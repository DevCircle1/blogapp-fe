import React, { useState, useRef, useEffect } from 'react';

const TextToHtmlTool = () => {
  const [inputText, setInputText] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [theme, setTheme] = useState('light');
  const textareaRef = useRef(null);

  // Common text patterns and their HTML equivalents
  const textPatterns = [
    { name: 'Heading 1', pattern: '# ', replacement: '<h1>', end: '</h1>' },
    { name: 'Heading 2', pattern: '## ', replacement: '<h2>', end: '</h2>' },
    { name: 'Heading 3', pattern: '### ', replacement: '<h3>', end: '</h3>' },
    { name: 'Bold', pattern: '**', replacement: '<strong>', end: '</strong>' },
    { name: 'Italic', pattern: '*', replacement: '<em>', end: '</em>' },
    { name: 'Underline', pattern: '__', replacement: '<u>', end: '</u>' },
    { name: 'Link', pattern: '[', replacement: '<a href="#">', end: '</a>', middle: ']()' },
    { name: 'List Item', pattern: '- ', replacement: '<li>', end: '</li>' },
    { name: 'Paragraph', pattern: '\n\n', replacement: '<p>', end: '</p>' },
  ];

  // Convert text to HTML
  const convertToHtml = () => {
    let html = inputText;

    // Replace line breaks
    html = html.replace(/\n/g, '<br>');

    // Apply text patterns
    textPatterns.forEach(({ pattern, replacement, end, middle }) => {
      if (middle) {
        // For patterns like links [text](url)
        const regex = new RegExp(`\\${pattern}(.*?)\\${middle}(.*?)\\)`, 'g');
        html = html.replace(regex, `<a href="$2">$1</a>`);
      } else {
        const regex = new RegExp(`\\${pattern}(.*?)\\${pattern}`, 'g');
        html = html.replace(regex, `${replacement}$1${end}`);
      }
    });

    // Wrap in body tags for better preview
    html = `<div class="prose max-w-none">${html}</div>`;
    setHtmlOutput(html);
  };

  // Copy HTML to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput.replace('<div class="prose max-w-none">', '').replace('</div>', ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Insert pattern at cursor position
  const insertPattern = (pattern, endPattern = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    const newText = inputText.substring(0, start) + pattern + selectedText + endPattern + inputText.substring(end);
    
    setInputText(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + pattern.length, end + pattern.length);
    }, 0);
  };

  // Clear all content
  const clearContent = () => {
    setInputText('');
    setHtmlOutput('');
  };

  // Auto-convert when input changes
  useEffect(() => {
    if (inputText) {
      convertToHtml();
    } else {
      setHtmlOutput('');
    }
  }, [inputText]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Text to HTML Converter
          </h1>
          <p className="text-lg opacity-75">Convert plain text to HTML with modern formatting</p>
          
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
          {/* Toolbar */}
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-medium opacity-75">Quick Insert:</span>
              {textPatterns.map((pattern, index) => (
                <button
                  key={index}
                  onClick={() => insertPattern(pattern.pattern, pattern.end ? pattern.pattern : '')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={clearContent}
                  className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-red-600 hover:bg-red-500' 
                      : 'bg-red-500 hover:bg-red-400 text-white'
                  }`}
                >
                  Clear All
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm opacity-75">{inputText.length} characters</span>
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
            </div>
          </div>

          {/* Content Area */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Input Text</h3>
                <span className="text-sm opacity-75">Markdown-style formatting supported</span>
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text here... Use # for headings, **bold**, *italic*, - for lists, etc."
                  className={`w-full h-96 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700 text-white' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                />
                {!inputText && (
                  <div className={`absolute top-4 left-4 pointer-events-none ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <div className="space-y-2 text-sm">
                      <p># Heading 1</p>
                      <p>## Heading 2</p>
                      <p>**Bold text**</p>
                      <p>*Italic text*</p>
                      <p>- List item</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">HTML Output</h3>
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'preview' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm' 
                        : 'opacity-75'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'code' 
                        ? 'bg-white dark:bg-gray-600 shadow-sm' 
                        : 'opacity-75'
                    }`}
                  >
                    Code
                  </button>
                </div>
              </div>

              <div className={`h-96 rounded-lg border overflow-auto ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                {activeTab === 'preview' ? (
                  <div 
                    className="p-4 h-full prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlOutput || '<p class="opacity-50">Preview will appear here...</p>' }}
                  />
                ) : (
                  <pre className={`p-4 h-full overflow-auto text-sm ${
                    theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-900 text-green-300'
                  }`}>
                    <code>{htmlOutput.replace('<div class="prose max-w-none">', '').replace('</div>', '') || '<!-- HTML code will appear here... -->'}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Real-time Conversion</h3>
            <p className="opacity-75">See HTML results instantly as you type</p>
          </div>
          
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">Modern UI</h3>
            <p className="opacity-75">Clean, responsive design with dark/light themes</p>
          </div>
          
          <div className={`p-6 rounded-2xl transition-all hover:scale-105 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Responsive</h3>
            <p className="opacity-75">Works perfectly on desktop and mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToHtmlTool;