import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest } from '../../services/api';
import debounce from 'lodash.debounce';

const CodeShare = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [shareUrl, setShareUrl] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [currentCodeId, setCurrentCodeId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const textareaRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'text', label: 'Plain Text' }
  ];

  // ✅ Debounced WebSocket sender (prevents lag while typing)
  const sendUpdate = useCallback(
    debounce((updatedContent, lang) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ content: updatedContent, language: lang }));
      }
    }, 400),
    []
  );

  useEffect(() => {
    const path = window.location.pathname.split('/').filter(Boolean);
    if (path.length === 2 && path[0] === 'codes') {
      const codeId = path[1];
      loadSharedCode(codeId);
    }
  }, []);

  useEffect(() => {
    if (currentCodeId) {
      connectWebSocket();
    }
    return () => {
      if (socketRef.current) socketRef.current.close();
      sendUpdate.cancel();
    };
  }, [currentCodeId]);

  const connectWebSocket = () => {
    if (socketRef.current) socketRef.current.close();

    const backendUrl = 'api.talkandtool.com';
    const wsUrl = `wss://${backendUrl}/ws/codes/${currentCodeId}/`;
    console.log('Connecting to WebSocket:', wsUrl);

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Avoid re-render loop
      setContent((prev) => (prev !== data.content ? data.content : prev));
      setLanguage((prev) => (prev !== data.language ? data.language : prev));
    };

    socketRef.current.onclose = (e) => {
      console.log('🔴 WebSocket disconnected:', e.code);
      setIsConnected(false);
      if (e.code !== 1000) {
        setTimeout(() => {
          if (currentCodeId) connectWebSocket();
        }, 2000);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket connection failed');
    };
  };

  const loadSharedCode = async (codeId) => {
    try {
      const response = await publicRequest.get(`/codes/${codeId}/`);
      const data = response.data;
      setContent(data.content);
      setLanguage(data.language);
      const displayCodeId = data.short_code || data.id;
      setCurrentCodeId(displayCodeId);
      setIsEditing(false);
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
    sendUpdate(newContent, language);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    sendUpdate(content, newLang);
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
    setIsEditing(true);
    window.history.pushState({}, '', '/');
    if (socketRef.current) socketRef.current.close();
    toast.info('Create a new code share');
  };

  const handleCopyUrl = () => {
    if (!shareUrl) return toast.error('No URL to copy');
    navigator.clipboard.writeText(shareUrl);
    toast.success('URL copied to clipboard!');
  };

  const isShortCode = (codeId) => codeId && codeId.length === 6 && /^[A-Za-z0-9]+$/.test(codeId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CodeShare</h1>
          <p className="text-gray-600">Share code instantly with real-time collaboration</p>
          {currentCodeId && (
            <div className="mt-2 text-sm text-gray-500">
              Current Code ID: {currentCodeId} {isShortCode(currentCodeId) && '(Short Code)'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <span>Copy URL</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      disabled={!content.trim()}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <span>Download</span>
                    </button>

                    <button
                      onClick={handleNewShare}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                      <span>New</span>
                    </button>

                    <button
                      onClick={handleShare}
                      disabled={!content.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center space-x-2"
                    >
                      <span>{currentCodeId ? 'Update' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Paste your code here..."
                  className="w-full h-96 font-mono text-sm p-6 border-0 focus:ring-0 resize-none bg-white"
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5',
                    tabSize: 2
                  }}
                />
                {!content && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400 text-center">
                      <div className="text-lg mb-2">Start coding...</div>
                      <div className="text-sm">Paste your code or start typing</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="bg-gray-50 px-6 py-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                <div>
                  Language:{' '}
                  <span className="font-medium">
                    {languages.find((l) => l.value === language)?.label}
                  </span>
                </div>
                <div>
                  {content.length} characters
                  {content.length > 0 && <span> • {content.split('\n').length} lines</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {shareUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Share Link</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Copy URL to Clipboard
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  <span className="font-medium">This link will expire in 5 hours</span>
                  <br />
                  Share this URL with others to collaborate in real-time
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Connection Status</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {currentCodeId && (
                <p className="text-sm text-gray-500 mt-2">
                  Real-time collaboration {isConnected ? 'active' : 'inactive'}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>✅ Real-time collaboration</li>
                <li>✅ Short URLs (6-character codes)</li>
                <li>✅ Auto-expiry in 5 hours</li>
                <li>✅ Multiple language support</li>
                <li>✅ One-click download</li>
                <li>✅ Syntax highlighting ready</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>CodeShare • Real-time code collaboration • URLs expire after 5 hours</p>
        </div>
      </div>
    </div>
  );
};

export default CodeShare;
