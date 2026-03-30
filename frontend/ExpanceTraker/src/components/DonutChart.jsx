import { useState } from "react";
import { getCategory } from "../utils/analytics";

export default function DonutChart({ data, total }) {
  const size = 200;
  const r = 72;
  const cx = size / 2;
  const cy = size / 2;
  const gap = 3;

  let cumulativeAngle = -90;

  const slices = data.map((d) => {
    const fraction = d.amount / total;
    const angleDeg = fraction * 360 - gap;
    const startAngle = cumulativeAngle;
    cumulativeAngle += fraction * 360;
    return { ...d, fraction, startAngle, angleDeg };
  });

  const polarToXY = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startAngle, angleDeg, radius) => {
    if (angleDeg <= 0) return "";
    const endAngle = startAngle + angleDeg;
    const largeArc = angleDeg > 180 ? 1 : 0;
    const start = polarToXY(startAngle, radius);
    const end = polarToXY(endAngle, radius);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center">
      <svg width={size} height={size}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={describeArc(s.startAngle, s.angleDeg, r)}
            fill="none"
            stroke={getCategory(s.name).color}
            strokeWidth={hovered === i ? 20 : 14}
            strokeLinecap="round"
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <circle cx={cx} cy={cy} r={52} fill="#fff" />
      </svg>

      <div className="absolute text-center">
        {hovered !== null ? (
          <>
            <div>{getCategory(slices[hovered]?.name).icon}</div>
            <div className="text-xs font-semibold text-violet-800">
              {slices[hovered]?.name}
            </div>
            <div className="text-sm font-bold">
              ₹{slices[hovered]?.amount.toLocaleString()}
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-gray-400">Total</div>
            <div className="font-bold text-violet-800">
              ₹{total.toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}