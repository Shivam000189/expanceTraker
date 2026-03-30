export default function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-violet-100 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-[11px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          {sub}
        </span>
      </div>

      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-extrabold text-violet-900">
          {value}
        </p>
      </div>
    </div>
  );
}