// === HELPER FUNKTIONEN FÜR FOOTER ===
function getDocumentNameForAudit(auditType) {
    const documentMap = {
        'wirbelstrom': 'FBL_INFSW17008_01_NDT_Personal_ET',
        'magnetpulver': 'FBL_INFSW17008_04_NDT_Personal_MT', 
        'nital': 'FBL_INFSW17008_03_NDT_Personal_NE',
        'ultraschall': 'FBL_INFSW17008_02_NDT_Personal_UT'
    };
    return documentMap[auditType] || 'FBL_INFSW17008_NDT_Personal';
}

function getVersionForAudit(auditType) {
    return 'Version AA, 16.12.2025';
}

// === OVERLAY CLOSE FUNKTIONEN ===
function closeReport() {
    document.getElementById('reportOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAuthorization() {
    document.getElementById('authorizationOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// === PRINT FUNCTIONS ===
function printFullReport() {
    const reportContainer = document.getElementById('reportContainer');
    const printContent = reportContainer.innerHTML;
    
    // Entferne nur die Action-Buttons
    const cleanContent = printContent.replace(
        /<div class="report-action-buttons">[\s\S]*?<\/div>/, 
        ''
    );
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ZfP Audit Bericht - Schaeffler</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 15px; 
                    color: #000;
                    font-size: 10pt;
                    line-height: 1.3;
                }
                @page { 
                    size: A4 portrait; 
                    margin: 15mm; 
                }
                .report-header {
                    border-bottom: 2px solid #000;
                    padding-bottom: 8px;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .report-header h2 {
                    font-size: 14pt;
                    margin: 0 0 4px 0;
                    color: #000;
                }
                .company-info {
                    font-size: 9pt;
                    margin: 2px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 8px 0;
                    font-size: 9pt;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 5px;
                    vertical-align: top;
                }
                th {
                    background: #f0f0f0;
                    font-weight: bold;
                }
                .details-table td:first-child {
                    font-weight: bold;
                    width: 25%;
                    background: #f9f9f9;
                }
                .results-section {
                    margin: 15px 0;
                }
                .report-section-header {
                    font-size: 10pt;
                    font-weight: bold;
                    margin: 12px 0 6px 0;
                    padding-bottom: 2px;
                    border-bottom: 1px solid #000;
                }
                .question-item {
                    margin: 3px 0;
                    padding: 4px;
                    font-size: 9pt;
                    line-height: 1.2;
                }
                .question-item.ok {
                    border-left: 2px solid #00a000;
                    background: #f0fff0;
                }
                .question-item.not-ok {
                    border-left: 2px solid #ff0000;
                    background: #fff0f0;
                }
                .question-id {
                    font-weight: bold;
                }
                .question-comment {
                    font-style: italic;
                    color: #666;
                    margin-left: 8px;
                    font-size: 8pt;
                }
                .signature-area {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #000;
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }
                .signature-box {
                    flex: 1;
                    text-align: center;
                }
                .signature-line {
                    margin-top: 50px;
                    min-height: 40px;
                    height: 60px;
                }
                /* BILDER IM BERICHT */
                .report-image-container {
                    margin: 10px 0;
                    padding: 8px;
                    border: 1px solid #ddd;
                    background: #f9f9f9;
                    page-break-inside: avoid;
                }
                .report-image-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 8px;
                }
                .report-image-item {
                    border: 1px solid #ccc;
                    padding: 5px;
                    background: white;
                    text-align: center;
                }
                .report-image {
                    max-width: 80px;
                    max-height: 80px;
                    object-fit: contain;
                    border: 1px solid #eee;
                }
                .report-image-caption {
                    font-size: 8px;
                    color: #666;
                    margin-top: 3px;
                }
                /* FOOTER TABLES OHNE RAHMEN UND WENIGER ABSTAND */
                body > div:last-child {
                    margin-top: 5px !important;
                    padding-top: 3px !important;
                    border-top: 1px solid #ccc !important;
                }
                body > div:last-child table,
                body > div:last-child table td {
                    border: none !important;
                    border-collapse: collapse !important;
                }
                body > div:last-child table td {
                    padding: 0 !important;
                }
                @media print {
                    body { 
                        padding: 0; 
                    }
                    .signature-area { 
                        page-break-inside: avoid;
                        margin-top: 30px;
                    }
                    .signature-line {
                        border-top: none !important;
                        border: none !important;
                        margin-top: 40px;
                        min-height: 40px;
                        height: 60px;
                    }
                    table { font-size: 8pt; }
                    .question-item { font-size: 8pt; }
                    .report-image {
                        max-width: 70px;
                        max-height: 70px;
                    }
                    .report-image-container {
                        border: 0.5px solid #aaa;
                    }
                    body > div:last-child table,
                    body > div:last-child table td {
                        border: none !important;
                    }
                    body > div:last-child {
                        margin-top: 2px !important;
                        padding-top: 2px !important;
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            ${cleanContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 250);
}

function printFullAuthorization() {
    const authorizationContainer = document.getElementById('authorizationContainer');
    const printContent = authorizationContainer.innerHTML;
    
    const cleanContent = printContent.replace(
        /<div class="report-action-buttons">[\s\S]*?<\/div>/, 
        ''
    );
    
    const isMobile = window.innerWidth <= 768;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Autorisierung ZfP - Schaeffler</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 15px; 
                    color: #000;
                    font-size: 10pt;
                    line-height: 1.3;
                    ${isMobile ? 'transform: scale(0.95); transform-origin: top left; width: 105.3%;' : ''}
                }
                @page { 
                    size: A4 portrait; 
                    margin: 15mm; 
                }
                .authorization-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 12px;
                    margin-bottom: 20px;
                }
                .authorization-header h1 {
                    font-size: 18pt;
                    margin: 0 0 8px 0;
                    color: #000;
                }
                .authorization-info {
                    margin: 15px 0;
                    padding: 12px;
                    border: 1px solid #ccc;
                    background: #f9f9f9;
                }
                .authorization-info p {
                    margin: 6px 0;
                    font-size: 10pt;
                }
                .authorization-text-box {
                    border: 2px solid #000;
                    padding: 15px;
                    margin: 20px 0;
                    font-size: 10pt;
                    line-height: 1.4;
                    background: #f9f9f9;
                    min-height: 100px;
                }
                .authorization-details {
                    margin: 20px 0;
                    padding: 12px;
                    border: 1px solid #ccc;
                    background: #fff;
                }
                .authorization-details p {
                    margin: 6px 0;
                    font-size: 9pt;
                }
                .authorization-signatures {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #000;
                    display: flex;
                    justify-content: space-between;
                    gap: 30px;
                }
                .authorization-signature-field {
                    flex: 1;
                    text-align: center;
                }
                .authorization-signature-line {
                    margin-top: 40px;
                    padding-top: 8px;
                    min-height: 40px;
                    height: 60px;
                }
                .authorization-stamp-box {
                    text-align: center;
                    margin: 1px auto;
                    padding: 12px;
                    border: 2px solid #000;
                    border-radius: 8px;
                    background: #fff;
                    width: 70%;
                    max-width: 250px;
                }
                .authorization-stamp-box div:first-child {
                    font-size: 12pt;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                /* FOOTER TABLES OHNE RAHMEN */
                body > div:last-child table,
                body > div:last-child table td,
                body > div:last-child table tr {
                    border: none !important;
                    border-collapse: collapse !important;
                }
                body > div:last-child table td {
                    padding: 0 !important;
                }
                @media print {
                    body { 
                        padding: 0; 
                        ${isMobile ? 'transform: scale(0.95) !important; transform-origin: top left !important; width: 105.3% !important;' : ''}
                    }
                    .authorization-signatures { 
                        page-break-inside: avoid;
                        margin-top: 50px;
                    }
                    body > div:last-child table,
                    body > div:last-child table td {
                        border: none !important;
                    }
                }
            </style>
        </head>
        <body>
            ${cleanContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 250);
}