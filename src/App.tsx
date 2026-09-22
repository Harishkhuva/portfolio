import { DBProvider, useDB } from '@/db/DBContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PlatformStrip from '@/components/PlatformStrip';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import AdminPanel from '@/components/admin/AdminPanel';

function AppContent() {
  const { loaded } = useDB();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          <p className="mt-4 text-sm font-semibold text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <PortfolioSite />;
}

function PortfolioSite() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />
      <main>
        <Hero />
        <PlatformStrip />
        <Portfolio />
        <Services />
        <About />
        <Contact />
      </main>
    </div>
  );
}

function App() {
  return (
    <DBProvider>
      <AppContent />
    </DBProvider>
  );
}

export default App;
