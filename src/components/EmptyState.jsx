// components/EmptyState.jsx
//
// WHAT: A friendly placeholder shown when a list has no data yet
//       (e.g. no runs logged, no search results).
// WHY: An empty screen should invite action, not just look broken.

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      {icon && <div className="mb-4 text-4xl text-slate-600">{icon}</div>}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
