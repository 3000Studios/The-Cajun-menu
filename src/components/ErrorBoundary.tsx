import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep lightweight log to help with debugging without breaking UI
    console.error('App error boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center text-[color:var(--text)] px-6">
            <div className="max-w-md text-center space-y-3 wallpaper-panel rounded-3xl border border-white/10 p-8">
              <h1 className="text-2xl font-serif">We’re fixing a quick hiccup</h1>
              <p className="text-sm text-[color:var(--muted)]">
                Please refresh the page. If this keeps happening, call us at (678) 899-7404.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
