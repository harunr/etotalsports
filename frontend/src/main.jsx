import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreProvider, useStore } from './store.jsx';
import { Preloader, Cursor, ScrollProgress, ScrollTrigger } from './fx.jsx';
import { AnnouncementBar, Header, MobileMenu, CartDrawer, SearchOverlay, QuickView, Footer } from './Shell.jsx';
import SupportChat from './SupportChat.jsx';
import { Toasts, Btn } from './ui.jsx';
import { Home, NewsPage } from './Pages1.jsx';
import { CartPage, Terms, Privacy, NotFound } from './Pages3.jsx';
import { Shop, ProductPage, Wishlist, Checkout, OrderDone, About, Contact } from './Pages2.jsx';

function Router() {
  const { route, navigate } = useStore();
  useEffect(() => { window.scrollTo(0, 0); const t = setTimeout(() => ScrollTrigger.refresh(), 250); return () => clearTimeout(t); }, [route.key]);
  const pages = { home: Home, shop: Shop, product: ProductPage, wishlist: Wishlist, checkout: Checkout, order: OrderDone, about: About, contact: Contact, news: NewsPage, cart: CartPage, terms: Terms, privacy: Privacy, notfound: NotFound };
  const Page = pages[route.name] || NotFound;
  return <AnimatePresence mode="wait" initial={false}><motion.main key={route.key} id="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}><Page /></motion.main></AnimatePresence>;
}

function App() {
  return (
    <StoreProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[300] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:font-bold">Skip to content</a>
      <Preloader /><Cursor /><ScrollProgress />
      <AnnouncementBar /><Header /><Router /><Footer />
      <MobileMenu /><CartDrawer /><SearchOverlay /><QuickView /><Toasts />
      <SupportChat />
    </StoreProvider>
  );
}
createRoot(document.getElementById('root')).render(<App />);
