"use client";

import type { InterruptValue } from "@/hooks/useAgentStream";
import { useState } from "react";

interface EmailDraftCardProps {
  interrupt: InterruptValue;
  onRespond: (decisions: Record<string, unknown>[]) => void;
}

export default function EmailDraftCard({
  interrupt,
  onRespond,
}: EmailDraftCardProps) {
  const action = interrupt.actionRequests[0];
  const config = interrupt.reviewConfigs[0];
  const [mode, setMode] = useState<"review" | "reject" | "edit">("review");
  const [rejectReason, setRejectReason] = useState("");

  // Edit state — initialize from the tool args
  const [editTo, setEditTo] = useState(String(action?.args?.to ?? ""));
  const [editSubject, setEditSubject] = useState(
    String(action?.args?.subject ?? "")
  );
  const [editBody, setEditBody] = useState(
    String(action?.args?.message ?? "")
  );

  if (!action || !config) return null;

  const allowed = config.allowedDecisions;
  const args = action.args as Record<string, unknown>;
  const attachmentArgs = Array.isArray(args.attachments)
    ? (args.attachments as unknown[])
    : [];

  return (
    <div className="px-4 sm:px-6 py-2 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide text-slate-400">
            SEND EMAIL CONFIRMATION
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
            Requires approval
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 overflow-hidden shadow-[0_6px_30px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-300"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span className="text-sm font-medium text-slate-100">
              Review draft before sending
            </span>
          </div>

              {/* Review mode — show draft preview */}
              {mode === "review" && (
                <>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex gap-3">
                      <span className="text-slate-500 w-14 shrink-0">To</span>
                      <span className="text-slate-200">
                        {String(args.to ?? "")}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-slate-500 w-14 shrink-0">
                        Subject
                      </span>
                      <span className="text-slate-200">
                        {String(args.subject ?? "")}
                      </span>
                    </div>
                    {(() => {
                      if (args.cc && Array.isArray(args.cc)) {
                        const cc = args.cc as string[];
                        if (cc.length > 0) {
                          return (
                            <div className="flex gap-3">
                              <span className="text-slate-500 w-14 shrink-0">Cc</span>
                              <span className="text-slate-200">
                                {cc.join(", ")}
                              </span>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}
                    {(() => {
                      if (args.bcc && Array.isArray(args.bcc)) {
                        const bcc = args.bcc as string[];
                        if (bcc.length > 0) {
                          return (
                            <div className="flex gap-3">
                              <span className="text-slate-500 w-14 shrink-0">Bcc</span>
                              <span className="text-slate-200">
                                {bcc.join(", ")}
                              </span>
                            </div>
                          );
                        }
                      }
                      return null;
                    })()}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {String(args.message ?? "")}
                      </p>
                    </div>
                    {attachmentArgs.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-500 mb-2">Attachments</p>
                        <div className="flex flex-wrap gap-2">
                          {attachmentArgs.map((item, idx) => (
                            <span
                              key={`${String(item)}-${idx}`}
                              className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-300"
                            >
                              {String(item)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 p-4 pt-0">
                    {allowed.includes("approve") && (
                      <button
                        id="hitl-approve-button"
                        onClick={() =>
                          onRespond([{ type: "approve" }])
                        }
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all active:scale-[0.98]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Approve &amp; Send
                      </button>
                    )}
                    {allowed.includes("edit") && (
                      <button
                        id="hitl-edit-button"
                        onClick={() => setMode("edit")}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium transition-all active:scale-[0.98]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    )}
                    {allowed.includes("reject") && (
                      <button
                        id="hitl-reject-button"
                        onClick={() => setMode("reject")}
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/15 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-sm font-medium transition-all active:scale-[0.98]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
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
                        Reject
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Edit mode */}
              {mode === "edit" && (
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">
                      To
                    </label>
                    <input
                      id="hitl-edit-to"
                      type="text"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      value={editTo}
                      onChange={(e) => setEditTo(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">
                      Subject
                    </label>
                    <input
                      id="hitl-edit-subject"
                      type="text"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">
                      Body
                    </label>
                    <textarea
                      id="hitl-edit-body"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50 resize-none"
                      rows={5}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      id="hitl-edit-submit"
                      onClick={() =>
                        onRespond([
                          {
                            type: "edit",
                            edited_action: {
                              name: "send_email",
                              args: {
                                ...args,
                                to: editTo,
                                subject: editSubject,
                                message: editBody,
                              },
                            },
                          },
                        ])
                      }
                      className="cursor-pointer flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all active:scale-[0.98]"
                    >
                      Submit Edits &amp; Send
                    </button>
                    <button
                      onClick={() => setMode("review")}
                      className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium transition-colors hover:bg-white/10"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Reject mode */}
              {mode === "reject" && (
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">
                      Reason (optional)
                    </label>
                    <textarea
                      id="hitl-reject-reason"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-rose-500/50 resize-none"
                      rows={3}
                      placeholder="Why are you rejecting this email?"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="hitl-reject-confirm"
                      onClick={() =>
                        onRespond([
                          {
                            type: "reject",
                            message:
                              rejectReason ||
                              "User rejected the email send action.",
                          },
                        ])
                      }
                      className="cursor-pointer flex-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setMode("review")}
                      className="cursor-pointer px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium transition-colors hover:bg-white/10"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
