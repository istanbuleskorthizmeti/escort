import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { omniAI } from "../ai-provider";
import { TelegramService } from "../crm/telegram";
import dotenv from "dotenv";

dotenv.config();

/**
 * ☁️ DRKCNAY ENGINE: CLOUD STACKER (The DotMirror Killer)
 * 
 * Objective: Generate High DA (Domain Authority) contextual backlinks 
 * by creating AI-generated static HTML sites hosted directly on 
 * AWS S3, Google Cloud, Azure, and DigitalOcean Spaces.
 */

interface CloudProviderConfig {
    name: string;
    region: string;
    endpoint?: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    bucketName: string;
    publicUrlFormat: string; // e.g. "https://{bucket}.s3.{region}.amazonaws.com/{key}"
}

export class CloudStacker {
    private providers: CloudProviderConfig[] = [];

    constructor() {
        // 1. AWS S3 Configuration
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_STACK_BUCKET) {
            this.providers.push({
                name: "AWS S3",
                region: process.env.AWS_REGION || "eu-central-1",
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                },
                bucketName: process.env.AWS_STACK_BUCKET,
                publicUrlFormat: `https://${process.env.AWS_STACK_BUCKET}.s3.${process.env.AWS_REGION || "eu-central-1"}.amazonaws.com/{key}`
            });
        }

        // 2. DigitalOcean Spaces (S3 Compatible)
        if (process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET && process.env.DO_STACK_BUCKET) {
             this.providers.push({
                name: "DigitalOcean Spaces",
                region: process.env.DO_SPACES_REGION || "fra1",
                endpoint: `https://${process.env.DO_SPACES_REGION || "fra1"}.digitaloceanspaces.com`,
                credentials: {
                    accessKeyId: process.env.DO_SPACES_KEY,
                    secretAccessKey: process.env.DO_SPACES_SECRET
                },
                bucketName: process.env.DO_STACK_BUCKET,
                publicUrlFormat: `https://${process.env.DO_STACK_BUCKET}.${process.env.DO_SPACES_REGION || "fra1"}.digitaloceanspaces.com/{key}`
            });
        }
    }

    private async generateSEOContent(city: string, keyword: string, targetUrl: string): Promise<string> {
        const prompt = `
            Sen bir elit SEO uzmanısın. Bize "Digital PR" seviyesinde, otoriter bir makale yazman gerekiyor.
            Konu: ${city} bölgesinde lüks yaşam, VIP danışmanlık ve üst düzey sosyal hizmetler.
            Makale tamamen yasal, prestijli ve kurumsal bir dille yazılmalı (Turizm ve Organizasyon).
            İçerik en az 800 kelime olmalı.
            HTML formatında yaz. Başlıklar (h1, h2), paragraflar (p) ve listeler (ul/li) kullan.
            Makalenin rastgele bir paragrafında şu anahtar kelimeyi tam eşleşme olarak geçir: "${keyword}" ve bunu şu linke yönlendir (a href): "${targetUrl}".
            CSS kullanma, sadece saf semantik HTML body içeriği ver. 
            Kesinlikle yasaklı escort kelimeleri kullanma, "VIP Asistanlık", "Özel Rehberlik", "Elit Sosyal Ajans" kelimelerini kullan.
        `;

        try {
            const htmlContent = await omniAI.generate(prompt, { temperature: 0.8, model: 'gemini-3.1-ultra' });
            
            // Clean up AI markdown formatting
            return htmlContent.replace(/```html|```/g, '').trim();
            
        } catch (error) {
            console.error("❌ [CLOUD STACKER] Content generation failed.", error);
            throw error;
        }
    }

    private wrapInModernTemplate(title: string, bodyHtml: string): string {
        return `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title} | VIP Executive Lifestyle</title>
                <style>
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; background-color: #fcfcfc; }
                    h1, h2, h3 { color: #111; }
                    a { color: #b91c1c; text-decoration: none; font-weight: bold; }
                    a:hover { text-decoration: underline; }
                    .author-bio { margin-top: 50px; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 8px; font-style: italic; color: #666; }
                </style>
            </head>
            <body>
                <header>
                    <h1>${title}</h1>
                </header>
                <main>
                    ${bodyHtml}
                </main>
                <footer class="author-bio">
                    <p>Powered by DRKCNAY Engine Cloud Distribution Network. Elite digital PR for exclusive clientele.</p>
                </footer>
            </body>
            </html>
        `;
    }

    public async executeSiege(city: string, keyword: string, targetUrl: string, slug: string) {
        if (this.providers.length === 0) {
            console.warn("⚠️ [CLOUD STACKER] No Cloud Providers configured in .env. Skipping Cloud Stacking.");
            return;
        }

        console.log(`☁️ [CLOUD STACKER] Initiating Siege for ${city} -> ${targetUrl}`);
        
        const rawContent = await this.generateSEOContent(city, keyword, targetUrl);
        const title = `${city} Elit Yaşam ve VIP Asistanlık Rehberi`;
        const finalHtml = this.wrapInModernTemplate(title, rawContent);
        
        const filename = `seo-pr-${slug}-${Date.now()}.html`;
        const uploadedLinks: string[] = [];

        for (const provider of this.providers) {
            try {
                console.log(`🚀 [CLOUD STACKER] Uploading to ${provider.name}...`);
                
                const s3Client = new S3Client({
                    region: provider.region,
                    endpoint: provider.endpoint,
                    credentials: provider.credentials,
                });

                await s3Client.send(new PutObjectCommand({
                    Bucket: provider.bucketName,
                    Key: filename,
                    Body: finalHtml,
                    ContentType: "text/html; charset=utf-8",
                    // ACL: "public-read" // Note: Bucket must have public access enabled
                }));

                const publicUrl = provider.publicUrlFormat.replace('{key}', filename);
                console.log(`✅ [CLOUD STACKER] Deployed on ${provider.name}: ${publicUrl}`);
                uploadedLinks.push(publicUrl);
                
            } catch (error: any) {
                console.error(`❌ [CLOUD STACKER] Failed on ${provider.name}:`, error.message);
            }
        }

        if (uploadedLinks.length > 0) {
            TelegramService.sendMessage(`☁️ *CLOUD STACKING BAŞARILI*\n\nYüksek DA'lı bulut sunucularında DoFollow link inşası tamamlandı.\nHedef: ${targetUrl}\nBulut Linkleri:\n${uploadedLinks.join('\n')}`);
        }
    }
}

// Singleton Instance
export const cloudStacker = new CloudStacker();
