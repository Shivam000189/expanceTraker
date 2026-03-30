export default function LoadingSpinner({
  message = "Loading...",
  logoText = "ExpanceTracker",
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B1A] gap-8">
      
      {/* Logo */}
      <div className="relative inline-block">
        <div className="text-[72px] md:text-[96px] font-black text-violet-600 tracking-tight select-none drop-shadow-[0_0_18px_rgba(124,58,237,0.8)]">
          {logoText}
        </div>

        {/* Glow Rings */}
        <div className="absolute -inset-4 rounded-full border-2 border-violet-500 animate-ping opacity-70" />
        <div className="absolute -inset-7 rounded-full border border-violet-400/40 animate-ping delay-300" />
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-2 items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-xs tracking-[0.2em] uppercase text-white/60">
        {message}
      </p>
    </div>
  );
}