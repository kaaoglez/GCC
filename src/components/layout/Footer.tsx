'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Leaf, Instagram, Facebook, Twitter, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/use-i18n';
import { FOOTER_LINKS, APP_CONFIG, SITE_URLS } from '@/lib/constants';

export function Footer() {
  const { locale, tp } = useI18n();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      {/* ── Main Footer Content ────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* ── Column 1: About ─────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              {tp('footer', 'tagline')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={SITE_URLS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_URLS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SITE_URLS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={SITE_URLS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ── Column 2: Resources ──────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              {FOOTER_LINKS.resources[0] ? '' : ''}
              {locale === 'es' ? 'Recursos' : 'Resources'}
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Legal ──────────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              {locale === 'es' ? 'Legal' : 'Legal'}
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Newsletter ─────────────────── */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              {tp('footer', 'newsletter')}
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              {locale === 'es'
                ? 'Recibe novedades y eventos en tu email.'
                : 'Get news and events in your inbox.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tp('footer', 'newsletterPlaceholder')}
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm h-10 focus-visible:ring-white/30"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 font-semibold"
              >
                <Send className="h-4 w-4 mr-1.5" />
                {tp('footer', 'subscribe')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────── */}
      <Separator className="bg-white/10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/80">
          <p>
            © {new Date().getFullYear()} {APP_CONFIG.name}. {tp('footer', 'rights')}.
          </p>
          <p className="flex items-center gap-1.5">
            {tp('footer', 'madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
