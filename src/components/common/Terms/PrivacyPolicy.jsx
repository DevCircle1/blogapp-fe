import { useState, useEffect } from 'react';
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let currentSection = 'introduction';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  const navigationItems = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'data-usage', title: 'Data Usage' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'user-rights', title: 'Your Rights' },
    { id: 'changes', title: 'Policy Changes' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="w-20 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Sections</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-3 ${
                          activeSection === item.id ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      ></span>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to our website. We are committed to protecting your privacy and ensuring
                  that your personal information is handled in a safe and responsible manner. This
                  Privacy Policy outlines how we collect, use, and protect your information when
                  you use our website and services.
                </p>
                <p className="text-gray-700">
                  Our website offers blog content and various tools including IP checking, screen
                  resolution detection, and other utilities. By using our website, you agree to
                  the collection and use of information in accordance with this policy.
                </p>
              </section>

              {/* Data Collection */}
              <section id="data-collection" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect several different types of information for various purposes to provide
                  and improve our services to you.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Personal Data</h3>
                  <p className="text-gray-700 mb-2">
                    While using our website, we may ask you to provide us with certain personally
                    identifiable information that can be used to contact or identify you.
                    Personally identifiable information may include, but is not limited to:
                  </p>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Cookies and usage data</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Usage Data</h3>
                  <p className="text-gray-700">
                    We may also collect information on how the website is accessed and used. This
                    usage data may include information such as your computer's Internet Protocol
                    address (e.g., IP address), browser type, browser version, the pages of our
                    website that you visit, the time and date of your visit, the time spent on
                    those pages, unique device identifiers, and other diagnostic data.
                  </p>
                </div>
              </section>

              {/* Data Usage */}
              <section id="data-usage" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the collected data for various purposes:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>To provide and maintain our website and services</li>
                  <li>To notify you about changes to our website or services</li>
                  <li>To allow you to participate in interactive features of our website when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our website</li>
                  <li>To monitor the usage of our website</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to track the activity on our
                  website and hold certain information.
                </p>
                <p className="text-gray-700 mb-4">
                  Cookies are files with a small amount of data which may include an anonymous
                  unique identifier. Cookies are sent to your browser from a website and stored
                  on your device. Other tracking technologies are also used such as beacons, tags,
                  and scripts to collect and track information and to improve and analyze our service.
                </p>
                <p className="text-gray-700">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie
                  is being sent. However, if you do not accept cookies, you may not be able to use
                  some portions of our website.
                </p>
              </section>

              {/* Third-Party Services */}
              <section id="third-party" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  We may employ third-party companies and individuals to facilitate our website
                  ("Service Providers"), to provide the website on our behalf, to perform
                  website-related services, or to assist us in analyzing how our website is used.
                </p>
                <p className="text-gray-700">
                  These third parties have access to your personal information only to perform
                  these tasks on our behalf and are obligated not to disclose or use it for any
                  other purpose.
                </p>
              </section>

              {/* Data Security */}
              <section id="data-security" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
                <p className="text-gray-700 mb-4">
                  The security of your data is important to us, but remember that no method of
                  transmission over the Internet or method of electronic storage is 100% secure.
                  While we strive to use commercially acceptable means to protect your personal
                  information, we cannot guarantee its absolute security.
                </p>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              {/* User Rights */}
              <section id="user-rights" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Data Protection Rights</h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have the following rights regarding your
                  personal data:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>The right to access, update or delete the information we have on you</li>
                  <li>The right of rectification to have your information corrected if it is inaccurate or incomplete</li>
                  <li>The right to object to our processing of your personal data</li>
                  <li>The right to restrict the processing of your personal information</li>
                  <li>The right to data portability to receive a copy of your personal data in a structured format</li>
                  <li>The right to withdraw consent where we have relied on your consent to process your personal information</li>
                </ul>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the
                  "Last updated" date at the top of this Privacy Policy.
                </p>
                <p className="text-gray-700">
                  You are advised to review this Privacy Policy periodically for any changes.
                  Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>

              {/* Contact */}
              <section id="contact">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email: info.devcircle@gmail.com</span>
                    </li>
                    {/* <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </li> */}
                  </ul>
                </div>
              </section>
            </div>

            {/* Consent Banner */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-gray-800 mb-2">Your Privacy Matters</h3>
                <p className="text-gray-600 text-sm">
                  We value your privacy and are committed to protecting your personal information.
                </p>
              </div>
              {/* <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                Accept Privacy Policy
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;