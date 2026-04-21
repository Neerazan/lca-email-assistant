import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AI Email Assistant",
  description: "Terms of Service for AI Email Assistant.",
};

export default function TermsPage() {
  const lastUpdated = "April 9, 2026";

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
                1. About This Project
              </h2>
              <p>
                AI Email Assistant (&quot;the Service&quot;) is a{" "}
                Gmail assistant powered by LangGraph to help with reading,
                summarizing, and drafting email replies. By using this Service,
                you agree to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Google Account Access
              </h2>
              <p className="mb-3">
                The Service uses Google OAuth 2.0 to access your Google account.
                When you sign in, you grant the Service the following permissions:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
                <li>
                  <strong className="text-slate-300">Read your emails</strong>{" "}
                  (Gmail readonly scope) — to summarize and search your inbox.
                </li>
                <li>
                  <strong className="text-slate-300">Send emails</strong>{" "}
                  (Gmail send scope) — to send emails on your behalf, only when
                  you explicitly approve a draft.
                </li>
                <li>
                  <strong className="text-slate-300">
                    View your basic profile
                  </strong>{" "}
                  (openid, email, profile) — to display your name and email in the
                  interface.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. How Your Data Is Used
              </h2>
              <p className="mb-3">
                The Service processes your email data solely to respond to your
                chat requests. Specifically:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-2">
                <li>
                  Email content is read on-demand when you ask the AI to
                  summarize, search, or draft a reply.
                </li>
                <li>Emails are never sent without your explicit approval.</li>
                <li>
                  Chat conversations may be stored temporarily for session
                  continuity but are not used for any other purpose.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                4. No Warranty
              </h2>
              <p>
                This Service is provided <strong className="text-slate-200">&quot;as is&quot;</strong> and{" "}
                <strong className="text-slate-200">&quot;as available.&quot;</strong> As a
                demonstration project, there is no guarantee of uptime,
                reliability, or accuracy. The AI may produce incorrect summaries
                or drafts — always review before approving any email send.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Limitation of Liability
              </h2>
              <p>
                The developer of this project shall not be liable for any damages
                arising from your use of the Service, including but not limited to
                emails sent in error, data loss, or unauthorized access to your
                Google account. You use this Service at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Revoking Access
              </h2>
              <p>
                You can revoke the Service&apos;s access to your Google account at any
                time by visiting your{" "}
                <Link
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  Google Account permissions page
                </Link>
                . Revoking access will immediately prevent the Service from
                reading or sending emails on your behalf.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Changes to These Terms
              </h2>
              <p>
                These terms may be updated from time to time. Continued use of the
                Service after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                8. Contact
              </h2>
              <p>
                If you have any questions about these Terms, please reach out via
                the project&apos;s GitHub repository.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
