'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Edit, Plus, ExternalLink, Copy } from 'lucide-react';

interface AffiliateLink {
  _id: string;
  name: string;
  slug: string;
  originalUrl: string;
  clickCount: number;
}

export default function AffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<{ name: string; originalUrl: string }>();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/affiliates');
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: { name: string; originalUrl: string }) => {
    try {
      if (isEditing) {
        await fetch(`/api/affiliates/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/affiliates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      reset();
      setIsEditing(null);
      fetchLinks();
    } catch (error) {
      console.error('Failed to save link', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/affiliates/${id}`, { method: 'DELETE' });
      fetchLinks();
    } catch (error) {
      console.error('Failed to delete link', error);
    }
  };

  const handleEdit = (link: AffiliateLink) => {
    setIsEditing(link._id);
    setValue('name', link.name);
    setValue('originalUrl', link.originalUrl);
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/deal/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Affiliate Links</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Form Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">{isEditing ? 'Edit Link' : 'Add New Link'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Amazon Echo Dot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target URL</label>
                <input
                  {...register('originalUrl', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://amazon.com/..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                  {isEditing ? 'Update' : 'Create'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(null);
                      reset();
                    }}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug / Clicks</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No links found.</td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{link.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">/deal/{link.slug}</code>
                          <button onClick={() => copyToClipboard(link.slug)} className="text-gray-400 hover:text-gray-600">
                            <Copy size={14} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{link.clickCount} clicks</div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 max-w-[150px] truncate">
                          Link <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(link)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
      </div>
    </div>
  );
}
