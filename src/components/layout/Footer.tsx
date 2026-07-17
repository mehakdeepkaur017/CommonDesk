import React from "react";
import { Layers, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-surface-border bg-surface pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center">
                <Layers className="w-5 h-5 text-text-primary" />
              </div>
              <span className="text-xl font-bold font-heading text-text-primary">
                CommonDesk
              </span>
            </div>
            <p className="text-text-muted text-sm mb-6 max-w-xs">
              The modern multi-tenant workspace platform built for enterprise scale and security.
            </p>
            <div className="flex items-center gap-4 text-text-muted">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">LinkedIn</a>
              <a href="mailto:contact@example.com" className="hover:text-text-primary transition-colors"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-text-primary transition-colors">Features</a></li>
              <li><a href="#solutions" onClick={(e) => handleScrollTo(e, 'solutions')} className="hover:text-text-primary transition-colors">Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Features</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#workspace" onClick={(e) => handleScrollTo(e, 'workspace')} className="hover:text-text-primary transition-colors">Workspaces</a></li>
              <li><Link to="/auth/login" className="hover:text-text-primary transition-colors">Authentication</Link></li>
              <li><a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-text-primary transition-colors">Real-time</a></li>
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Developers</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">API Reference</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">Open Source</a></li>
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">Status</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-text-primary font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><a href="#top" onClick={(e) => handleScrollTo(e, 'top')} className="hover:text-text-primary transition-colors">About Us</a></li>
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">Careers</Link></li>
              <li><Link to="/auth/register" className="hover:text-text-primary transition-colors">Blog</Link></li>
              <li><a href="mailto:contact@example.com" className="hover:text-text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div>© {new Date().getFullYear()} CommonDesk. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/auth/register" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="/auth/register" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <div className="w-1.5 h-1.5 rounded-full bg-surface-hover" />
            <Link to="/auth/register" className="hover:text-text-primary transition-colors">System Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
