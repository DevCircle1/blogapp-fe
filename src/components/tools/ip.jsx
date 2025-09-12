import React, { useState, useEffect } from 'react';

const IPAddressChecker = () => {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchIPData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ipwho.is/');
        if (!response.ok) throw new Error('Failed to fetch IP data');
        const data = await response.json();
        if (!data.success) throw new Error('Failed to get valid IP data');
        setIpData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIPData();
  }, []);
  const copyToClipboard = () => {
    if (ipData && ipData.ip) {
      navigator.clipboard.writeText(ipData.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-blue-100 p-4 mb-6">
              <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading IP Information</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">IP Address Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your public IP address and network information instantly. Your digital identity online.
          </p>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          {/* IP Address Display */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-semibold">Your Public IP Address</h2>
            </div>
            
            <div className="flex items-center justify-center mt-6 mb-4">
              <span className="text-3xl md:text-4xl font-mono font-bold bg-blue-800 bg-opacity-25 px-6 py-3 rounded-lg">
                {ipData.ip}
              </span>
              <button 
                onClick={copyToClipboard}
                className="ml-4 bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Network Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Network Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">City</h4>
                <p className="text-lg font-semibold">{ipData.city || 'Unknown'}</p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Region</h4>
                <p className="text-lg font-semibold">{ipData.region || 'Unknown'}</p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Country</h4>
                <p className="text-lg font-semibold">{ipData.country || 'Unknown'}</p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">ISP</h4>
                <p className="text-lg font-semibold">{ipData.connection.org || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </main>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What is an IP address?</h3>
              <p className="text-gray-600">An IP address is a unique identifier assigned to each device connected to a network. It allows devices to communicate with each other over the internet.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Why is my IP address important?</h3>
              <p className="text-gray-600">Your IP address is essential for internet communication. It enables websites to send data to your device and helps in identifying your approximate location for content delivery.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I hide my IP address?</h3>
              <p className="text-gray-600">Yes, you can use VPN services or proxy servers to mask your real IP address and enhance your online privacy.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8">
          <p>© {new Date().getFullYear()} IP Address Checker. All rights reserved.</p>
          <p className="mt-2 text-sm">Your privacy is important to us. We don't store any of your IP information.</p>
        </footer>
      </div>
    </div>
  );
};

export default IPAddressChecker;