// === RENDERING FUNKTIONEN ===
function renderAuditSections() {
    const container = document.getElementById('auditSections');
    container.innerHTML = '';
    
    if (!allQuestions.length) return;
    
    const sections = {};
    allQuestions.forEach(question => {
        if (!sections[question.sectionTitle]) {
            sections[question.sectionTitle] = {
                title: question.sectionTitle,
                short: question.sectionShort,
                questions: []
            };
        }
        sections[question.sectionTitle].questions.push(question);
    });
    
    Object.values(sections).forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section';
        sectionElement.innerHTML = `
            <div class="section-header">
                <h2>${section.title}</h2>
                <span>▼</span>
            </div>
            <div class="section-content">
                ${renderSectionQuestions(section.questions, false)}
            </div>
        `;
        container.appendChild(sectionElement);
    });
}

function renderSectionQuestions(questions, isMobile) {
    return questions.map(question => {
        const verdict = question.verdict;
        const questionClass = verdict === 'ok' ? 'ok' : verdict === 'not-ok' ? 'not-ok' : '';
        const images = question.images || [];
        const isActivityProof = question.isActivityProof || false;
        
        return `
        <div class="question ${questionClass}" data-id="${question.id}">
            <div class="question-header">
                <div class="question-text">${question.text} ${isActivityProof ? '<span style="color: #e74c3c; font-size: 0.8em;">⚠️ Erforderlich für Autorisierung</span>' : ''}</div>
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
                <textarea class="comment" placeholder="Anmerkungen...">${question.comment || ''}</textarea>
            </div>
            
            ${!isMobile ? `
            <div class="image-upload-section">
                <h4>📸 Bildnachweise (optional)</h4>
                <div class="file-input-wrapper">
                    <input type="file" accept="image/*" class="file-input image-input" multiple data-question="${question.id}">
                    <span class="file-input-label">Bilder auswählen</span>
                </div>
                <div class="image-preview-container" id="preview-${question.id}">
                    ${renderImagePreviews(images, question.id, isMobile)}
                </div>
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
}

function renderImagePreviews(images, questionId, isMobile) {
    return images.map((img, index) => `
        <div class="image-preview-item">
            <img class="image-preview" src="${img}" alt="Bild ${index + 1}">
            <button class="remove-image" data-question="${questionId}" data-index="${index}">×</button>
        </div>
    `).join('');
}

// === HELPER FUNKTIONEN ===
function updateQuestionData(questionId, field, value) {
    const question = allQuestions.find(q => q.id === questionId);
    if (question) {
        if (field === 'verdict') {
            question.verdict = value;
        } else if (field === 'comment') {
            question.comment = value;
        } else if (field === 'addImage') {
            if (!question.images) question.images = [];
            if (!uploadedImages.has(value)) {
                question.images.push(value);
                uploadedImages.add(value);
                imageStorage[`${questionId}_${question.images.length}`] = value;
            }
        } else if (field === 'removeImage') {
            if (question.images) {
                const removedImage = question.images[value];
                question.images.splice(value, 1);
                uploadedImages.delete(removedImage);
                delete imageStorage[`${questionId}_${value}`];
            }
        }
        saveCurrentAuditData();
        updateCurrentAuditProgress();
    }
}