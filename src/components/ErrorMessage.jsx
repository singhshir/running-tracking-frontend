// components/ErrorMessage.jsx
//
// WHAT: A small inline banner for surfacing API/validation errors.
// WHY: Consistent error styling instead of ad-hoc red <p> tags everywhere.

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
};

export default ErrorMessage;
