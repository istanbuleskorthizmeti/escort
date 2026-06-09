import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { wordPressService } from '@/lib/seo/wordpress';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: 'OAuth Authorization failed', details: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    try {
        const setting = await prisma.systemSetting.findUnique({ where: { key: 'WP_AUTH' } });
        if (!setting || !setting.value) {
            return NextResponse.json({ error: 'WP_AUTH not configured in database' }, { status: 500 });
        }

        const wpAuth = JSON.parse(setting.value);

        // Exchange code for token
        const tokenData = await wordPressService.exchangeCodeForToken(
            wpAuth.clientId,
            wpAuth.clientSecret,
            code,
            'https://istanbulescort.blog/api/auth/callback/wordpress'
        );

        if (!tokenData.access_token) {
            throw new Error(`Invalid token response: ${JSON.stringify(tokenData)}`);
        }

        wpAuth.accessToken = tokenData.access_token;
        wpAuth.blogId = tokenData.blog_id;
        wpAuth.blogUrl = tokenData.blog_url;

        await prisma.systemSetting.update({
            where: { key: 'WP_AUTH' },
            data: { value: JSON.stringify(wpAuth) }
        });

        return NextResponse.json({ success: true, message: 'WordPress OAuth successful! Token saved to database.', data: { blogUrl: wpAuth.blogUrl } });

    } catch (err: any) {
        console.error('WP OAuth Error:', err.message);
        return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}
