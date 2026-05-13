'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSlider } from '@/components/home/FeaturedSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { LatestListings } from '@/components/home/LatestListings';
import { EventsSection } from '@/components/home/EventsSection';
import { BusinessDirectory } from '@/components/home/BusinessDirectory';
import { PricingSection } from '@/components/home/PricingSection';
import { NewsSection } from '@/components/home/NewsSection';
import { RecyclingSection } from '@/components/home/RecyclingSection';
import { CommunityStats } from '@/components/home/CommunityStats';
import { HomeModals } from '@/components/modals/HomeModals';
import { ArticleReadingView } from '@/components/modals/ArticleReadingView';
import { ListingFullView } from '@/components/modals/ListingFullView';
import { EventFullView } from '@/components/modals/EventFullView';
import { AdminPage } from '@/components/admin/AdminPage';
import { AnunciosPage } from '@/components/pages/AnunciosPage';
import { EventosPage } from '@/components/pages/EventosPage';
import { ComingSoonPage } from '@/components/pages/ComingSoonPage';
import { NoticiasPage } from '@/components/pages/NoticiasPage';
import { ReciclajePage } from '@/components/pages/ReciclajePage';
import { DirectorioPage } from '@/components/pages/DirectorioPage';
import { useModalStore } from '@/lib/modal-store';
import { useAdminStore } from '@/lib/admin-store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const searchParams = useSearchParams();
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const currentView = useModalStore((s) => s.currentView);
  const isAdminView = useModalStore((s) => s.isAdminView);
  const setAdminView = useModalStore((s) => s.setAdminView);
  const isArticleReadingView = useModalStore((s) => s.isArticleReadingView);
  const isListingFullView = useModalStore((s) => s.isListingFullView);
  const isEventFullView = useModalStore((s) => s.isEventFullView);
  const selectedListing = useModalStore((s) => s.selectedListing);
  const selectedEvent = useModalStore((s) => s.selectedEvent);

  // Auto-activate admin view from URL param or admin store
  useEffect(() => {
    const shouldShow = searchParams.get('admin') === '1' || isAdmin;
    if (shouldShow) setAdminView(true);
  }, [searchParams, isAdmin, setAdminView]);

  // Admin view: full page, no Navbar/Footer
  if (isAdminView) {
    return <AdminPage />;
  }

  // Determine what to render in the main area
  const renderMain = () => {
    if (isListingFullView) {
      return <ListingFullView key={`listing-${selectedListing?.id ?? 'none'}`} />;
    }
    if (isEventFullView) {
      return <EventFullView key={`event-${selectedEvent?.id ?? 'none'}`} />;
    }
    if (isArticleReadingView) {
      return <ArticleReadingView />;
    }

    if (currentView === 'home') {
      return (
        <>
          <HeroSection />
          <div className="py-12 md:py-16">
            <FeaturedSlider />
          </div>
          <div className="bg-muted/30">
            <CategoryGrid />
          </div>
          <LatestListings />
          <div className="bg-muted/30">
            <EventsSection />
          </div>
          <BusinessDirectory />
          <PricingSection />
          <div className="bg-muted/30">
            <NewsSection />
          </div>
          <RecyclingSection />
          <CommunityStats />
        </>
      );
    }

    if (currentView === 'anuncios') return <AnunciosPage />;
    if (currentView === 'eventos') return <EventosPage />;
    if (currentView === 'news') return <NoticiasPage />;
    if (currentView === 'directory') return <DirectorioPage />;
    if (currentView === 'recycling') return <ReciclajePage />;
    if (currentView === 'categorias') return <ComingSoonPage viewKey="categorias" />;

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" id="public-site">
      <Navbar />
      <main className="flex-1">{renderMain()}</main>
      <Footer />
      <HomeModals />
    </div>
  );
}