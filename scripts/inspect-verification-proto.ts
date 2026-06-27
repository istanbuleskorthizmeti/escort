import { google } from 'googleapis';

const siteVerification = google.siteVerification('v1');
const proto = Object.getPrototypeOf(siteVerification.webResource);
console.log("WebResource prototype methods:", Object.getOwnPropertyNames(proto));
