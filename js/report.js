// === BERICHTSANZEIGE ===
async function showReport() {
    saveCurrentAuditData();
    
    const headerData = getHeaderData();
    const auditInfo = AUDIT_TYPES[currentAuditType];
    
    const total = allQuestions.length;
    const answered = allQuestions.filter(q => q.verdict !== null).length;
    const notOk = allQuestions.filter(q => q.verdict === 'not-ok').length;
    const activityProofQuestion = allQuestions.find(q => q.isActivityProof);
    const activityProofOk = activityProofQuestion && activityProofQuestion.verdict === 'ok';
    
    let reportHTML = `
        <div class="report-header" style="position: relative;">
            <div style="position: absolute; top: 5px; right: 1px; text-align: right;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Schaeffler_logo.svg" 
                     alt="Schaeffler Logo" 
                     style="height: 7mm; width: auto; max-width: 35mm;">
            </div>
            
            <h2>ZfP-Operator Audit</h2>
            <div class="company-info"><strong>Prüfbericht-Nr.:</strong> ${headerData.reportNumber || 'Muster_2025_NE'}</div>
        </div>
        
        <table class="person-table">
            <thead>
                <tr>
                    <th style="width: 33%;">Bediener / Operator</th>
                    <th style="width: 33%;">Level II Auditor</th>
                    <th style="width: 34%;">Freigegeben Stufe III</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Name:</strong> ${headerData.operatorName || '---'}<br>
                        <strong>Mitarbeiter-Nr.:</strong> ${headerData.operatorNumber || '---'}<br>
                        <strong>Zertifikat:</strong> ${headerData.operatorCert || '---'}<br>
                        <strong>Abteilung:</strong> ${headerData.operatorDept || '---'}
                    </td>
                    <td>
                        <strong>Name:</strong> ${headerData.auditorName || '---'}<br>
                        <strong>Abteilung:</strong> ${headerData.auditorDept || '---'}<br>
                        <strong>Zertifikat:</strong> ${headerData.auditorCert || '---'}<br>
                        <strong>Tel:</strong> ${headerData.auditorPhone || '---'}
                    </td>
                    <td>
                        <strong>Name:</strong> ${headerData.approverName || '---'}<br>
                        <strong>Abteilung:</strong> ${headerData.approverDept || '---'}<br>
                        <strong>Zertifikat:</strong> ${headerData.approverCert || '---'}<br>
                        <strong>Tel:</strong> ${headerData.approverPhone || '---'}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <table class="details-table">
            <tr>
                <td><strong>F-Teiletype:</strong></td>
                <td>${headerData.partType || '---'}</td>
                <td><strong>Prüfverfahren:</strong></td>
                <td>${auditInfo.title}</td>
            </tr>
            <tr>
                <td><strong>Externe Norm:</strong></td>
                <td>${headerData.externalStandard || '---'}</td>
                <td><strong>S-Standard:</strong></td>
                <td>${headerData.sStandard || auditInfo.norm}</td>
            </tr>
            <tr>
                <td><strong>Arbeitsanweisung:</strong></td>
                <td colspan="3">${headerData.workInstruction || auditInfo.instruction}</td>
            </tr>
        </table>
        
        <div class="results-section">
            <div class="report-section-header">Audit-Ergebnisse</div>
    `;
    
    const sections = {};
    allQuestions.forEach(question => {
        if (!sections[question.sectionTitle]) {
            sections[question.sectionTitle] = [];
        }
        sections[question.sectionTitle].push(question);
    });
    
    Object.keys(sections).forEach(sectionTitle => {
        reportHTML += `<div class="report-section-header">${sectionTitle}</div>`;
        
        sections[sectionTitle].forEach(question => {
            const verdictClass = question.verdict === 'ok' ? 'ok' : question.verdict === 'not-ok' ? 'not-ok' : '';
            const verdictIcon = question.verdict === 'ok' ? '✅' : question.verdict === 'not-ok' ? '❌' : '○';
            
            reportHTML += `
                <div class="question-item ${verdictClass}">
                    <span class="question-id">${question.id}:</span> ${verdictIcon} ${question.text}
                    ${question.comment ? `<div class="question-comment">Kommentar: ${question.comment}</div>` : ''}
                    ${renderQuestionImagesInReport(question)}
                </div>
            `;
        });
    });
    
    reportHTML += `
        </div>
        
        <div class="signature-area">
            <div class="signature-box">
                <div style="font-weight: bold; font-size: 11px;">Auditor (Level II)</div>
                <div class="signature-line"></div>
            </div>
            
            <div class="signature-box">
                <div style="font-weight: bold; font-size: 11px;">NDT Expert (Level III)</div>
                <div class="signature-line"></div>
            </div>
        </div>
        <div style="font-size: 10px; text-align: center">
        <div>Erstellt: ${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</div>
        <div>Nächste Prüfung fällig: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}</div>
        
        <div style="font-size: 10px; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 8px;">
            <table style="width: 100%;">
                <tr>
                    <td style="text-align: left; width: 33%;">Daniel Häusner, WI/SW2-PQT</td>
                    <td style="text-align: center; width: 34%;">
                        <div style="word-break: break-word; max-width: 180px; margin: 0 auto; font-size: 9px;">
                            ${getDocumentNameForAudit(currentAuditType)}
                        </div>
                    </td>
                    <td style="text-align: right; width: 33%;">${getVersionForAudit(currentAuditType)}</td>
                </tr>
            </table>
        </div>
    `;
    
    document.getElementById('reportContainer').innerHTML = `
        <div class="report-action-buttons">
            <button class="report-action-btn print-btn" onclick="printFullReport()">🖨️</button>
            <button class="report-action-btn close-btn" onclick="closeReport()">✕</button>
        </div>
        ${reportHTML}
    `;
    document.getElementById('reportOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function renderQuestionImagesInReport(question) {
    if (!question.images || question.images.length === 0) {
        return '';
    }
    
    let imagesHTML = '<div style="margin-top: 10px;">';
    imagesHTML += '<div style="display: flex; flex-wrap: wrap; gap: 15px;">';
    
    question.images.forEach((image, index) => {
        imagesHTML += `
            <div style="border: 1px solid #ccc; padding: 5px; background: white; text-align: center;">
                <img src="${image}" 
                     alt="" 
                     style="max-width: 300px; max-height: 300px; object-fit: contain; display: block;">
            </div>
        `;
    });
    
    imagesHTML += '</div></div>';
    return imagesHTML;
}