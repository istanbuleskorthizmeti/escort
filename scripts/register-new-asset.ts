
import { prisma } from "../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

async function registerAsset() {
    const url = "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa";
    const title = "Beşyol Üniversiteli Escort (Google Sites)";
    
    console.log(`🛰️ [HYDRA-ASSET] Registering: ${url}`);

    try {
        await prisma.authorityAsset.upsert({
            where: { url: url },
            update: {
                status: 'LIVE',
                dr: 100, // Google Sites is DA/DR 100
                type: 'GOOGLE_SITES'
            },
            create: {
                url: url,
                title: title,
                dr: 100,
                type: 'GOOGLE_SITES',
                status: 'LIVE'
            }
        });
        console.log("✅ [SUCCESS] Asset registered and indexed for reporting.");
    } catch (err: any) {
        console.error("❌ [ERROR]", err.message);
    }
}

registerAsset();
