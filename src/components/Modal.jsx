// components/Modal.jsx
//
// WHAT: A minimal, centered modal dialog with a backdrop.
// WHY: Used for confirmation dialogs (e.g. "Delete this run?") so we don't
//      rely on the browser's ugly native confirm().

import Button from './Button';

const Modal = ({ open, title, children, onClose, onConfirm, confirmLabel = 'Confirm', danger = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-md">
        {title && <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>}
        <div className="mb-6 text-sm text-slate-300">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
