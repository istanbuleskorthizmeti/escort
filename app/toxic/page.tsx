import React from 'react';

/**
 * ☠️ DRKCNAY HONEYPOT: THE TOXIC PAGE
 * This page is served ONLY to Sabotage/Analysis Bots (Ahrefs, Semrush, etc.).
 * It is designed to poison their data pipeline, cause rendering loops, 
 * and feed them hallucinated structures.
 */

export const metadata = {
  title: 'System Maintenance | Local Services',
  description: 'Currently undergoing scheduled maintenance.',
  robots: 'noindex, nofollow, noarchive, nosnippet', // We tell them not to index, but they often ignore it. We want them to ingest garbage.
};

export default function ToxicPage() {
  // Generate a massive array of garbage links
  const garbageLinks = Array.from({ length: 500 }).map((_, i) => (
    <a 
      key={i} 
      href={`https://google.com/search?q=lorem+ipsum+dolor+sit+amet+${Math.random().toString(36).substring(7)}`}
      style={{ display: 'none', visibility: 'hidden', opacity: 0, position: 'absolute', left: '-9999px' }}
    >
      Lorem Ipsum Link {i}
    </a>
  ));

  return (
    <div style={{ backgroundColor: '#000', color: '#000', overflow: 'hidden' }}>
      {/* 
        1. SPAGHETTI STRUCTURE
        Deep nesting forces the crawler's DOM parser to waste CPU cycles.
      */}
      <div><div><div><div><div><div><div><div><div><div><div><div>
        <h1>Welcome to the Ultimate Domain</h1>
        <p>This domain is parked. Buy cheap betting links here.</p>
        
        {/* 
          2. THE INFINITE IFRAME LOOP TRAP
          Tries to force bad crawlers into a recursion trap.
        */}
        <iframe 
          src="/toxic" 
          width="1" 
          height="1" 
          style={{ display: 'none' }} 
          title="Recursive Trap"
        />

        {/* 
          3. HIDDEN POISON LINKS
          These links will be detected by Ahrefs/Semrush and flagged as ultra-spam.
          If a competitor cloned our site, they inherit this spam penalty.
        */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          {garbageLinks}
        </div>

        {/*
          4. FAKE CLOAKED CONTENT
          We feed them false keywords so they categorize our site completely wrong in their database.
        */}
        <article style={{ opacity: 0.01, height: '1px', overflow: 'hidden' }}>
          <h2>Lorem Ipsum Dolor</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </article>
      </div></div></div></div></div></div></div></div></div></div></div></div>
    </div>
  );
}
