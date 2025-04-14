'use client';

import { useEffect, useState } from 'react';
import PreviewPageComponent from '@/components/PreviewPageComponent';

export default function UserCodePreviewPage() {
  const [fullHtml, setFullHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get HTML content from URL parameter
    const fullCode = localStorage.getItem('atadxresuxlmthllufxweiverpxahdraps');
    setFullHtml(fullCode);
  }, []);

  return fullHtml ? (
    <PreviewPageComponent fullHtml={fullHtml} />
  ) : (
    <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
    </div>
  );
}
