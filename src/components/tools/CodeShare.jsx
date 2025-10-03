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
  if (path.length === 1 && path[0] !== 'codeshare') {
    const codeId = path[0];
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

    const wsScheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsScheme}//${window.location.host}/ws/code/${currentCodeId}/`;
    
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setContent(data.content);
      setLanguage(data.language);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
  };

  const loadSharedCode = async (codeId) => {
    try {
      const response = await publicRequest.get(`/codes/${codeId}/`);
      const data = response.data;
      setContent(data.content);
      setLanguage(data.language);
      setCurrentCodeId(codeId);
      setIsEditing(false);
      toast.success('Code loaded successfully!');
    } catch (error) {
      toast.error('Code not found or expired');
      // window.location.href = '/';
    }
  };

  const handleShare = async () => {
    if (!content.trim()) {
      toast.error('Please enter some code to share');
      return;
    }

    try {
      const response = await publicRequest.post('/codes/', {
        content,
        language
      });

      const data = response.data;
      const newUrl = `${window.location.origin}/${data.id}`;
      setShareUrl(newUrl);
      setCurrentCodeId(data.id);

      // Update URL without reload
      window.history.pushState({}, '', `/${data.id}`);

      setIsEditing(true);
      connectWebSocket();
      toast.success('Code shared successfully!');

      // Copy to clipboard
      navigator.clipboard.writeText(newUrl);
      toast.info('URL copied to clipboard!');
    } catch (error) {
      toast.error('Error sharing code');
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

  const handleDownload = () => {
    const extension = getFileExtension();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
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
    toast.info('Create a new code share');
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('URL copied to clipboard!');
    }
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
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Copy URL
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Download
                    </button>
                    
                    <button
                      onClick={handleNewShare}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      New
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                      {shareUrl ? 'Update' : 'Share'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="p-1">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Paste your code here..."
                  className="w-full h-96 font-mono text-sm p-6 border-0 focus:ring-0 resize-none"
                  style={{ 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5'
                  }}
                />
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
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This link will expire in 5 hours
                </p>
              </div>
            )}

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
                <li>Click "Share" to generate a link</li>
                <li>Share the link with others</li>
                <li>Collaborate in real-time!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeShare;
