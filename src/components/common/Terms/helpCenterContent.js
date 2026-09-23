/**
 * Plain-data copy for HelpCenter.jsx, kept in a .js (not .jsx) file so
 * scripts/routes.mjs — a plain Node script with no JSX transform — can
 * import it too, and reuse this exact FAQ content in the prerendered
 * /help-center snapshot instead of maintaining a second copy that can drift.
 */
export const HELP_CENTER_CATEGORIES = [
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
