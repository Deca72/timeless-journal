export default function CancelPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">You’ve returned from Stripe</h1>
          <p className="mt-4">Feel free to continue managing your account.</p>
          <a href="/profile" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
            Go to Profile
          </a>
        </div>
      </div>
    );
  }
  