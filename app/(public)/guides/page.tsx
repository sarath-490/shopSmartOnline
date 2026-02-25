import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Filter, ArrowRight, Clock, Star, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category';
import { calculateReadingTime } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

interface SearchParams {
  q?: string;
  category?: string;
  rating?: string;
  page?: string;
}

async function getGuides(params: SearchParams) {
  await dbConnect();

  const page = parseInt(params.page || '1');
  const limit = 9;
  const skip = (page - 1) * limit;

  const query: any = { status: 'published' };

  if (params.q) {
    query.$or = [
      { title: { $regex: params.q, $options: 'i' } },
      { summary: { $regex: params.q, $options: 'i' } },
      { content: { $regex: params.q, $options: 'i' } },
    ];
  }

  if (params.category) {
    const categoryDoc = await Category.findOne({ slug: params.category });
    if (categoryDoc) query.category = categoryDoc._id;
  }

  if (params.rating) {
    query.ratingScore = { $gte: parseFloat(params.rating) };
  }

  const [guides, total, categories] = await Promise.all([
    Guide.find(query)
      .populate('category', 'name slug')
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Guide.countDocuments(query),
    Category.find({}).sort({ name: 1 }).lean()
  ]);

  return {
    guides: guides.map(g => ({
      ...g,
      readingTime: calculateReadingTime((g as any).content || '')
    })),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    categories
  };
}

export default async function GuidesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { guides, total, totalPages, currentPage, categories } = await getGuides(params);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 mb-4">
              <Link href="/">Home</Link>
              <ChevronRight size={12} className="text-stone-300" />
              <span className="text-stone-500">Blogs</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
              Honest Expert Blogs <br />& <span className="text-emerald-600">Smart Reviews.</span>
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              We separate the best from the rest so you don&apos;t have to. Our recommendations are based on rigorous testing and data analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <form action="/guides" className="relative">
                <input
                  name="q"
                  placeholder="Search blogs..."
                  defaultValue={params.q}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </form>

              {/* Categories */}
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                  <Filter size={14} className="text-emerald-600" />
                  Categories
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/guides"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!params.category ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:bg-stone-100'}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat._id}
                      href={`/guides?category=${cat.slug}${params.q ? `&q=${params.q}` : ''}${params.rating ? `&rating=${params.rating}` : ''}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${params.category === cat.slug ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:bg-stone-100'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                  <Star size={14} className="text-emerald-600" />
                  Minimum Rating
                </h3>
                <div className="space-y-1">
                  {[9, 8, 7, 0].map((r) => (
                    <Link
                      key={r}
                      href={`/guides?rating=${r}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${(params.rating === r.toString()) || (!params.rating && r === 0)
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-gray-600 hover:bg-stone-100'
                        }`}
                    >
                      {r === 0 ? 'Any Rating' : `${r}+ Stars`}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-emerald-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                  <Shield size={20} />
                </div>
                <h4 className="font-bold text-lg mb-2">Editor Verified</h4>
                <p className="text-xs text-emerald-100/60 leading-relaxed mb-4">
                  Every blog is fact-checked by our senior editors for accuracy and performance standards.
                </p>
                <Link href="/how-we-test" className="text-xs font-black uppercase tracking-widest text-emerald-300 hover:text-emerald-200 underline decoration-2 underline-offset-4">Learn More</Link>
              </div>
            </div>
          </aside>

          {/* Guides Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm font-bold text-stone-400">
                Showing <span className="text-gray-900">{guides.length}</span> of {total} blogs
              </p>
              <div className="flex gap-2">
                {/* Mobile Filter Trigger (Just for visuals in this version) */}
                <button className="lg:hidden p-2 bg-white border border-stone-200 rounded-lg text-gray-600">
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </div>

            {guides.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-stone-200 shadow-sm">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No blogs found</h2>
                <p className="text-stone-500 max-w-sm mx-auto mb-8">
                  We couldn&apos;t find any blogs matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Link href="/guides" className="px-8 py-3 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all">Clear All Filters</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {guides.map((guide: any) => (
                  <article key={guide._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all border border-stone-100 flex flex-col">
                    <Link href={`/guides/${guide.slug}`} className="relative h-56 w-full bg-stone-100 block overflow-hidden">
                      {guide.featuredImage ? (
                        <Image
                          src={guide.featuredImage}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold uppercase tracking-widest text-[10px]">Shop Smart</div>
                      )}
                      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-emerald-800 uppercase tracking-widest shadow-sm">
                        {guide.category?.name}
                      </div>
                      {guide.ratingScore > 8.5 && (
                        <div className="absolute top-5 right-5 bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-emerald-500">
                          <Star size={10} fill="currentColor" />
                          Top Rated
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
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
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                        <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 mb-6 flex-1 italic font-medium leading-relaxed">
                        &quot;{guide.summary}&quot;
                      </p>
                      <Link href={`/guides/${guide.slug}`} className="w-full py-3 bg-stone-50 text-stone-900 border border-stone-100 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all text-center flex items-center justify-center gap-2 group/btn">
                        Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <Link
                  href={`/guides?page=${Math.max(1, currentPage - 1)}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}${params.rating ? `&rating=${params.rating}` : ''}`}
                  className={`p-3 rounded-2xl border border-stone-200 bg-white transition-all ${currentPage <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-emerald-50 hover:border-emerald-200 text-emerald-700'}`}
                >
                  <ChevronLeft size={20} />
                </Link>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/guides?page=${p}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}${params.rating ? `&rating=${params.rating}` : ''}`}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl border font-black text-sm transition-all ${p === currentPage
                        ? 'bg-emerald-700 border-emerald-700 text-white shadow-lg shadow-emerald-900/20'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/guides?page=${Math.min(totalPages, currentPage + 1)}${params.q ? `&q=${params.q}` : ''}${params.category ? `&category=${params.category}` : ''}${params.rating ? `&rating=${params.rating}` : ''}`}
                  className={`p-3 rounded-2xl border border-stone-200 bg-white transition-all ${currentPage >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-emerald-50 hover:border-emerald-200 text-emerald-700'}`}
                >
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
