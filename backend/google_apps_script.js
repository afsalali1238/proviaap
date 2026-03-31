// ============================================
// PROVIA Question Report — Google Apps Script
// ============================================
// 
// SETUP:
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Delete existing code, paste this entire script
// 3. Deploy → New Deployment → Web App (Access: Anyone)
// 4. Copy the URL → it's already in ReportQuestionModal.tsx
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Support both form submissions (e.parameter) and JSON body (e.postData)
    var data = {};
    
    if (e.parameter && e.parameter.questionId) {
      // Form submission — data comes as key-value pairs
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      // JSON body — parse from postData
      data = JSON.parse(e.postData.contents);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.questionId || '',
      data.day || '',
      data.questionText || '',
      data.issueType || '',
      data.comment || '',
      data.suggestedAnswer || '',
      data.shownCorrectAnswer || '',
      data.allOptions || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'PROVIA Report API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
