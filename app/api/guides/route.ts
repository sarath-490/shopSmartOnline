import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import User from '@/models/User'; // Explicit import for registration
import Category from '@/models/Category'; // Explicit import for registration
import Tag from '@/models/Tag'; // Explicit import for registration
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
    console.error('Fetch guides error:', error);
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
    if (!data.title || !data.content || !data.category || !data.summary) {
      return NextResponse.json({ error: 'Missing required fields: title, content, summary, and category are required' }, { status: 400 });
    }

    const slug = data.slug || slugify(data.title);

    // Ensure unique slug
    let uniqueSlug = slug;
    const existing = await Guide.findOne({ slug });
    if (existing) {
      uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Robust ID extraction and validation
    let authorId = String(session.userId);
    if (!authorId || authorId === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(authorId)) {
      return NextResponse.json({
        error: 'Outdated or invalid session. Please Log Out and Log In again to refresh.',
        debug: { userId: String(session.userId) }
      }, { status: 403 });
    }

    const guide = await Guide.create({
      ...data,
      slug: uniqueSlug,
      author: authorId,
    });



    return NextResponse.json(guide);
  } catch (error: any) {
    console.error('Create blog error:', error);
    return NextResponse.json({
      error: 'Failed to create blog',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

