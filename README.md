# Shop Act License Application Form

A production-ready static web application for collecting Maharashtra Shop Act License application details and saving submissions into Google Sheets through Google Apps Script.

## Files

- `index.html` – responsive form markup with all eight sections.
- `style.css` – government-style blue theme, cards, responsive grid, sticky section titles, animations, validation styles, spinner, and success states.
- `script.js` – Vanilla JavaScript validation, worker totals, input restrictions, PAN uppercase conversion, duplicate-submission prevention, and Fetch API submission.
- `Code.gs` – Google Apps Script backend that receives JSON POST requests and appends rows to Google Sheets.

## Sample Google Sheet Layout

Create a sheet named `Applications` with these columns in row 1:

| Timestamp | Application Type | Business Name | Business Address | Business City | PIN Code | Business Start Date | Nature of Business | Organization Type | Ownership | Male Workers | Female Workers | Total Workers | Employer Name | Residential Address | Residential City | ZIP | Resident Since | Aadhaar | PAN | Email | Mobile | Alternate Mobile | Consent | IP Address (optional) | Browser (optional) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

`Code.gs` automatically creates the header row if the sheet is empty.

## Deploy Google Apps Script as a Web App

1. Open [Google Sheets](https://sheets.google.com/) and create a new spreadsheet.
2. Rename the first sheet to `Applications`.
3. Copy the spreadsheet ID from the URL. It is the long value between `/d/` and `/edit`.
4. Open **Extensions → Apps Script**.
5. Paste the contents of `Code.gs` into the Apps Script editor.
6. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your spreadsheet ID.
7. Click **Save**.
8. Click **Deploy → New deployment**.
9. Select **Web app** as the deployment type.
10. Set **Execute as** to **Me**.
11. Set **Who has access** to **Anyone**.
12. Click **Deploy** and authorize the requested permissions.
13. Copy the generated Web App URL.

## Connect the Web App URL to JavaScript

1. Open `script.js`.
2. Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web App URL from Apps Script.
3. Replace `91XXXXXXXXXX` with the WhatsApp number that should receive documents, including country code and no plus sign.
4. Upload `index.html`, `style.css`, and `script.js` to your static hosting provider.

## Validation and Submission Behavior

- Required fields are validated before submission.
- PIN must be exactly 6 digits.
- ZIP / Postal code must be 5 or 6 digits.
- Aadhaar must be exactly 12 digits.
- Mobile and alternate mobile numbers must be exactly 10 digits when provided.
- PAN is optional, converted to uppercase, and validated against `ABCDE1234F` format when provided.
- Worker counts cannot be negative and total workers are calculated automatically.
- The submit button is disabled while the request is in progress to prevent duplicate submissions.
- A green success card is displayed, the form is cleared, and the page scrolls to the top after a successful response.

## Local Preview

Because this is a static application, open `index.html` in a browser or serve the folder with any static server. No build step or framework is required.
