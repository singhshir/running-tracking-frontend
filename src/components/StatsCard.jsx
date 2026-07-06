// components/StatsCard.jsx
//
// WHAT: A single "stat tile" — icon, label, big value — used on the
//       Dashboard and Statistics pages (Total Runs, Total Distance, etc).
// WHY: Reused four+ times per page, so it earns its own component.

const colorClasses = {
  blue: 'bg-primary-light text-primary',
  green: 'bg-accent-light text-accent-dark',
};

const StatsCard = ({ icon, label, value, sublabel, color = 'blue' }) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
};

export default StatsCard;
