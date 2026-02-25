import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AffiliateLink from '@/models/AffiliateLink';
import { getSession } from '@/lib/auth';

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
    await AffiliateLink.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete affiliate link' }, { status: 500 });
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

    const { id } = await params;
    const { name, originalUrl } = await request.json();
    
    await dbConnect();
    const link = await AffiliateLink.findByIdAndUpdate(
      id,
      { name, originalUrl },
      { new: true }
    );

    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update affiliate link' }, { status: 500 });
  }
}
