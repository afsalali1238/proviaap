// ============================================
// PROVIA Question Report — Google Apps Script
// ============================================
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com → Create a new Google Sheet
// 2. Name it "PROVIA Question Reports"
// 3. In Row 1, add these headers:
//    A: Timestamp | B: Question ID | C: Day | D: Question Text | E: Issue Type | F: Comment | G: Suggested Answer | H: Shown Correct Answer | I: All Options
// 4. Go to Extensions → Apps Script
// 5. Delete any existing code and paste this entire file
// 6. Click Deploy → New Deployment
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Click "Deploy" and copy the Web App URL
// 8. Paste that URL into ReportQuestionModal.tsx (replace YOUR_GOOGLE_APPS_SCRIPT_URL)
// 9. Save, rebuild, and push!
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
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
