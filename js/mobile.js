// === MOBILE FUNKTIONEN ===
function renderMobileQuestion() {
    if (allQuestions.length === 0) return;
    
    const container = document.getElementById('mobileQuestions');
    const question = allQuestions[currentMobileQuestion];
    if (!question) return;
    
    const verdict = question.verdict;
    const questionClass = verdict === 'ok' ? 'ok' : verdict === 'not-ok' ? 'not-ok' : '';
    const images = question.images || [];
    const isActivityProof = question.isActivityProof || false;
    
    container.innerHTML = `
        <div class="question ${questionClass}" data-id="${question.id}">
            <div class="question-header">
                <div class="question-text">${question.text} ${isActivityProof ? '<span style="color: #e74c3c; font-size: 0.7em;">⚠️ Erforderlich</span>' : ''}</div>
                <div class="question-id">${question.id}</div>
            </div>
            ${question.english ? `<div class="english-translation">${question.english}</div>` : ''}
            
            <div class="verdict-options">
                <button class="verdict-btn ok ${verdict === 'ok' ? 'selected' : ''}" data-verdict="ok">
                    <span>✅</span> OK
                </button>
                <button class="verdict-btn not-ok ${verdict === 'not-ok' ? 'selected' : ''}" data-verdict="not-ok">
                    <span>❌</span> Nicht OK
                </button>
            </div>
            
            <div class="comment-section">
                <label class="comment-label">Kommentar:</label>
                <textarea class="comment" placeholder="Anmerkungen..." rows="2">${question.comment || ''}</textarea>
            </div>
            
            <div class="image-upload-section">
                <h4>📸 Bilder (optional)</h4>
                <div class="file-input-wrapper">
                    <input type="file" accept="image/*" class="file-input image-input" multiple data-question="${question.id}">
                    <span class="file-input-label">Bilder auswählen</span>
                </div>
                <div class="image-preview-container" id="mobile_preview-${question.id}">
                    ${renderImagePreviews(images, question.id, true)}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('mobileCounter').textContent = `${currentMobileQuestion + 1}/${allQuestions.length}`;
    renderMobileSectionSelector();
}

function renderMobileSectionSelector() {
    const container = document.getElementById('sectionSelector');
    container.innerHTML = '';
    
    if (!allQuestions.length) return;
    
    const sections = {};
    let questionIndex = 0;
    
    allQuestions.forEach((question, index) => {
        if (!sections[question.sectionTitle]) {
            sections[question.sectionTitle] = {
                title: question.sectionTitle,
                short: question.sectionShort,
                startIndex: index,
                count: 0
            };
        }
        sections[question.sectionTitle].count++;
    });
    
    Object.values(sections).forEach((section, index) => {
        const button = document.createElement('button');
        button.className = 'section-btn';
        if (currentMobileQuestion >= section.startIndex && 
            currentMobileQuestion < section.startIndex + section.count) {
            button.classList.add('active');
        }
        button.textContent = section.short;
        button.title = section.title;
        button.addEventListener('click', function() {
            currentMobileQuestion = section.startIndex;
            renderMobileQuestion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(button);
    });
}

// Mobile Navigation
function goToPrevQuestion() {
    if (currentMobileQuestion > 0) {
        currentMobileQuestion--;
        renderMobileQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToNextQuestion() {
    if (currentMobileQuestion < allQuestions.length - 1) {
        currentMobileQuestion++;
        renderMobileQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}