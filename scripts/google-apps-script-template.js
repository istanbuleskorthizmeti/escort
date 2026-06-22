/**
 * ⚡ HYDRA BLACK HAT SEO - MASTER GOOGLE APPS SCRIPT TEMPLATE (v2.0)
 * 
 * INSTRUCTIONS FOR USE:
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code and paste this entire script.
 * 4. Replace the SERVICE_ACCOUNT_EMAIL and SERVICE_ACCOUNT_PRIVATE_KEY placeholders 
 *    with the credentials from your local "google-key.json".
 * 5. Run setupSheet() first to create the correct sheet columns and tabs.
 * 6. Authorize the permissions requested by Google.
 */

// ==========================================
// 🛡️ CONFIGURATION GATE (ENTERPRISE CREDENTIALS)
// ==========================================
const SERVICE_ACCOUNT_EMAIL = "sovereign-spyy@karacocuk.iam.gserviceaccount.com"; // From your google-key.json
const SERVICE_ACCOUNT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...\n-----END PRIVATE KEY-----\n"; // Replace with your actual private key (include \n for newlines)

const MONEY_SITE_REDIRECT = "https://dorukcanay.digital"; // Your canonical destination

// ==========================================
// 1. DATABASE & SHEET SETUP INITIALIZER
// ==========================================
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create / Retrieve Sheets
  let dataSheet = ss.getSheetByName("Parasite Hub");
  if (!dataSheet) {
    dataSheet = ss.insertSheet("Parasite Hub");
  }
  
  // Set Column Headers
  const headers = [
    "District", 
    "Neighborhood", 
    "Slug", 
    "Keywords", 
    "Doc URL", 
    "Google Doc Index Status", 
    "Google Sites URL", 
    "Sitemap Status", 
    "Last Action Timestamp"
  ];
  
  dataSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  dataSheet.getRange(1, 1, 1, headers.length)
    .setBackground("#111827")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  SpreadsheetApp.getUi().alert("✅ Setup Complete! 'Parasite Hub' columns configured with dark theme headers.");
}

// ==========================================
// 2. SOVEREIGN GOOGLE DOCS AUTOMATIC GENERATOR
// ==========================================
function generateBulkGoogleDocs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Parasite Hub");
  const data = sheet.getDataRange().getValues();
  
  // Start from row 2 (index 1) to bypass headers
  for (let i = 1; i < data.length; i++) {
    const district = data[i][0];
    const neighborhood = data[i][1];
    const slug = data[i][2] || (district + "-" + neighborhood).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const docUrl = data[i][4];
    
    // Process only rows without generated Docs
    if (!docUrl && district) {
      const zoneName = neighborhood ? district + " " + neighborhood : district;
      const docTitle = `💎 ${zoneName} Escort | VIP Partner & Escort Kataloğu (2026)`;
      
      try {
        Logger.log(`📝 Creating Google Doc for: ${zoneName}`);
        
        // 1. Create a blank Google Document
        const doc = DocumentApp.create(docTitle);
        const body = doc.getBody();
        
        // 2. Generate Content structure
        body.appendParagraph(docTitle)
          .setHeading(DocumentApp.ParagraphHeading.HEADING1)
          .setFontFamily("Georgia")
          .setForegroundColor("#E11D48");
        
        body.appendParagraph(`${zoneName} bölgesinde lüks ve konforlu bir eşlik deneyimi mi arıyorsunuz? Doğru yerdesiniz. Güvenliğiniz ve gizliliğiniz %100 koruma altındadır.`)
          .setFontSize(11)
          .setItalic(true);
          
        body.appendParagraph("🛡️ Kaporasız & Güvenilir Buluşma Prensipleri")
          .setHeading(DocumentApp.ParagraphHeading.HEADING2)
          .setForegroundColor("#111827");
          
        body.appendParagraph(`Bizim sistemimizdeki tüm partnerler doğrulanmıştır. Herhangi bir ön ödeme, depozito veya kapora tuzağı bulunmamaktadır. Ödemenizi adreste elden nakit olarak güvenle gerçekleştirebilirsiniz.`);
        
        body.appendParagraph("🔗 RESMİ VIP ESCORT KATALOĞUNU AÇMAK İÇİN BURAYA TIKLAYIN")
          .setHeading(DocumentApp.ParagraphHeading.HEADING3)
          .setLinkUrl(`${MONEY_SITE_REDIRECT}/istanbul/${slug}`)
          .setForegroundColor("#E11D48");
          
        body.appendParagraph(`Daha fazla model görmek, resimlerini incelemek ve WhatsApp üzerinden randevu oluşturmak için resmi yönlendirme linkimizi kullanın. Eve ve otele lüks manken servisimiz mevcuttur.`);
        
        doc.saveAndClose();
        
        // 3. Make Document Public & Shared
        const file = DriveApp.getFileById(doc.getId());
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        const finalUrl = file.getUrl();
        Logger.log(`✅ Success: ${finalUrl}`);
        
        // Write url back to sheet
        sheet.getRange(i + 1, 5).setValue(finalUrl);
        sheet.getRange(i + 1, 9).setValue(new Date().toISOString());
        
      } catch (err) {
        Logger.log(`❌ Failed creating doc for ${zoneName}: ${err.toString()}`);
      }
    }
  }
}

// ==========================================
// 3. BULK GOOGLE INDEXING API AUTOMATOR
// ==========================================
function runGoogleIndexingAPI() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Parasite Hub");
  const data = sheet.getDataRange().getValues();
  
  Logger.log("🔌 Resolving Indexing API token...");
  const token = getGoogleAuthToken(SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_PRIVATE_KEY);
  if (!token) {
    SpreadsheetApp.getUi().alert("❌ Authentication failed. Check private key format.");
    return;
  }
  
  let successCount = 0;
  
  for (let i = 1; i < data.length; i++) {
    const docUrl = data[i][4]; // Google Doc URL
    const status = data[i][5]; // Index Status
    
    // Process only populated Docs that haven't been indexed successfully
    if (docUrl && status !== "INDEX_REQUESTED") {
      try {
        Logger.log(`📡 Sending Indexing request for: ${docUrl}`);
        
        const response = UrlFetchApp.fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
          method: "post",
          contentType: "application/json",
          headers: {
            "Authorization": "Bearer " + token
          },
          payload: JSON.stringify({
            "url": docUrl,
            "type": "URL_UPDATED"
          }),
          muteHttpExceptions: true
        });
        
        const resCode = response.getResponseCode();
        const resText = response.getContentText();
        
        if (resCode === 200) {
          sheet.getRange(i + 1, 6).setValue("INDEX_REQUESTED");
          sheet.getRange(i + 1, 9).setValue(new Date().toISOString());
          successCount++;
          Logger.log(`✅ Index Request Successful for: ${docUrl}`);
        } else {
          Logger.log(`⚠️ Status ${resCode}: ${resText}`);
          sheet.getRange(i + 1, 6).setValue(`ERROR_${resCode}`);
        }
        
      } catch (e) {
        Logger.log(`❌ Request failed: ${e.toString()}`);
      }
      
      // Throttle to respect Google API limits
      Utilities.sleep(100);
    }
  }
  
  Logger.log(`🏁 Done! Submitted ${successCount} URLs to Google Indexing API.`);
}

// ==========================================
// 🔒 GOOGLE OAUTH JWT UTILITIES
// ==========================================
function getGoogleAuthToken(clientEmail, privateKey) {
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };
  
  const encodedHeader = base64Encode(JSON.stringify(header));
  const encodedClaimSet = base64Encode(JSON.stringify(claimSet));
  const signatureInput = encodedHeader + "." + encodedClaimSet;
  
  try {
    const signature = Utilities.computeRsaSha256Signature(signatureInput, privateKey);
    const encodedSignature = Utilities.base64EncodeWebSafe(signature).replace(/=+$/, '');
    const jwt = signatureInput + "." + encodedSignature;
    
    const response = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
      method: "post",
      payload: {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      },
      muteHttpExceptions: true
    });
    
    const tokenData = JSON.parse(response.getContentText());
    return tokenData.access_token;
  } catch (err) {
    Logger.log(`❌ Auth token generation failed: ${err.toString()}`);
    return null;
  }
}

function base64Encode(str) {
  return Utilities.base64EncodeWebSafe(Utilities.newBlob(str).getBytes()).replace(/=+$/, '');
}
