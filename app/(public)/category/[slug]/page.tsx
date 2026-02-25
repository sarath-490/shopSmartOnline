import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, Star, ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category';
import { calculateReadingTime } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${(category as any).name} - Best Products & Expert Blogs | Shop Smart Online`,
    description: `Explore the best ${(category as any).name} reviews and expert buying advice to help you shop smart and spend better.`,
  };
}

async function getCategoryData(slug: string, pageNum: number) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;

  const limit = 9;
  const skip = (pageNum - 1) * limit;

  const [guides, total] = await Promise.all([
    Guide.find({ category: (category as any)._id, status: 'published' })
      .populate('category', 'name slug')
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Guide.countDocuments({ category: (category as any)._id, status: 'published' }),
  ]);

  return {
    category,
    guides: guides.map(g => ({
      ...g,
      readingTime: calculateReadingTime((g as any).content || '')
    })),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: pageNum
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageNum = parseInt(page || '1');

  const data = await getCategoryData(slug, pageNum);
  if (!data) notFound();

  const { category, guides, total, totalPages, currentPage } = data;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Category Header */}
      <div className="bg-white border-b border-stone-200 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <ChevronRight size={10} className="text-stone-300" />
            <Link href="/guides" className="hover:text-emerald-700 transition-colors">Blogs</Link>
            <ChevronRight size={10} className="text-stone-300" />
            <span className="text-stone-400">{(category as any).name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-4">
                {(category as any).name} <span className="text-emerald-600">Blogs.</span>
              </h1>
              <p className="text-stone-500 text-lg leading-relaxed">
                The latest and greatest in {(category as any).name.toLowerCase()}, rigorously tested and honestly reviewed.
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-100 px-6 py-4 rounded-3xl flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-3xl font-black text-gray-900">{total}</span>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {guides.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-stone-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-stone-500 mb-8">We&apos;re currently testing products for this category. Check back soon for our expert recommendations.</p>
            <Link href="/guides" className="px-8 py-3 bg-emerald-700 text-white font-bold rounded-xl active:scale-95 transition-all">Back to all blogs</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide: any) => (
              <article key={guide._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all border border-stone-100 flex flex-col h-full">
                <Link href={`/guides/${guide.slug}`} className="relative h-60 w-full bg-stone-100 block overflow-hidden">
                  {guide.featuredImage ? (
                    <Image src={guide.featuredImage} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold uppercase tracking-widest text-[10px]">Shop Smart</div>
                  )}
                  {guide.featured && (
                    <div className="absolute top-5 left-5 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Featured</div>
                  )}
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                      <Clock size={12} className="text-emerald-600" />
                      {guide.readingTime} min read
                    </div>
                    <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                    <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                      <Star size={12} className="text-orange-500" fill="currentColor" />
                      {guide.ratingScore}/10
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                    <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-2 mb-8 flex-1 leading-relaxed italic font-medium">
                    {guide.summary}
                  </p>
                  <Link href={`/guides/${guide.slug}`} className="w-full py-3 bg-stone-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all text-center flex items-center justify-center gap-2 group/btn">
                    Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            {currentPage > 1 && (
              <Link
                href={`/category/${slug}?page=${currentPage - 1}`}
                className="px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all"
              >
                Previous
              </Link>
            )}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/category/${slug}?page=${p}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border font-black text-sm transition-all ${p === currentPage
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                >
                  {p}
                </Link>
              ))}
            </div>
            {currentPage < totalPages && (
              <Link
                href={`/category/${slug}?page=${currentPage + 1}`}
                className="px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
