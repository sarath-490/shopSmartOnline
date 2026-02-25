import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';

const BASE_URL = process.env.APP_URL || 'https://shopsmartonline.com';

export async function GET() {
    await dbConnect();

    const guides = await Guide.find({ status: 'published' })
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(20)
        .lean();

    const feedItems = guides.map((guide: any) => `
    <item>
      <title><![CDATA[${guide.title}]]></title>
      <link>${BASE_URL}/guides/${guide.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/guides/${guide.slug}</guid>
      <pubDate>${new Date(guide.publishDate || guide.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${guide.summary}]]></description>
      <content:encoded><![CDATA[${guide.content}]]></content:encoded>
    </item>
  `).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Shop Smart Online</title>
        <link>${BASE_URL}</link>
        <description>Expert product reviews and buying guides to help you shop smart and spend better.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>
  `;

    return new NextResponse(rssFeed, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
