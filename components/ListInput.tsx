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
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/5 group animate-fade-in"
          >
            <div className="flex-1 text-sm text-slate-300 leading-relaxed py-0.5 whitespace-pre-wrap">
              {item}
            </div>
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
