import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category'; // Explicit import for registration
import User from '@/models/User'; // Explicit import for registration
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const guide = await Guide.findById(id).populate('category').populate('author', 'name email');

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Fetch guide by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch guide' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const guide = await Guide.findById(id);
    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Security: Ensure session userId is a valid hex string
    const currentUserId = String(session.userId);
    if (!currentUserId || currentUserId === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(currentUserId)) {
      return NextResponse.json({ error: 'Outdated session. Please re-login.' }, { status: 403 });
    }

    // Security: Only author or admin can delete
    if (guide.author.toString() !== currentUserId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own guides' }, { status: 403 });
    }

    await Guide.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete guide error:', error);
    return NextResponse.json({ error: 'Failed to delete guide' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Security: Ensure session userId is a valid hex string
    const currentUserId = String(session.userId);
    if (!currentUserId || currentUserId === '[object Object]' || !/^[0-9a-fA-F]{24}$/.test(currentUserId)) {
      return NextResponse.json({ error: 'Outdated session. Please re-login.' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    await dbConnect();

    const existingGuide = await Guide.findById(id);
    if (!existingGuide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Security: Only author or admin can update
    if (existingGuide.author.toString() !== currentUserId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own guides' }, { status: 403 });
    }

    const guide = await Guide.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Update guide error:', error);
    return NextResponse.json({ error: 'Failed to update guide' }, { status: 500 });
  }
}


