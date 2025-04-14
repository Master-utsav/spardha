'use client';

const PreviewPageComponent = ({ fullHtml }: { fullHtml: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: fullHtml }} />;
};

export default PreviewPageComponent;
