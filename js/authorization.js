// === AUTORISIERUNGS FUNKTIONEN ===
async function showAuthorization() {
    saveCurrentAuditData();
    
    const passedAudits = [];
    const allProcedures = [];
    
    for (const auditType of Object.keys(AUDIT_TYPES)) {
        const saved = localStorage.getItem(`zfpAudit_${auditType}`);
        if (saved) {
            const auditData = JSON.parse(saved);
            const questions = auditData.questions || [];
            
            if (questions.length > 0) {
                const total = questions.length;
                const answered = questions.filter(q => q.verdict !== null).length;
                const notOk = questions.filter(q => q.verdict === 'not-ok').length;
                const activityProofQuestion = questions.find(q => q.isActivityProof);
                const activityProofOk = activityProofQuestion && activityProofQuestion.verdict === 'ok';
                
                if (answered === total && notOk === 0 && activityProofOk) {
                    let auditDate = new Date();
                    if (auditData.meta && auditData.meta.created) {
                        try {
                            auditDate = new Date(auditData.meta.created);
                        } catch (e) {
                            auditDate = new Date();
                        }
                    }
                    
                    const expiryDate = new Date(auditDate);
                    expiryDate.setMonth(expiryDate.getMonth() + 12);
                    
                    passedAudits.push({
                        type: auditType,
                        data: auditData,
                        info: AUDIT_TYPES[auditType],
                        auditDate: auditDate,
                        expiryDate: expiryDate,
                        reportNumber: auditData.headerData?.reportNumber || '---',
                        operatorCert: auditData.headerData?.operatorCert || '---'
                    });
                }
                
                allProcedures.push({
                    type: auditType,
                    title: AUDIT_TYPES[auditType].title,
                    short: AUDIT_TYPES[auditType].short,
                    passed: (answered === total && notOk === 0 && activityProofOk)
                });
            }
        }
    }
    
    if (passedAudits.length === 0) {
        let message = 'Keine bestandenen Audits gefunden.\n\n';
        allProcedures.forEach(proc => {
            message += `${proc.title}: ${proc.passed ? '✅ Bestanden' : '❌ Nicht bestanden'}\n`;
        });
        message += '\nAutorisierung nur möglich, wenn:\n1. Alle Fragen beantwortet sind\n2. Keine "Nicht OK" Bewertungen\n3. Tätigkeitsnachweis vorhanden ist';
        
        showCustomModal(message);
        return;
    }
    
    const oldestAuditDate = passedAudits.reduce((oldest, audit) => {
        return audit.auditDate < oldest ? audit.auditDate : oldest;
    }, passedAudits[0].auditDate);
    
    const overallExpiryDate = new Date(oldestAuditDate);
    overallExpiryDate.setMonth(overallExpiryDate.getMonth() + 12);
    
    const headerData = passedAudits[0].data.headerData || {};
    
    const uniqueCerts = [...new Set(passedAudits.map(a => a.operatorCert).filter(cert => cert && cert !== '---'))];
    
    let werk = '';
    if (headerData.operatorDept) {
        if (headerData.operatorDept.includes('SW1') || headerData.operatorDept.includes('WI/SW1')) {
            werk = 'Werk 1';
        } else if (headerData.operatorDept.includes('SW2') || headerData.operatorDept.includes('WI/SW2')) {
            werk = 'Werk 2';
        }
    }
    
    const authorizationText = `<strong>Die genannte Person hat nachweislich die in der Verfahrensanweisung 
INFSW17008 beschriebenen Voraussetzungen für Ausbildung, Schulung 
Berufserfahrung, fortlaufende Tätigkeit und Prüfung erfüllt und ist damit für die 
Durchführung der Prüfung in den oben gelisteten ZfP-Verfahren autorisiert. Die Autorisierung gilt nur in Verbindung mit einem gültigen Zertifikat und hat
eine Gültigkeit von 12 Monaten.</strong><br><br><em>The named person has demonstrably fulfilled the requirements for training, education, professional experience, ongoing activity, and examination described in the procedure instruction INFSW17008 and is therefore authorized to conduct the examination in the NDT procedures listed below. This authorization is valid only in conjunction with a valid certificate and is valid for 12 months.</em>`;
    
    let authorizationHTML = `
        <div class="authorization-header">
            <div style="position: absolute; top: -5px; right: 1px; text-align: right;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Schaeffler_logo.svg" 
                     alt="Schaeffler Logo" 
                     style="height: 7mm; width: auto; max-width: 40mm;">
            </div>
            
            <h1>AUTORISIERUNG</h1>
            <div class="company-info">für zerstörungsfreie Prüfungen</div>
        </div>
        
        <div class="authorization-info">
            <p><strong>Name:</strong> ${headerData.operatorName || '---'}</p>
            <p><strong>Personalnummer:</strong> ${headerData.operatorNumber || '---'}</p>
            <p><strong>Abteilung:</strong> ${headerData.operatorDept || '---'}</p>
            <p><strong>Zertifikate:</strong> ${uniqueCerts.length > 0 ? uniqueCerts.join(', ') : '---'}</p>
            <p><strong>Autorisierte Verfahren:</strong> ${passedAudits.map(a => `${a.info.title} (${a.info.short})`).join(', ')}</p>
            <p><strong>Sektor:</strong> is</p>
        </div>
        
        <div class="authorization-text-box">
            ${authorizationText}
        </div>
        
        <div class="authorization-details">
            <p><strong>Befugnisse:</strong> Autorisierung zur Durchführung folgender Verfahren:</p>
            <div style="margin-left: 20px; margin-top: 5px;">
                ${passedAudits.map(a => 
                    `<div style="margin-bottom: 3px;">• ${a.info.title} (${a.info.short})</div>`
                ).join('')}
            </div>
            
            <p style="margin-top: 15px;"><strong>Ort:</strong> ${werk || 'Dem zuständigen Werk'}</p>
            <p><strong>Gesamtgültigkeit:</strong> ${overallExpiryDate.toLocaleDateString('de-DE')}</p>
        </div>
        
        <div class="authorization-signatures">
            <div class="authorization-signature-field">
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 11px;">Autorisierter Mitarbeiter (oder Führungskraft)</div>
                <div class="authorization-signature-line">
                    <div style="min-height: 20px;"></div>
                </div>
            </div>
            
            <div class="authorization-signature-field">
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 11px;">NDT Supervisor</div>
                <div class="authorization-signature-line">
                </div>
            </div>
        </div>
        
        <div class="authorization-stamp-box">
            <div>AUTORISIERUNG ERTEILT</div>
            <div>${new Date().toLocaleDateString('de-DE')}</div>
        </div>
        
        <div style="margin-top: 30px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 10px;">
            <table style="width: 100%;">
                <tr>
                    <td style="text-align: left; width: 33%;">Daniel Häusner, WI/SW2-PQT</td>
                    <td style="text-align: center; width: 34%;">FBL_INFSW17008_05_Autorisierungen_ZfP_Prüfungen</td>
                    <td style="text-align: right; width: 33%;">Version AA, 10.01.2026</td>
                </tr>
            </table>
        </div>
    `;
    
    document.getElementById('authorizationContainer').innerHTML = `
        <div class="report-action-buttons">
            <button class="report-action-btn print-btn" onclick="printFullAuthorization()">🖨️</button>
            <button class="report-action-btn close-btn" onclick="closeAuthorization()">✕</button>
        </div>
        ${authorizationHTML}
    `;
    document.getElementById('authorizationOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}