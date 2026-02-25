import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tag from '@/models/Tag';
import { slugify } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const tags = await Tag.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tags);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const slug = slugify(name);

        const tag = await Tag.create({ name, slug });
        return NextResponse.json(tag);
    } catch (error) {
        console.error('Create tag error:', error);
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
