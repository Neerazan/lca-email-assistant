"use client";

export default function ChatSidebarSkeleton() {
  return (
    <div className="space-y-1 p-2 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="w-full rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-2"
        >
          <div className="h-4 bg-white/10 rounded-md w-3/4" />
          <div className="h-3 bg-white/5 rounded-md w-1/4" />
        </div>
      ))}
    </div>
  );
}
