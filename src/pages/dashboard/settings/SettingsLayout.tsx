import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Users, 
  ShieldCheck, 
  Bell, 
  Lock, 
  MonitorSmartphone, 
  AlertTriangle 
} from "lucide-react";
import { GeneralSettings } from "./tabs/GeneralSettings";
import { BrandingSettings } from "./tabs/BrandingSettings";
import { SecuritySettings } from "./tabs/SecuritySettings";
import { NotificationsSettings } from "./tabs/NotificationsSettings";
import { AppearanceSettings } from "./tabs/AppearanceSettings";
import { DangerZoneSettings } from "./tabs/DangerZoneSettings";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "members", label: "Members", icon: Users, route: "/dashboard/members" },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: MonitorSmartphone },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

export const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();

  const handleTabClick = (tab: { id: string; label: string; icon: any; route?: string }) => {
    if (tab.route) {
      navigate(tab.route);
    } else {
      setActiveTab(tab.id);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general": return <GeneralSettings />;
      case "branding": return <BrandingSettings />;
      case "security": return <SecuritySettings />;
      case "notifications": return <NotificationsSettings />;
      case "appearance": return <AppearanceSettings />;
      case "danger": return <DangerZoneSettings />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 h-full"
    >
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-6">Settings</h1>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? (tab.danger ? "bg-red-500/10 text-red-400" : "bg-brand-indigo/10 text-brand-indigo") 
                  : (tab.danger ? "text-red-400/70 hover:bg-red-500/5 hover:text-red-400" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary")
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 glass-card rounded-2xl border border-surface-border bg-black/[0.02] dark:bg-background p-6 sm:p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
