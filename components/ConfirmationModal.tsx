"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-rose-500/10",
          iconText: "text-rose-400",
          iconBorder: "border-rose-500/20",
          confirmBtn: "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/20",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          ),
        };
      case "warning":
        return {
          iconBg: "bg-amber-500/10",
          iconText: "text-amber-400",
          iconBorder: "border-amber-500/20",
          confirmBtn: "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border-amber-500/20",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 9 4 7H8l4-7Z" />
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
              <line x1="12" y1="13" x2="12" y2="13" />
            </svg>
          ),
        };
      default:
        return {
          iconBg: "bg-indigo-500/10",
          iconText: "text-indigo-400",
          iconBorder: "border-indigo-500/20",
          confirmBtn: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border-indigo-500/20",
          icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ),
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-95 rounded-2xl border border-white/10 bg-[#0d0d15] shadow-2xl p-7 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-11 h-11 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconText} border ${styles.iconBorder}`}>
            {styles.icon}
          </div>
          <h3 id="modal-title" className="text-xl font-semibold text-white tracking-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-[15px] text-slate-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-[0.98] ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
