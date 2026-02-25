import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AffiliateLink from '@/models/AffiliateLink';
import ClickTracking from '@/models/ClickTracking';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await dbConnect();

    const link = await AffiliateLink.findOne({ slug });

    if (!link) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Enhanced tracking
    try {
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const referrer = request.headers.get('referer') || 'direct';
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

      // Basic device detection
      let device = 'desktop';
      if (/mobile/i.test(userAgent)) device = 'mobile';
      else if (/tablet/i.test(userAgent)) device = 'tablet';

      // Fire and forget (optional: use waitUntil if on Vercel)
      Promise.all([
        AffiliateLink.findByIdAndUpdate(link._id, { $inc: { clickCount: 1 } }),
        ClickTracking.create({
          affiliateLink: link._id,
          guide: (link as any).guideReference,
          userAgent,
          referrer,
          device,
          ipAddress: ip,
          timestamp: new Date(),
        })
      ]).catch(err => console.error('Tracking background task failed', err));

    } catch (err) {
      console.error('Tracking logic error', err);
    }

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Redirect error', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
