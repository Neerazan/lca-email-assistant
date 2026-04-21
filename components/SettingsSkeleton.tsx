"use client"

export default function SettingsSkeleton() {
  return (
    <div className="min-h-screen text-slate-200 font-sans animate-pulse" style={{ background: "var(--chat-bg)" }}>
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 backdrop-blur-md border-b border-white/6 px-4 py-2.5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="w-20 h-4 bg-white/10 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8 pb-24">
        {[...Array(3)].map((_, i) => (
          <section key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Section Header */}
              <div className="space-y-2">
                <div className="w-32 h-5 bg-white/10 rounded-full" />
                <div className="w-full h-3 bg-white/5 rounded-full" />
                <div className="w-2/3 h-3 bg-white/5 rounded-full" />
              </div>

              {/* Section Fields */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="w-12 h-3 bg-white/5 rounded-full" />
                    <div className="w-full h-10 bg-white/5 rounded-xl border border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-3 bg-white/5 rounded-full" />
                    <div className="w-full h-10 bg-white/5 rounded-xl border border-white/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-white/5 rounded-full" />
                  <div className="w-full h-24 bg-white/5 rounded-xl border border-white/5" />
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* Footer Skeleton */}
      <div className="sticky bottom-3 z-10 flex justify-end px-4 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-[#0d0d15]/80 backdrop-blur-sm px-3 py-2">
          <div className="w-32 h-10 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
