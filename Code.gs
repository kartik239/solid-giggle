/**
 * Google Apps Script backend for Shop Act License Application submissions.
 * 1. Create a Google Sheet with the headers listed in README.md.
 * 2. Paste this file into Apps Script.
 * 3. Set SPREADSHEET_ID to your Sheet ID and deploy as a Web App.
 */
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Applications';

const HEADERS = [
  'Timestamp', 'Application Type', 'Business Name', 'Business Address', 'Business City',
  'PIN Code', 'Business Start Date', 'Nature of Business', 'Organization Type', 'Ownership',
  'Male Workers', 'Female Workers', 'Total Workers', 'Employer Name', 'Residential Address',
  'Residential City', 'ZIP', 'Resident Since', 'Aadhaar', 'PAN', 'Email', 'Mobile',
  'Alternate Mobile', 'Consent', 'IP Address (optional)', 'Browser (optional)'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    sheet.appendRow([
      new Date(), data.applicationType, data.businessName, data.businessAddress, data.businessCity,
      data.pinCode, data.businessStartDate, data.natureOfBusiness, data.organizationType,
      data.ownership, data.maleWorkers, data.femaleWorkers, data.totalWorkers, data.employerName,
      data.residentialAddress, data.residentialCity, data.zipCode, data.residentSince,
      data.aadhaar, data.pan, data.email, data.mobile, data.alternateMobile, data.consent,
      data.ipAddress || '', data.browser || ''
    ]);
    return json_({ status: 'success', message: 'Application saved successfully.' });
  } catch (error) {
    return json_({ status: 'error', message: error.message });
  }
}

function doGet() {
  return json_({ status: 'success', message: 'Shop Act application endpoint is active.' });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
