import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiArrowRight, FiCode, FiBook, FiTrendingUp, FiClock, FiHeart, FiShare2 } from 'react-icons/fi';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Sample data - replace with actual API data
  const featuredBlogs = [
    {
      id: 1,
      title: "The Future of Web Development in 2024",
      excerpt: "Exploring the latest trends and technologies shaping the web development landscape...",
      category: "Web Development",
      readTime: "5 min read",
      likes: 42,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Mastering React Hooks: A Comprehensive Guide",
      excerpt: "Deep dive into React Hooks and how to use them effectively in your projects...",
      category: "React",
      readTime: "8 min read",
      likes: 89,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "AI Tools Every Developer Should Know",
      excerpt: "Discover the most powerful AI tools that can boost your productivity...",
      category: "AI",
      readTime: "6 min read",
      likes: 156,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
      date: "2024-01-10"
    }
  ];

  const popularTools = [
    {
      id: 1,
      name: "Code Optimizer",
      description: "AI-powered code optimization tool",
      category: "Development",
      icon: "⚡",
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      name: "Design Assistant",
      description: "Smart design suggestions and feedback",
      category: "Design",
      icon: "🎨",
      rating: 4.6,
      isNew: false
    },
    {
      id: 3,
      name: "Content Generator",
      description: "AI content creation made easy",
      category: "Writing",
      icon: "✍️",
      rating: 4.9,
      isNew: true
    },
    {
      id: 4,
      name: "SEO Analyzer",
      description: "Comprehensive SEO analysis tool",
      category: "Marketing",
      icon: "📊",
      rating: 4.7,
      isNew: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: '🌐', count: 28 },
    { id: 'webdev', name: 'Web Development', icon: '💻', count: 12 },
    { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', count: 8 },
    { id: 'mobile', name: 'Mobile Development', icon: '📱', count: 6 },
    { id: 'design', name: 'UI/UX Design', icon: '�', count: 9 },
    { id: 'devops', name: 'DevOps', icon: '⚙️', count: 5 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleBlogLike = (blogId) => {
    toast.success('Added to favorites! ❤️');
  };

  const handleToolClick = (toolId) => {
    toast.info(`Opening tool ${toolId}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Talk and Tool
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover insightful blogs and powerful tools for developers, designers, and tech enthusiasts. 
            Your ultimate resource for staying ahead in the tech world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/blogs" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>Explore Blogs</span>
              <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/tools" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <FiCode className="mr-2" />
              <span>Discover Tools</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl'
                    : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold">{category.name}</div>
                <div className={`text-sm mt-1 ${
                  activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {category.count} articles
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Blogs</h2>
            <Link 
              to="/blogs" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All Blogs</span>
              <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleBlogLike(blog.id)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <FiHeart className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <FiClock />
                        <span>{blog.readTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiHeart />
                        <span>{blog.likes}</span>
                      </span>
                    </div>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Popular Tools</h2>
            <Link 
              to="/tools" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>Explore All Tools</span>
              <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => handleToolClick(tool.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{tool.icon}</div>
                  {tool.isNew && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      NEW
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 font-semibold">⭐ {tool.rating}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore More?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers and designers who are already using Talk and Tool 
            to enhance their skills and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started Free
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}