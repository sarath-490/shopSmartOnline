import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

async function getFooterCategories() {
  await dbConnect();
  return Category.find({}).select('name slug').sort({ name: 1 }).limit(6).lean();
}

export default async function Footer() {
  const categories = await getFooterCategories();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="tracking-tight">Shop Smart Online</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted source for honest product reviews and smart shopping advice. We help you spend better.
            </p>
          </div>

          {/* Blogs */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Blogs</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  All Blogs
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-we-test" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  How We Test
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Shop Smart Online. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <Link href="/affiliate-disclosure" className="hover:text-gray-300 transition-colors">
                Affiliate Disclosure
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            Shop Smart Online is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
            program designed to provide a means for sites to earn advertising fees by advertising and linking to
            Amazon.com.
          </p>
        </div>
      </div>
    </footer>
  );
}
