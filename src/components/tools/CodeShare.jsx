import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest } from '../../services/api';
import debounce from 'lodash.debounce';

const CodeShare = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [shareUrl, setShareUrl] = useState('');
  const [currentCodeId, setCurrentCodeId] = useState('');
  const [isEditing, setIsEditing] = useState(true);
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
      loadSharedCode(path[1]);
    }
  }, []);

  useEffect(() => {
    if (currentCodeId) connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
      sendUpdate.cancel();
    };
  }, [currentCodeId]);

  const connectWebSocket = () => {
    if (socketRef.current) socketRef.current.close();

    const wsUrl = `wss://api.talkandtool.com/ws/codes/${currentCodeId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log('✅ WebSocket connected:', wsUrl);
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Only update if message content differs to avoid re-render lag
      setContent((prev) => (prev !== data.content ? data.content : prev));
      setLanguage((prev) => (prev !== data.language ? data.language : prev));
    };

    socketRef.current.onclose = (e) => {
      setIsConnected(false);
      console.log('🔴 WebSocket disconnected:', e.code);
      if (e.code !== 1000) {
        setTimeout(connectWebSocket, 2000);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      toast.error('WebSocket error occurred');
    };
  };

  const loadSharedCode = async (codeId) => {
    try {
      const { data } = await publicRequest.get(`/codes/${codeId}/`);
      setContent(data.content);
      setLanguage(data.language);
      const displayCodeId = data.short_code || data.id;
      setCurrentCodeId(displayCodeId);
      setIsEditing(false);
      toast.success('Code loaded successfully!');
    } catch (err) {
      console.error(err);
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
        const { data } = await publicRequest.post('/codes/', { content, language });
        const displayCodeId = data.short_code || data.id;
        const newUrl = `${window.location.origin}/codes/${displayCodeId}`;
        setCurrentCodeId(displayCodeId);
        setShareUrl(newUrl);
        window.history.pushState({}, '', `/codes/${displayCodeId}`);
        navigator.clipboard.writeText(newUrl);
        toast.success('Code shared successfully! URL copied!');
      } else {
        const endpoint =
          currentCodeId.length === 6
            ? `/codes/${currentCodeId}/`
            : `/codes/${currentCodeId}/update/`;
        await publicRequest.put(endpoint, { content, language });
        toast.success('Code updated successfully!');
      }
    } catch (err) {
      console.error(err);
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
    const extMap = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      text: 'txt'
    };
    const file = `code_${currentCodeId || 'new'}.${extMap[language] || 'txt'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file;
    a.click();
    toast.success('Code downloaded!');
  };

  const handleNewShare = () => {
    setContent('');
    setLanguage('javascript');
    setShareUrl('');
    setCurrentCodeId('');
    setIsEditing(true);
    if (socketRef.current) socketRef.current.close();
    window.history.pushState({}, '', '/');
    toast.info('New code session started');
  };

  const handleCopyUrl = () => {
    if (!shareUrl) return toast.error('No URL to copy');
    navigator.clipboard.writeText(shareUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">CodeShare</h1>
          <p className="text-gray-600">Collaborate live, instantly.</p>
          {currentCodeId && (
            <p className="text-sm text-gray-500 mt-1">
              Code ID: <strong>{currentCodeId}</strong>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Download
                </button>
                <button
                  onClick={handleNewShare}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  New
                </button>
                {/* <button
                  onClick={handleShare}
                  disabled={!content.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {currentCodeId ? 'Update' : 'Share'}
                </button> */}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Type your code here..."
              className="w-full h-96 font-mono text-sm p-6 border-0 focus:ring-0 resize-none"
              style={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                lineHeight: '1.5',
                tabSize: 2
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {shareUrl && (
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Share Link</h3>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 mb-3"
                />
                <button
                  onClick={handleCopyUrl}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Copy URL
                </button>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="font-semibold text-gray-800 mb-2">Connection</h3>
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
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          <p>CodeShare — Real-time code collaboration (auto expires in 5h)</p>
        </div>
      </div>
    </div>
  );
};

export default CodeShare;
