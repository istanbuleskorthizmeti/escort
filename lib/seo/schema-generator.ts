/**
 * 🧛‍♂️ DRKCNAY HYDRA: JSON-LD SCHEMA GENERATOR (v1.0)
 * Generates SEO-rich schemas (LocalBusiness, FAQPage) for search engines.
 */

interface FAQItem {
  q: string;
  a: string;
}

export class SchemaGenerator {
  /**
   * Generates FAQPage JSON-LD Schema
   */
  public static generateFAQPage(faqs: FAQItem[]): string {
    if (!faqs || faqs.length === 0) return '';

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }

  /**
   * Generates LocalBusiness JSON-LD Schema for physical search visibility
   */
  public static generateLocalBusiness({
    city,
    district,
    neighborhood,
    host,
    logoUrl,
    telephone = "+905000000000"
  }: {
    city: string;
    district?: string;
    neighborhood?: string;
    host: string;
    logoUrl?: string;
    telephone?: string;
  }): string {
    const cleanHost = host.replace(/^(https?:\/\/)?(www\.)?/, '');
    const siteUrl = `https://${cleanHost}`;
    
    // Construct localized business name
    const locationName = neighborhood 
      ? `${neighborhood}, ${district}`
      : district 
        ? district 
        : city;
        
    const businessName = `${locationName} VIP Escort - ${cleanHost.toUpperCase()}`;

    const schema: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": businessName,
      "image": logoUrl || `${siteUrl}/logo.png`,
      "telephone": telephone,
      "url": siteUrl,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressRegion": district || city,
        "addressCountry": "TR"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    };

    if (neighborhood) {
      schema.address.streetAddress = `${neighborhood} Mahallesi`;
    }

    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }
}
export default SchemaGenerator;
