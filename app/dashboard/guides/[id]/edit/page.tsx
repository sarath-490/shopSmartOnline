'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GuideForm from '@/components/GuideForm';

export default function EditGuidePage() {
  const params = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/guides/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setGuide(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading guide...</div>;
  if (!guide) return <div className="p-8 text-center">Guide not found</div>;

  return <GuideForm initialData={guide} isEditing={true} />;
}
