export default function LoadingSpinner({ message = "Loading...", logoText = "ExpanceTraker" }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      gap: "32px",
    }}>
      {/* Logo text with glow */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{
          fontSize: "96px",
          fontWeight: "900",
          color: "#ff4b2b",
          lineHeight: 1,
          fontFamily: "Arial Black, sans-serif",
          filter: "drop-shadow(0 0 18px #E50914) drop-shadow(0 0 40px #E5091488)",
          letterSpacing: "-4px",
          userSelect: "none",
        }}>
          {logoText}
        </div>

        {/* Animated glow rings */}
        <div style={{
          position: "absolute",
          inset: "-16px",
          borderRadius: "50%",
          border: "2px solid #ff4b2b",
          opacity: 0,
          animation: "ping 1.6s ease-out infinite",
        }} />
        <div style={{
          position: "absolute",
          inset: "-28px",
          borderRadius: "50%",
          border: "1px solid #E5091455",
          opacity: 0,
          animation: "ping 1.6s ease-out 0.4s infinite",
        }} />
      </div>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#E50914",
              animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <p style={{
        color: "#ffffff99",
        fontSize: "13px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "sans-serif",
        margin: 0,
      }}>
        {message}
      </p>

      <style>{`
        @keyframes ping {
          0% { opacity: 0.8; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scaleY(1); opacity: 0.4; }
          40% { transform: scaleY(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}