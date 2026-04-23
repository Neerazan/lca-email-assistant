import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Email Assistant",
  description: "Privacy Policy for AI Email Assistant.",
};

export default function PrivacyPage() {
  const lastUpdated = "April 23, 2026";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 relative overflow-hidden">
      {/* Subtle background orb */}
      <div className="orb orb-2 bottom-[-10%] right-[-15%] opacity-10" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto px-4 sm:px-6 py-5 border-b border-white/6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
        <Link
          href="/terms"
          className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
        >
          ← Terms of Service
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
          </header>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                1. Introduction
              </h2>
              <p>
                AI Email Assistant (&quot;the Service&quot;) is a productivity tool that helps you manage your
                Gmail inbox using artificial intelligence. We are committed to protecting your privacy and being transparent about how we handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Information We Access and Collect
              </h2>
              <p className="mb-3">
                When you use the Service, we access the following information
                through Google OAuth 2.0:
              </p>

              <div className="space-y-4">
                <div className="pl-4 border-l-2 border-indigo-500/30">
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">
                    Google Profile Information
                  </h3>
                  <p className="text-slate-400">
                    Your name, email address, and profile picture. This is used to create your account and personalize your experience.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-indigo-500/30">
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">
                    Gmail Data (Restricted Scopes)
                  </h3>
                  <p className="text-slate-400">
                    We access your email content (subject lines, body text, sender/recipient details) only when you explicitly ask the AI to perform a task. This data is processed in real-time to fulfill your request and is <strong className="text-slate-300">not stored permanently</strong> on our servers beyond the active chat session.
                  </p>
                </div>

                <div className="pl-4 border-l-2 border-indigo-500/30">
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">
                    Interaction History
                  </h3>
                  <p className="text-slate-400">
                    We store your chat history with the assistant to provide context for follow-up questions. You can delete your chat history at any time.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. How We Use Your Data
              </h2>
              <p className="mb-3">We use the information we collect solely for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
                <li>To provide the core functionality of the Service (summarizing, searching, and drafting emails).</li>
                <li>To improve the quality of AI responses within your specific session.</li>
                <li>To send emails on your behalf, but only after you have explicitly reviewed and approved the draft.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-5 rounded-2xl border border-indigo-500/20">
              <h2 className="text-lg font-semibold text-white mb-3">
                4. Google API Limited Use Disclosure
              </h2>
              <p className="mb-3">
                AI Email Assistant&apos;s use and transfer of information received from Google APIs to any other app will adhere to <Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-indigo-400 hover:underline">Google API Services User Data Policy</Link>, including the Limited Use requirements.
              </p>
              <p className="text-slate-400 font-medium">Specifically:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2 mt-2">
                <li>We do <strong className="text-white">not</strong> use your Gmail data to serve advertisements.</li>
                <li>We do <strong className="text-white">not</strong> sell or rent your Gmail data to third parties.</li>
                <li>We do <strong className="text-white">not</strong> use your Gmail data to train non-personalized AI or machine learning models.</li>
                <li>Humans are <strong className="text-white">not</strong> permitted to read your Gmail data unless you provide explicit consent for a specific support request or if required for security/legal compliance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Data Sharing
              </h2>
              <p>
                We only share your data with AI service providers (such as OpenAI or Anthropic) to the extent necessary to process your specific requests. These providers are contractually obligated to protect your data and are not permitted to use it for their own purposes or to train their foundation models.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Security
              </h2>
              <p>
                We use industry-standard encryption (SSL/TLS) for data in transit. OAuth tokens are stored securely using encryption and are never exposed to the client-side. Access to our database is strictly controlled and monitored.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Data Retention and Deletion
              </h2>
              <p>
                You can revoke access to your Google account at any time via the <Link href="https://myaccount.google.com/permissions" target="_blank" className="text-indigo-400 hover:underline">Google Security Settings</Link>. Upon revocation, we immediately lose access to your Gmail data. You can also request the deletion of your account and chat history by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                8. Contact Us
              </h2>
              <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at <span className="text-white font-medium">[Your Support Email]</span> or via our GitHub repository.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
