'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Leaf, Sun, Moon, Globe, Plus, Menu, Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/use-i18n';
import { NAV_ITEMS, APP_CONFIG } from '@/lib/constants';
import { useAdminStore } from '@/lib/admin-store';
import { useModalStore, type PageView } from '@/lib/modal-store';

/* ── Hydration-safe client check via useSyncExternalStore ─────────── */
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/* ── Theme Toggle (separate component to avoid hydration mismatch) ─── */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && (resolvedTheme === 'dark');

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={className}
      aria-label="Toggle theme"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        /* Render a placeholder with the same dimensions during SSR */
        <div className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

/* ── Mapping from navKeys index to PageView ─────────────────────── */
const NAV_KEY_TO_VIEW: PageView[] = [
  'anuncios',   // ads
  'categorias', // categories
  'eventos',    // events
  'news',       // news
  'directory',  // directory
  'recycling',  // recycling
];

/* ── Navbar ───────────────────────────────────────────────────────── */
export function Navbar() {
  const { locale, toggleLocale, tp } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentView = useModalStore((s) => s.currentView);
  const setCurrentView = useModalStore((s) => s.setCurrentView);
  const closeListingFullView = useModalStore((s) => s.closeListingFullView);
  const closeEventFullView = useModalStore((s) => s.closeEventFullView);
  const closeArticleReadingView = useModalStore((s) => s.closeArticleReadingView);

  // Scroll detection via event subscription (proper effect usage)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleNavClick = (index: number) => {
    const view = NAV_KEY_TO_VIEW[index];
    if (view) {
      // Close any open full views / reading views so navigation works
      closeListingFullView();
      closeEventFullView();
      closeArticleReadingView();
      setCurrentView(view);
      closeMobile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    // Close any open full views / reading views so navigation works
    closeListingFullView();
    closeEventFullView();
    closeArticleReadingView();
    setCurrentView('home');
    closeMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-background border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ──────────────────────────────────────── */}
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block font-heading font-bold text-lg text-primary">
            {APP_CONFIG.name}
          </span>
        </button>

        {/* ── Desktop Nav Links ──────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1">
          {currentView !== 'home' && (
            <button
              onClick={handleHomeClick}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted flex items-center gap-1.5"
            >
              <Home className="size-3.5" />
              {tp('common', 'home')}
            </button>
          )}
          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(index)}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted ${
                currentView === NAV_KEY_TO_VIEW[index]
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item[locale]}
            </button>
          ))}
        </div>

        {/* ── Desktop Right Actions ──────────────────────── */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="gap-1.5 text-muted-foreground hover:text-primary"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">
              {locale === 'es' ? 'EN' : 'ES'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle className="text-muted-foreground hover:text-primary" />

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Admin Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={() => {
             useModalStore.getState().setAdminView(true);
            }}
            title="Admin"
          >
            <Shield className="h-4 w-4" />
          </Button>

          {/* Login Button */}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            {tp('nav', 'login')}
          </Button>

          {/* CTA: Post Ad */}
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            {tp('nav', 'postAd')}
          </Button>
        </div>

        {/* ── Mobile Actions ────────────────────────────── */}
        <div className="flex lg:hidden items-center gap-1.5">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="text-muted-foreground hover:text-primary px-2"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">
              {locale === 'es' ? 'EN' : 'ES'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle className="text-muted-foreground hover:text-primary" />

          {/* Mobile Menu Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">
                Menú de navegación
              </SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <span className="font-heading font-bold text-primary">
                      {APP_CONFIG.name}
                    </span>
                  </div>
                </div>

                {/* Mobile Nav Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-1 px-2">
                    {/* Home button when not on home */}
                    {currentView !== 'home' && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <button
                          onClick={handleHomeClick}
                          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Home className="size-4" />
                          {tp('common', 'home')}
                        </button>
                      </motion.div>
                    )}

                    {NAV_ITEMS.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (currentView !== 'home' ? 1 : 0) + index * 0.05 }}
                      >
                        <button
                          onClick={() => handleNavClick(index)}
                          className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            currentView === NAV_KEY_TO_VIEW[index]
                              ? 'text-primary bg-muted'
                              : 'text-foreground hover:text-primary hover:bg-muted'
                          }`}
                        >
                          {item[locale]}
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Auth Links */}
                  <div className="space-y-1 px-2">
                    <button
                      onClick={closeMobile}
                      className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                    >
                      {tp('nav', 'login')}
                    </button>
                  </div>
                </div>

                {/* Mobile Footer CTA */}
                <div className="p-4 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold shadow-sm">
                    <Plus className="h-4 w-4" />
                    {tp('nav', 'postAd')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
