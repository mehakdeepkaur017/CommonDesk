import React, { Component } from "react";
import type { ReactNode } from "react";
import { Error500 } from "./ErrorStates";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || "Unknown error" };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isChunkLoadError = error.name === 'ChunkLoadError' || error.message.includes('Failed to fetch dynamically imported module');
    if (isChunkLoadError) {
      window.location.reload();
      return;
    }
    
    console.error("🔴 UNCAUGHT ERROR:", error.message);
    console.error("🔴 ERROR STACK:", error.stack);
    console.error("🔴 COMPONENT STACK:", errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      const isChunkLoadError = this.state.errorMessage.includes('Failed to fetch dynamically imported module') || this.state.errorMessage.includes('ChunkLoadError');
      if (isChunkLoadError) return null;

      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
          <Error500 />
          <div className="text-center">
            <p className="text-xs text-text-muted mb-4 max-w-md px-4 font-mono bg-surface-hover rounded-lg p-3 border border-surface-border">
              {this.state.errorMessage}
            </p>
            <button 
              onClick={this.handleReset}
              className="px-4 py-2 bg-brand-indigo text-white rounded-xl text-sm font-medium hover:bg-brand-indigo/90 transition-colors"
            >
              Try Again (Without Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
