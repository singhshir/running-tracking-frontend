// components/Input.jsx
//
// WHAT: A labeled text input with a consistent look and optional inline
//       validation error message.
// WHY: Every form in the app (login, register, profile) needs the same
//      label + input + error pattern — written once here.

const Input = ({ label, error, id, className = '', ...rest }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-white bg-surface
          placeholder:text-slate-500 outline-none transition-colors
          focus:border-primary
          ${error ? 'border-red-400' : 'border-border'} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default Input;
