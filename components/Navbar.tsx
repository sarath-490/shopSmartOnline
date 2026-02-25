import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import MobileMenu from '@/components/MobileMenu';

async function getNavCategories() {
  await dbConnect();
  const categories = await Category.find({}).select('name slug').sort({ name: 1 }).limit(6).lean();
  return categories.map((cat: any) => ({
    ...cat,
    _id: cat._id.toString(),
  }));
}

export default async function Navbar() {
  const categories = await getNavCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-xl text-emerald-800 hover:text-emerald-700 transition-colors"
        >
          <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="tracking-tight">
            Shop Smart<span className="text-emerald-600 font-semibold"> Online</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-600">
          <Link
            href="/guides"
            className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            Blogs
          </Link>
          {categories.slice(0, 4).map((cat: any) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/guides"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Read Blogs
          </Link>

          {/* Mobile Menu */}
          <MobileMenu categories={categories as any} />
        </div>
      </div>
    </header>
  );
}
