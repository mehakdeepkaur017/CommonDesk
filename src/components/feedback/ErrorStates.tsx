import React from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, WifiOff, ServerCrash, Home, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";

export const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-brand-indigo/10 rounded-3xl flex items-center justify-center mb-8 border border-brand-indigo/20 shadow-[0_0_40px_rgba(79,70,229,0.1)]"
      >
        <AlertOctagon className="w-12 h-12 text-brand-indigo" />
      </motion.div>
      <h1 className="text-4xl font-bold font-heading text-text-primary mb-4">404</h1>
      <h2 className="text-xl font-medium text-text-primary mb-2">Page not found</h2>
      <p className="text-sm text-text-muted mb-8 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>
          <Home className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export const ErrorNetwork = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20"
      >
        <WifiOff className="w-12 h-12 text-red-400" />
      </motion.div>
      <h2 className="text-xl font-medium text-text-primary mb-2">Network Error</h2>
      <p className="text-sm text-text-muted mb-8 max-w-sm">
        We couldn't connect to the server. Please check your internet connection.
      </p>
      <Button onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" /> Try Again
      </Button>
    </div>
  );
};

export const Error500 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20"
      >
        <ServerCrash className="w-12 h-12 text-red-400" />
      </motion.div>
      <h1 className="text-4xl font-bold font-heading text-text-primary mb-4">500</h1>
      <h2 className="text-xl font-medium text-text-primary mb-2">Server Error</h2>
      <p className="text-sm text-text-muted mb-8 max-w-sm">
        Something went wrong on our end. Our engineering team has been notified.
      </p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw className="w-4 h-4 mr-2" /> Reload Page
      </Button>
    </div>
  );
};
