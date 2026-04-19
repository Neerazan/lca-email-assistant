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

  return (
    <div className="chat-message-row assistant animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4">
          {/* AI Avatar */}
          <div className="shrink-0 mt-1">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M3.586 3.586A2 2 0 0 1 5 3h14a2 2 0 0 1 1.414.586l.001.001A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .586-1.414z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-amber-400 mb-1.5 block">
              Action Requires Approval
            </span>

            {/* Card */}
            <div className="rounded-xl bg-white/4 border border-amber-500/20 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-amber-500/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="text-sm font-semibold text-amber-300">
                  📧 Send Email — Review Required
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
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {String(args.message ?? "")}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 p-4 pt-0">
                    {allowed.includes("approve") && (
                      <button
                        id="hitl-approve-button"
                        onClick={() =>
                          onRespond([{ type: "approve" }])
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-sm font-medium transition-colors active:scale-[0.98]"
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
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500/50"
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
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500/50"
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
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500/50 resize-none"
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
                                to: editTo,
                                subject: editSubject,
                                message: editBody,
                              },
                            },
                          },
                        ])
                      }
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
                    >
                      Submit Edits &amp; Send
                    </button>
                    <button
                      onClick={() => setMode("review")}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm font-medium transition-colors hover:bg-white/10"
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
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-rose-500/50 resize-none"
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
                      className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors active:scale-[0.98]"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setMode("review")}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm font-medium transition-colors hover:bg-white/10"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
