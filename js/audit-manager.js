// === GLOBALE VARIABLEN ===
let currentAuditType = null;
let currentAuditData = null;
let allQuestions = [];
let currentMobileQuestion = 0;
let imageStorage = {};
let uploadedImages = new Set();

// === AUDIT MANAGEMENT ===
function loadAllAuditData() {
    Object.keys(AUDIT_TYPES).forEach(auditType => {
        const saved = localStorage.getItem(`zfpAudit_${auditType}`);
        if (!saved) {
            const sections = STANDARD_QUESTIONS[auditType];
            const allQuestionsForAudit = sections.flatMap(section => 
                section.questions.map(q => ({
                    ...q,
                    sectionTitle: section.title,
                    sectionShort: section.short,
                    verdict: null,
                    comment: "",
                    images: []
                }))
            );
            
            const initialData = {
                meta: {
                    created: new Date().toISOString(),
                    lastModified: new Date().toISOString(),
                    auditType: auditType,
                    title: AUDIT_TYPES[auditType].title,
                    version: "2.5"
                },
                headerData: {},
                questions: allQuestionsForAudit,
                images: {}
            };
            localStorage.setItem(`zfpAudit_${auditType}`, JSON.stringify(initialData));
        }
    });
}

function getHeaderData() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        return {
            operatorName: document.getElementById('mobileOperatorName')?.value || '',
            operatorNumber: document.getElementById('mobileOperatorNumber')?.value || '',
            operatorCert: document.getElementById('mobileOperatorCert')?.value || '',
            operatorDept: document.getElementById('mobileOperatorDept')?.value || '',
            auditorName: document.getElementById('mobileAuditorName')?.value || '',
            auditorDept: document.getElementById('mobileAuditorDept')?.value || '',
            auditorCert: document.getElementById('mobileAuditorCert')?.value || '',
            auditorPhone: document.getElementById('mobileAuditorPhone')?.value || '',
            approverName: document.getElementById('mobileApproverName')?.value || '',
            approverDept: document.getElementById('mobileApproverDept')?.value || '',
            approverCert: document.getElementById('mobileApproverCert')?.value || '',
            approverPhone: document.getElementById('mobileApproverPhone')?.value || '',
            reportNumber: document.getElementById('mobileReportNumber')?.value || '',
            partType: document.getElementById('mobilePartType')?.value || '',
            externalStandard: document.getElementById('mobileExternalStandard')?.value || '',
            sStandard: document.getElementById('mobileSStandard')?.value || AUDIT_TYPES[currentAuditType]?.norm || '',
            workInstruction: document.getElementById('mobileWorkInstruction')?.value || AUDIT_TYPES[currentAuditType]?.instruction || ''
        };
    } else {
        return {
            operatorName: document.getElementById('operatorName')?.value || '',
            operatorNumber: document.getElementById('operatorNumber')?.value || '',
            operatorCert: document.getElementById('operatorCert')?.value || '',
            operatorDept: document.getElementById('operatorDept')?.value || '',
            auditorName: document.getElementById('auditorName')?.value || '',
            auditorDept: document.getElementById('auditorDept')?.value || '',
            auditorCert: document.getElementById('auditorCert')?.value || '',
            auditorPhone: document.getElementById('auditorPhone')?.value || '',
            approverName: document.getElementById('approverName')?.value || '',
            approverDept: document.getElementById('approverDept')?.value || '',
            approverCert: document.getElementById('approverCert')?.value || '',
            approverPhone: document.getElementById('approverPhone')?.value || '',
            reportNumber: document.getElementById('reportNumber')?.value || '',
            partType: document.getElementById('partType')?.value || '',
            externalStandard: document.getElementById('externalStandard')?.value || '',
            sStandard: document.getElementById('sStandard')?.value || AUDIT_TYPES[currentAuditType]?.norm || '',
            workInstruction: document.getElementById('workInstruction')?.value || AUDIT_TYPES[currentAuditType]?.instruction || ''
        };
    }
}

function setHeaderData(data) {
    if (!data) return;
    
    const fields = [
        { id: 'operatorName', value: data.operatorName },
        { id: 'operatorNumber', value: data.operatorNumber },
        { id: 'operatorCert', value: data.operatorCert },
        { id: 'operatorDept', value: data.operatorDept },
        { id: 'auditorName', value: data.auditorName },
        { id: 'auditorDept', value: data.auditorDept },
        { id: 'auditorCert', value: data.auditorCert },
        { id: 'auditorPhone', value: data.auditorPhone },
        { id: 'approverName', value: data.approverName },
        { id: 'approverDept', value: data.approverDept },
        { id: 'approverCert', value: data.approverCert },
        { id: 'approverPhone', value: data.approverPhone },
        { id: 'reportNumber', value: data.reportNumber },
        { id: 'partType', value: data.partType },
        { id: 'externalStandard', value: data.externalStandard },
        { id: 'sStandard', value: data.sStandard },
        { id: 'workInstruction', value: data.workInstruction }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        const mobileElement = document.getElementById('mobile' + field.id.charAt(0).toUpperCase() + field.id.slice(1));
        
        if (element && field.value !== undefined) element.value = field.value;
        if (mobileElement && field.value !== undefined) mobileElement.value = field.value;
    });
}

function startAudit(auditType) {
    currentAuditType = auditType;
    
    document.getElementById('auditSelection').classList.remove('active');
    document.getElementById('auditContent').classList.add('active');
    document.getElementById('finalResult').style.display = 'none';
    
    loadCurrentAuditData();
    
    const auditInfo = AUDIT_TYPES[auditType];
    document.querySelector('h1').textContent = `ZfP Audit - ${auditInfo.title}`;
    document.querySelector('.subtitle').textContent = `Prüfverfahren: ${auditInfo.title}`;
    
    document.getElementById('desktopHeaderContent').classList.remove('collapsed');
    document.getElementById('desktopToggleHeader').textContent = 'Ausblenden';
    document.getElementById('mobileHeaderSection').classList.add('collapsed');
    document.getElementById('mobileHeaderContent').classList.add('collapsed');
    document.getElementById('mobileToggleHeader').textContent = 'Einblenden';
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        document.getElementById('desktopView').style.display = 'none';
        document.getElementById('mobileView').style.display = 'block';
        document.getElementById('toggleViewBtn').textContent = '🖥️ Desktop';
        renderMobileQuestion();
    } else {
        document.getElementById('desktopView').style.display = 'block';
        document.getElementById('mobileView').style.display = 'none';
        document.getElementById('toggleViewBtn').textContent = '📱 Mobile';
        renderAuditSections();
    }
    
    updateCurrentAuditProgress();
    checkAndShowFinalResult();
}

function loadCurrentAuditData() {
    const saved = localStorage.getItem(`zfpAudit_${currentAuditType}`);
    if (saved) {
        currentAuditData = JSON.parse(saved);
        allQuestions = currentAuditData.questions || [];
        imageStorage = currentAuditData.images || {};
        
        if (currentAuditData.headerData) {
            setHeaderData(currentAuditData.headerData);
        }
        
        uploadedImages.clear();
        allQuestions.forEach(question => {
            if (question.images && question.images.length > 0) {
                question.images.forEach(img => {
                    uploadedImages.add(img);
                });
            }
        });
    } else {
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
    }
}

function saveCurrentAuditData() {
    if (!currentAuditType || !currentAuditData) return;
    
    currentAuditData.questions = allQuestions;
    currentAuditData.headerData = getHeaderData();
    currentAuditData.images = imageStorage;
    currentAuditData.meta.lastModified = new Date().toISOString();
    
    localStorage.setItem(`zfpAudit_${currentAuditType}`, JSON.stringify(currentAuditData));
    updateAuditProgressDisplays();
    updateCurrentAuditProgress();
    checkAndShowFinalResult();
}

async function goBackToSelection() {
    saveCurrentAuditData();
    
    const shouldProceed = await showCustomModal('Zurück zur Auswahl? Ungespeicherte Änderungen gehen verloren.');
    if (!shouldProceed) return;
    
    currentAuditType = null;
    currentAuditData = null;
    allQuestions = [];
    uploadedImages.clear();
    
    document.getElementById('auditSelection').classList.add('active');
    document.getElementById('auditContent').classList.remove('active');
    
    document.querySelector('h1').textContent = 'ZfP Operator Audit';
    document.querySelector('.subtitle').textContent = 'Zerstörungsfreie Prüfverfahren - Operator Qualifizierung';
}

// === FORTSCHRITTSANZEIGEN ===
function updateAuditProgressDisplays() {
    Object.keys(AUDIT_TYPES).forEach(auditType => {
        const progress = calculateAuditProgress(auditType);
        const progressElement = document.getElementById(`${auditType}Progress`);
        if (progressElement) {
            progressElement.textContent = `${progress.percent}%`;
        }
    });
}

function calculateAuditProgress(auditType) {
    const saved = localStorage.getItem(`zfpAudit_${auditType}`);
    if (!saved) {
        const sections = STANDARD_QUESTIONS[auditType];
        const total = sections.reduce((sum, section) => sum + section.questions.length, 0);
        return { answered: 0, total: total, percent: 0, ok: 0, notOk: 0 };
    }
    
    const data = JSON.parse(saved);
    const questions = data.questions || [];
    const total = questions.length;
    const answered = questions.filter(q => q.verdict !== null).length;
    const ok = questions.filter(q => q.verdict === 'ok').length;
    const notOk = questions.filter(q => q.verdict === 'not-ok').length;
    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    
    return { answered, total, percent, ok, notOk };
}

function updateCurrentAuditProgress() {
    if (!allQuestions.length) return;
    
    const total = allQuestions.length;
    const answered = allQuestions.filter(q => q.verdict !== null).length;
    const ok = allQuestions.filter(q => q.verdict === 'ok').length;
    const notOk = allQuestions.filter(q => q.verdict === 'not-ok').length;
    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressText').textContent = `${percent}%`;
    
    let statusText = "In Bearbeitung";
    let statusColor = "#f39c12";
    
    if (answered === total) {
        const activityProofQuestion = allQuestions.find(q => q.isActivityProof);
        const activityProofOk = activityProofQuestion && activityProofQuestion.verdict === 'ok';
        
        if (notOk === 0 && activityProofOk) {
            statusText = "✅ Bestanden";
            statusColor = "#27ae60";
        } else if (notOk === 0 && !activityProofOk) {
            statusText = "⚠️ Tätigkeitsnachweis fehlt";
            statusColor = "#f39c12";
        } else {
            statusText = "❌ Nicht bestanden";
            statusColor = "#e74c3c";
        }
    } else if (answered > 0) {
        statusText = `${answered}/${total} beantwortet`;
    }
    
    document.getElementById('auditStatusText').textContent = statusText;
    document.getElementById('auditStatusText').style.color = statusColor;
    
    if (currentAuditType) {
        updateAuditProgressDisplays();
    }
}

// === HEADER TOGGLE FUNKTIONEN ===
function toggleDesktopHeader() {
    const content = document.getElementById('desktopHeaderContent');
    const btn = document.getElementById('desktopToggleHeader');
    
    content.classList.toggle('collapsed');
    
    if (content.classList.contains('collapsed')) {
        btn.textContent = 'Einblenden';
    } else {
        btn.textContent = 'Ausblenden';
    }
}

function toggleMobileHeader() {
    const section = document.getElementById('mobileHeaderSection');
    const content = document.getElementById('mobileHeaderContent');
    const btn = document.getElementById('mobileToggleHeader');
    
    section.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
    
    if (section.classList.contains('collapsed')) {
        btn.textContent = 'Einblenden';
        section.style.padding = '0';
    } else {
        btn.textContent = 'Ausblenden';
        section.style.padding = '';
    }
}

// === HEADER DATEN SYNC ===
function syncHeaderData() {
    // Mobile zu Desktop sync
    const mobileIds = [
        'mobileOperatorName', 'mobileOperatorNumber', 'mobileOperatorCert', 'mobileOperatorDept',
        'mobileAuditorName', 'mobileAuditorDept', 'mobileAuditorCert', 'mobileAuditorPhone',
        'mobileApproverName', 'mobileApproverDept', 'mobileApproverCert', 'mobileApproverPhone',
        'mobileReportNumber', 'mobilePartType', 'mobileExternalStandard', 'mobileSStandard', 'mobileWorkInstruction'
    ];
    
    mobileIds.forEach(mobileId => {
        const mobileElement = document.getElementById(mobileId);
        if (mobileElement) {
            mobileElement.addEventListener('input', function() {
                const desktopId = mobileId.replace('mobile', '').charAt(0).toLowerCase() + mobileId.replace('mobile', '').slice(1);
                const desktopElement = document.getElementById(desktopId);
                if (desktopElement) {
                    desktopElement.value = this.value;
                }
                saveCurrentAuditData();
            });
        }
    });
    
    // Desktop zu Mobile sync
    const desktopIds = [
        'operatorName', 'operatorNumber', 'operatorCert', 'operatorDept',
        'auditorName', 'auditorDept', 'auditorCert', 'auditorPhone',
        'approverName', 'approverDept', 'approverCert', 'approverPhone',
        'reportNumber', 'partType', 'externalStandard', 'sStandard', 'workInstruction'
    ];
    
    desktopIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                const mobileId = 'mobile' + id.charAt(0).toUpperCase() + id.slice(1);
                const mobileElement = document.getElementById(mobileId);
                if (mobileElement) {
                    mobileElement.value = this.value;
                }
                saveCurrentAuditData();
            });
        }
    });
}

// === RESET HEADER-FELDER ===
function resetAllHeaderFields() {
    const allIds = [
        'operatorName', 'operatorNumber', 'operatorCert', 'operatorDept',
        'auditorName', 'auditorDept', 'auditorCert', 'auditorPhone',
        'approverName', 'approverDept', 'approverCert', 'approverPhone',
        'reportNumber', 'partType', 'externalStandard', 'sStandard', 'workInstruction',
        'mobileOperatorName', 'mobileOperatorNumber', 'mobileOperatorCert', 'mobileOperatorDept',
        'mobileAuditorName', 'mobileAuditorDept', 'mobileAuditorCert', 'mobileAuditorPhone',
        'mobileApproverName', 'mobileApproverDept', 'mobileApproverCert', 'mobileApproverPhone',
        'mobileReportNumber', 'mobilePartType', 'mobileExternalStandard', 'mobileSStandard', 'mobileWorkInstruction'
    ];
    
    allIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
}