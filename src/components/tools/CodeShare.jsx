import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest } from '../../services/api';
import { supabase } from '../../services/supabase';
import Seo from '../common/Seo.jsx';

const CodeShare = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [shareUrl, setShareUrl] = useState('');
  const [currentCodeId, setCurrentCodeId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);
  const editorContainerRef = useRef(null);
  const lastSyncedRef = useRef({ content: '', language: 'javascript' });

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'text', label: 'Plain Text' }
  ];

  useEffect(() => {
    const path = window.location.pathname.split('/').filter(Boolean);
    if (path.length === 2 && path[0] === 'codes') {
      const codeId = path[1];
      loadSharedCode(codeId);
    }
  }, []);

  useEffect(() => {
    if (!currentCodeId) return undefined;
    const channel = supabase
      .channel(`code-share-${currentCodeId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'code_shares', filter: `id=eq.${currentCodeId}` },
        ({ new: updated }) => {
          lastSyncedRef.current = { content: updated.content, language: updated.language };
          setContent(updated.content);
          setLanguage(updated.language);
        },
      )
      .subscribe((status) => setIsConnected(status === 'SUBSCRIBED'));

    return () => {
      setIsConnected(false);
      supabase.removeChannel(channel);
    };
  }, [currentCodeId]);

  useEffect(() => {
    if (!currentCodeId) return undefined;
    if (lastSyncedRef.current.content === content && lastSyncedRef.current.language === language) return undefined;
    const timer = setTimeout(async () => {
      try {
        await publicRequest.put(`/codes/${currentCodeId}/`, { content, language });
        lastSyncedRef.current = { content, language };
      } catch (error) {
        console.error('Supabase code sync failed:', error);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [content, language, currentCodeId]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const loadSharedCode = async (codeId) => {
    try {
      const response = await publicRequest.get(`/codes/${codeId}/`);
      const data = response.data;
      lastSyncedRef.current = { content: data.content, language: data.language };
      setContent(data.content);
      setLanguage(data.language);
      const displayCodeId = data.short_code || data.id;
      setCurrentCodeId(displayCodeId);
      toast.success('Code loaded successfully!');
    } catch (error) {
      console.error('Error loading code:', error);
      toast.error('Code not found or expired');
    }
  };

  const handleShare = async () => {
    if (!content.trim()) {
      toast.error('Please enter some code to share');
      return;
    }

    try {
      if (!currentCodeId) {
        const response = await publicRequest.post('/codes/', { content, language });
        const data = response.data;
        const displayCodeId = data.short_code || data.id;
        const newUrl = `${window.location.origin}/codes/${displayCodeId}`;
        setShareUrl(newUrl);
        setCurrentCodeId(displayCodeId);
        window.history.pushState({}, '', `/codes/${displayCodeId}`);
        navigator.clipboard.writeText(newUrl);
        toast.success('Code shared successfully! URL copied to clipboard!');
      } else {
        const updateEndpoint =
          currentCodeId.length === 6 && /^[A-Za-z0-9]+$/.test(currentCodeId)
            ? `/codes/${currentCodeId}/`
            : `/codes/${currentCodeId}/update/`;

        await publicRequest.put(updateEndpoint, { content, language });
        toast.success('Code updated successfully!');
      }
    } catch (error) {
      console.error('Error sharing code:', error);
      toast.error('Error sharing code');
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
  };

  const handleDownload = () => {
    if (!content.trim()) return toast.error('No code to download');
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      text: 'txt'
    };
    const filename = `code_${currentCodeId || 'new'}.${extensions[language] || 'txt'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const handleNewShare = () => {
    setContent('');
    setLanguage('javascript');
    setShareUrl('');
    setCurrentCodeId('');
    window.history.pushState({}, '', '/');
    toast.info('Create a new code share');
  };

  const handleCopyUrl = () => {
    if (!shareUrl) return toast.error('No URL to copy');
    navigator.clipboard.writeText(shareUrl);
    toast.success('URL copied to clipboard!');
  };

  const toggleFullscreen = () => {
    if (!editorContainerRef.current) return;

    if (!document.fullscreenElement) {
      editorContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Calculate line numbers
  const lineNumbers = content.split('\n').map((_, index) => index + 1);

  return (
  <div
    className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-3 sm:px-4 ${
      isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
    }`}
  >
      <Seo title="CodeShare" description="Share and collaborate on code snippets in real time." path="/codes" noindex />
    <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto'}`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">
            CodeShare
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Share code instantly with real-time collaboration
          </p>
          {currentCodeId && (
            <div className="mt-2 text-xs sm:text-sm text-gray-500">
              Code ID: {currentCodeId}
            </div>
          )}
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${
          isFullscreen ? 'h-full' : 'lg:grid-cols-3 gap-4 sm:gap-6'
        }`}
      >
        {/* Editor */}
        <div className={`${isFullscreen ? 'h-full' : 'lg:col-span-2'}`}>
          <div
            ref={editorContainerRef}
            className={`bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden ${
              isFullscreen ? 'h-full rounded-none' : ''
            }`}
          >
            {/* Toolbar */}
            <div className="bg-gray-50 px-3 sm:px-6 py-3 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>

                  {shareUrl && (
                    <button
                      onClick={handleCopyUrl}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      Copy URL
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!content.trim()}
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 disabled:bg-purple-300 transition-colors"
                  >
                    Download
                  </button>

                  {!isFullscreen && (
                    <button
                      onClick={handleNewShare}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      New
                    </button>
                  )}

                  <button
                    onClick={handleShare}
                    disabled={!content.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    {currentCodeId ? 'Update' : 'Share'}
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div
              className={`relative ${
                isFullscreen ? 'h-[calc(100%-70px)]' : 'h-80 sm:h-96'
              }`}
            >
              <div className="flex h-full">
                <div className="hidden sm:flex flex-col items-end pr-4 py-6 bg-gray-50 border-r border-gray-200 overflow-hidden">
                  {lineNumbers.map((number) => (
                    <div
                      key={number}
                      className="text-right text-gray-400 text-xs sm:text-sm font-mono leading-6 select-none"
                    >
                      {number}
                    </div>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Write or paste your code..."
                  className="flex-1 font-mono text-xs sm:text-sm p-3 sm:p-6 border-0 focus:ring-0 resize-none bg-white overflow-auto"
                  style={{
                    fontFamily:
                      'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5',
                  }}
                />
              </div>

              {!content && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-gray-400 text-center text-sm sm:text-base">
                    <div>Start typing your code...</div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-3 sm:px-6 py-2 border-t border-gray-200 text-xs sm:text-sm text-gray-500 flex justify-between items-center flex-wrap gap-2">
              <div>
                Language:{' '}
                <span className="font-medium">
                  {languages.find((l) => l.value === language)?.label}
                </span>
              </div>
              <div>
                {content.length} chars
                {content.length > 0 && (
                  <span> • {content.split('\n').length} lines</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isFullscreen && (
          <div className="space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            {shareUrl && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Share Link
                </h3>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-gray-50 mb-3"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopyUrl}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                >
                  Copy URL
                </button>
                <p className="text-xs sm:text-sm text-gray-500 mt-3">
                  <span className="font-medium">
                    This link will expire in 5 hours
                  </span>
                </p>
              </div>
            )}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Connection Status
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Features
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                <li>✅ Real-time collaboration</li>
                <li>✅ Short URLs</li>
                <li>✅ Auto-expiry in 5 hours</li>
                <li>✅ Multi-language support</li>
                <li>✅ One-click download</li>
                <li>✅ Fullscreen mode</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      {!isFullscreen && (
        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>CodeShare • Real-time collaboration • Auto-expiry in 5 hours</p>
        </div>
      )}
    </div>
  </div>
);
};
export default CodeShare
