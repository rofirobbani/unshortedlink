function processShortlinksWithExpandURL() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("unshort");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Get column indexes
  const shortlinkCol = headers.indexOf("shortlink");
  const unshortenedCol = headers.indexOf("unshortened");
  const statusCol = headers.indexOf("status");
  const timestampCol = headers.indexOf("timestamp");

  if (shortlinkCol === -1 || unshortenedCol === -1 || statusCol === -1 || timestampCol === -1) {
    throw new Error("Missing one of the required columns: 'shortlink', 'unshortened', 'status', 'timestamp'");
  }

  for (let i = 1; i < data.length; i++) {
    const rowNumber = i + 1;
    const shortUrl = data[i][shortlinkCol];

    if (!shortUrl) {
      sheet.getRange(rowNumber, statusCol + 1).setValue("No URL provided");
      sheet.getRange(rowNumber, timestampCol + 1).setValue(new Date());
      continue;
    }

    Logger.log(`🔍 Row ${rowNumber}: Unshortening ${shortUrl}`);
    const startTime = new Date();
    let finalUrl = "";
    let status = "";

    try {
      finalUrl = ExpandURLManually(shortUrl);
      status = finalUrl.startsWith("Error") || finalUrl === "Too many redirects"
        ? finalUrl
        : "Success";
    } catch (e) {
      status = "Error: " + e.message;
    }

    sheet.getRange(rowNumber, unshortenedCol + 1).setValue(finalUrl);
    sheet.getRange(rowNumber, statusCol + 1).setValue(status);
    sheet.getRange(rowNumber, timestampCol + 1).setValue(startTime);

    Logger.log(`✅ Row ${rowNumber}: ${status} | Final URL: ${finalUrl}`);
  }

  Logger.log("🚀 Done processing all rows.");
}


function ExpandURLManually(url, maxRedirects = 10) {
  if (!url) return "";

  url = url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;

  try {
    let currentUrl = url;

    for (let i = 0; i < maxRedirects; i++) {
      const response = UrlFetchApp.fetch(currentUrl, {
        followRedirects: false,
        muteHttpExceptions: true,
      });

      const responseCode = response.getResponseCode();
      const headers = response.getAllHeaders();
      const location = headers["Location"] || headers["location"];

      if (responseCode >= 300 && responseCode < 400 && location) {
        // If the redirect is a relative URL, prepend the domain
        if (location.startsWith("/")) {
          const baseUrl = currentUrl.match(/^(https?:\/\/[^/]+)/)[0];
          currentUrl = baseUrl + location;
        } else if (location.startsWith("http://") || location.startsWith("https://")) {
          currentUrl = location;
        } else {
          // Not a full or relative URL, treat it as-is
          currentUrl = location;
        }
      } else {
        return currentUrl;
      }
    }

    return "Too many redirects";
  } catch (e) {
    return "Error: " + e.message;
  }
}
