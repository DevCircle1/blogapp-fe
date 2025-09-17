import { useState } from 'react';

const ToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const tools = [
    {
      id: 1,
      title: 'IP Address Checker',
      description: 'Discover your current public IP address instantly. See what information websites can detect about your connection.',
      icon: '🌐',
      link: '/check-ip',
      category: 'Network',
      tags: ['ip', 'network', 'privacy']
    },
    {
      id: 2,
      title: 'Profit Margin Calculator',
      description: 'Calculate profit margins quickly for your business or personal projects. Easy to use with instant results.',
      icon: '💰',
      link: '/profit-margin-calculator',
      category: 'Business',
      tags: ['finance', 'business', 'calculator']
    },
    {
      id: 3,
      title: 'Screen Resolution',
      description: 'Check your current screen resolution and device information. Perfect for developers and designers.',
      icon: '📱',
      link: '/screen-resolution',
      category: 'Display',
      tags: ['display', 'resolution', 'design']
    },
    {
      id: 4,
      title: 'Password Generator',
      description: 'Create strong, secure passwords with our customizable generator. Keep your accounts safe.',
      icon: '🔒',
      link: '/password-generator',
      category: 'Security',
      tags: ['security', 'password', 'privacy'],
      comingSoon: true
    },
    {
      id: 5,
      title: 'Color Picker',
      description: 'Find the perfect color for your design projects. Get HEX, RGB, and HSL values instantly.',
      icon: '🎨',
      link: '/color-picker',
      category: 'Design',
      tags: ['design', 'color', 'web'],
      comingSoon: true
    },
    {
      id: 6,
      title: 'Unit Converter',
      description: 'Convert between different units of measurement. Length, weight, temperature, and more.',
      icon: '📏',
      link: '/unit-converter',
      category: 'Utility',
      tags: ['conversion', 'measurement', 'tools'],
      comingSoon: true
    }
  ];

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Web Tools Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Free online tools to help with everyday tasks. No installation required.
          </p>
          <div className="w-20 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </header>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <svg 
              className="absolute right-3 top-3 w-5 h-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setSearchTerm('')}
            className={`px-4 py-2 rounded-full ${searchTerm === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} transition-colors`}
          >
            All Tools
          </button>
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSearchTerm(category)}
              className={`px-4 py-2 rounded-full ${searchTerm === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map(tool => (
            <div key={tool.id} className="flex flex-col">
              {/* Tool Card */}
              <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{tool.icon}</span>
                    <h2 className="text-xl font-semibold text-gray-800">{tool.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-6">{tool.description}</p>
                  
                  <div className="mb-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href={tool.comingSoon ? '#' : tool.link}
                      className={`block text-center py-2 px-4 rounded-lg font-medium ${
                        tool.comingSoon 
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {tool.comingSoon ? 'Coming Soon' : 'Use Tool'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tools found</h3>
            <p className="text-gray-600">Try a different search term or browse all tools</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Our Tools</h2>
          <p className="text-gray-700 mb-4">
            All our tools are designed to be simple, fast, and privacy-focused. We don't store your data or require any sign-ups.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-800 mb-2">Privacy Focused</h3>
              <p className="text-gray-600">We don't store your data or track your usage.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Fast & Lightweight</h3>
              <p className="text-gray-600">Our tools load quickly and work efficiently.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">💯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Forever</h3>
              <p className="text-gray-600">All our tools are completely free to use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;