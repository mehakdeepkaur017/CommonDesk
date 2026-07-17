import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

const navLinks: { name: string; href: string; badge?: string }[] = [
  { name: "Features", href: "#features" },
  { name: "Solutions", href: "#solutions" },
  { name: "Workspace", href: "#workspace" },
  { name: "Security", href: "#security" },
  { name: "Resources", href: "#resources" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-300 ${
            scrolled ? "glass-nav" : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-text-primary">
              CommonDesk
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative group"
              >
                {link.name}
                {link.badge && (
                  <span className="absolute -top-3 -right-6 px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-violet/20 text-brand-violet border border-brand-violet/20">
                    Soon
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/auth/join-organization')}>
              Join Organization
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/auth/create-organization')}>
              Create Organization
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-6 right-6 mt-2 p-6 glass-card rounded-2xl flex flex-col gap-4 lg:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-text-primary hover:text-text-primary flex items-center justify-between"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-violet/20 text-brand-violet">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
              <div className="h-px bg-surface my-2" />
              <Button variant="ghost" className="w-full justify-start px-0" onClick={() => navigate('/auth/login')}>Sign In</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/auth/join-organization')}>Join Organization</Button>
              <Button variant="primary" className="w-full" onClick={() => navigate('/auth/create-organization')}>Create Organization</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
