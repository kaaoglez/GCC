// Gran Canaria Conecta - Global Modal State Store
// Zustand store for managing modal visibility across components

'use client';

import { create } from 'zustand';
import type { ListingDTO, EventDTO, ArticleDTO } from './types';

export type PageView = 'home' | 'anuncios' | 'categorias' | 'eventos' | 'news' | 'directory' | 'recycling';

interface ModalState {
  // Current page view (client-side routing)
  currentView: PageView;
  setCurrentView: (view: PageView) => void;

  // Admin full-page view
  isAdminView: boolean;
  setAdminView: (active: boolean) => void;

  // Post Ad Modal
  isPostAdOpen: boolean;
  openPostAd: () => void;
  closePostAd: () => void;

  // Listing Detail Modal
  selectedListing: ListingDTO | null;
  isListingDetailOpen: boolean;
  openListingDetail: (listing: ListingDTO) => void;
  closeListingDetail: () => void;

  // Search Results Modal
  searchQuery: string;
  searchCategoryId: string | null;
  isSearchOpen: boolean;
  openSearch: (query: string, categoryId?: string) => void;
  closeSearch: () => void;

  // Event Detail Modal
  selectedEvent: EventDTO | null;
  isEventDetailOpen: boolean;
  openEventDetail: (event: EventDTO) => void;
  closeEventDetail: () => void;

  // Article Detail Modal
  selectedArticle: ArticleDTO | null;
  isArticleDetailOpen: boolean;
  openArticleDetail: (article: ArticleDTO) => void;
  closeArticleDetail: () => void;

  // Article Reading View (in-page, keeps Navbar + Footer)
  isArticleReadingView: boolean;
  openArticleReadingView: (article: ArticleDTO) => void;
  closeArticleReadingView: () => void;

  // Listing Full View (in-page, keeps Navbar + Footer)
  isListingFullView: boolean;
  openListingFullView: () => void;
  closeListingFullView: () => void;

  // Event Full View (in-page, keeps Navbar + Footer)
  isEventFullView: boolean;
  openEventFullView: () => void;
  closeEventFullView: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  // Current page view
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),

  // Admin full-page view
  isAdminView: false,
  setAdminView: (active) => set({ isAdminView: active }),

  // Post Ad Modal
  isPostAdOpen: false,
  openPostAd: () => set({ isPostAdOpen: true }),
  closePostAd: () => set({ isPostAdOpen: false }),

  // Listing Detail Modal
  selectedListing: null,
  isListingDetailOpen: false,
  openListingDetail: (listing) =>
    set({ selectedListing: listing, isListingDetailOpen: true }),
  closeListingDetail: () =>
    set({ selectedListing: null, isListingDetailOpen: false }),

  // Search Results Modal
  searchQuery: '',
  searchCategoryId: null,
  isSearchOpen: false,
  openSearch: (query, categoryId) =>
    set({ searchQuery: query, searchCategoryId: categoryId || null, isSearchOpen: true }),
  closeSearch: () =>
    set({ searchQuery: '', searchCategoryId: null, isSearchOpen: false }),

  // Event Detail Modal
  selectedEvent: null,
  isEventDetailOpen: false,
  openEventDetail: (event) =>
    set({ selectedEvent: event, isEventDetailOpen: true }),
  closeEventDetail: () =>
    set({ selectedEvent: null, isEventDetailOpen: false }),

  // Article Detail Modal
  selectedArticle: null,
  isArticleDetailOpen: false,
  openArticleDetail: (article) =>
    set({ selectedArticle: article, isArticleDetailOpen: true }),
  closeArticleDetail: () =>
    set({ selectedArticle: null, isArticleDetailOpen: false }),

  // Article Reading View
  isArticleReadingView: false,
  openArticleReadingView: (article) =>
    set({ selectedArticle: article, isArticleDetailOpen: false, isArticleReadingView: true }),
  closeArticleReadingView: () =>
    set({ selectedArticle: null, isArticleReadingView: false }),

  // Listing Full View
  isListingFullView: false,
  openListingFullView: () =>
    set({ isListingDetailOpen: false, isListingFullView: true }),
  closeListingFullView: () =>
    set({ selectedListing: null, isListingFullView: false }),

  // Event Full View
  isEventFullView: false,
  openEventFullView: () =>
    set({ isEventDetailOpen: false, isEventFullView: true }),
  closeEventFullView: () =>
    set({ selectedEvent: null, isEventFullView: false }),
}));