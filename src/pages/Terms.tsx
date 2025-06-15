
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: December 15, 2024</p>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Treqy ("Service"), you accept and agree to be bound by the terms and provision of this agreement. Treqy is provided by Treqy Inc. ("Company", "we", "us", "our").
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Treqy is a material management platform designed for design studios, providing:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Material database management and organization</li>
                <li>Project tracking and material allocation</li>
                <li>Manufacturer and supplier information management</li>
                <li>Client project coordination tools</li>
                <li>Cost tracking and compliance insights</li>
                <li>Data onboarding and migration services</li>
                <li>Team collaboration features</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription Plans and Billing</h2>
              <p className="text-gray-700 mb-4">
                Treqy offers various subscription plans with different material limits and features:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All subscriptions are billed via invoice with bank transfer payment only</li>
                <li>Subscription fees are charged monthly in advance</li>
                <li>Extra materials beyond your plan limit are charged at $1.50 per material per month</li>
                <li>Onboarding services are available as one-time fees</li>
                <li>Enterprise plans are available for studios with 1,500+ materials</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any laws or regulations</li>
                <li>Upload malicious code or attempt to compromise system security</li>
                <li>Share your account credentials with unauthorized parties</li>
                <li>Attempt to reverse engineer or copy the Service</li>
                <li>Use the Service for any unlawful or prohibited purpose</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Treqy Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Treqy is provided as an insights tool and does not replace official cost or compliance consultants. We are not liable for business decisions made based on information provided by the Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: <a href="mailto:hello@treqy.com" className="text-coral hover:text-coral-600">hello@treqy.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
