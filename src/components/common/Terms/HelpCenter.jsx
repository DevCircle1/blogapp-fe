import { useState } from "react";

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFaq, setOpenFaq] = useState(null);

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
            'Yes, our platform allows you to schedule posts. After writing your content,  admin will review your blog and then post it laterand inform you.',
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
      ],
    },
  ];

  const popularArticles = [
    {
      title: "Getting Started with Blog Writing",
      category: "Blogs",
      // views: "1.2k",
    },
    {
      title: "Understanding IP Addresses",
      category: "Tools",
      // views: "980",
    },
    {
      title: "Optimizing Images for Blog Posts",
      category: "Blogs",
      // views: "845",
    },
    {
      title: "Troubleshooting Tool Issues",
      category: "Tools",
      // views: "721",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, guides, and troubleshooting tips
            for all our features.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Popular Help Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.category}
                    </p>
                  </div>
                  {/* <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {article.views} views
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories & FAQs */}
        <div className="flex flex-col lg:flex-row gap-8">
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
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
                        activeCategory === category.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.title}</span>
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
                <h2 className="text-2xl font-semibold text-gray-800">
                  {categories.find((cat) => cat.id === activeCategory)?.title}
                </h2>
              </div>

              <div className="space-y-4">
                {categories
                  .find((cat) => cat.id === activeCategory)
                  ?.questions.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="font-medium text-gray-800">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform ${
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
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{faq.answer}</p>
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
                  <a
                    href="/contact-us"
                    className="bg-white text-blue-700 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Contact Us
                  </a>
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
