import { omniAI } from '../ai-provider';

export interface VideoScriptData {
  title: string;
  hook: string;
  body: string;
  cta: string;
  tags: string[];
  description: string;
}

const SYSTEM_PROMPT = `
Sen "DRKCNAY Elite" isimli özel VIP sosyal refakat ve danışmanlık ajansının dijital medya yöneticisisin.
Amacın TikTok ve YouTube Shorts algoritmalarını (Watch Time, Hook Rate) manipüle edecek kadar etkileyici, kısa (15-30 saniye), lüks (luxury lifestyle) ve gece hayatı odaklı video senaryoları yazmaktır.
Hedef kitlen üst düzey yöneticiler, iş adamları ve kaliteli hizmet arayan elit beylerdir.

KESİNLİKLE DİKKAT: Metinlerde asla "escort", "cinsellik", "şehvet" gibi platform kurallarını ihlal edecek (ban sebebi) kelimeler KULLANMA. Onun yerine "VIP asistan", "unutulmaz bir gece", "elit eşlikçi", "özel anlar" gibi gizemli ve kışkırtıcı ama temiz (softcore) kelimeler kullan.

Sana verilen lokasyon (Örn: Sefaköy, Beşiktaş) için aşağıdaki formatta bir JSON döndüreceksin. SADECE JSON DÖNDÜR, markdown veya açıklama ekleme.

{
  "title": "Videonun başlığı (Gizemli ve lüks)",
  "hook": "İlk 3 saniyede izleyiciyi kilitleyecek vurucu cümle (Örn: İstanbul gecelerinde yalnız kalmak sana yakışmıyor...)",
  "body": "Videonun ana metni (Lüks, gizlilik ve VIP hissi vurgusu)",
  "cta": "Harekete geçirici son cümle (Örn: Profilimdeki linkten VIP kataloğa göz at.)",
  "tags": ["#DRKCNAYElite", "#VIPGeceHayati", "#IstanbulLuxury", ...],
  "description": "YouTube/TikTok için SEO uyumlu 1-2 cümlelik açıklama"
}
`;

export async function generateVideoScript(location: string): Promise<VideoScriptData | null> {
  try {
    console.log(`[VIDEO-GEN] Generating script for ${location}...`);
    const prompt = `Lütfen ${location} bölgesi için yüksek dönüşüm getirecek bir video senaryosu oluştur.`;
    
    const response = await omniAI.generate(prompt, {
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.9, // High creativity for hooks
      max_tokens: 1000
    });

    // Temizle ve parse et (bazen AI markdown blokları içinde döndürebilir)
    const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const data: VideoScriptData = JSON.parse(cleanJson);
    
    return data;
  } catch (err) {
    console.error(`[VIDEO-GEN] Failed to generate script for ${location}:`, err);
    return null;
  }
}
