"use server";
import fs from 'fs';
import path from 'path';

export async function getWhatsAppStatus() {
    const qrPath = path.join(process.cwd(), 'public', 'wa-qr.png');
    const hasQrCode = fs.existsSync(qrPath);
    
    // We assume if there is no QR code, it might be connected, 
    // unless the process hasn't started yet. 
    // A more robust check would involve IPC, but this is sufficient for now.
    return {
        needsScan: hasQrCode,
        timestamp: Date.now()
    };
}
