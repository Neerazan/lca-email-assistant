import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AI Email Assistant",
  description: "Terms of Service for AI Email Assistant.",
};

export default function TermsPage() {
  const lastUpdated = "April 23, 2026";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 relative overflow-hidden">
      {/* Subtle background orb */}
      <div className="orb orb-1 top-[-20%] left-[-15%] opacity-10" />

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
          href="/privacy"
          className="text-sm text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Privacy Policy →
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500">Last updated: {lastUpdated}</p>
          </header>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using AI Email Assistant (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Description of Service
              </h2>
              <p>
                AI Email Assistant is an AI-powered productivity tool that interacts with your Gmail inbox to help you read, search, summarize, and draft email replies. The Service uses large language models (LLMs) to process your natural language requests.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. Google Account Integration
              </h2>
              <p className="mb-3">
                To use the Service, you must sign in with your Google account and grant specific permissions (scopes) via OAuth 2.0.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
                <li><strong className="text-slate-300">Gmail Access:</strong> You grant the Service permission to read and manage your emails.</li>
                <li><strong className="text-slate-300">User Approval:</strong> The Service will NEVER send an email without your explicit approval of a drafted response.</li>
                <li><strong className="text-slate-300">Revocation:</strong> You can revoke access at any time via your Google Account security settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                4. User Responsibilities
              </h2>
              <p>
                You are responsible for all activity that occurs under your account. You agree not to use the Service for any unlawful or prohibited activities, including sending spam or malicious content. Because the Service uses AI, it may occasionally produce inaccurate information. You are responsible for reviewing all AI-generated drafts before sending them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Privacy and Data Use
              </h2>
              <p>
                Your use of the Service is also governed by our <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>. We comply with the Google API Services User Data Policy, including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                In no event shall the Service or its developers be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                8. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any changes by updating the &quot;Last updated&quot; date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                9. Contact
              </h2>
              <p>
                If you have any questions about these Terms, please contact us via our GitHub repository or at <span className="text-white font-medium">[Your Support Email]</span>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
