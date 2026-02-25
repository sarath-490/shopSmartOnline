'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Edit, Plus, Hash } from 'lucide-react';

interface Tag {
    _id: string;
    name: string;
    slug: string;
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<{ name: string }>();

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            setTags(data);
        } catch (error) {
            console.error('Failed to fetch tags', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const onSubmit = async (data: { name: string }) => {
        try {
            if (isEditing) {
                const res = await fetch(`/api/tags/${isEditing}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Update failed');
                showFeedback('success', 'Tag updated successfully');
            } else {
                const res = await fetch('/api/tags', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error('Create failed');
                showFeedback('success', 'Tag created successfully');
            }
            reset();
            setIsEditing(null);
            fetchTags();
        } catch (error) {
            showFeedback('error', 'Failed to save tag');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        try {
            const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            showFeedback('success', 'Tag deleted');
            fetchTags();
        } catch (error) {
            showFeedback('error', 'Failed to delete tag');
        }
    };

    const handleEdit = (tag: Tag) => {
        setIsEditing(tag._id);
        setValue('name', tag.name);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tags</h2>

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

            <div className="grid gap-6 md:grid-cols-3">
                {/* Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            {isEditing ? 'Edit Tag' : 'Add New Tag'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
                                <input
                                    {...register('name', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                    placeholder="e.g. Budget Friendly, Wireless"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-700 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                                >
                                    {isEditing ? <Edit size={14} /> : <Plus size={14} />}
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(null);
                                            reset();
                                        }}
                                        className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tags List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/80 text-gray-500 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Tag Name</th>
                                    <th className="px-5 py-3.5">Slug</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="skeleton h-4 w-32" />
                                                <div className="skeleton h-4 w-24" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : tags.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">
                                            <Hash className="mx-auto mb-2 text-gray-300" size={24} />
                                            No tags yet. Create your first one.
                                        </td>
                                    </tr>
                                ) : (
                                    tags.map((tag) => (
                                        <tr key={tag._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-900">{tag.name}</td>
                                            <td className="px-5 py-3">
                                                <code className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded font-mono">
                                                    {tag.slug}
                                                </code>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEdit(tag)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tag._id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
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
