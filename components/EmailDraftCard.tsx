"use client";

import { EmailDraft } from "./MessageBubble";

interface EmailDraftCardProps {
  draft: EmailDraft;
  onApprove: (draft: EmailDraft) => void;
  onCancel: () => void;
}

export default function EmailDraftCard({
  draft,
  onApprove,
  onCancel,
}: EmailDraftCardProps) {
  return (
    <div className="animate-slide-up glass-strong rounded-xl p-5 border border-indigo-500/20 max-w-lg mx-auto my-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            📧 Draft Email Preview
          </h3>
          <p className="text-xs text-slate-400">
            Review before sending
          </p>
        </div>
      </div>

      {/* Draft Details */}
      <div className="space-y-3 text-sm">
        <div className="flex gap-3 items-start">
          <span className="text-slate-500 w-16 shrink-0 pt-0.5 font-medium">
            To:
          </span>
          <span className="text-slate-200 bg-white/5 px-3 py-1 rounded-md flex-1">
            {draft.to}
          </span>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-slate-500 w-16 shrink-0 pt-0.5 font-medium">
            Subject:
          </span>
          <span className="text-slate-200 bg-white/5 px-3 py-1 rounded-md flex-1">
            {draft.subject}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-slate-500 text-xs font-medium block mb-2">
            Body:
          </span>
          <div className="text-slate-300 bg-white/5 p-3 rounded-lg whitespace-pre-wrap leading-relaxed text-sm">
            {draft.body}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          id="draft-approve-button"
          onClick={() => onApprove(draft)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-linear-to-r from-emerald-600 to-emerald-500
            hover:from-emerald-500 hover:to-emerald-400
            text-white text-sm font-semibold
            transition-all duration-200
            shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30
            active:scale-[0.97]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          Approve &amp; Send
        </button>
        <button
          id="draft-cancel-button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30
            text-slate-300 hover:text-rose-300 text-sm font-semibold
            transition-all duration-200
            active:scale-[0.97]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
}
