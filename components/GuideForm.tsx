'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}

interface GuideFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function GuideForm({ initialData, isEditing }: GuideFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: initialData || {
      status: 'draft',
      featured: false,
      ratingScore: 8,
      tags: [],
      publishDate: new Date().toISOString().slice(0, 16), // Auto-set current date
    },
  });

  const contentValue = watch('content');

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch('/api/tags').then((res) => res.json()),
    ]).then(([cats, tgs]) => {
      setCategories(cats);
      setTags(tgs);
    });
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const url = isEditing ? `/api/guides/${initialData._id}` : '/api/guides';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save blog');
      }

      setFeedback({ type: 'success', message: isEditing ? 'Blog updated!' : 'Blog created!' });
      setTimeout(() => {
        router.push('/dashboard/guides');
        router.refresh();
      }, 800);
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Failed to save blog' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Sticky Top Bar */}
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-3 z-10 border-b border-gray-200 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/guides"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit Blog' : 'Write New Blog'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-white bg-emerald-700 rounded-lg hover:bg-emerald-600 flex items-center gap-2 disabled:opacity-50 text-sm font-semibold transition-colors shadow-sm"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Publish Now'}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${feedback.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-red-50 text-red-700 border border-red-100'
            }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & Summary */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Headline *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="e.g. The Only Coffee Maker You'll Ever Need"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (Short Summary) *</label>
              <textarea
                {...register('summary', { required: 'Summary is required' })}
                rows={2}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="What is this blog about?"
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1">{errors.summary.message as string}</p>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Body Content (HTML) *</label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPreview ? 'Switch to Edit' : 'Preview Result'}
              </button>
            </div>

            {showPreview ? (
              <div
                className="prose prose-sm max-w-none min-h-[300px] border border-gray-200 rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: contentValue || '<p class="text-gray-400">No content yet...</p>' }}
              />
            ) : (
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={15}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-xs leading-relaxed"
                placeholder="Write your story here..."
              />
            )}
          </div>

          {/* Quick Recommendation */}
          <details className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all group">
            <summary className="text-sm font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
              <span>Quick Product Recommendation (Optional)</span>
              <span className="text-gray-400 text-xs transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name</label>
                <input
                  {...register('quickRecommendation.productName')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Affiliate Link URL</label>
                <input
                  {...register('quickRecommendation.affiliateLink')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Short Review Reason</label>
                <textarea
                  {...register('quickRecommendation.reason')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </details>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-5">
          {/* Metadata */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Publish Date</label>
              <input
                type="datetime-local"
                {...register('publishDate')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-50 mt-4 pt-4">
              <select
                {...register('status')}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                />
                <span className="text-xs font-medium">Featured</span>
              </label>
            </div>
          </div>

          {/* Rating & Image */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Editor Rating Score</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                {...register('ratingScore', { valueAsNumber: true })}
                className="w-full accent-emerald-600"
              />
              <div className="text-center font-bold text-emerald-700 text-sm mt-1">{watch('ratingScore') || 0}/10</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Featured Image URL</label>
              <input
                {...register('featuredImage')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="Unsplash URL..."
              />
            </div>
          </div>

          {/* Advanced / SEO */}
          <details className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <summary className="text-xs font-bold text-gray-400 cursor-pointer uppercase tracking-wider list-none">Advanced / SEO</summary>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug Override</label>
                <input {...register('slug')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Meta Description</label>
                <textarea {...register('seo.metaDescription')} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs" />
              </div>
              <div className="pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Select Tags</h4>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {tags.map((tag) => (
                    <label key={tag._id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" value={tag._id} {...register('tags')} className="h-3 w-3 text-emerald-600 rounded" />
                      <span className="text-xs text-gray-600">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </form>
  );
}
