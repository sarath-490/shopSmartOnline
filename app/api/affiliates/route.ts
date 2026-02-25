import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AffiliateLink from '@/models/AffiliateLink';
import { slugify } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const links = await AffiliateLink.find({}).sort({ createdAt: -1 });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch affiliate links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { name, originalUrl } = await request.json();
    
    if (!name || !originalUrl) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const slug = slugify(name);
    
    // Check if slug exists, append random string if so
    let uniqueSlug = slug;
    const existing = await AffiliateLink.findOne({ slug });
    if (existing) {
      uniqueSlug = `${slug}-${Math.random().toString(36).substring(7)}`;
    }

    const link = await AffiliateLink.create({
      name,
      slug: uniqueSlug,
      originalUrl,
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Create affiliate link error:', error);
    return NextResponse.json({ error: 'Failed to create affiliate link' }, { status: 500 });
  }
}
