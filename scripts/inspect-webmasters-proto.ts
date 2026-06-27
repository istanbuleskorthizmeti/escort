import { google } from 'googleapis';

const webmasters = google.webmasters('v3');
const proto = Object.getPrototypeOf(webmasters);
console.log("Webmasters prototype properties/methods:", Object.getOwnPropertyNames(proto));
