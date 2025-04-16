import LegalHeader from "../../components/LegalHeader";


export default function PrivacyPolicy() {
  return (
    <>
      <LegalHeader />

      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-300">Privacy Policy</h1>

          <p className="mb-4 text-gray-300">
            At <strong>Timeless Journal</strong>, we value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">1. Information We Collect</h2>
          <p className="text-gray-400 mb-2">
            When you use Timeless Journal, we collect:
          </p>
          <ul className="list-disc ml-6 mb-4 text-gray-400">
            <li>Your email and password via Firebase Authentication</li>
            <li>Uploaded photos, dates, and locations you provide</li>
            <li>AI-generated captions and your personal preferences (writing style, genre, word count)</li>
            <li>Basic usage activity (e.g. number of captions created)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">2. How We Use Your Data</h2>
          <p className="text-gray-400 mb-2">
            We use your data to:
          </p>
          <ul className="list-disc ml-6 mb-4 text-gray-400">
            <li>Generate AI-powered journal entries</li>
            <li>Personalize your experience based on preferences</li>
            <li>Provide support and maintain your account</li>
            <li>Track free usage and subscription eligibility</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">3. Data Storage & Security</h2>
          <p className="text-gray-400 mb-4">
            Your data is stored securely via Firebase and Google Cloud infrastructure. We use encryption and authenticated access to protect your information.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">4. AI & Third-Party Services</h2>
          <p className="text-gray-400 mb-4">
            Caption generation is powered by external AI APIs, including OpenAI and Hugging Face. Your uploaded images are temporarily shared with these services for analysis but are not stored or reused by them.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">5. Data Retention</h2>
          <p className="text-gray-400 mb-4">
            Your journal entries and account data remain available as long as your account is active. You may request deletion of your account and associated data at any time.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">6. Your Rights</h2>
          <p className="text-gray-400 mb-2">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mb-4 text-gray-400">
            <li>Access your stored data</li>
            <li>Correct or update your preferences</li>
            <li>Request deletion of your data</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">7. Cookies & Tracking</h2>
          <p className="text-gray-400 mb-4">
            We do not use cookies or third-party analytics on the current version of Timeless Journal.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">8. Changes to This Policy</h2>
          <p className="text-gray-400 mb-4">
            We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the app or via email.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">9. Contact</h2>
          <p className="text-gray-400">
            For questions or privacy concerns, please contact us at: <em>your.agent.in.the.usa@gmail.com</em>
          </p>
        </div>
      </div>
    </>
  );
}
