import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, LayoutDashboard } from "lucide-react";

import logoImg from "@assets/WhatsApp_Image_2026-03-03_at_1.45.01_AM_1772495301593.jpeg";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { lang, setLang, t, setCartOpen, cartCount } = useAppStore();
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');
  const closeMenu = () => setMobileMenuOpen(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  if (user?.role === "ADMIN") {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled ? "glass py-2" : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-xl shadow-primary/10 group-hover:scale-105 transition-all duration-500">
              <img src={logoImg} alt="Air Bliss" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-black text-foreground tracking-tighter leading-none group-hover:text-primary transition-colors">
                AIR BLISS<span className="text-primary">.</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mt-1">Breathe Easy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-wide uppercase transition-all hover:text-primary relative group ${location === link.href ? "text-primary" : "text-foreground/70"
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-all text-foreground/70 hover:text-primary"
              aria-label="Toggle Language"
            >
              <span className="text-xs font-bold uppercase">{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-all text-foreground/70 hover:text-primary relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount() > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in">
                  {cartCount()}
                </span>
              )}
            </button>

            {user && (
              <button
                onClick={() => logoutMutation.mutate()}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-all text-foreground/70 hover:text-destructive"
                aria-label="Logout"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-all text-foreground/70"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-border/50 py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`text-lg font-medium py-2 border-b border-border/50 ${location === link.href ? "text-primary" : "text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
