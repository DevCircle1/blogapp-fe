/**
 * Plain-data copy for HomePage.jsx, kept in a .js (not .jsx) file so
 * scripts/routes.mjs — a plain Node script with no JSX transform — can
 * import it too, and reuse this exact list in the prerendered homepage
 * snapshot instead of maintaining a second copy that can drift.
 */
export const POPULAR_TOOLS = [
  {
    id: 1,
    name: "Word Counter",
    description: "Count words, characters, sentences, and reading time as you type.",
    category: "Writing",
    icon: "✍️",
    path: "/tools/word-counter",
  },
  {
    id: 2,
    name: "Percentage Calculator",
    description: "Percentages, percentage change, and what share one number is of another.",
    category: "Maths",
    icon: "📊",
    path: "/tools/percentage-calculator",
  },
  {
    id: 3,
    name: "Loan & EMI Calculator",
    description: "Monthly repayments, total interest, and the real cost of a longer term.",
    category: "Finance",
    icon: "💰",
    path: "/tools/loan-calculator",
  },
  {
    id: 4,
    name: "BMI Calculator",
    description: "Body mass index in metric or imperial, with the healthy range for your height.",
    category: "Health",
    icon: "⚕️",
    path: "/tools/bmi-calculator",
  },
  {
    id: 5,
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON with clear syntax error messages.",
    category: "Developer",
    icon: "🧩",
    path: "/tools/json-studio",
  },
  {
    id: 6,
    name: "Password Generator",
    description: "Strong random passwords built with your browser’s cryptographic source.",
    category: "Security",
    icon: "🔐",
    path: "/tools/password-generator",
  },
  {
    id: 7,
    name: "Unit Converter",
    description: "Length, weight, temperature, area, volume, speed, time, and data.",
    category: "Converters",
    icon: "↔️",
    path: "/tools/unit-converter",
  },
  {
    id: 8,
    name: "What Is My IP?",
    description: "Your public IP address, approximate location, and internet provider.",
    category: "Network",
    icon: "🌐",
    path: "/check-ip",
  },
];
