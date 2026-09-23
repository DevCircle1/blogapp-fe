import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo from '../Seo.jsx';
import { HELP_CENTER_CATEGORIES } from './helpCenterContent.js';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const categories = HELP_CENTER_CATEGORIES;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const popularArticles = [
    {
      title: "Getting Started with Blog Writing",
      category: "blogs",
      description: "Learn how to create your first blog post",
      icon: "📖",
      action: () => {
        setActiveCategory("blogs");
        setOpenFaq(0);
        scrollToFAQs();
      }
    },
    {
      title: "Understanding IP Addresses",
      category: "tools",
      description: "Complete guide to IP checking tool",
      icon: "🌐",
      action: () => {
        setActiveCategory("tools");
        setOpenFaq(0);
        scrollToFAQs();
      }
    },
    {
      title: "Optimizing Images for Blog Posts",
      category: "blogs",
      description: "Best practices for image optimization",
      icon: "🖼️",
      action: () => {
        setActiveCategory("blogs");
        setOpenFaq(2);
        scrollToFAQs();
      }
    },
    {
      title: "Troubleshooting Login Issues",
      category: "account",
      description: "Fix common account access problems",
      icon: "🔐",
      action: () => {
        setActiveCategory("account");
        setOpenFaq(0);
        scrollToFAQs();
      }
    },
    {
      title: "Mobile Browser Compatibility",
      category: "technical",
      description: "Optimize your mobile experience",
      icon: "📱",
      action: () => {
        setActiveCategory("technical");
        setOpenFaq(0);
        scrollToFAQs();
      }
    },
    {
      title: "Privacy and Data Security",
      category: "account",
      description: "How we protect your information",
      icon: "🛡️",
      action: () => {
        setActiveCategory("account");
        setOpenFaq(1);
        scrollToFAQs();
      }
    },
  ];

  const scrollToFAQs = () => {
    setTimeout(() => {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePopularArticleClick = (article) => {
    article.action();
  };

  const getCategoryTitle = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <Seo title={"Help Center"} description={"Answers to common questions about using Talk & Tool: the free online tools, publishing articles, accounts, and getting in touch."} path={"/help-center"} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, guides, and troubleshooting tips
            for all our features.
          </p>
          
          {/* Quick Search */}
          <div className="max-w-md mx-auto mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = e.target.value.toLowerCase();
                    // Simple search implementation
                    categories.forEach((category) => {
                      category.questions.forEach((question, questIndex) => {
                        if (question.question.toLowerCase().includes(searchTerm) || 
                            question.answer.toLowerCase().includes(searchTerm)) {
                          setActiveCategory(category.id);
                          setOpenFaq(questIndex);
                          scrollToFAQs();
                        }
                      });
                    });
                  }
                }}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🔥 Popular Help Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => handlePopularArticleClick(article)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-md group"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {article.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {getCategoryTitle(article.category)}
                      </span>
                      <span className="text-blue-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Read → 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories & FAQs */}
        <div id="faq-section" className="flex flex-col lg:flex-row gap-8">
          {/* Category Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Help Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(category.id);
                        setOpenFaq(0);
                      }}
                      className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                        activeCategory === category.id
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.title}</span>
                      <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {category.questions.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">
                  {categories.find((cat) => cat.id === activeCategory)?.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {categories.find((cat) => cat.id === activeCategory)?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {categories.find((cat) => cat.id === activeCategory)?.questions.length} articles available
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {categories
                  .find((cat) => cat.id === activeCategory)
                  ?.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      <button
                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors duration-200"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="font-medium text-gray-800 pr-4">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openFaq === index && (
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          {/* <div className="mt-3 flex space-x-2">
                            <span className="text-xs text-gray-500">Was this helpful?</span>
                            <button className="text-xs text-blue-600 hover:text-blue-800">Yes</button>
                            <button className="text-xs text-gray-600 hover:text-gray-800">No</button>
                          </div> */}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 mt-8 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2">
                    Still need help?
                  </h3>
                  <p className="opacity-90">
                    Can't find what you're looking for? Our support team is here
                    to help.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/contact-us')}
                    className="bg-white text-blue-700 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Contact Us
                  </button>
                  {/* <button className="border border-white py-2 px-6 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors">
                    Live Chat
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
