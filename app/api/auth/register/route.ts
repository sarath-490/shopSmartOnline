import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password, secret } = await request.json();

    // Simple protection to prevent public registration of admins
    // In a real app, this should be disabled or protected by a master key
    if (secret !== process.env.ADMIN_SECRET && process.env.NODE_ENV === 'production') {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Defaulting to admin for the first user setup
    });

    return NextResponse.json({ success: true, userId: user._id });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
