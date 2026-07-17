import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "CTO, TechFlow",
    image: "https://i.pravatar.cc/150?u=alex",
    content: "CommonDesk completely transformed how our engineering teams collaborate. The multi-tenant architecture gives us peace of mind when working with external contractors.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Product Lead, InnovateHQ",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "We replaced three different tools with just CommonDesk. The UI is incredibly polished, and the real-time updates make remote work feel seamless.",
    rating: 5,
  },
  {
    name: "Michael Chang",
    role: "Director of Ops, ScaleUp",
    image: "https://i.pravatar.cc/150?u=michael",
    content: "The level of control we have over permissions is unmatched. It's the first platform we've used that actually feels like it was built for enterprise scale.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
            Loved by <span className="text-text-muted">teams</span>. <br/>
            Trusted by <span className="text-text-muted">enterprises</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-surface-border bg-black/[0.01] dark:bg-background"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-text-primary leading-relaxed mb-8 text-lg font-medium">"{t.content}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-surface-border bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-text-primary font-bold text-lg">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">{t.name}</h4>
                  <p className="text-sm text-text-secondary">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
