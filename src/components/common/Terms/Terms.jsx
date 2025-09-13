import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Terms and Conditions</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <p className="text-sm text-gray-500 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              Welcome to DevCircle! By accessing or using our website located at devcircle.com (the "Site"), 
              you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, 
              please do not use our Site.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Description of Services</h2>
            <p className="mb-4">
              DevCircle provides users with access to:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Educational blog posts on various technology topics</li>
              <li className="mb-2">Interactive tools for developers</li>
              <li className="mb-2">Community features allowing user interaction</li>
              <li>Other resources related to software development</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of our Site, you may be required to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Maintaining the confidentiality of your account credentials</li>
              <li className="mb-2">All activities that occur under your account</li>
              <li>Ensuring that your account information is accurate and up-to-date</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your account if any information provided during registration 
              proves to be inaccurate, false, or misleading.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Intellectual Property Rights</h2>
            <p className="mb-4">
              All content on this Site, including but not limited to text, graphics, logos, images, tutorials, code samples, 
              and tools, is the property of DevCircle or its content suppliers and is protected by international copyright laws.
            </p>
            <p className="mb-4">
              You may access and use the content for your personal, non-commercial use. However, you may not:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Modify, copy, or redistribute content for commercial purposes</li>
              <li className="mb-2">Remove any copyright or proprietary notices</li>
              <li>Use our content to create a competing service</li>
            </ul>
            <p>
              Code samples provided on our Site are licensed under the MIT License unless otherwise specified.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. User-Generated Content</h2>
            <p className="mb-4">
              Users may have the opportunity to post comments, share code, or contribute other content. By submitting 
              content to our Site, you grant DevCircle a perpetual, royalty-free, worldwide license to use, modify, 
              and display your contribution.
            </p>
            <p className="mb-4">
              You agree not to post content that:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">Is illegal, offensive, or defamatory</li>
              <li className="mb-2">Infringes on any third party's intellectual property rights</li>
              <li className="mb-2">Contains malware, viruses, or other harmful code</li>
              <li>Is spam or unauthorized promotional material</li>
            </ul>
            <p>
              We reserve the right to remove any user-generated content that violates these Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The content and tools on DevCircle are provided "as is" without warranties of any kind, either express or implied. 
              While we strive to provide accurate and up-to-date information, we do not guarantee the completeness, reliability, 
              or accuracy of any content on our Site.
            </p>
            <p>
              Code samples and tools are provided for educational purposes only. We are not responsible for any damages 
              resulting from the use of code or tools from our Site in production environments.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p>
              DevCircle and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages 
              resulting from the use or inability to use our Site or services, even if we have been advised of the possibility 
              of such damages.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites or services that are not owned or controlled by DevCircle. 
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any 
              third-party websites or services. You acknowledge and agree that DevCircle shall not be responsible for any 
              damage or loss caused by use of such third-party resources.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by 
              posting the new Terms on our Site and updating the "Last updated" date. Your continued use of the Site 
              after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where 
              DevCircle is established, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: info@devcircle.com<br />
            </p>
          </section>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This is a simplified terms and conditions agreement. We recommend consulting 
            with a legal professional to ensure your terms and conditions comply with all applicable laws and 
            regulations for your specific jurisdiction and business model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;