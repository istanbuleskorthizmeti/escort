import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSiteId } from '@/lib/site-context';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const host = request.headers.get('host') || '';
    const siteId = await getSiteId(host);

    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    const content = await prisma.pageContent.findUnique({
      where: {
        slug_siteId: {
          slug,
          siteId
        }
      }
    });

    return NextResponse.json(content || { title: '', content: '' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, content } = body;
    const host = request.headers.get('host') || '';
    const siteId = await getSiteId(host);

    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    const updated = await prisma.pageContent.upsert({
      where: {
        slug_siteId: {
          slug,
          siteId
        }
      },
      update: {
        title,
        content,
        updatedAt: new Date()
      },
      create: {
        siteId,
        slug,
        title,
        content
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin Content API Error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
