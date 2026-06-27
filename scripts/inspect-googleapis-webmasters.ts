import { google } from 'googleapis';

const webmasters = google.webmasters('v3');
console.log("Keys of webmasters:", Object.keys(webmasters));
if ((webmasters as any).permissions) {
  console.log("Keys of webmasters.permissions:", Object.keys((webmasters as any).permissions));
} else {
  console.log("webmasters.permissions is undefined!");
}
