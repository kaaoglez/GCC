'use client';

import { useState, useCallback } from 'react';
import { useAdminStore, type AdminPage } from '@/lib/admin-store';
import {
  LogOut, ArrowLeft, Menu, Leaf, ChevronRight,
  LayoutDashboard, FileText, Sparkles, Users, FolderOpen, CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const navItems: { key: AdminPage; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'listings', label: 'Anuncios', icon: <FileText className="w-5 h-5" /> },
  { key: 'promotions', label: 'Promociones', icon: <Sparkles className="w-5 h-5" /> },
  { key: 'users', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
  { key: 'categories', label: 'Categorías', icon: <FolderOpen className="w-5 h-5" /> },
  { key: 'payments', label: 'Pagos', icon: <CreditCard className="w-5 h-5" /> },
];

function SidebarContent({ activePage, onNavigate, onBack, onLogout }: {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onBack: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#1B4332', color: '#ffffff' }}
    >
      <div className="p-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Leaf className="w-5 h-5" style={{ color: '#ffffff' }} />
        </div>
        <div>
          <h2 className="font-bold text-lg" style={{ color: '#ffffff' }}>GC Admin</h2>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Gran Canaria Conecta</p>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.12)' }} />

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
            >
              <span style={{ display: 'flex', color: 'inherit' }}>{item.icon}</span>
              <span style={{ color: 'inherit' }}>{item.label}</span>
              {item.key === 'promotions' && (
                <Badge className="ml-auto text-[10px] px-1.5 py-0" style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none' }}>
                  ★
                </Badge>
              )}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" style={{ opacity: 0.6 }} />}
            </button>
          );
        })}
      </nav>

      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.12)' }} />

      <div className="p-3 space-y-1">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.8)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al sitio</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#fca5a5' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fecaca'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fca5a5'; }}
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { activePage, setActivePage, logout } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useCallback((page: AdminPage) => {
    setActivePage(page);
    setMobileOpen(false);
  }, [setActivePage]);

  const handleBack = useCallback(() => {
    logout();
    setMobileOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
  }, [logout]);

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    listings: 'Anuncios',
    promotions: 'Promociones',
    users: 'Usuarios',
    categories: 'Categorías',
    payments: 'Pagos',
  };

  const pageTitle = pageTitles[activePage] || 'Dashboard';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f5f0', color: '#1a2e1a' }}>
      <aside className="hidden lg:flex w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent activePage={activePage} onNavigate={navigate} onBack={handleBack} onLogout={logout} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 !bg-transparent" style={{ backgroundColor: '#1B4332' }}>
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SidebarContent activePage={activePage} onNavigate={navigate} onBack={handleBack} onLogout={logout} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen" style={{ color: '#1a2e1a' }}>
        <header
          className="sticky top-0 z-20 border-b"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderColor: '#d4ddd4', color: '#1a2e1a' }}
        >
          <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: '#1a2e1a' }}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: '#1a2e1a' }}>{pageTitle}</h1>
            <div className="ml-auto flex items-center gap-3">
              <Badge className="hidden sm:flex gap-1.5" style={{ backgroundColor: '#1B4332', color: '#ffffff', border: 'none' }}>
                <Leaf className="w-3 h-3" />
                Admin
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8" style={{ color: '#1a2e1a' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
