import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import { slugify } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const guides = await Guide.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ updatedAt: -1 });

    return NextResponse.json(guides);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.title);

    // Ensure unique slug
    let uniqueSlug = slug;
    const existing = await Guide.findOne({ slug });
    if (existing) {
      uniqueSlug = `${slug}-${Math.random().toString(36).substring(7)}`;
    }

    const guide = await Guide.create({
      ...data,
      slug: uniqueSlug,
      author: String(session.userId), // Ensure it's a string for BSON conversion
    });

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
