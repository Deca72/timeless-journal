import LegalHeader from "../../components/LegalHeader";

export default function TermsOfService() {
  return (
    <>
      <LegalHeader />
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-300">Terms of Service</h1>

          <p className="mb-4 text-gray-300">
            Welcome to <strong>Timeless Journal</strong>. These Terms of Service ("Terms") govern your access to and use of the Timeless Journal website and app ("Service"), which provides AI-generated journal-style captions based on user-uploaded photos, dates, and locations.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">1. Account Creation</h2>
          <p className="text-gray-400 mb-4">
            To use Timeless Journal, you must create an account using a valid email and password. You are responsible for maintaining the security of your account and for any activity under your credentials.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">2. Free and Paid Use</h2>
          <p className="text-gray-400 mb-4">
            New users are entitled to generate captions for up to <strong>5 photos for free</strong>. After this limit is reached, continued access requires a paid subscription. Details of subscription pricing and plans will be available within the app.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">3. Acceptable Use</h2>
          <p className="text-gray-400 mb-2">
            You agree to use the Service only for lawful and personal purposes. You may not upload images that contain:
          </p>
          <ul className="list-disc ml-6 mb-4 text-gray-400">
            <li>Explicit, violent, or hateful content</li>
            <li>Images of others without their consent</li>
            <li>Illegal or misleading materials</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">4. Generated Content</h2>
          <p className="text-gray-400 mb-4">
            Our AI generates captions based on your photos and input. While we strive for relevance and accuracy, the results may vary and are not guaranteed to be factually correct or free from subjective interpretation.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">5. Data and Privacy</h2>
          <p className="text-gray-400 mb-4">
            We respect your privacy. Please refer to our{" "}
            <a href="/legal/privacy" className="text-blue-400 underline">Privacy Policy</a>{" "}
            for details on how we store and protect your data, including uploaded photos and generated text.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">6. Modifications</h2>
          <p className="text-gray-400 mb-4">
            We may update these Terms from time to time. Continued use of the Service after changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 text-blue-200">7. Contact</h2>
          <p className="text-gray-400">
            If you have any questions or concerns, please contact us at: <em>your.agent.in.the.usa@gmail.com</em>
          </p>
        </div>
      </div>
    </>
  );
}
