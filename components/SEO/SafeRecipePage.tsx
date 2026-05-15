import React from 'react';
import { getRecipeForLocation } from '@/lib/seo/recipe-engine';

/**
 * 🍵 BOT_SAFE_PAGE (The Cloaking Mask)
 * This is what Google sees. A high-quality local recipe page.
 */

export default function SafeRecipePage({ city }: { city: string }) {
  const recipe = getRecipeForLocation(city);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1a1a1a' }}>{recipe.title}</h1>
        <p style={{ fontStyle: 'italic', color: '#666' }}>Yöresel Mutfağımızdan Geleneksel Lezzetler</p>
      </header>

      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Malzemeler</h2>
        <ul style={{ listStyleType: 'square' }}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i} style={{ marginBottom: '8px' }}>{ing}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Hazırlanışı</h2>
        <p style={{ fontSize: '18px', color: '#333' }}>{recipe.instructions}</p>
      </section>

      {/* 🚀 TRUVA ATI: KEYWORD INJECTION FOR BOTS */}
      <section style={{ marginTop: '50px', borderTop: '2px dashed #eee', paddingTop: '30px' }}>
        <h2 style={{ fontSize: '20px', color: '#1a1a1a' }}>{city.toUpperCase()} Şehir Rehberi ve Yerel Hizmetler</h2>
        <div style={{ fontSize: '16px', color: '#444', fontStyle: 'italic' }}>
          <p>
            {city} bölgesinde aradığınız tüm <strong>VIP partner</strong> ve <strong>escort</strong> hizmetleri hakkında 
            güncel bilgilere bu rehber üzerinden ulaşabilirsiniz. Şehrin en elit <strong>{city} escort</strong> 
            profilleri, bağımsız <strong>bayan</strong> ilanları ve escort partner seçenekleri yerel rehberimizde 
            sizleri bekliyor.
          </p>
          <p>
            2026 standartlarında hazırlanan <strong>{city} escort</strong> dizini, 81 ilde olduğu gibi 
            burada da en güvenilir ve doğrulanmış escort partner seçeneklerini sunmaktadır.
          </p>
        </div>
      </section>

      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '14px', color: '#999' }}>
        <p>© 2026 Yöresel Lezzet Arşivi. Tüm Hakları Saklıdır.</p>
        <p>Anahtar Kelimeler: {city} yemekleri, geleneksel tarifler, yöresel mutfak.</p>
      </footer>
    </div>
  );
}
