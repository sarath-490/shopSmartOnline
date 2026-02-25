import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, TrendingUp, CheckCircle, Shield, Zap, Search } from 'lucide-react';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category';
import ClickTracking from '@/models/ClickTracking';
import { formatDate } from '@/lib/utils';

async function getHomePageData() {
  await dbConnect();

  const [featuredGuides, recentGuides, categories, trendingDeals] = await Promise.all([
    // Featured guides
    Guide.find({ status: 'published', featured: true })
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),

    // Recent guides
    Guide.find({ status: 'published' })
      .populate('category', 'name slug')
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(6)
      .lean(),

    // All categories
    Category.find({}).sort({ name: 1 }).lean(),

    // Trending deals based on recent clicks
    ClickTracking.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: '$affiliateLink', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: 'affiliatelinks',
          localField: '_id',
          foreignField: '_id',
          as: 'details'
        }
      },
      { $unwind: '$details' }
    ])
  ]);

  return { featuredGuides, recentGuides, categories, trendingDeals };
}

export default async function HomePage() {
  const { featuredGuides, recentGuides, categories, trendingDeals } = await getHomePageData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-950 text-white py-20 md:py-32 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0,transparent_50%)]"></div>
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-sm">
            <Zap size={14} fill="currentColor" />
            <span>Expert-Backed Buying Advice</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1] animate-fade-in [text-wrap:balance]">
            Shop Smarter. <span className="text-emerald-500">Spend Better.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:100ms]">
            We rigorously test thousands of products to help you find precisely what you need—without the marketing fluff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:200ms]">
            <Link
              href="/guides"
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Our Blogs
            </Link>
            <Link
              href="/how-we-test"
              className="px-8 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:-translate-y-0.5 active:translate-y-0"
            >
              Our Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Explore Categories</h2>
              <p className="text-gray-500 mt-2">Find the best products in your favorite niche.</p>
            </div>
            <Link href="/guides" className="text-emerald-700 font-bold flex items-center gap-1 group">
              View All Topics <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat: any) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-white rounded-2xl mb-4 flex items-center justify-center shadow-sm border border-stone-100 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{cat.name}</h3>
                <p className="text-[10px] uppercase font-bold text-emerald-600/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Explore</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      {featuredGuides.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="max-w-xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Top Editorial Picks</h2>
                <p className="text-gray-500 mt-2">In-depth reviews and expert-led product breakdowns.</p>
              </div>
              <Link href="/guides" className="hidden md:flex items-center gap-1 text-emerald-700 font-bold group">
                All Blogs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredGuides.map((guide: any) => (
                <article key={guide._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all border border-stone-100 flex flex-col h-full">
                  <Link href={`/guides/${guide.slug}`} className="relative h-64 w-full bg-stone-200 block overflow-hidden">
                    {guide.featuredImage ? (
                      <Image
                        src={guide.featuredImage}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold uppercase tracking-widest text-xs">No Image Available</div>
                    )}
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-emerald-800 uppercase tracking-widest shadow-sm">
                      {(guide.category as any)?.name}
                    </div>
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                      <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                    </h3>
                    <p className="text-stone-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                      {guide.summary}
                    </p>
                    <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold border border-emerald-200">SS</div>
                        <span className="text-xs font-bold text-gray-600">Shop Smart</span>
                      </div>
                      <Link href={`/guides/${guide.slug}`} className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 group/btn">
                        Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Deals Section */}
      {trendingDeals.length > 0 && (
        <section className="py-20 bg-white border-b border-stone-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-12 flex items-center gap-3">
              <span className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Zap size={20} fill="currentColor" />
              </span>
              Trending Right Now
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDeals.map((deal: any) => (
                <Link
                  key={deal._id}
                  href={`/deal/${deal.details.slug}`}
                  target="_blank"
                  className="group bg-stone-50 p-6 rounded-2xl border border-stone-100 hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg">Popular Choice</span>
                      <TrendingUp size={14} className="text-orange-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-700 mb-2 leading-tight">
                      {deal.details.name}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400">{deal.count}+ clicks</span>
                    <span className="text-xs font-black uppercase text-orange-600">Check Deal</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How We Review Section */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-500/20">
                Our Methodology
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
                How We Review <br /><span className="text-emerald-500">Products.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl">
                We believe transparency is the foundation of trust. Here&apos;s a look at the rigorous steps we take to ensure every recommendation is accurate.
              </p>
              <Link
                href="/how-we-test"
                className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors group"
              >
                Read our full testing process <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Real Testing", desc: "We purchase or borrow products to use them in real environments, not just look at specs.", icon: Shield },
                { title: "Data-Driven", desc: "We analyze verified user reports to spot long-term durability patterns.", icon: TrendingUp },
                { title: "Unbiased", desc: "We never accept payments for reviews. Commissions do not influence our rankings.", icon: CheckCircle },
                { title: "Expert Insight", desc: "Our reviewers bring years of experience in their respective categories.", icon: Star }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Smart Shopping Tips Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Latest Expert Blogs</h2>
            <p className="text-stone-500 text-lg">Pro tips, buying strategies, and product deep dives.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentGuides.slice(0, 3).map((guide: any) => (
              <article key={guide._id} className="group relative flex flex-col bg-white hover:-translate-y-1 transition-all duration-300">
                <Link href={`/guides/${guide.slug}`} className="relative h-56 w-full rounded-2xl overflow-hidden mb-6 block">
                  {guide.featuredImage && (
                    <Image
                      src={guide.featuredImage}
                      alt={guide.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{(guide.category as any)?.name}</span>
                    <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{formatDate(guide.publishDate || guide.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-3 leading-tight line-clamp-2">
                    <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/guides"
              className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
            >
              View More Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-emerald-700 p-8 md:p-16 rounded-[40px] text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-950/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Stop Overpaying for Garbage.</h2>
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed [text-wrap:balance]">
                Join smart shoppers who get our best deals and expert reviews in their inbox every week.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl text-white placeholder:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button className="bg-white text-emerald-800 font-black px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all whitespace-nowrap active:scale-95">
                  Get Insights
                </button>
              </form>
              <p className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-widest mt-6">No spam. Ever. Just smart choices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
