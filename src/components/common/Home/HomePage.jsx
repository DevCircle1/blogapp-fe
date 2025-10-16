import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
  FiSearch,
  FiArrowRight,
  FiCode,
  FiBook,
  FiTrendingUp,
  FiClock,
  FiHeart,
  FiShare2,
} from "react-icons/fi";
import { publicRequest } from "../../../services/api";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured blogs from API
  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await publicRequest.get("/posts/");
        // Get the 3 latest posts sorted by created_at
        const latestPosts = response.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        setFeaturedBlogs(latestPosts);
      } catch (err) {
        setError("Failed to fetch featured blogs");
        console.error("Error fetching featured blogs:", err);
        toast.error("Failed to load featured blogs");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await publicRequest.get("/top-categories/");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchFeaturedBlogs();
    fetchCategories();
  }, []);

  const popularTools = [
    {
      id: 1,
      name: "Check Ip Address",
      description: "Quickly find and display your current public IP address.",
      category: "Development",
      icon: "🌐",
      isNew: true,
      url: "https://talkandtool.com/check-ip",
    },
    {
      id: 2,
      name: "Screen Resolution",
      description:
        "Detect and display your device’s current screen resolution.",
      category: "Design",
      icon: "🖥️",
      isNew: false,
      url: "https://talkandtool.com/screen-resolution",
    },
    {
      id: 3,
      name: "Profit Margin Calculator",
      description: "Easily calculate profit margin, markup, and cost analysis.",
      category: "Business",
      icon: "📊",
      isNew: true,
      url: "https://talkandtool.com/profit-margin-calculator",
    },
    {
      id: 4,
      name: "Text to Html Converter",
      description: "Easily convert plain text to formatted HTML code.",
      category: "Development",
      icon: "📊",
      isNew: true,
      url: "https://talkandtool.com/text-to-html",
    },
  ];

  // Icon mapping for categories
  const categoryIcons = {
    Technology: "💻",
    Health: "🏥",
    Travel: "✈️",
    Education: "🎓",
    Sports: "⚽",
    Food: "🍕",
    News: "📰",
    Fashion: "👗",
    Tools: "🛠️",
    all: "🌐",
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || "📁";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToolClick = (toolId) => {
    toast.info(`Opening tool ${toolId}...`);
  };

  // Helper function to strip HTML tags and get plain text
  const stripHtmlTags = (html) => {
    if (!html) return "No description available...";

    // Remove HTML tags using regex
    const plainText = html.replace(/<[^>]*>/g, "");

    // Decode HTML entities
    const textArea = document.createElement("textarea");
    textArea.innerHTML = plainText;
    return textArea.value || "No description available...";
  };

  // Helper function to calculate read time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const plainText = stripHtmlTags(content);
    const words = plainText ? plainText.split(/\s+/).length : 0;
    return Math.ceil(words / wordsPerMinute);
  };

  // Helper function to get excerpt from content
  const getExcerpt = (content, maxLength = 120) => {
    if (!content) return "No excerpt available...";
    const plainText = stripHtmlTags(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Default image if featured_image is not available
  const getBlogImage = (blog) => {
    if (blog.featured_image) return blog.featured_image;

    // Fallback images based on category or random
    const fallbackImages = [
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return (
    <>
    <Helmet>
        {/* ===== BASIC SEO ===== */}
        <title>Talk and Tool - Free Online Tools & Tech Blogs</title>
        <meta
          name="description"
          content="Explore free online tools, coding utilities, and insightful blogs on Talk and Tool. Discover practical guides for developers and creators."
        />
        <meta
          name="keywords"
          content="free online tools, talkandtool, profit margin calculator, IP checker, coding blog, text to HTML"
        />
        <meta name="author" content="Talk and Tool" />

        {/* ===== OPEN GRAPH / SOCIAL SHARE ===== */}
        <meta property="og:title" content="Talk and Tool - Free Tools & Blogs" />
        <meta
          property="og:description"
          content="Empowering developers and creators with practical tools and tech blogs."
        />
        <meta property="og:image" content="https://talkandtool.com/logo.png" />
        <meta property="og:url" content="https://talkandtool.com/" />
        <meta property="og:type" content="website" />

        {/* ===== TWITTER CARD ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talk and Tool" />
        <meta
          name="twitter:description"
          content="Free online tools and technology blogs for creators and developers."
        />
        <meta name="twitter:image" content="https://talkandtool.com/logo.png" />

        {/* ===== CANONICAL URL ===== */}
        <link rel="canonical" href="https://talkandtool.com/" />

        {/* ===== PREFETCH / PRELOAD ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          as="image"
          href="https://talkandtool.com/assets/hero-banner.webp"
        />
        <link rel="prefetch" href="/blogs" />

        {/* ===== STRUCTURED DATA ===== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Talk and Tool",
            "url": "https://talkandtool.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://talkandtool.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Talk and Tool
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover insightful blogs and powerful tools for developers,
            designers, and tech enthusiasts. Your ultimate resource for staying
            ahead in the tech world.
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Browse by Category
          </h2>

          {categoriesLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg">
                No categories available
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* All Topics Button */}
              <button
                onClick={() => setActiveCategory("all")}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                    : "bg-white text-gray-700 shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-semibold">All Topics</div>
                <div
                  className={`text-sm mt-1 ${
                    activeCategory === "all" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {categories.reduce(
                    (total, cat) => total + cat.article_count,
                    0
                  )}{" "}
                  articles
                </div>
              </button>

              {/* API Categories */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id.toString())}
                  className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id.toString()
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl"
                      : "bg-white text-gray-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="font-semibold">{category.name}</div>
                  <div
                    className={`text-sm mt-1 ${
                      activeCategory === category.id.toString()
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {category.article_count} articles
                  </div>
                </button>
              ))}
            </div>
          )}
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          ) : featuredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                No featured blogs available
              </div>
              <p className="text-gray-400 mt-2">
                Check back later for new posts
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Link
                  to={`/blogs/article/${blog.slug}`}
                  key={blog.slug}
                  className="block"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer">
                    <div className="relative">
                      <img
                      loading="lazy"
                        src={getBlogImage(blog)}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {getExcerpt(blog.content || blog.excerpt)}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <FiClock />
                            <span>
                              {calculateReadTime(blog.content)} min read
                            </span>
                          </span>
                        </div>
                        <span>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
                onClick={() => (window.location.href = tool.url)}
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
                  <span className="text-yellow-500 font-semibold">
                    ⭐ {tool.rating}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Got a Question in Mind?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don’t wait—ask anything and get expert answers from the Talk & Tool
            community. Whether it’s coding, design, or business, we’ve got you covered.
          </p>
          <Link
            to="/ask-anything"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Ask a Question</span>
            <FiArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore More?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers and designers who are already using
            Talk and Tool to enhance their skills and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about-us">
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}