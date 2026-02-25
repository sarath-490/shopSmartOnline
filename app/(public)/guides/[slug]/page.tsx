import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  Calendar,
  Clock,
  Share2,
  Star,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Twitter,
  Facebook,
  Zap
} from 'lucide-react';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category';
import { formatDate } from '@/lib/utils';
import {
  calculateReadingTime,
  generateArticleSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  extractFAQsFromContent
} from '@/lib/seo';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  await dbConnect();
  const guide = await Guide.findOne({ slug, status: 'published' }).lean();

  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: (guide as any).seo?.metaTitle || (guide as any).title,
    description: (guide as any).seo?.metaDescription || (guide as any).summary,
    openGraph: {
      title: (guide as any).title,
      description: (guide as any).summary,
      images: (guide as any).featuredImage ? [{ url: (guide as any).featuredImage }] : [],
    },
  };
}

async function getGuideData(slug: string) {
  await dbConnect();
  const guide = await Guide.findOne({ slug, status: 'published' })
    .populate('category', 'name slug')
    .populate('author', 'name')
    .lean();

  if (!guide) return null;

  const relatedGuides = await Guide.find({
    status: 'published',
    category: (guide as any).category?._id,
    _id: { $ne: (guide as any)._id },
  })
    .select('title slug featuredImage summary publishDate createdAt')
    .limit(3)
    .lean();

  return {
    guide: {
      ...guide,
      readingTime: calculateReadingTime((guide as any).content || '')
    },
    relatedGuides
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const data = await getGuideData(slug);

  if (!data) notFound();

  const { guide, relatedGuides } = data;
  const faqs = extractFAQsFromContent((guide as any).content || '');

  // JSON-LD Scripts
  const articleSchema = generateArticleSchema(guide as any);
  const productSchema = generateProductSchema(guide as any);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blogs', url: '/guides' },
    { name: (guide as any).category?.name || 'Category', url: `/category/${(guide as any).category?.slug}` },
    { name: (guide as any).title, url: `/guides/${(guide as any).slug}` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const shareUrl = `${process.env.APP_URL || 'https://shopsmartonline.com'}/guides/${(guide as any).slug}`;
  const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent((guide as any).featuredImage || '')}&description=${encodeURIComponent((guide as any).title)}`;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* JSON-LD Integration */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Breadcrumbs Header */}
      <div className="bg-white border-b border-stone-200 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <ChevronRight size={10} className="text-stone-300" />
            <Link href="/guides" className="hover:text-emerald-700 transition-colors">Blogs</Link>
            <ChevronRight size={10} className="text-stone-300" />
            <span className="text-stone-400">{(guide as any).title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-[300px] md:h-[450px] w-full bg-stone-100">
                {(guide as any).featuredImage ? (
                  <Image
                    src={(guide as any).featuredImage}
                    alt={(guide as any).title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold uppercase tracking-widest text-xs">Shop Smart Guide</div>
                )}
                <div className="absolute top-8 left-8 bg-emerald-700 text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  {(guide as any).category?.name}
                </div>
              </div>

              <div className="p-8 md:p-16">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-6 mb-8 text-stone-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-widest">{formatDate((guide as any).publishDate || (guide as any).createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-widest">{(guide as any).readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-orange-500" fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-widest">{(guide as any).ratingScore}/10 Rating</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 leading-tight [text-wrap:balance]">
                  {(guide as any).title}
                </h1>

                <p className="text-lg md:text-xl text-stone-500 font-medium italic mb-12 border-l-4 border-emerald-500 pl-6 py-2 leading-relaxed">
                  {(guide as any).summary}
                </p>

                {/* Quick Recommendation Section */}
                {(guide as any).quickRecommendation?.productName && (
                  <div className="mb-16 bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Editor&apos;s Pick</div>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <h2 className="text-2xl font-black text-emerald-950 mb-3 tracking-tight">{(guide as any).quickRecommendation.productName}</h2>
                          <p className="text-emerald-800/80 text-sm leading-relaxed mb-6">{(guide as any).quickRecommendation.reason}</p>
                          <Link
                            href={`/deal/${(guide as any).slug}-top-pick`} // Fallback provided common redirect pattern
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                          >
                            Check Price on Amazon <ArrowRight size={18} />
                          </Link>
                        </div>
                        <div className="hidden md:block">
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col items-center text-center">
                            <Star className="text-orange-400 mb-2" fill="currentColor" size={24} />
                            <span className="text-3xl font-black text-gray-900">{(guide as any).ratingScore}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Shop Smart Score</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Affiliate Disclosure */}
                <div className="mb-12 flex items-start gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-200">
                  <AlertCircle size={20} className="text-stone-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-500 leading-relaxed italic">
                    <strong>Disclosure:</strong> Shop Smart Online is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. <Link href="/affiliate-disclosure" className="underline text-emerald-700 font-bold">Learn more</Link>
                  </p>
                </div>

                {/* Main Content Render */}
                <div
                  className="prose prose-emerald max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: (guide as any).content || '' }}
                />

                {/* Share Buttons */}
                <div className="mt-20 pt-10 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-4">Share this Blog</h4>
                    <div className="flex gap-3">
                      <Link
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent((guide as any).title)}`}
                        target="_blank"
                        className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-stone-800 transition-all active:scale-90"
                      >
                        <Twitter size={16} fill="currentColor" />
                      </Link>
                      <Link
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90"
                      >
                        <Facebook size={16} fill="currentColor" />
                      </Link>
                      <Link
                        href={pinterestShareUrl}
                        target="_blank"
                        className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all active:scale-90 shadow-lg shadow-red-900/10"
                      >
                        <Share2 size={16} />
                      </Link>
                    </div>
                  </div>
                  <div>
                    <Link
                      href="/how-we-test"
                      className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
                    >
                      How we test products
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Blogs */}
            {relatedGuides.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Related Blogs</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedGuides.map((rg: any) => (
                    <article key={rg._id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
                      <Link href={`/guides/${rg.slug}`} className="relative h-44 w-full bg-stone-100 block overflow-hidden">
                        {rg.featuredImage && (
                          <Image src={rg.featuredImage} alt={rg.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                      </Link>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                          <Link href={`/guides/${rg.slug}`}>{rg.title}</Link>
                        </h3>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{formatDate(rg.publishDate || rg.createdAt)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents Overlay (Visual only, usually requires JS but here kept static) */}
              <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm">
                <h3 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                  <Clock size={14} className="text-emerald-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-stone-50">
                    <span className="text-sm text-stone-600 font-medium">Shop Smart Score</span>
                    <span className="text-lg font-black text-emerald-700">{(guide as any).ratingScore}/10</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-50">
                    <span className="text-sm text-stone-600 font-medium">Review Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">Verified</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-50">
                    <span className="text-sm text-stone-600 font-medium">Last Updated</span>
                    <span className="text-xs text-stone-400 font-bold">{formatDate((guide as any).updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Top Pick Sticky CTA */}
              {(guide as any).quickRecommendation?.productName && (
                <div className="bg-emerald-900 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-950/20">
                  <Star className="text-emerald-400 mb-4" fill="currentColor" size={24} />
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Our #1 Recommendation</h4>
                  <h3 className="text-xl font-black mb-6 leading-tight">{(guide as any).quickRecommendation.productName}</h3>
                  <Link
                    href={`/deal/${(guide as any).slug}-sticky-cta`}
                    target="_blank"
                    className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
                  >
                    View on Amazon <ShoppingBag size={18} />
                  </Link>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 border border-stone-100">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Stay Sharp</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-8">Get our latest reviews and smart buying tips delivered direct to your inbox.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button className="w-full py-3 bg-emerald-700 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/10">Subscribe</button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
