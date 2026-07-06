// components/Button.jsx
//
// WHAT: A single reusable button with a few visual variants.
// WHY: Keeps button styling (colors, hover, disabled state) consistent
//      across the whole app instead of re-typing class strings everywhere.

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-surface text-primary border border-border hover:bg-primary-light',
  danger: 'bg-surface text-red-400 border border-red-900 hover:bg-red-950',
  ghost: 'bg-transparent text-slate-300 hover:bg-primary-light hover:text-primary',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
