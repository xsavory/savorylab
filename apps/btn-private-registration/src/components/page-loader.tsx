function PageLoader() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      {/* Dark elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/60"></div>

      {/* Subtle geometric accents with golden theme */}
      <div className="absolute top-20 left-16 w-24 h-24 border border-amber-400/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 border border-amber-300/15 rounded-lg rotate-45 animate-pulse delay-300"></div>
      <div className="absolute top-1/3 left-10 w-8 h-8 bg-amber-400/10 rounded-full blur-sm animate-pulse delay-150"></div>
      <div className="absolute top-40 right-20 w-32 h-32 border border-amber-500/10 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-amber-300/20 rounded-full blur-md animate-pulse delay-700"></div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Spinner */}
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
          <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-500 rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="mb-4">
          <span className="inline-block bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-200 font-bold px-6 py-3 rounded-full shadow-xl border border-amber-400/40 backdrop-blur-sm">
            <span className="mr-2">✨</span>
            Memuat...
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-amber-200/70 italic">
          BTN Private Registration System
        </p>
      </div>
    </div>
  )
}

export default PageLoader