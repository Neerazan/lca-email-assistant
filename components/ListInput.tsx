"use client"

import { useState } from "react"

interface ListInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

const defaultFieldClass =
  "w-full rounded-xl bg-white/3 border border-white/10 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"

export default function ListInput({
  value,
  onChange,
  placeholder,
  className = defaultFieldClass,
}: ListInputProps) {
  const items = value ? value.split("\n").filter((i) => i.trim() !== "") : []
  const [inputValue, setInputValue] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  const addItem = () => {
    if (inputValue.trim()) {
      const newLines = inputValue.split("\n").filter((i) => i.trim() !== "")
      onChange([...items, ...newLines].join("\n"))
      setInputValue("")
    }
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems.join("\n"))
    // If we were editing this item, cancel the edit
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditValue("")
    } else if (editingIndex !== null && editingIndex > index) {
      // Adjust editing index if an item above was removed
      setEditingIndex(editingIndex - 1)
    }
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditValue(items[index])
  }

  const cancelEditing = () => {
    setEditingIndex(null)
    setEditValue("")
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    if (!editValue.trim()) {
      // If empty, just remove the item
      removeItem(editingIndex)
      return
    }
    const newItems = [...items]
    newItems[editingIndex] = editValue.trim()
    onChange(newItems.join("\n"))
    setEditingIndex(null)
    setEditValue("")
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/5 group animate-fade-in"
          >
            {editingIndex === idx ? (
              /* ─── Editing Mode ─── */
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  rows={1}
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      saveEdit()
                    }
                    if (e.key === "Escape") {
                      cancelEditing()
                    }
                  }}
                  autoFocus
                  className={`${defaultFieldClass} resize-none min-h-10 py-2 overflow-hidden transition-[height] duration-200 bg-white/5! border-indigo-500/40!`}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={!editValue.trim()}
                    className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="cursor-pointer px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-xs font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Display Mode ─── */
              <>
                <div className="flex-1 text-sm text-slate-300 leading-relaxed py-0.5 whitespace-pre-wrap">
                  {item}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditing(idx)}
                    className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all sm:opacity-0 group-hover:opacity-100"
                    title="Edit item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all sm:opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-3 py-4 rounded-xl border border-dashed border-white/10 bg-white/1 text-center">
            <p className="text-xs text-slate-500 italic">No items added yet.</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <textarea
          rows={1}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            // Simple auto-resize
            e.target.style.height = 'auto'
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              addItem()
              // Reset height
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
            }
          }}
          placeholder={placeholder}
          className={`${className} resize-none min-h-10.5 py-2.5 overflow-hidden transition-[height] duration-200`}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim()}
          className="cursor-pointer px-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-slate-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] h-10.5 shrink-0 self-end"
        >
          Add
        </button>
      </div>
    </div>
  )
}
