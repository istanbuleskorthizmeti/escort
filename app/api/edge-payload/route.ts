import { NextResponse } from 'next/server';
import { generateUltraContextualContent } from '../../../lib/ai-seo';
import { splitSlug } from '../../../lib/slug';

const API_SECRET_KEY = "DRKCNAY_EDGE_V1_778899"; // Same as the worker

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${API_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain, path, ip } = await req.json();

    console.log(`👻 [EDGE PBN] Request from ${domain}${path} (IP: ${ip})`);

    // Parse location from domain or path
    // Example: sisliescortvip.online -> we can extract "sisli" 
    // Or if path is /kadikoy -> we extract "kadikoy"
    let locationTarget = "Türkiye";
    let districtTarget = "";

    const cleanPath = path.replace(/^\//, ''); // Remove leading slash
    
    // Simple parsing logic: if there is a path, it's the district.
    // If not, try to extract it from the domain.
    if (cleanPath && cleanPath !== '') {
        const parts = splitSlug(cleanPath);
        locationTarget = parts[0] || "İstanbul";
        districtTarget = parts[1] || "";
    } else {
        // Try to guess from domain (e.g., sisli-escort. online)
        const domainParts = domain.split('.')[0].split('-');
        if (domainParts.length > 0) {
            locationTarget = domainParts[0]; // Guess: 'sisli'
        }
    }

    // Generate VIP Elite Content specifically for this Edge Request
    const omniContent = await generateUltraContextualContent({
        city: locationTarget,
        district: districtTarget,
        category: 'VIP Escort',
        nicheType: 'Escort ve Yetişkin Ajansı',
        host: domain
    });

    // Create a basic schema for the edge node
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `${locationTarget} ${districtTarget} VIP Escort`,
        "image": "https://istanbulescort.blog/images/profiles/vip-1.webp",
        "telephone": "",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": locationTarget,
          "addressCountry": "TR"
        },
        "url": `https://${domain}${path}`
    };

    return NextResponse.json({
      title: omniContent.wordpress.title,
      description: `${locationTarget} bölgesinde en kaliteli kaporasız hizmet.`,
      htmlContent: omniContent.wordpress.content, // Sending the WP HTML version
      schema: schema
    });

  } catch (error: any) {
    console.error('Edge Payload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
