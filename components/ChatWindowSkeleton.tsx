"use client";

export default function ChatWindowSkeleton() {
  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col animate-pulse" style={{ background: "var(--chat-bg)" }}>
      {/* Messages Area Skeleton - matches pt-6 from ChatWindow */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 pt-6 pb-2 space-y-10">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="max-w-3xl mx-auto w-full space-y-8">
            {/* User message skeleton */}
            <div className="flex justify-end px-4 py-1">
              <div 
                className="w-2/3 sm:w-1/2 h-11" 
                style={{ background: "#3d4263", borderRadius: "18px 4px 18px 18px", opacity: 0.4 }} 
              />
            </div>
            
            {/* Assistant message skeleton */}
            <div className="flex justify-start px-4 py-2">
              <div className="w-full space-y-3.5">
                <div className="h-3.5 bg-white/10 rounded-full w-full" />
                <div className="h-3.5 bg-white/10 rounded-full w-5/6" />
                <div className="h-3.5 bg-white/5 rounded-full w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Input Area Skeleton - matches ChatWindow exactly */}
      <div className="shrink-0 px-4 pb-5 pt-3">
        <div className="max-w-3xl mx-auto">
          {/* Main Input Box Skeleton - calculated 99px for exact match */}
          <div 
            className="rounded-2xl border border-white/10 bg-white/4 h-[99px]" 
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
          />
          
          {/* Footer Note Skeleton */}
          <div className="flex justify-center mt-2.5">
            <div className="h-2 bg-white/5 rounded-full w-48 opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
