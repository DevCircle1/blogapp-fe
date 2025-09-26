import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    {
      id: "general",
      title: "General Help",
      icon: "📝",
      questions: [
        {
          question: "How do I create an account on your website?",
          answer:
            'To create an account, click on the "Register" button in the top right corner of the page. Fill in your details including email address and password, then verify your email to complete registration.',
        },
        {
          question: "Is there a mobile app available?",
          answer:
            "Currently we don't have a dedicated mobile app, but our website is fully responsive and works perfectly on mobile browsers.",
        },
        {
          question: "How do I search for specific content?",
          answer:
            "Use the search bar at the top of any page to find blogs, tools, or specific topics. You can filter results by category, date, or popularity.",
        },
        {
          question: "Is the platform free to use?",
          answer:
            "Yes! All our basic features including reading blogs and using tools are completely free. We may introduce premium features in the future with clear indications.",
        },
      ],
    },
    {
      id: "blogs",
      title: "Blogs",
      icon: "✍️",
      questions: [
        {
          question: "How can I write a blog post?",
          answer:
            'After logging in, navigate to your Home screen and click "Write Blogs". You can use our rich text editor to format your content, add images, and preview before publishing.',
        },
        {
          question: "Can I schedule blog posts for later?",
          answer:
            'Yes, our platform allows you to schedule posts. After writing your content, admin will review your blog and then post it later and inform you.',
        },
        {
          question: "How do I format my blog content?",
          answer:
            "Our editor supports markdown and rich text formatting. You can add headings, lists, code blocks, images, and links using the toolbar or markdown syntax.",
        },
        {
          question: "Can I edit my published blog posts?",
          answer:
            "Yes, you can edit your published posts at any time. Go to 'My Blogs' section, find the post you want to edit, and click the edit button. Changes will be reviewed before updating.",
        },
      ],
    },
    {
      id: "tools",
      title: "Tools",
      icon: "🛠️",
      questions: [
        {
          question: "How does the IP check tool work?",
          answer:
            "Our IP check tool automatically detects and displays your public IP address when you visit the tool page. It also provides information about your approximate location and internet service provider.",
        },
        {
          question: "What information does the screen resolution tool show?",
          answer:
            "The screen resolution tool displays your current screen dimensions, color depth, and pixel ratio. This is helpful for developers designing responsive websites.",
        },
        {
          question: "Are there any usage limits for the tools?",
          answer:
            "Most tools have generous usage limits for free users. If you encounter any limits, you'll see a notification with information about when the limit resets.",
        },
        {
          question: "Can I suggest new tools to be added?",
          answer:
            "Absolutely! We welcome tool suggestions. Please use the Contact Us form to share your ideas for new tools that would be helpful for our community.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Billing",
      icon: "👤",
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. The link will expire after 24 hours for security reasons.',
        },
        {
          question: "Is my account information private?",
          answer:
            "Yes. We take privacy seriously — your personal details are protected and never shared with third parties without your consent. You can also review and adjust your privacy settings anytime in your account.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "You can delete your account from the Account Settings page. Please note this action is permanent and will remove all your data including blog posts and preferences.",
        },
        {
          question: "Can I change my username?",
          answer:
            "Yes, you can change your username once every 30 days from the Account Settings page. Your new username must be unique and follow our community guidelines.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Issues",
      icon: "🔧",
      questions: [
        {
          question: "What should I do if a page isn't loading properly?",
          answer:
            "Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team with details about the problem.",
        },
        {
          question: "Why are images not displaying in my blog?",
          answer:
            "This could be due to file size limits (we support up to 5MB per image) or format issues (we support JPG, PNG, GIF). Try compressing your images or using different formats.",
        },
        {
          question: "How do I enable cookies for the best experience?",
          answer:
            "Our platform uses cookies for authentication and preferences. Enable cookies in your browser settings for full functionality. We don't use tracking cookies without consent.",
        },
      ],
    },
  ];

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
                    categories.forEach((category, catIndex) => {
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
                          <div className="mt-3 flex space-x-2">
                            <span className="text-xs text-gray-500">Was this helpful?</span>
                            <button className="text-xs text-blue-600 hover:text-blue-800">Yes</button>
                            <button className="text-xs text-gray-600 hover:text-gray-800">No</button>
                          </div>
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
                  <button className="border border-white py-2 px-6 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors">
                    Live Chat
                  </button>
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