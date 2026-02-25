'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Guide {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  category: { name: string };
  updatedAt: string;
  author: { name: string };
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/guides');
      const data = await res.json();
      setGuides(data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await fetch(`/api/guides/${id}`, { method: 'DELETE' });
      fetchGuides();
    } catch (error) {
      console.error('Failed to delete guide', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Blogs</h2>
        <Link
          href="/dashboard/guides/create"
          className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Write Blog
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : guides.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No blogs found. Write your first one!</td>
              </tr>
            ) : (
              guides.map((guide) => (
                <tr key={guide._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{guide.title}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">/{guide.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${guide.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{guide.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(guide.updatedAt)}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link
                      href={`/guides/${guide.slug}`}
                      target="_blank"
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      title="View Live"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/dashboard/guides/${guide._id}/edit`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(guide._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
