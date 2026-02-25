'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
    categories: Array<{ _id: string; name: string; slug: string }>;
}

export default function MobileMenu({ categories }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Panel */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 font-extrabold text-lg text-emerald-800"
                    >
                        <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        Shop Smart Online
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    <Link
                        href="/guides"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-gray-800 font-medium hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                    >
                        All Buying Guides
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>

                    <div className="pt-3 pb-2 px-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
                    </div>
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                            {cat.name}
                            <ChevronRight className="h-4 w-4 text-gray-300" />
                        </Link>
                    ))}

                    <div className="pt-4 border-t border-gray-100 mt-4 space-y-1">
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/how-we-test"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                            How We Test
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <Link
                        href="/guides"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                        Browse All Guides
                    </Link>
                </div>
            </div>
        </>
    );
}
