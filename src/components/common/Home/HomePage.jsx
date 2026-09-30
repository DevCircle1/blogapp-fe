import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Seo from "../Seo.jsx";
import { websiteSchema, organizationSchema } from "../../../seo/siteMeta.js";
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
import { POPULAR_TOOLS } from "./popularTools.js";
import { useSeed } from "../../../context/seed.js";
import { homeView } from "../../../lib/blog/views.js";
export default function HomePage() {
  // The prerendered page carries these sections' data (src/context/seed.js),
  // so they render filled in at once; the fetches below refresh them.
  const seed = useSeed("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredBlogs, setFeaturedBlogs] = useState(seed?.featured ?? []);
  const [publishedPostCount, setPublishedPostCount] = useState(seed?.postCount ?? 0);
  const [categories, setCategories] = useState(seed?.categories ?? []);
  const [isLoading, setIsLoading] = useState(!seed);
  const [categoriesLoading, setCategoriesLoading] = useState(!seed);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await publicRequest.get("/posts/");
        const view = homeView(Array.isArray(response.data) ? response.data : [], []);
        setPublishedPostCount(view.postCount);
        setFeaturedBlogs(view.featured);
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
        const response = await publicRequest.get("/top-categories/");
        setCategories(homeView([], response.data).categories);
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

  // Internal paths rather than absolute URLs: these render as real anchors that
  // crawlers can follow, and navigation stays inside the SPA instead of forcing
  // a full page reload.
  const popularTools = POPULAR_TOOLS;

  const getArticleCount = (category) => {
    const count = Number(
      category?.total_articles ??
      category?.article_count ??
      category?.articles_count ??
      category?.post_count ??
      (Array.isArray(category?.articles) ? category.articles.length : undefined) ??
      0
    );

    return Number.isFinite(count) && count >= 0 ? count : 0;
  };

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

  return (
    <>
    <Seo
        title="Talk & Tool — 70+ Free Online Tools, Calculators & Guides"
        description="Free online calculators, unit converters, text utilities, and developer tools that run entirely in your browser, plus practical guides. No sign-up, no downloads."
        path="/"
        schemas={[websiteSchema, organizationSchema]}
      >
        {/* The ad script is render-blocking on first paint; warming the
            connection early shaves the TLS handshake off that critical path. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </Seo>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* The h1 leads with what the page is for rather than the brand name.
              "Talk and Tool" ranks for nothing; "free online tools" is the term
              people actually search. */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Free online tools and calculators
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Over 70 calculators, converters, text utilities, and developer tools that run entirely
            in your browser. No sign-up, no downloads, and nothing you type is uploaded.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/tools"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <FiCode className="mr-2" />
              <span>Browse all tools</span>
            </Link>
            <Link
              to="/blogs"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Read the blog</span>
              <FiArrowRight className="ml-2" />
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
            // Sized like the real grid below (same columns, same button
            // height) rather than a small spinner box, so the categories
            // popping in doesn't push the rest of the page — and the footer —
            // down once the request resolves.
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" aria-label="Loading categories">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-6 rounded-xl bg-white shadow-lg animate-pulse">
                  <div className="h-8 w-8 mb-2 rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 mt-2 rounded bg-gray-100"></div>
                </div>
              ))}
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
                  {publishedPostCount} {publishedPostCount === 1 ? "article" : "articles"}
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
                    {getArticleCount(category)} {getArticleCount(category) === 1 ? "article" : "articles"}
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
            // Same 3-column card grid the real content renders into, so the
            // section doesn't grow taller once the blogs arrive.
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Loading blog posts">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-5 w-5/6 rounded bg-gray-200 mb-3"></div>
                    <div className="h-4 w-full rounded bg-gray-100 mb-2"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-100 mb-4"></div>
                    <div className="h-3 w-1/3 rounded bg-gray-100"></div>
                  </div>
                </div>
              ))}
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
                        width={400}
                        height={192}
                        src={blog.image}
                        alt={`Blog article — ${blog.title}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <FiClock />
                            <span>
                              {blog.readMinutes} min read
                            </span>
                          </span>
                        </div>
                        <span>
                          {blog.date}
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
              <Link
                key={tool.id}
                to={tool.path}
                className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 group"
              >
                <div className="text-3xl mb-4">{tool.icon}</div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tool.category}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Browse all 70+ free tools
            </Link>
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
            The tools are free and need no sign-up, and most run entirely in
            your browser. Our guides explain the maths and methods behind them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blogs">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300">
                Read the Guides
              </button>
            </Link>
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
