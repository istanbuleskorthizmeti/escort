import { google } from 'googleapis';

const siteVerification = google.siteVerification('v1');
console.log("Keys of siteVerification:", Object.keys(siteVerification));
console.log("Keys of siteVerification.webResource:", Object.keys(siteVerification.webResource));
