import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThreeScene } from './components/ThreeScene';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Specialties } from './components/Specialties';
import { ServicesGrid } from './components/ServicesGrid';
import { Founders } from './components/Founders';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { BridalChatbot } from './components/BridalChatbot';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { PageRoute, ServiceName } from './data/studioContent';

const VALID_ROUTES: PageRoute[] = ['/', '/specialties', '/services', '/founders', '/book'];

function resolveRoute(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return (VALID_ROUTES.includes(normalized as PageRoute) ? normalized : '/') as PageRoute;
}

export default function App() {
  const scrollProgressRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeRoute, setActiveRoute] = useState<PageRoute>(() =>
    typeof window !== 'undefined' ? resolveRoute(window.location.pathname) : '/',
  );
  const [selectedServices, setSelectedServices] = useState<ServiceName[]>([
    'HD Bridal Makeup',
  ]);

  const isDarkTheme =
    activeRoute === '/services' || activeRoute === '/founders' || activeRoute === '/book';

  // Sync browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(resolveRoute(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track scroll depth per page for top rose-gold progress bar and 3D scene parallax
  useEffect(() => {
    let rafId = 0;

    const updateScroll = () => {
      rafId = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      scrollProgressRef.current = clamped;
      setScrollProgress(clamped);
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeRoute]);

  const navigateTo = useCallback((path: PageRoute) => {
    setActiveRoute((current) => {
      if (current === path) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return current;
      }
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState({ route: path }, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      scrollProgressRef.current = 0;
      setScrollProgress(0);
      return path;
    });
  }, []);

  const handleToggleService = useCallback((service: ServiceName) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service],
    );
  }, []);

  const handleSelectSpecialtyAndBook = useCallback(
    (service: ServiceName) => {
      setSelectedServices((prev) =>
        prev.includes(service) ? prev : [...prev, service],
      );
      navigateTo('/book');
    },
    [navigateTo],
  );

  const renderActivePage = () => {
    switch (activeRoute) {
      case '/specialties':
        return (
          <Specialties
            onSelectServiceAndBook={handleSelectSpecialtyAndBook}
            onNavigate={navigateTo}
          />
        );
      case '/services':
        return (
          <ServicesGrid
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            onNavigate={navigateTo}
          />
        );
      case '/founders':
        return <Founders onNavigate={navigateTo} />;
      case '/book':
        return (
          <BookingSection
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            onNavigate={navigateTo}
          />
        );
      case '/':
      default:
        return <Hero onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip">
      {/* Persistent 3D Three.js Scene Choreographed Per Page */}
      <ThreeScene scrollProgressRef={scrollProgressRef} activeRoute={activeRoute} />

      {/* Glassmorphic Multi-Page Floating Navbar */}
      <Navbar
        scrollProgress={scrollProgress}
        activeRoute={activeRoute}
        isDarkTheme={isDarkTheme}
        onNavigate={navigateTo}
      />

      {/* Animated Separate-Page Viewport */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoute}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Integrated Floating WhatsApp Direct Desk (Bottom-Left) */}
      <WhatsAppFloatingButton />

      {/* Fixed NS Bridal Concierge AI Chatbot (Bottom-Right) */}
      <BridalChatbot onNavigate={navigateTo} />
    </div>
  );
}
