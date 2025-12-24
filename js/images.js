// === BILDVERARBEITUNG ===
async function processAndLimitImage(file) {
    return new Promise((resolve, reject) => {
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            reject(new Error(`Bild zu groß (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB`));
            return;
        }

        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = function() {
            const maxWidth = 1200;
            const maxHeight = 800;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            try {
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(compressedDataUrl);
            } catch (error) {
                reject(new Error('Bild konnte nicht verarbeitet werden'));
            }
        };
        
        img.onerror = function() {
            reject(new Error('Bild konnte nicht geladen werden'));
        };
        
        img.src = URL.createObjectURL(file);
    });
}

async function handleImageUpload(event, questionId, isMobile = false) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    
    event.target.value = '';
    
    const question = allQuestions.find(q => q.id === questionId);
    if (!question.images) question.images = [];
    
    const previewContainerId = isMobile ? `mobile_preview-${questionId}` : `preview-${questionId}`;
    const previewContainer = document.getElementById(previewContainerId);
    
    for (const file of files) {
        if (!file.type.startsWith('image/')) {
            showCustomModal('❌ Nur Bilddateien erlaubt');
            continue;
        }
        
        try {
            const compressedImage = await processAndLimitImage(file);
            
            if (uploadedImages.has(compressedImage)) {
                showCustomModal('⚠️ Dieses Bild wurde bereits hochgeladen');
                continue;
            }
            
            updateQuestionData(questionId, 'addImage', compressedImage);
            
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img class="image-preview" src="${compressedImage}" alt="Bild">
                <button class="remove-image" data-question="${questionId}" data-index="${question.images.length - 1}">×</button>
            `;
            previewContainer.appendChild(previewItem);
            
        } catch (error) {
            showCustomModal(`❌ ${error.message}`);
        }
    }
    
    saveCurrentAuditData();
}

function removeImage(questionId, imageIndex, isMobile = false) {
    const question = allQuestions.find(q => q.id === questionId);
    if (question && question.images) {
        updateQuestionData(questionId, 'removeImage', imageIndex);
        
        if (isMobile) {
            renderMobileQuestion();
        } else {
            const questionElement = document.querySelector(`.question[data-id="${questionId}"]`);
            if (questionElement) {
                const previewContainer = questionElement.querySelector('.image-preview-container');
                if (previewContainer) {
                    previewContainer.innerHTML = renderImagePreviews(question.images, questionId, false);
                }
            }
        }
    }
}