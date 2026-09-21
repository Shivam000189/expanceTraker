export default function LoadingSpinner({
  message = "Loading...",
  logoText = "Spendora",
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 gap-8 px-4 text-center">
      
      {/* Logo */}
      <div className="relative inline-block">
        <div className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white select-none break-words">
          {logoText}
          <span className="text-emerald-400">.</span>
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex gap-2 items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-400">
        {message}
      </p>
    </div>
  );
}
