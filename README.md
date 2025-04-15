# 🔗 URL Unshortener with Google Apps Script

This project provides a Google Apps Script that helps you **automatically unshorten (expand) shortened URLs** like `bit.ly`, `t.co`, or `tinyurl` inside a Google Sheet.

---

## 🚀 Features

- Automatically unshortens shortened URLs using manual redirect tracing (up to 10 hops).
- Writes the final unshortened URL back to the sheet.
- Logs processing status for each URL.
- Adds a timestamp when each URL is processed.
- Provides detailed logs via `Logger.log()` in Apps Script.
- Designed for Google Sheets with custom headers.

---

## 📊 Sheet Setup

Use a Google Sheet with the name: `unshort`

Add **these exact headers in Row 1**:

| shortlink | unshortened | status | timestamp |
|-----------|-------------|--------|-----------|
| https://bit.ly/... |             |        |           |
| https://tinyurl... |             |        |           |

---

## ⚙️ How to Use

1. Open your Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Delete any existing code and paste the contents of `Code.gs` (provided below).
4. Click `File > Save` and give your project a name.
5. Select the `processShortlinksWithExpandURL` function from the dropdown and click ▶️ Run.
6. The script will ask for authorization. Grant the necessary permissions to access the sheet and URLs.

---

## This function:
1. Reads all rows in the unshort sheet.
2. Extracts URLs from the shortlink column.
3. Manually follows HTTP redirects to determine the final destination.
4. Writes the unshortened URL to the unshortened column.
5. Logs success or errors in the status column.
6. Logs a timestamp in the timestamp column.

---

## 🧪 Sample Output
| shortlink | unshortened | status | timestamp |
|-----------|-------------|--------|-----------|
| https://bit.ly/... |https://example.com/real-page|Success|025-04-15T14:32:10Z|
| https://tinyurl... |Error: Redirect failed|Error|2025-04-15T14:32:12Z|

---

## 🛠️ Optional Enhancements
1. Add a button in your Sheet to run the script manually.
2. Set a time-based trigger to auto-run the script every hour or day.
3. Modify to skip rows where unshortened already has a value.

