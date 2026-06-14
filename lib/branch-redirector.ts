import { BRANCHES, generateBranchSchema } from './gbp-pinning-data';

/**
 * 🛰️ DRKCNAY ELITE - CENTRALIZED REDIRECTOR & SCHEMA ENGINE
 * Handles dynamic branch routing and hidden WhatsApp redirects.
 */

// Centralized number management - change here to update ALL branches
const GLOBAL_CONFIG = {
    whatsappNumber: "12495448982",
    redirectDelay: 0 // ms
};

export default function BranchHandler({ slug }: { slug: string }) {
    const branch = BRANCHES.find(b => b.slug === slug);
    
    if (!branch) return null;

    const schema = generateBranchSchema(branch);

    return `
        <html>
            <head>
                <title>${branch.title}</title>
                <script type="application/ld+json">
                    ${JSON.stringify(schema)}
                </script>
                <meta name="robots" content="index, follow">
                <script>
                    // Professional Stealth Redirect
                    setTimeout(() => {
                        window.location.href = "https://wa.me/${GLOBAL_CONFIG.whatsappNumber}?text=${encodeURIComponent('Merhaba, ' + branch.title + ' üzerinden ulaşıyorum.')}";
                    }, ${GLOBAL_CONFIG.redirectDelay});
                </script>
            </head>
            <body>
                <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
                    <h2>${branch.title} - Yönlendiriliyorsunuz...</h2>
                </div>
            </body>
        </html>
    `;
}
