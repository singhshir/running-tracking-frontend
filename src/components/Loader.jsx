// components/Loader.jsx
//
// WHAT: A simple centered spinner, with an optional full-page mode.
// WHY: Used any time we're waiting on an API call (page load, form submit).

const Loader = ({ fullPage = false, label = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="flex h-[60vh] w-full items-center justify-center">{spinner}</div>;
  }

  return <div className="flex w-full items-center justify-center py-10">{spinner}</div>;
};

export default Loader;
