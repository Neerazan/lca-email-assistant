"use client"

import { useAuth } from "@/contexts/AuthContext"
import { getPreferences, resetMemory, savePreferences } from "@/lib/api"
import Link from "next/link"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useCallback, useEffect, useState } from "react"

const fieldClass =
  "w-full rounded-xl bg-white/3 border border-white/10 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"
type SelectOption = { value: string; label: string }

function ThemedSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        className={`${fieldClass} cursor-pointer flex items-center justify-between`}
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120)
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label || "Select..."}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-white/10 bg-[#141826] shadow-[0_10px_30px_rgba(0,0,0,0.45)] p-1">
          <ul role="listbox" className="max-h-56 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? "bg-indigo-500/20 text-indigo-200"
                        : "text-slate-200 hover:bg-white/8"
                    }`}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
const labelClass =
  "text-[11px] font-semibold text-slate-500 uppercase tracking-wider"

function Toggle({
  checked,
  onClick,
}: {
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
        checked ? "bg-indigo-600" : "bg-white/10"
      }`}
      aria-pressed={checked}
    >
      <div
        className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { appToken, user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [prefs, setPrefs] = useState({
    tone: "formal",
    length: "medium",
    signature: "",
    full_name: "",
    role_title: "",
    company: "",
    relationships: "",
    default_action: "draft",
    language: "en",
    ask_clarifying_questions: true,
    custom_instructions: "",
    save_history: true,
    ai_memory_enabled: true
  })

  const loadPrefs = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPreferences(appToken!, user!.sub)
      if (data && Object.keys(data).length > 0) {
        setPrefs((prev) => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to load preferences", error)
    } finally {
      setLoading(false)
    }
  }, [appToken, user])

  useEffect(() => {
    if (isAuthenticated && appToken && user?.sub) {
      loadPrefs()
    }
  }, [isAuthenticated, appToken, user, loadPrefs])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!appToken || !user?.sub) return

    try {
      setSaving(true)
      setMessage({ type: "", text: "" })
      await savePreferences(appToken, user.sub, prefs)
      setMessage({ type: "success", text: "Settings saved successfully!" })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      console.error("Failed to save settings", error)
      setMessage({ type: "error", text: "Failed to save settings." })
    } finally {
      setSaving(false)
    }
  }

  const handleResetMemory = async () => {
    if (!appToken || !user?.sub) return

    try {
      setSaving(true)
      await resetMemory(appToken, user.sub)
      setMessage({ type: "success", text: "AI memory has been reset." })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      console.error("Failed to reset AI memory", error)
      setMessage({ type: "error", text: "Failed to reset AI memory." })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white font-sans" style={{ background: "var(--chat-bg)" }}>
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-200 p-4 text-center font-sans" style={{ background: "var(--chat-bg)" }}>
        <h1 className="text-2xl font-semibold mb-6 tracking-tight">Access Denied</h1>
        <Link href="/" className="px-6 py-2.5 bg-indigo-600 rounded-full font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30" style={{ background: "var(--chat-bg)" }}>
      <header
        className="sticky top-0 z-20 backdrop-blur-md border-b border-white/6 px-4 py-2.5 flex items-center justify-between"
        style={{ background: "var(--chat-header-bg)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </Link>
          <span className="text-sm font-medium text-slate-300">Settings</span>
        </div>
      </header>

      {message.text && (
        <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 sm:right-6 z-[100] pointer-events-none">
          <div
            className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.45)] animate-fade-in ${
              message.type === "success"
                ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-100"
                : "bg-rose-500/20 border-rose-400/40 text-rose-100"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full ${
                message.type === "success"
                  ? "bg-indigo-400/20 text-indigo-100"
                  : "bg-rose-400/20 text-rose-100"
              }`}
            >
              {message.type === "success" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-0.5">
                {message.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-sm font-medium leading-relaxed break-words">
                {message.text}
              </p>
            </div>
            <button
              type="button"
              className="cursor-pointer p-1 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMessage({ type: "", text: "" })}
              aria-label="Close notification"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 6-12 12" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8 animate-fade-in pb-24">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">AI Personality</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Customize how the assistant drafts and responds to your emails.</p>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Tone</label>
                <ThemedSelect
                  value={prefs.tone}
                  onChange={(newTone) => setPrefs({ ...prefs, tone: newTone })}
                  options={[
                    { value: "formal", label: "Formal & Professional" },
                    { value: "casual", label: "Casual & Friendly" },
                    { value: "concise", label: "Direct & Concise" },
                    { value: "enthusiastic", label: "Enthusiastic" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Length</label>
                <ThemedSelect
                  value={prefs.length}
                  onChange={(newLength) => setPrefs({ ...prefs, length: newLength })}
                  options={[
                    { value: "short", label: "Short" },
                    { value: "medium", label: "Medium" },
                    { value: "long", label: "Long" },
                  ]}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Email Signature</label>
              <textarea
                value={prefs.signature}
                onChange={(e) => setPrefs({ ...prefs, signature: e.target.value })}
                placeholder="e.g. Best regards, Alex"
                className={`${fieldClass} min-h-24 resize-y`}
              />
            </div>
          </div>
        </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">Identity & Context</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Personal information that helps the AI understand your role and relationships.</p>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={prefs.full_name}
                  onChange={(e) => setPrefs({ ...prefs, full_name: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Role Title</label>
                <input
                  type="text"
                  value={prefs.role_title}
                  onChange={(e) => setPrefs({ ...prefs, role_title: e.target.value })}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Important Relationships</label>
              <textarea
                value={prefs.relationships}
                onChange={(e) => setPrefs({ ...prefs, relationships: e.target.value })}
                placeholder="e.g. Sarah is my manager, Team at Vertex are my main clients."
                className={`${fieldClass} min-h-24 resize-y`}
              />
            </div>
          </div>
        </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">Memory & Behavior</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Control how the assistant learns from your interactions.</p>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-slate-200">Active Learning</h3>
                <p className="text-[11px] text-slate-500">Allow AI to remember facts and habits mentioned in chats.</p>
              </div>
              <Toggle checked={prefs.ai_memory_enabled} onClick={() => setPrefs({ ...prefs, ai_memory_enabled: !prefs.ai_memory_enabled })} />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-slate-200">Clarification Mode</h3>
                <p className="text-[11px] text-slate-500">Ask clarifying questions instead of guessing when unsure.</p>
              </div>
              <Toggle checked={prefs.ask_clarifying_questions} onClick={() => setPrefs({ ...prefs, ask_clarifying_questions: !prefs.ask_clarifying_questions })} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Custom Instructions</label>
              <textarea
                value={prefs.custom_instructions}
                onChange={(e) => setPrefs({ ...prefs, custom_instructions: e.target.value })}
                placeholder="e.g. Always use British English, Never use exclamation marks."
                className={`${fieldClass} min-h-28 resize-y`}
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 italic">This will permanently clear all facts learned by the AI.</span>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="cursor-pointer px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all text-xs font-semibold active:scale-[0.98]"
              >
                Reset AI Memory
              </button>
            </div>
          </div>
        </div>
        </section>

        <div className="sticky bottom-3 z-10 flex justify-end">
          <div className="rounded-2xl border border-white/10 bg-[#0d0d15]/80 backdrop-blur-sm px-3 py-2">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="cursor-pointer px-5 sm:px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showResetConfirm}
        title="Reset memory?"
        description="This will permanently remove all memory facts learned by the assistant. This action cannot be undone."
        confirmText="Reset Memory"
        onConfirm={async () => {
          setShowResetConfirm(false)
          await handleResetMemory()
        }}
        onCancel={() => setShowResetConfirm(false)}
        variant="danger"
      />
    </div>
  )
}
