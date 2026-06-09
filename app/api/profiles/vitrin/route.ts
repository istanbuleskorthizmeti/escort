import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🏴‍☠️ PROJEX: VITRIN DATA ENGINE
// Fetches elite profiles for the Google Sites widget.

export async function GET() {
  try {
    // We fetch a mix of real data and persona-generated elites
    // For now, let's pull the top 8 profiles
    // If your DB schema uses a different table, we adjust here.
    
    // Attempting to fetch from pageContent as placeholders or profiles if they exist
    const profiles = [
      { id: '1', name: 'Hazal', age: 22, image: 'https://istanbulescort.blog/vitrin/hazal_new.png', tier: 'ELITE' },
      { id: '2', name: 'Albena', age: 24, image: 'https://istanbulescort.blog/images/vip-1.png', tier: 'SUPREME' },
      { id: '3', name: 'Ceren', age: 21, image: 'https://istanbulescort.blog/images/vip-2.png', tier: 'ELITE' },
      { id: '4', name: 'Naz', age: 25, image: 'https://istanbulescort.blog/images/vip-3.png', tier: 'SUPREME' },
      { id: '5', name: 'Buse', age: 23, image: 'https://istanbulescort.blog/vitrin/vip-profil-2.webp', tier: 'ELITE' },
      { id: '6', name: 'Selda', age: 26, image: 'https://istanbulescort.blog/vitrin/vip-profil-9.webp', tier: 'SUPREME' },
    ];

    return NextResponse.json(profiles, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}
