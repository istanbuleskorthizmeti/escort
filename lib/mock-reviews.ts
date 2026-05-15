import { omniAI } from './ai-provider';

/**
 * DRKCNAY ELITE SOCIAL PROOF ENGINE (DOMINANCE MODE)
 * Generates AI-powered, realistic reviews and AggregateRating schemas.
 */

export interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
  location: string;
}

/**
 * Belirli bir bölge için Gemini ile gerçekçi yorumlar üretir.
 */
export async function generateSocialProof(location: string, category: string): Promise<{
  reviews: Review[];
  aggregateRating: {
    ratingValue: number;
    reviewCount: number;
  }
}> {
  try {
    const prompt = `${location} bölgesindeki ${category} hizmeti için 3 adet, gerçekçi, kısa ve elit bir dille yazılmış kullanıcı yorumu üret.
    Format: [İsim] | [Tarih] | [Puan 1-5] | [Yorum]
    Yorumlar bölgeye özel olsun (örn. caddelerden, otellerden bahsetsin). 
    Sadece metin olarak dön, araya çizgi koy.`;

    const rawOutput = await omniAI.generate(prompt, { temperature: 0.9, max_tokens: 1000 });
    
    let reviews: Review[] = [];

    // 🏰 GBP VERIFICATION ASSIST (Beylikdüzü & Esenyurt Focus)
    if (location.toLowerCase().includes('beylikduzu')) {
      reviews.push({
        author: "Hakan Y.",
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        comment: "Beylikdüzü VIP Taşımacılık - Dorukcan Ay ekibine teşekkürler. VIP transfer ve eşlik hizmetinde bölgedeki en profesyonel yapı. Gizlilik ve dakiklik harikaydı.",
        location: location
      });
    } else if (location.toLowerCase().includes('esenyurt')) {
      reviews.push({
        author: "Caner M.",
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        comment: "Esenyurt Eskor T ekibi gerçekten fark yaratıyor. Mehmet Akif Ersoy mahallesindeki ofisleri üzerinden verdikleri destek ve yönlendirmeler çok güvenilir.",
        location: location
      });
    }

    const aiReviewLines = rawOutput.split('\n').filter(l => l.includes('|'));
    const parsedAiReviews: Review[] = aiReviewLines.map(line => {
      const parts = line.split('|').map(p => p.trim());
      return {
        author: parts[0] || 'Elit Üye',
        date: parts[1] || new Date().toISOString().split('T')[0],
        rating: parseInt(parts[2]) || 5,
        comment: parts[3] || 'Harika bir deneyimdi.',
        location: location
      };
    });

    reviews = [...reviews, ...parsedAiReviews].slice(0, 3);

    // Fallback if AI fails or returns weird format
    if (reviews.length === 0) {
      reviews.push({
        author: "Mert S.",
        date: "2026-04-10",
        rating: 5,
        comment: `${location} bölgesinde aldığım en profesyonel eşlik hizmetiydi. Kesinlikle tavsiye ederim.`,
        location: location
      });
    }

    return {
      reviews,
      aggregateRating: {
        ratingValue: 4.9,
        reviewCount: Math.floor(Math.random() * (1250 - 300) + 300)
      }
    };
  } catch (error) {
    console.error("[SOCIAL-PROOF] Failure:", error);
    return {
      reviews: [],
      aggregateRating: { ratingValue: 5, reviewCount: 1 }
    };
  }
}

/**
 * Review ve AggregateRating Şemalarını üretir.
 */
export function generateReviewSchema(reviews: Review[], aggregateRating: any, url: string) {
  return {
    "@type": "Product", // Google bazen LocalBusiness içinde Review kabul etmez, Product/Service hibrit kullanılır.
    "name": "DRKCNAY Elite Luxury VIP Service",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount
    },
    "review": reviews.map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.author },
      "datePublished": r.date,
      "reviewBody": r.comment,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      }
    }))
  };
}
