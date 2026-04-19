"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getPreferences, savePreferences, resetMemory } from "@/lib/api"
import Link from "next/link"

export default function SettingsPage() {
  const { appToken, user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    if (isAuthenticated && appToken && user?.sub) {
      loadPrefs()
    }
  }, [isAuthenticated, appToken, user])

  const loadPrefs = async () => {
    try {
      setLoading(true)
      const data = await getPreferences(appToken!, user!.sub)
      if (data && Object.keys(data).length > 0) {
        setPrefs(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to load preferences", error)
    } finally {
      setLoading(false)
    }
  }

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
      setMessage({ type: "error", text: "Failed to save settings." })
    } finally {
      setSaving(false)
    }
  }

  const handleResetMemory = async () => {
    if (!confirm("Are you sure you want to clear all AI memory facts? This cannot be undone.")) return
    if (!appToken || !user?.sub) return

    try {
      setSaving(true)
      await resetMemory(appToken, user.sub)
      setMessage({ type: "success", text: "AI memory has been reset." })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to reset AI memory." })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a] text-white font-sans">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0e1a] text-slate-200 p-4 text-center font-sans">
        <h1 className="text-2xl font-semibold mb-6 tracking-tight">Access Denied</h1>
        <Link href="/" className="px-6 py-2.5 bg-indigo-600 rounded-full font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 font-sans selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        input, select, textarea {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(99, 102, 241, 0.4) !important;
          outline: none !important;
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2) !important;
        }
        option {
          background-color: #1a1a2e !important;
          color: #f1f5f9 !important;
        }
      `}} />

      {/* Matching Header Style */}
      <header 
        className="sticky top-0 z-20 backdrop-blur-md border-b border-white/6 px-4 py-2.5 flex items-center justify-between"
        style={{ background: "rgba(13, 13, 13, 0.8)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/chat" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <span className="text-sm font-medium text-slate-300">Settings</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-10 px-6 space-y-12 animate-fade-in">
        {message.text && (
          <div className={`fixed bottom-10 right-10 p-4 rounded-xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-5 duration-300 ${
            message.type === 'success' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-100' : 'bg-red-500/20 border-red-500/50 text-red-100'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Section: AI Personality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">AI Personality</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Customize how the assistant drafts and responds to your emails.</p>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tone</label>
                <select 
                  value={prefs.tone}
                  onChange={(e) => setPrefs({...prefs, tone: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  <option value="formal">Formal & Professional</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="concise">Direct & Concise</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Length</label>
                <select 
                  value={prefs.length}
                  onChange={(e) => setPrefs({...prefs, length: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email Signature</label>
              <textarea 
                value={prefs.signature}
                onChange={(e) => setPrefs({...prefs, signature: e.target.value})}
                placeholder="e.g. Best regards, Alex"
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-200 min-h-[80px] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Section: Your Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">Identity & Context</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Personal information that helps the AI understand your role and relationships.</p>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  value={prefs.full_name}
                  onChange={(e) => setPrefs({...prefs, full_name: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 text-sm text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role Title</label>
                <input 
                  type="text"
                  value={prefs.role_title}
                  onChange={(e) => setPrefs({...prefs, role_title: e.target.value})}
                  className="w-full rounded-lg px-3 py-2 text-sm text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Important Relationships</label>
              <textarea 
                value={prefs.relationships}
                onChange={(e) => setPrefs({...prefs, relationships: e.target.value})}
                placeholder="e.g. Sarah is my manager, Team at Vertex are my main clients."
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-200 min-h-[80px] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Section: AI Memory & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-base font-semibold text-white">Memory & Behavior</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Control how the assistant learns from your interactions.</p>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-slate-200">Active Learning</h3>
                <p className="text-[11px] text-slate-500">Allow AI to remember facts and habits mentioned in chats.</p>
              </div>
              <button 
                onClick={() => setPrefs({...prefs, ai_memory_enabled: !prefs.ai_memory_enabled})}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${prefs.ai_memory_enabled ? 'bg-indigo-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${prefs.ai_memory_enabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-slate-200">Clarification Mode</h3>
                <p className="text-[11px] text-slate-500">Ask clarifying questions instead of guessing when unsure.</p>
              </div>
              <button 
                onClick={() => setPrefs({...prefs, ask_clarifying_questions: !prefs.ask_clarifying_questions})}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${prefs.ask_clarifying_questions ? 'bg-indigo-600' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${prefs.ask_clarifying_questions ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Custom Instructions</label>
              <textarea 
                value={prefs.custom_instructions}
                onChange={(e) => setPrefs({...prefs, custom_instructions: e.target.value})}
                placeholder="e.g. Always use British English, Never use exclamation marks."
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-200 min-h-[100px] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">This will permanently clear all facts learned by the AI.</span>
              <button 
                onClick={handleResetMemory}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all text-xs font-semibold active:scale-[0.98]"
              >
                Reset AI Memory
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <div className="pt-4 flex justify-end">
          <button 
            onClick={() => handleSave()}
            disabled={saving}
            className="cursor-pointer px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-600 rounded-md text-sm font-semibold text-white transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </main>
    </div>
  )
}
