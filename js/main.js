// === INITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupGlobalEventListeners();
});

function initializeApp() {
    loadAllAuditData();
    updateAuditProgressDisplays();
    
    // Header Toggle Buttons
    document.getElementById('desktopToggleHeader').addEventListener('click', toggleDesktopHeader);
    document.getElementById('mobileToggleHeader').addEventListener('click', toggleMobileHeader);
    
    // Sync Header Daten
    syncHeaderData();
}

function setupEventListeners() {
    // Audit-Auswahl
    document.querySelectorAll('.audit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            startAudit(this.dataset.audit);
        });
    });

    // Controls
    document.getElementById('backBtn').addEventListener('click', goBackToSelection);
    document.getElementById('exportBtn').addEventListener('click', exportAudit);
    document.getElementById('auditLoadBtn').addEventListener('click', loadAudit);
    document.getElementById('authorizationBtn').addEventListener('click', showAuthorization);
    document.getElementById('reportBtn').addEventListener('click', showReport);
    document.getElementById('toggleViewBtn').addEventListener('click', toggleView);
    document.getElementById('resetBtn').addEventListener('click', resetAudit);
    document.getElementById('uploadQuestionsBtn').addEventListener('click', () => document.getElementById('questionsLoader').click());

    // File Loader
    document.getElementById('fileLoader').addEventListener('change', loadAuditData);
    document.getElementById('questionsLoader').addEventListener('change', loadQuestionsData);

    // Responsive
    window.addEventListener('resize', handleResize);
}

function setupGlobalEventListeners() {
    // Section Header Klicks (Desktop)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.section-header') && 
            document.getElementById('desktopView').style.display === 'block') {
            const header = e.target.closest('.section-header');
            const section = header.closest('.section');
            
            section.classList.toggle('expanded');
            
            const arrow = header.querySelector('span');
            if (section.classList.contains('expanded')) {
                arrow.style.transform = 'rotate(90deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
            
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    // Verdict Buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.verdict-btn')) {
            const btn = e.target.closest('.verdict-btn');
            const questionElement = btn.closest('.question');
            if (!questionElement) return;
            
            const questionId = questionElement.dataset.id;
            const verdict = btn.dataset.verdict;
            
            updateQuestionData(questionId, 'verdict', verdict);
            
            questionElement.classList.remove('ok', 'not-ok');
            questionElement.classList.add(verdict === 'ok' ? 'ok' : 'not-ok');
            
            questionElement.querySelectorAll('.verdict-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            checkAndShowFinalResult();
        }
        
        // Remove Image Buttons
        if (e.target.classList.contains('remove-image')) {
            const questionId = e.target.dataset.question;
            const imageIndex = parseInt(e.target.dataset.index);
            const isMobile = window.innerWidth <= 768;
            removeImage(questionId, imageIndex, isMobile);
        }
    });
    
    // Kommentare
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('comment')) {
            const questionId = e.target.closest('.question').dataset.id;
            updateQuestionData(questionId, 'comment', e.target.value);
        }
        
        // Header-Daten
        if (e.target.classList.contains('header-input')) {
            saveCurrentAuditData();
        }
    });
    
    // Bild-Uploads
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('image-input')) {
            const questionId = e.target.dataset.question;
            const isMobile = window.innerWidth <= 768;
            handleImageUpload(e, questionId, isMobile);
        }
    });
}

// === ERGEBNISANZEIGE ===
function checkAndShowFinalResult() {
    if (!allQuestions.length) return;
    
    const total = allQuestions.length;
    const answered = allQuestions.filter(q => q.verdict !== null).length;
    const notOk = allQuestions.filter(q => q.verdict === 'not-ok').length;
    
    if (answered === total) {
        const finalResult = document.getElementById('finalResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultText = document.getElementById('resultText');
        
        const activityProofQuestion = allQuestions.find(q => q.isActivityProof);
        const activityProofOk = activityProofQuestion && activityProofQuestion.verdict === 'ok';
        
        if (notOk === 0 && activityProofOk) {
            finalResult.className = 'final-result passed';
            resultIcon.textContent = '✅';
            resultText.textContent = 'Audit BESTANDEN - Tätigkeitsnachweis vorhanden';
        } else if (notOk === 0 && !activityProofOk) {
            finalResult.className = 'final-result warning';
            resultIcon.textContent = '⚠️';
            resultText.textContent = 'Tätigkeitsnachweis erforderlich für Autorisierung';
        } else {
            finalResult.className = 'final-result failed';
            resultIcon.textContent = '❌';
            resultText.textContent = 'Audit NICHT BESTANDEN';
        }
        
        finalResult.style.display = 'block';
    } else {
        document.getElementById('finalResult').style.display = 'none';
    }
}

// === RESET FUNKTION ===
async function resetAudit() {
    if (!currentAuditType) return;
    
    const shouldReset = await showCustomModal('Audit wirklich zurücksetzen?\nALLE Daten werden gelöscht, inklusive Header-Felder.');
    if (!shouldReset) return;
    
    const sections = STANDARD_QUESTIONS[currentAuditType];
    allQuestions = sections.flatMap(section => 
        section.questions.map(q => ({
            ...q,
            sectionTitle: section.title,
            sectionShort: section.short,
            verdict: null,
            comment: "",
            images: []
        }))
    );
    
    resetAllHeaderFields();
    
    uploadedImages.clear();
    imageStorage = {};
    
    currentAuditData = {
        meta: {
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            auditType: currentAuditType,
            title: AUDIT_TYPES[currentAuditType].title,
            version: "2.5"
        },
        headerData: {},
        questions: allQuestions,
        images: {}
    };
    
    localStorage.setItem(`zfpAudit_${currentAuditType}`, JSON.stringify(currentAuditData));
    
    if (window.innerWidth <= 768) {
        currentMobileQuestion = 0;
        renderMobileQuestion();
    } else {
        renderAuditSections();
    }
    
    updateCurrentAuditProgress();
    document.getElementById('finalResult').style.display = 'none';
    
    showCustomModal('✅ Audit wurde zurückgesetzt\nALLE Felder wurden geleert.');
}

// === EXPORT FUNKTION ===
async function exportAudit() {
    if (!currentAuditType || !currentAuditData) return;
    
    saveCurrentAuditData();
    
    const jsonData = { ...currentAuditData };
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `ZfP_Audit_${AUDIT_TYPES[currentAuditType].title}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    const imageCount = Object.keys(imageStorage).length;
    if (imageCount > 0) {
        try {
            let downloaded = 0;
            
            for (const [key, base64Data] of Object.entries(imageStorage)) {
                const byteString = atob(base64Data.split(',')[1]);
                const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                
                const blob = new Blob([ab], { type: mimeString });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bild_${key}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                downloaded++;
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            showCustomModal(`✅ Export erfolgreich\n\nJSON-Datei + ${downloaded} Bilder exportiert`);
            
        } catch (error) {
            showCustomModal(`✅ JSON exportiert, aber Bilder konnten nicht exportiert werden:\n${error.message}`);
        }
    } else {
        showCustomModal('✅ Audit wurde als JSON exportiert (keine Bilder vorhanden)');
    }
}

// === AUDIT LADEN FUNKTION ===
function loadAudit() {
    document.getElementById('fileLoader').click();
}

function loadAuditData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const loadedData = JSON.parse(e.target.result);
            
            if (!loadedData.meta || !loadedData.meta.auditType) {
                throw new Error('Ungültiges Audit-Datenformat');
            }
            
            const auditType = loadedData.meta.auditType;
            
            if (currentAuditType !== auditType) {
                startAudit(auditType);
            }
            
            currentAuditData = loadedData;
            allQuestions = currentAuditData.questions || [];
            imageStorage = currentAuditData.images || {};
            
            uploadedImages.clear();
            allQuestions.forEach(question => {
                if (question.images && question.images.length > 0) {
                    question.images.forEach(img => {
                        uploadedImages.add(img);
                    });
                }
            });
            
            if (currentAuditData.headerData) {
                setHeaderData(currentAuditData.headerData);
            }
            
            localStorage.setItem(`zfpAudit_${auditType}`, JSON.stringify(currentAuditData));
            
            if (window.innerWidth <= 768) {
                currentMobileQuestion = 0;
                renderMobileQuestion();
            } else {
                renderAuditSections();
            }
            
            updateCurrentAuditProgress();
            checkAndShowFinalResult();
            
            showCustomModal(`✅ Audit geladen\n\n${loadedData.meta.title}\nLetzte Änderung: ${new Date(loadedData.meta.lastModified).toLocaleDateString()}`);
            
        } catch (error) {
            showCustomModal(`❌ Fehler beim Laden: ${error.message}`);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function toggleView() {
    const desktopView = document.getElementById('desktopView');
    const mobileView = document.getElementById('mobileView');
    const toggleBtn = document.getElementById('toggleViewBtn');
    
    if (desktopView.style.display === 'block') {
        desktopView.style.display = 'none';
        mobileView.style.display = 'block';
        toggleBtn.textContent = '🖥️ Desktop';
        renderMobileQuestion();
    } else {
        desktopView.style.display = 'block';
        mobileView.style.display = 'none';
        toggleBtn.textContent = '📱 Mobile';
        renderAuditSections();
    }
}

function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const desktopView = document.getElementById('desktopView');
    const mobileView = document.getElementById('mobileView');
    const toggleBtn = document.getElementById('toggleViewBtn');
    
    if (isMobile && desktopView.style.display === 'block') {
        desktopView.style.display = 'none';
        mobileView.style.display = 'block';
        toggleBtn.textContent = '🖥️ Desktop';
        renderMobileQuestion();
    } else if (!isMobile && mobileView.style.display === 'block') {
        desktopView.style.display = 'block';
        mobileView.style.display = 'none';
        toggleBtn.textContent = '📱 Mobile';
        renderAuditSections();
    }
}

function loadQuestionsData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const questionsData = JSON.parse(e.target.result);
            
            if (typeof questionsData !== 'object') {
                throw new Error('Ungültiges Fragenformat');
            }
            
            showCustomModal(`✅ Fragen geladen\n\nVerfahren: ${Object.keys(questionsData).join(', ')}`);
            
        } catch (error) {
            showCustomModal(`❌ Fehler: ${error.message}`);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}