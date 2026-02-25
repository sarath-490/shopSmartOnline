import Link from 'next/link';
import { Shield, Search, Star, MessageCircle, BarChart3, CheckCircle2, FlaskConical, AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'How We Test & Review Products | Shop Smart Online',
    description: 'Our rigorous, data-driven methodology for reviewing products and making recommendations you can trust.',
};

export default function HowWeTestPage() {
    return (
        <div className="bg-stone-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 py-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200 mb-6">
                        <Shield size={14} fill="currentColor" />
                        <span>Trust Transparency</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
                        How We Review <span className="text-emerald-600">Products.</span>
                    </h1>
                    <p className="text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
                        Trust is earned. We spent years refining a rigorous methodology that prioritizes fact-checking and hands-on testing over marketing hype.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-20 max-w-5xl">
                <div className="grid gap-16">
                    {/* Step 1 */}
                    <section className="bg-white rounded-[40px] p-10 md:p-16 border border-stone-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center text-4xl font-black text-stone-100 group-hover:scale-110 transition-transform">01</div>
                        <div className="grid md:grid-cols-12 gap-10 relative z-10">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
                                    <Search size={24} />
                                </div>
                            </div>
                            <div className="md:col-span-11">
                                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Market Research & Selection</h2>
                                <p className="text-stone-500 leading-relaxed mb-6">
                                    We don&apos;t just review what&apos;s popular. We start by analyzing an entire category—identifying every major player and promising newcomer. We look at technical specs, warranty terms, and brand history.
                                </p>
                                <p className="text-stone-500 leading-relaxed font-bold italic border-l-4 border-emerald-500 pl-6">
                                    We filter through thousands of internal and external data points to select 5-10 finalists that actually deserve your attention.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section className="bg-white rounded-[40px] p-10 md:p-16 border border-stone-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center text-4xl font-black text-stone-100 group-hover:scale-110 transition-transform">02</div>
                        <div className="grid md:grid-cols-12 gap-10 relative z-10">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/20">
                                    <FlaskConical size={24} />
                                </div>
                            </div>
                            <div className="md:col-span-11">
                                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Hands-On Testing</h2>
                                <p className="text-stone-500 leading-relaxed mb-6">
                                    Specs lie. Hands-on experience doesn&apos;t. We buy or borrow the finalists and put them to use in real-world environments. Testing a vacuum? We use it on hardwood, thick carpet, and pet hair. Testing a camera? We shoot in direct sun and low light.
                                </p>
                                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
                                        <Star className="text-orange-400 mb-2" size={16} fill="currentColor" />
                                        <span className="text-xs font-black uppercase text-gray-900">Performance</span>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
                                        <Shield className="text-emerald-600 mb-2" size={16} fill="currentColor" />
                                        <span className="text-xs font-black uppercase text-gray-900">Durability</span>
                                    </div>
                                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
                                        <CheckCircle2 className="text-blue-600 mb-2" size={16} fill="currentColor" />
                                        <span className="text-xs font-black uppercase text-gray-900">Usability</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-white rounded-[40px] p-10 md:p-16 border border-stone-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center text-4xl font-black text-stone-100 group-hover:scale-110 transition-transform">03</div>
                        <div className="grid md:grid-cols-12 gap-10 relative z-10">
                            <div className="md:col-span-1 flex flex-col items-center">
                                <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-stone-800/20">
                                    <BarChart3 size={24} />
                                </div>
                            </div>
                            <div className="md:col-span-11">
                                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Verified User Data Analysis</h2>
                                <p className="text-stone-500 leading-relaxed mb-6">
                                    Even the best testers can&apos;t simulate 3 years of use in 3 weeks. That&apos;s why we ingest thousands of verified purchase reviews from Amazon, Reddit, and specialty forums to spot patterns of failure or long-term satisfaction that only appear over time.
                                </p>
                                <p className="text-stone-500 leading-relaxed">
                                    We score products based on <span className="text-emerald-600 font-bold">Reliability Weighted Averages</span>—which accounts for the fact that every product has some bad reviews, but the nature of the complaints matters more than the quantity.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Ethics */}
                    <section className="bg-emerald-950 rounded-[40px] p-10 md:p-16 text-white border border-white/5 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">Our Ethical <span className="text-emerald-500 underline decoration-4 underline-offset-8">Guarantee.</span></h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
                                    <h4 className="font-bold text-lg">No Paid Placements</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">Brands cannot pay to be on our lists. Ever. Rankings are earned through performance.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center"><MessageCircle size={24} /></div>
                                    <h4 className="font-bold text-lg">Independent Opinions</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">Our editorial team is separate from our affiliate team. Money doesn&apos;t influence reviews.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center"><AlertTriangle size={24} /></div>
                                    <h4 className="font-bold text-lg">Honest Cons</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">If a product has flaws, we will tell you. We highlight the bad as clearly as the good.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
