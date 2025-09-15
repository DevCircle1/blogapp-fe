import React, { useState, useEffect } from 'react';

const ScreenResolutionTool = () => {
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${resolution.width} × ${resolution.height}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Screen Resolution Tool</h1>
          <p className="text-gray-600 mt-2">Real-time display of your current screen resolution</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {resolution.width} <span className="text-gray-400">×</span> {resolution.height}
            </div>
            <p className="text-gray-600">pixels</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-blue-600 font-semibold">Width</div>
            <div className="text-lg font-medium">{resolution.width}px</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-purple-600 font-semibold">Height</div>
            <div className="text-lg font-medium">{resolution.height}px</div>
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isCopied ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Resolution
            </>
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Resize your browser window to see changes in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default ScreenResolutionTool;