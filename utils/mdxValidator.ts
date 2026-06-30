import { z } from 'zod';

// MDX Frontmatter için Zod Şeması
// Bu şema, programatik olarak üretilen MDX dosyalarının tam tip güvenliğini sağlar (God Mode Zırhı).
export const MdxFrontmatterSchema = z.object({
  title: z.string().min(5, "Başlık çok kısa").max(100, "Başlık çok uzun"),
  description: z.string().min(10, "Açıklama çok kısa").max(250, "Açıklama çok uzun"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, "Geçersiz tarih formatı (ISO 8601 olmalı)"),
  city: z.string().min(2, "Şehir adı boş olamaz"),
  district: z.string().min(2, "İlçe adı boş olamaz"),
  keyword: z.string().min(2, "Anahtar kelime boş olamaz"),
  tags: z.array(z.string()).optional().default([]),
  isDraft: z.boolean().optional().default(false),
  seoScore: z.number().min(0).max(100).optional()
});

export type MdxFrontmatter = z.infer<typeof MdxFrontmatterSchema>;

/**
 * MDX verisini diske yazmadan önce doğrular.
 * Eğer hata varsa, throw fırlatmak yerine güvenli bir yapı döndürür (Silent Fail önlemi).
 */
export function validateFrontmatter(data: unknown) {
  const result = MdxFrontmatterSchema.safeParse(data);
  
  if (!result.success) {
    const errorDetails = result.error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
    console.error(`🛡️ [ZOD VALIDATION ERROR]: Hatalı MDX yapısı engellendi. Detay: ${errorDetails}`);
    return { isValid: false, errors: result.error.issues, data: null };
  }
  
  return { isValid: true, errors: null, data: result.data };
}
