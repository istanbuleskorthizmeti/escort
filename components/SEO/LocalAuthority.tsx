
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { generateGhostSchema, getDistrictMapEmbedUrl } from '../../lib/seo/maps-generator';

/**
 * 🧛‍♂️ DRKCNAY ELITE: LOCAL AUTHORITY INJECTOR (Black Hat v3.0)
 * Objective: Inject hyper-local signals into the DOM to satisfy Google's LSA algorithms.
 */
export function LocalAuthority() {
  const params = useParams();
  const city = (params?.city as string) || 'İstanbul';
  const district = (params?.district as string) || (params?.slug as string) || 'Besiktas';
  
  const schema = generateGhostSchema(city, district);
  const mapUrl = getDistrictMapEmbedUrl(district);

  return (
    <div className="hidden sr-only" aria-hidden="true">
      {/* 🚀 SCHEMA.ORG INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* 🚀 LOCAL NAP CITATION (Hidden but indexable) */}
      <div className="local-citation">
        <h3>DRKCNAY ELITE {district} Ofis Bilgileri</h3>
        <p>{schema.address.streetAddress}, {schema.address.addressLocality}/{schema.address.addressRegion}</p>
        <p>Posta Kodu: {schema.address.postalCode}</p>
        <p>Telefon: {schema.telephone}</p>
      </div>

      {/* 🚀 GOOGLE MAPS EMBED (Force Googlebot to associate IP/Domain with Location) */}
      <iframe
        width="100%"
        height="1"
        frameBorder="0"
        src={mapUrl}
        allowFullScreen
      ></iframe>
    </div>
  );
}
