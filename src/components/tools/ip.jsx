import React, { useState, useEffect } from 'react';

const IPAddressChecker = () => {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // Detect bots by user agent
    const botRegex = /(bot|crawl|spider|slurp|bing|duckduck|baidu|yandex|sogou|exabot|facebook|pinterest)/i;
    if (botRegex.test(navigator.userAgent)) {
      setIsBot(true);
      setLoading(false);
      return;
    }

    const fetchIPData = async () => {
      try {
        setLoading(true);
        
        // Call your Django backend API
        const response = await fetch('/api/ip-checker/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch IP data');
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to get valid IP data');
        }
        
        setIpData(result.data);
      } catch (err) {
        setError(err.message);
        console.error('IP fetch error:', err);
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

  // Structured Data JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "IP Address Checker",
    "url": "https://talkandtool.com/check-ip",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "description": "Check your public IP address instantly with Talk and Tool's IP Address Checker. Get details like city, region, country, and ISP with one click.",
    "provider": {
      "@type": "Organization",
      "name": "Talk and Tool",
      "url": "https://talkandtool.com"
    },
    "featureList": [
      "Instant public IP lookup",
      "Network details (city, region, country, ISP)",
      "One-click IP copy",
      "Privacy-focused (no IP storage)"
    ]
  };

  // ✅ Bot fallback
  if (isBot) {
    return (
      <div style={{ padding: "40px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
        <h1>IP Address Checker</h1>
        <p>
          Instantly find your public IP address and network information. 
          This tool helps users discover their online identity and location details.
        </p>
        <p><strong>Main Features:</strong></p>
        <ul>
          <li>Detect public IP address</li>
          <li>Show city, region, country, and ISP</li>
          <li>Copy IP address with one click</li>
          <li>Privacy-focused (we don't store your data)</li>
        </ul>
        <p>Trusted tool by Talk and Tool for online privacy and quick IP lookup.</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    );
  }

  // ✅ Loading state
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

  // ✅ Error state
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

  // ✅ Main UI for humans
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-semibold">Your Public IP Address</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center mt-4 md:mt-6 mb-4 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto flex justify-center">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-blue-800 bg-opacity-25 px-4 py-3 rounded-lg break-all text-center max-w-full">
                  {ipData.ip}
                </span>
              </div>
              <div className="w-full sm:w-auto flex justify-center sm:ml-4">
                <button 
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center min-w-[120px]"
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
          </div>

          {/* Network Details */}
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Network Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 p-4 md:p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">City</h4>
                <p className="text-lg font-semibold">{ipData.city || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Region</h4>
                <p className="text-lg font-semibold">{ipData.region || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Country</h4>
                <p className="text-lg font-semibold">{ipData.country || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 p-4 md:p-5 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 mb-1">ISP</h4>
                <p className="text-lg font-semibold">{ipData.connection.org || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </main>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12">
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