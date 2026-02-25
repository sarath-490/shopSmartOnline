'use client';

import { useState } from 'react';
import { Mail, MessageSquare, User, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="bg-stone-50 min-h-screen py-20 px-4 md:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
                            Get in <span className="text-emerald-600">Touch.</span>
                        </h1>
                        <p className="text-lg text-stone-500 leading-relaxed mb-10 max-w-md">
                            Have a question about a review? A product you want us to test? Or just want to say hi? We respond to every email.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-stone-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Email Us</p>
                                    <p className="font-bold text-gray-900">hello@shopsmartonline.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-stone-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Support</p>
                                    <p className="font-bold text-gray-900">24h Response Guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-emerald-900/5 border border-stone-100">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h2>
                                <p className="text-stone-500 mb-8">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-emerald-600 font-bold underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                            <User size={12} className="text-emerald-600" />
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                            <Mail size={12} className="text-emerald-600" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                        <MessageSquare size={12} className="text-emerald-600" />
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-emerald-700 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            Send Message
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
