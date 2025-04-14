import React, { useState, useEffect, useRef } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  atomOneDark,
  docco,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Editor from 'react-simple-code-editor';
import * as monaco from 'monaco-editor';

// Import language support
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/htmlbars';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('html', html);

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js';
    }
    return './editor.worker.js';
  },
};

interface CodeEditorProps {
  initialLanguage?: string;
  initialCode?: string;
  onChange: (code: string) => void;
  height?: string;
  width?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialLanguage = 'html',
  initialCode = '// Start coding here',
  onChange,
  height = '400px',
  width = '100%',
  readOnly = false,
}) => {
  const [editorLanguage, setEditorLanguage] = useState(initialLanguage);
  const [lineCount, setLineCount] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const editorRef = useRef<any>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Monaco editor
  useEffect(() => {
    if (containerRef.current) {
      if (!monacoEditorRef.current) {
        // Initialize Monaco editor with the provided language
        const editor = monaco.editor.create(containerRef.current, {
          value: initialCode,
          language: mapLanguage(initialLanguage),
          theme: isDarkMode ? 'vs-dark' : 'vs',
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: fontSize,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          readOnly: readOnly,
          tabSize: 2,
          wordWrap: 'on',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true,
            showUsers: true,
            showIssues: true,
          },
        });

        // Set up auto-closing brackets and auto-indentation
        monaco.languages.setLanguageConfiguration(
          mapLanguage(initialLanguage),
          {
            autoClosingPairs: [
              { open: '{', close: '}' },
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"' },
              { open: "'", close: "'" },
              { open: '`', close: '`' },
              { open: '<', close: '>' },
            ],
            surroundingPairs: [
              { open: '{', close: '}' },
              { open: '[', close: ']' },
              { open: '(', close: ')' },
              { open: '"', close: '"' },
              { open: "'", close: "'" },
              { open: '`', close: '`' },
              { open: '<', close: '>' },
            ],
            indentationRules: {
              increaseIndentPattern: /^\s*[\{\[\(].*$/,
              decreaseIndentPattern: /^\s*[\}\]\)].*$/,
            },
            brackets: [
              ['{', '}'],
              ['[', ']'],
              ['(', ')'],
              ['<', '>'],
            ],
          }
        );

        // Add language-specific features
        setupLanguageSpecificFeatures(initialLanguage);

        // Set up change event handler
        editor.onDidChangeModelContent(() => {
          const newValue = editor.getValue();
          onChange(newValue);
          setLineCount(newValue.split('\n').length);
        });

        monacoEditorRef.current = editor;
      }
    }
  }, [fontSize, initialCode, initialLanguage, isDarkMode, onChange, readOnly]);

  // Update editor when language or theme changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
      monacoEditorRef.current.updateOptions({
        fontSize: fontSize,
      });
    }
  }, [isDarkMode, fontSize]);

  // Map language names to Monaco language ids
  const mapLanguage = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      xml: 'xml',
      css: 'css',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  // Setup language-specific features
  const setupLanguageSpecificFeatures = (language: string) => {
    const lang = language.toLowerCase();

    // HTML intellisense
    if (lang === 'html') {
      monaco.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [
            {
              label: 'div',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<div>$1</div>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'DIV element',
              range,
            },
            {
              label: 'span',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<span>$1</span>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'SPAN element',
              range,
            },
            {
              label: 'a',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<a href="$1">$2</a>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Anchor element',
              range,
            },
            {
              label: 'img',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<img src="$1" alt="$2">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Image element',
              range,
            },
            {
              label: 'ul',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<ul>\n\t<li>$1</li>\n</ul>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Unordered list',
              range,
            },
            {
              label: 'ol',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<ol>\n\t<li>$1</li>\n</ol>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Ordered list',
              range,
            },
            {
              label: 'table',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<table>\n\t<tr>\n\t\t<td>$1</td>\n\t</tr>\n</table>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Table',
              range,
            },
            {
              label: 'form',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<form action="$1" method="$2">\n\t$3\n</form>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Form',
              range,
            },
            {
              label: 'input',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<input type="$1" name="$2">',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Input element',
              range,
            },
            {
              label: 'button',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '<button type="$1">$2</button>',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Button element',
              range,
            },
          ];

          return { suggestions };
        },
      });
    }

    // CSS intellisense
    if (lang === 'css') {
      monaco.languages.registerCompletionItemProvider('css', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = [
            {
              label: 'background-color',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'background-color: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the background color',
              range,
            },
            {
              label: 'color',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'color: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the text color',
              range,
            },
            {
              label: 'display',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'display: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the display type',
              range,
            },
            {
              label: 'flex',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'display: flex;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets display to flex',
              range,
            },
            {
              label: 'grid',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'display: grid;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets display to grid',
              range,
            },
            {
              label: 'margin',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'margin: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the margin',
              range,
            },
            {
              label: 'padding',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'padding: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the padding',
              range,
            },
            {
              label: 'font-size',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'font-size: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the font size',
              range,
            },
            {
              label: 'font-weight',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'font-weight: $1;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the font weight',
              range,
            },
            {
              label: 'border',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'border: $1px $2 $3;',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Sets the border',
              range,
            },
          ];

          return { suggestions };
        },
      });
    }

    // Python intellisense
    if (lang === 'python') {
      monaco.languages.registerCompletionItemProvider('python', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const match = textUntilPosition.match(/(\w+)\.\s*$/);
          if (!match) return { suggestions: [] };

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          // Default list methods suggestions
          if (match[1]) {
            return {
              suggestions: [
                {
                  label: 'append',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'append($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Adds an element at the end of the list',
                  range,
                },
                {
                  label: 'extend',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'extend($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation:
                    'Add the elements of a list to the end of the current list',
                  range,
                },
                {
                  label: 'insert',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'insert($1, $2)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Adds an element at the specified position',
                  range,
                },
                {
                  label: 'remove',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'remove($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation:
                    'Removes the first item with the specified value',
                  range,
                },
                {
                  label: 'pop',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'pop($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation:
                    'Removes the element at the specified position',
                  range,
                },
                {
                  label: 'clear',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'clear()',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Removes all the elements from the list',
                  range,
                },
                {
                  label: 'index',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'index($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation:
                    'Returns the index of the first element with the specified value',
                  range,
                },
                {
                  label: 'count',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'count($1)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation:
                    'Returns the number of elements with the specified value',
                  range,
                },
                {
                  label: 'sort',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'sort(key=$1, reverse=$2)',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Sorts the list',
                  range,
                },
                {
                  label: 'reverse',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'reverse()',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Reverses the order of the list',
                  range,
                },
                {
                  label: 'copy',
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: 'copy()',
                  insertTextRules:
                    monaco.languages.CompletionItemInsertTextRule
                      .InsertAsSnippet,
                  documentation: 'Returns a copy of the list',
                  range,
                },
              ],
            };
          }

          return { suggestions: [] };
        },
      });
    }

    // JavaScript intellisense
    if (lang === 'javascript' || lang === 'typescript') {
      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const match = textUntilPosition.match(/(\w+)\.\s*$/);
          if (!match) return { suggestions: [] };

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          // Array methods
          return {
            suggestions: [
              {
                label: 'push',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'push($1)',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Adds one or more elements to the end of an array',
                range,
              },
              {
                label: 'pop',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'pop()',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Removes the last element from an array',
                range,
              },
              {
                label: 'shift',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'shift()',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Removes the first element from an array',
                range,
              },
              {
                label: 'unshift',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'unshift($1)',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Adds one or more elements to the beginning of an array',
                range,
              },
              {
                label: 'forEach',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'forEach((${1:item}) => {\n\t$2\n})',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Executes a provided function once for each array element',
                range,
              },
              {
                label: 'map',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'map((${1:item}) => {\n\treturn $2;\n})',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Creates a new array with the results of calling a function for every array element',
                range,
              },
              {
                label: 'filter',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'filter((${1:item}) => {\n\treturn $2;\n})',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Creates a new array with elements that pass the condition',
                range,
              },
              {
                label: 'reduce',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText:
                  'reduce((${1:accumulator}, ${2:currentValue}) => {\n\treturn $3;\n}, ${4:initialValue})',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Reduces the array to a single value',
                range,
              },
              {
                label: 'indexOf',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'indexOf($1)',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Returns the index of the first occurrence of a specified value',
                range,
              },
              {
                label: 'find',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'find((${1:item}) => {\n\treturn $2;\n})',
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation:
                  'Returns the value of the first element that passes a test',
                range,
              },
            ],
          };
        },
      });
    }
  };

  return (
    <div
      className="code-editor-container"
      style={{ position: 'relative', width, height }}
    >
      {/* Editor Header */}
      <div
        className="editor-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 6px',
          maxHeight: '50px',
          backgroundColor: isDarkMode ? '#252526' : '#f3f3f3',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #ddd',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <div
          className="editor-controls"
          style={{ display: 'flex', gap: '8px' }}
        >
          <div
            className="window-controls"
            style={{ display: 'flex', gap: '6px' }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ff5f56',
                borderRadius: '50%',
              }}
            ></span>
            <span
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ffbd2e',
                borderRadius: '50%',
              }}
            ></span>
            <span
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#27c93f',
                borderRadius: '50%',
              }}
            ></span>
          </div>
        </div>

        <div className="language-selector" style={{ padding: '0px 6px' }}>
          <span
            style={{
              backgroundColor: isDarkMode ? '#3c3c3c' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
              border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginRight: '10px',
            }}
          >
            {editorLanguage}
          </span>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              marginLeft: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#fff' : '#333',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setFontSize(Math.max(fontSize - 1, 10))}
            style={{
              marginLeft: '10px',
              padding: '4px',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
              color: isDarkMode ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            A-
          </button>

          <button
            onClick={() => setFontSize(Math.min(fontSize + 1, 24))}
            style={{
              marginLeft: '10px',
              padding: '4px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
              color: isDarkMode ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            A+
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div
        className="editor-body"
        ref={containerRef}
        style={{
          position: 'relative',
          height: 'calc(100% - 68px)', // Adjusted for status bar
          minHeight: '65vh',
          overflow: 'hidden',
        }}
      />

      {/* Status Bar */}
      <div
        className="editor-statusbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 10px',
          backgroundColor: isDarkMode ? '#007acc' : '#0098ff',
          color: '#fff',
          fontSize: '12px',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
      >
        <div>Lines: {lineCount}</div>
        <div>{editorLanguage.toUpperCase()}</div>
        <div>Tab Size: 2</div>
      </div>
    </div>
  );
};

export default CodeEditor;
