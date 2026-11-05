import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Story from "@/pages/Story";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/AdminLogin";
import AdminEvents from "@/pages/AdminEvents";
import IntroSplash from "@/components/IntroSplash";
import { Toaster } from "sonner";

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-serif text-accent mb-4">404</p>
      <h1 className="text-3xl font-serif text-primary mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <a href="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
        Return Home
      </a>
    </div>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/story" component={Story} />
          <Route path="/contact" component={Contact} />
          <Route path="/events" component={Events} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/events" component={AdminEvents} />
          <Route path="/faq" component={FAQ} />
          <Route path="/chat" component={FAQ} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ScrollToTop />
      <IntroSplash />
      <Toaster position="bottom-right" toastOptions={{ className: "font-sans" }} />
      <Router />
    </WouterRouter>
  );
}