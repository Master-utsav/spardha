import { CodeBlock } from '@/components/ui/code-block';

export interface FormattedText {
  type: 'text' | 'code' | 'bold' | 'codeBlock' | 'br';
  content: string;
}

const langExtension = {
  c: '.c',
  cpp: '.cpp',
  java: '.java',
  python: '.py',
  javaScript: '.js',
  typeScript: '.ts',
  go: '.go',
  rust: '.rs',
  kotlin: '.kt',
  swift: '.swift',
  php: '.php',
  ruby: '.rb',
  perl: '.pl',
  html: '.html',
  css: '.css',
  react: '.jsx',
  vue: '.vue',
  angular: '.ts',
  svelte: '.svelte',
};

const parseFormattedText = (text: string): FormattedText[] => {
  const parts: FormattedText[] = [];
  let currentText = '';
  let i = 0;

  while (i < text.length) {
    if (text.startsWith('<codeBlock>', i)) {
      if (currentText) {
        parts.push({ type: 'text', content: currentText });
        currentText = '';
      }
      const endIndex = text.indexOf('</codeBlock>', i);
      if (endIndex === -1) break;
      parts.push({ type: 'codeBlock', content: text.slice(i + 11, endIndex) });
      i = endIndex + 12;
    } else if (text.startsWith('<code>', i)) {
      if (currentText) {
        parts.push({ type: 'text', content: currentText });
        currentText = '';
      }
      const endIndex = text.indexOf('</code>', i);
      if (endIndex === -1) break;
      parts.push({ type: 'code', content: text.slice(i + 6, endIndex) });
      i = endIndex + 7;
    } else if (text.startsWith('<bold>', i)) {
      if (currentText) {
        parts.push({ type: 'text', content: currentText });
        currentText = '';
      }
      const endIndex = text.indexOf('</bold>', i);
      if (endIndex === -1) break;
      parts.push({ type: 'bold', content: text.slice(i + 6, endIndex) });
      i = endIndex + 7;
    } else if (text.startsWith('</br>', i) || text.startsWith('<br>', i)) {
      if (currentText) {
        parts.push({ type: 'text', content: currentText });
        currentText = '';
      }
      parts.push({ type: 'br', content: '' });
      i += 5;
    } else {
      currentText += text[i];
      i++;
    }
  }
  if (currentText) {
    parts.push({ type: 'text', content: currentText });
  }

  return parts;
};

export const renderFormattedText = (text: string, language: string) => {
  const parts = parseFormattedText(text);
  return parts.map((part, index) => {
    switch (part.type) {
      case 'codeBlock':
        return (
          <CodeBlock
            key={index}
            language={language}
            filename={`snippet${
              langExtension[language as keyof typeof langExtension]
            }`}
            tabs={[{ name: 'Code', code: part.content, language: language }]}
          />
        );
      case 'code':
        return (
          <code
            className="rounded-sm border-[1px] border-black bg-gray-200 px-1 font-mono text-red-500 dark:bg-gray-800"
            key={index}
          >
            {part.content}
          </code>
        );
      case 'bold':
        return (
          <strong className="" key={index}>
            {part.content}
          </strong>
        );
      case 'br':
        return <br key={index}></br>;
      default:
        return (
          <span className="" key={index}>
            {part.content}
          </span>
        );
    }
  });
};
