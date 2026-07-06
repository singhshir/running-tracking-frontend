// layout/DashboardLayout.jsx
//
// WHAT: The shared authenticated-app shell — Navbar on top, Sidebar on the
//       left, page content in the middle, Footer at the bottom.
// WHY: Every protected page (Dashboard, Start Run, History, etc.) renders
//      inside this shell via <Outlet /> from React Router, so the
//      navbar/sidebar don't need to be repeated in every page component.

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
