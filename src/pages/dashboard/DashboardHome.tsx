import React from "react";
import { motion } from "framer-motion";
import { WelcomeSection } from "./components/WelcomeSection";
import { TodayFocus } from "./components/TodayFocus";
import { ProductivityOverview } from "./components/ProductivityOverview";
import { MyProjects } from "./components/MyProjects";
import { TeamCollaboration } from "./components/TeamCollaboration";

export const DashboardHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <WelcomeSection />
      
      <ProductivityOverview />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TodayFocus />
          <MyProjects />
        </div>
        
        <div className="space-y-6">
          <TeamCollaboration />
        </div>
      </div>
    </motion.div>
  );
};
