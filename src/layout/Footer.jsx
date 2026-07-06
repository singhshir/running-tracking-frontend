// layout/Footer.jsx
//
// WHAT: A small, unobtrusive footer shown at the bottom of every page.
// WHY: Spec calls for a "small footer" — kept intentionally minimal.

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface px-6 py-4 text-center text-xs text-slate-500">
      Real-Time Running Tracker — a college project. Map data © OpenStreetMap contributors.
    </footer>
  );
};

export default Footer;
