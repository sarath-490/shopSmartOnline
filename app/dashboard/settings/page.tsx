'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="skeleton h-4 w-48 mb-4" />
          <div className="skeleton h-4 w-64 mb-2" />
          <div className="skeleton h-4 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your admin profile and preferences.</p>
      </div>

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

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 text-sm">Admin Profile</h3>
        </div>
        <div className="p-5 space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-xl">
                    {user.email?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.email || 'Admin'}</p>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium mt-1">
                    <Shield size={10} />
                    {user.role || 'admin'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Could not load profile info.</p>
          )}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Lock size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 text-sm">Security</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>JWT Authentication</strong> is active. Your session expires in 24 hours.
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Dashboard routes are protected by middleware. API routes require valid authentication tokens.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Environment Variables</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                MONGODB_URI — Connected
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                JWT_SECRET — Configured
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                APP_URL — {process.env.NEXT_PUBLIC_APP_URL || 'Not set (using default)'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
