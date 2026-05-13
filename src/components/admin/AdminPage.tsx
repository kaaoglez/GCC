'use client';

import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/lib/admin-store';
import { useModalStore } from '@/lib/modal-store';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminListings } from './AdminListings';
import { AdminPromotions } from './AdminPromotions';
import { AdminUsers } from './AdminUsers';
import { AdminCategories } from './AdminCategories';
import { AdminPayments } from './AdminPayments';
import { motion } from 'framer-motion';

const pages: Record<string, React.FC> = {
  dashboard: AdminDashboard,
  listings: AdminListings,
  promotions: AdminPromotions,
  users: AdminUsers,
  categories: AdminCategories,
  payments: AdminPayments,
};

export function AdminPage() {
  const { isAdmin, logout, activePage } = useAdminStore();
  const setAdminView = useModalStore((s) => s.setAdminView);
  const prevDarkClass = useRef<boolean | null>(null);

  // Remove 'dark' class while admin page is open
  useEffect(() => {
    const html = document.documentElement;
    prevDarkClass.current = html.classList.contains('dark');
    if (prevDarkClass.current) html.classList.remove('dark');
    return () => {
      if (prevDarkClass.current) html.classList.add('dark');
      prevDarkClass.current = null;
    };
  }, []);

  const closeAdmin = () => {
    logout();
    setAdminView(false);
    window.location.href = '/';
  };

  // Not logged in: show login screen
  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      >
        <AdminLogin />
      </motion.div>
    );
  }

  // Logged in: show admin panel full-page
  const PageComponent = pages[activePage] || AdminDashboard;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-slate-50"
    >
      <AdminLayout>
        <PageComponent />
      </AdminLayout>
    </motion.div>
  );
}