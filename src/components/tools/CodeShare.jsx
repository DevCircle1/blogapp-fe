import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest } from '../../services/api';

const CodeShare = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [shareUrl, setShareUrl] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [currentCodeId, setCurrentCodeId] = useState('');
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
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [currentCodeId]);

  const connectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const backendUrl = 'api.talkandtool.com'; 
    const wsUrl = `wss://${backendUrl}/ws/codes/${currentCodeId}/`;
    console.log('Connecting to WebSocket:', wsUrl);
    console.log('🔵 Connecting to WebSocket:', wsUrl);
    console.log('📝 Current Code ID:', currentCodeId);
    console.log('🔤 Code ID type:', currentCodeId.length === 6 ? 'Short Code' : 'UUID');
    
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setContent(data.content);
      setLanguage(data.language);
    };

    socketRef.current.onclose = (e) => {
      console.log('WebSocket disconnected:', e.code, e.reason);
      
      // Attempt to reconnect after 2 seconds if not a normal closure
      if (e.code !== 1000) {
        setTimeout(() => {
          if (currentCodeId) {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }
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
      // Use short_code if available, otherwise fall back to id
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
        // CREATE new code
        const response = await publicRequest.post('/codes/', {
          content,
          language
        });

        const data = response.data;
        // Use short_code for URL if available, otherwise use id
        const displayCodeId = data.short_code || data.id;
        const newUrl = `${window.location.origin}/codes/${displayCodeId}`;
        setShareUrl(newUrl);
        setCurrentCodeId(displayCodeId);

        window.history.pushState({}, '', `/codes/${displayCodeId}`);
        navigator.clipboard.writeText(newUrl);
        toast.success('Code shared successfully! URL copied to clipboard!');
      } else {
        // UPDATE existing code
        let updateEndpoint;
        
        // Check if it's a short code (6 alphanumeric characters)
        if (currentCodeId.length === 6 && /^[A-Za-z0-9]+$/.test(currentCodeId)) {
          // It's a short code - use the regular endpoint
          updateEndpoint = `/codes/${currentCodeId}/`;
        } else {
          // It's a UUID - use the update endpoint
          updateEndpoint = `/codes/${currentCodeId}/update/`;
        }

        await publicRequest.put(updateEndpoint, {
          content,
          language
        });

        toast.success('Code updated successfully!');
      }
    } catch (error) {
      console.error('Error sharing code:', error);
      if (error.response?.status === 404) {
        toast.error('Code not found or expired');
      } else {
        toast.error('Error sharing code');
      }
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Send update via WebSocket if connected
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        content: newContent,
        language: language
      }));
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Send language change via WebSocket if connected
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        content: content,
        language: newLanguage
      }));
    }
  };

  const handleDownload = () => {
    if (!content.trim()) {
      toast.error('No code to download');
      return;
    }

    const extension = getFileExtension();
    const filename = `code_${currentCodeId || 'new'}.${extension}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const getFileExtension = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      text: 'txt'
    };
    return extensions[language] || 'txt';
  };

  const handleNewShare = () => {
    setContent('');
    setLanguage('javascript');
    setShareUrl('');
    setCurrentCodeId('');
    setIsEditing(true);
    window.history.pushState({}, '', '/');
    
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    toast.info('Create a new code share');
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('URL copied to clipboard!');
    } else {
      toast.error('No URL to copy');
    }
  };

  const isShortCode = (codeId) => {
    return codeId && codeId.length === 6 && /^[A-Za-z0-9]+$/.test(codeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CodeShare
          </h1>
          <p className="text-gray-600">
            Share code instantly with real-time collaboration
          </p>
          {currentCodeId && (
            <div className="mt-2 text-sm text-gray-500">
              Current Code ID: {currentCodeId} {isShortCode(currentCodeId) && '(Short Code)'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor/Viewer */}
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
                  Language: <span className="font-medium">{languages.find(l => l.value === language)?.label}</span>
                </div>
                <div>
                  {content.length} characters
                  {content.length > 0 && (
                    <span> • {content.split('\n').length} lines</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Info */}
            {shareUrl && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Share Link
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      onClick={(e) => e.target.select()}
                    />
                  </div>
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

            {/* Connection Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Connection Status
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${socketRef.current?.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {socketRef.current?.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {currentCodeId && (
                <p className="text-sm text-gray-500 mt-2">
                  Real-time collaboration {socketRef.current?.readyState === WebSocket.OPEN ? 'active' : 'inactive'}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Features
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Real-time collaboration
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Short URLs (6-character codes)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Auto-expiry in 5 hours
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Multiple language support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  One-click download
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Syntax highlighting ready
                </li>
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                How to Use
              </h3>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                <li>Paste your code in the editor</li>
                <li>Select the programming language</li>
                <li>Click "Share" to generate a short link</li>
                <li>Share the 6-character code with others</li>
                <li>Collaborate in real-time!</li>
                <li>Code auto-saves as you type</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> New shares get short 6-character URLs that are easy to share and remember!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>CodeShare • Real-time code collaboration • URLs expire after 5 hours</p>
        </div>
      </div>
    </div>
  );
};

export default CodeShare;