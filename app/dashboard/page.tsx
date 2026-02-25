'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, MousePointerClick, TrendingUp, Layers, Plus, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DashboardStats {
  totalGuides: number;
  publishedGuides: number;
  draftGuides: number;
  totalCategories: number;
  totalClicks: number;
  topGuide: { title: string; slug: string };
  topCategory: { name: string; slug: string };
  recentGuides: Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: string;
    category?: { name: string };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-16 mb-2" />
              <div className="skeleton h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/dashboard/guides/create"
          className="bg-emerald-700 text-white py-2.5 px-5 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm"
        >
          <Plus size={16} />
          New Guide
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Guides</span>
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalGuides}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.publishedGuides} published · {stats.draftGuides} drafts
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Clicks</span>
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <MousePointerClick className="h-4.5 w-4.5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Affiliate link clicks</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Guide</span>
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-orange-600" />
            </div>
          </div>
          <div className="text-base font-bold text-gray-900 truncate" title={stats.topGuide.title}>
            {stats.topGuide.title}
          </div>
          <p className="text-xs text-gray-500 mt-1">Most engagement</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Category</span>
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <Layers className="h-4.5 w-4.5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.topCategory.name}</div>
          <p className="text-xs text-gray-500 mt-1">Highest guide count</p>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Guides */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900">Recent Guides</h3>
            <Link
              href="/dashboard/guides"
              className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentGuides.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No guides yet. Create your first guide to get started.
              </div>
            ) : (
              stats.recentGuides.map((guide) => (
                <div
                  key={guide._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/guides/${guide._id}/edit`}
                      className="font-medium text-gray-900 text-sm hover:text-emerald-700 truncate block"
                    >
                      {guide.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {guide.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{formatDate(guide.updatedAt)}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${guide.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                      }`}
                  >
                    {guide.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/guides/create"
                className="flex items-center gap-3 w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                Create New Guide
              </Link>
              <Link
                href="/dashboard/categories"
                className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <Layers size={16} />
                Manage Categories
              </Link>
              <Link
                href="/dashboard/affiliates"
                className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <MousePointerClick size={16} />
                Add Affiliate Link
              </Link>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-emerald-800 text-white rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm mb-2">💡 Pro Tip</h3>
            <p className="text-emerald-200 text-xs leading-relaxed">
              To improve SEO, add meta titles and focus keywords to each guide. Use the SEO fields in the guide editor for maximum search visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
