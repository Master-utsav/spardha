'use client';

import { notFound } from 'next/navigation';
import { getPreviewPage } from '@/app/(backend)/actions/getHtmlPage';
import PreviewPageComponent from '@/components/PreviewPageComponent';
import { useEffect, useRef, useState } from 'react';

export default function PreviewPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const [fullHtml, setFullHtml] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      const fetchPreviewPage = async () => {
        const preViewPage: any = await getPreviewPage(params.uniqueId);
        if (!preViewPage) {
          notFound();
        }
        setFullHtml(preViewPage.fullHtml);
        hasFetched.current = true;
      };

      fetchPreviewPage();
    }
  }, [params.uniqueId]);

  return fullHtml !== null ? (
    <PreviewPageComponent fullHtml={fullHtml} />
  ) : (
    <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
    </div>
  );
}
