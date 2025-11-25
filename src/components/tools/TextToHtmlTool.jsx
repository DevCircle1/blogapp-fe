import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Helmet } from "react-helmet-async";
const TextToHtmlTool = () => {
  const [inputText, setInputText] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [formattedHtml, setFormattedHtml] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [theme, setTheme] = useState('light');
  const quillRef = useRef(null);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  // Quill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
    'align',
    'color', 'background'
  ];

  // Format HTML with proper indentation and line breaks
  const formatHtml = (html) => {
    if (!html) return '';
    
    // Remove the wrapper div first
    let cleanHtml = html
      .replace('<div class="prose max-w-none p-4">', '')
      .replace('</div>', '')
      .trim();

    // Basic HTML formatting with indentation
    let formatted = '';
    let indentLevel = 0;
    const tags = cleanHtml.split(/(<[^>]*>)/g);
    
    tags.forEach(tag => {
      if (tag.startsWith('</')) {
        indentLevel--;
        formatted += '\n' + '  '.repeat(indentLevel) + tag;
      } else if (tag.startsWith('<') && !tag.endsWith('/>')) {
        formatted += '\n' + '  '.repeat(indentLevel) + tag;
        if (!tag.includes('/>') && !tag.startsWith('<!--')) {
          indentLevel++;
        }
      } else if (tag.trim() !== '') {
        formatted += tag;
      }
    });

    return formatted.trim();
  };

  // Convert Quill content to clean HTML
  const convertToHtml = (content) => {
    if (!content || content === '<p><br></p>') {
      return '';
    }
    
    // Clean up Quill's output and wrap in container
    const cleanHtml = `<div class="prose max-w-none p-4">${content}</div>`;
    return cleanHtml;
  };

  // Copy HTML to clipboard
  const copyToClipboard = async () => {
    try {
      const cleanHtml = htmlOutput
        .replace('<div class="prose max-w-none p-4">', '')
        .replace('</div>', '')
        .trim();
      await navigator.clipboard.writeText(cleanHtml);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Clear all content
  const clearContent = () => {
    setInputText('');
    setHtmlOutput('');
    setFormattedHtml('');
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.root.innerHTML = '';
    }
  };

  // Auto-convert when input changes
  useEffect(() => {
    if (inputText && inputText !== '<p><br></p>') {
      const html = convertToHtml(inputText);
      setHtmlOutput(html);
      setFormattedHtml(formatHtml(html));
    } else {
      setHtmlOutput('');
      setFormattedHtml('');
    }
  }, [inputText]);

  return (
    <>
      <Helmet>
        <title>Text to HTML Converter | Talk & Tool</title>
        <meta name="description" content="Convert plain text into clean HTML using our free Text to HTML tool." />
      </Helmet>
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Rich Text to HTML Converter
          </h1>
          <p className="text-lg opacity-75">Professional WYSIWYG editor with real-time HTML conversion</p>
          
          {/* Theme Toggle */}
          <div className="flex justify-center mt-4">
            <div className={`flex items-center space-x-2 p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-full transition-all ${
                  theme === 'light' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600'
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Content Area */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Input Section - Rich Text Editor */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Rich Text Editor</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm opacity-75">Full featured editor</span>
                  <button
                    onClick={clearContent}
                    title="Clear all content"
                    className={`p-2 rounded-md transition-all hover:scale-110 ${
                      theme === 'dark' 
                        ? 'hover:bg-red-900' 
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>
              
              {/* React Quill Editor */}
              <div className={`rounded-lg border overflow-hidden ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <ReactQuill
                  ref={quillRef}
                  value={inputText}
                  onChange={setInputText}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  className={`h-96 ${
                    theme === 'dark' ? 
                    'quill-dark-theme bg-gray-900 text-white' : 
                    'bg-white text-gray-800'
                  }`}
                  placeholder="Start typing your content here..."
                />
                
                {/* Editor Status Bar */}
                <div className={`px-4 py-2 text-xs border-t ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <span>Professional rich text editor</span>
                    <span>
                      {inputText.replace(/<[^>]*>/g, '').length} characters,{' '}
                      {inputText.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length} words
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section - Only HTML Code */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">HTML Output</h3>
                <button
                  onClick={copyToClipboard}
                  disabled={!htmlOutput}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    !htmlOutput 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105'
                  } ${
                    theme === 'dark' 
                      ? 'bg-green-600 hover:bg-green-500' 
                      : 'bg-green-500 hover:bg-green-400 text-white'
                  }`}
                >
                  {isCopied ? '✅ Copied!' : '📋 Copy HTML'}
                </button>
              </div>

              {/* HTML Code Output */}
              <div className={`h-96 rounded-lg border overflow-auto ${
                theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-900'
              }`}>
                <pre className={`p-4 h-full overflow-auto text-sm whitespace-pre-wrap ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-300'
                }`}>
                  <code>
                    {formattedHtml || '<!-- HTML code will appear here... -->'}
                  </code>
                </pre>
              </div>

              {/* Output Stats */}
              {htmlOutput && (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'
                }`}>
                  <div className="grid grid-cols-3 gap-4 text-sm text-center">
                    <div>
                      <div className="font-semibold">Lines</div>
                      <div>{formattedHtml.split('\n').length}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Elements</div>
                      <div>{(htmlOutput.match(/<[^>]*>/g) || []).length}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Size</div>
                      <div>{(new Blob([htmlOutput])).size} bytes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Professional Editor</h3>
            <p className="opacity-75 text-sm">Full-featured Quill.js rich text editor</p>
          </div>
          
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Real-time Conversion</h3>
            <p className="opacity-75 text-sm">Instant HTML code generation as you type</p>
          </div>
          
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">Formatted Output</h3>
            <p className="opacity-75 text-sm">Beautifully formatted HTML code with indentation</p>
          </div>
          
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Responsive</h3>
            <p className="opacity-75 text-sm">Works on all devices and screen sizes</p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className={`mt-8 p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
        }`}>
          <h3 className="font-semibold mb-4 text-center">💡 Quick Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Rich Formatting:</strong> Use the toolbar for text formatting, lists, links, and more
            </div>
            <div>
              <strong>Real-time Conversion:</strong> HTML code updates instantly as you edit
            </div>
            <div>
              <strong>Copy & Paste:</strong> Use the copy button to get clean HTML code
            </div>
            <div>
              <strong>Formatted Output:</strong> Get properly indented and readable HTML code
            </div>
          </div>
        </div>

        {/* Custom CSS for dark theme */}
        <style jsx>{`
          .quill-dark-theme .ql-toolbar {
            background-color: #374151;
            border-color: #4B5563;
          }
          .quill-dark-theme .ql-container {
            background-color: #1F2937;
            border-color: #4B5563;
          }
          .quill-dark-theme .ql-editor {
            color: white;
          }
          .quill-dark-theme .ql-toolbar .ql-stroke {
            stroke: white !important;
          }
          .quill-dark-theme .ql-toolbar .ql-fill {
            fill: white !important;
          }
          .quill-dark-theme .ql-toolbar .ql-picker-label {
            color: white !important;
          }
        `}</style>
      </div>
    </div>
    </>
  );
};

export default TextToHtmlTool;