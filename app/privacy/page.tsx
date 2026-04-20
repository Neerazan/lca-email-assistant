import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Email Assistant",
  description: "Privacy Policy for AI Email Assistant.",
};

export default function PrivacyPage() {
  const lastUpdated = "April 9, 2026";

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
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
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
              AI Email Assistant (&quot;the Service&quot;) helps you work with your
              Gmail inbox using AI. This Privacy Policy explains what data is
              collected, how it is used, and your rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              When you use the Service, we access the following information
              through Google OAuth:
            </p>

            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-indigo-500/30">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Profile Information
                </h3>
                <p className="text-slate-400">
                  Your name, email address, and profile picture from your Google
                  account. This is used solely to display your identity in the
                  interface.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-indigo-500/30">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Email Data
                </h3>
                <p className="text-slate-400">
                  Email content (subject, body, sender, recipients) is accessed
                  on-demand when you ask the AI to read, summarize, or search
                  your inbox. Email data is processed in real-time and is{" "}
                  <strong className="text-slate-300">
                    not permanently stored
                  </strong>{" "}
                  on our servers.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-indigo-500/30">
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Chat History
                </h3>
                <p className="text-slate-400">
                  Your chat messages with the AI assistant may be stored
                  temporarily for session continuity. Chat history does not
                  contain raw email content.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
              <li>
                To respond to your chat requests (summarize emails, search,
                draft replies).
              </li>
              <li>To display your profile information in the interface.</li>
              <li>
                To send emails on your behalf — only when you explicitly approve
                a draft.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-slate-200">not</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2 mt-2">
              <li>Sell, share, or transfer your data to third parties.</li>
              <li>Use your data for advertising or marketing purposes.</li>
              <li>
                Train AI models on your personal email content.
              </li>
              <li>
                Store your emails permanently on our servers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Data Security
            </h2>
            <p>
              Authentication tokens are handled securely: refresh tokens are stored
              in encrypted, HttpOnly cookies and are never exposed to client-side
              JavaScript. All communication between the frontend and backend uses
              HTTPS in production. However, as a demonstration project, the Service
              may not implement all enterprise-grade security measures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Third-Party Services
            </h2>
            <p className="mb-3">The Service integrates with:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
              <li>
                <strong className="text-slate-300">Google APIs</strong> — for
                authentication and Gmail access. Google&apos;s own{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Privacy Policy
                </a>{" "}
                applies to their services.
              </li>
              <li>
                <strong className="text-slate-300">AI Language Models</strong>{" "}
                — your chat messages are sent to AI model providers for
                processing. No personally identifiable email content is sent
                beyond what is necessary to fulfill your request.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Google API Services User Data Policy
            </h2>
            <p>
              The Service&apos;s use and transfer of information received from
              Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Data Retention &amp; Deletion
            </h2>
            <p className="mb-3">
              Email content is processed in real-time and discarded after the
              response is generated. Chat session data may be retained for the
              duration of your session.
            </p>
            <p>
              To delete all your data and revoke access, visit your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Google Account permissions page
              </a>{" "}
              and remove &quot;AI Email Assistant&quot; from the list of
              connected apps.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2 mt-2">
              <li>Revoke access to your Google account at any time.</li>
              <li>Request deletion of any stored chat data.</li>
              <li>
                Review what data the Service has access to via your Google
                Account settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              9. Changes to This Policy
            </h2>
            <p>
              This Privacy Policy may be updated from time to time. Continued
              use of the Service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about this Privacy Policy or want to request
              data deletion, please reach out via the project&apos;s GitHub
              repository.
            </p>
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
