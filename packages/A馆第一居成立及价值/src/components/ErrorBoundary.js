import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.retryCount = 0;
    this.lastErrorTime = 0;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    const now = Date.now();
    // Reset retry count if last error was more than 5 seconds ago
    if (now - this.lastErrorTime > 5000) {
      this.retryCount = 0;
    }
    
    this.lastErrorTime = now;
    this.retryCount++;

    // Limit retries to prevent infinite loops (e.g. max 5 retries in 5 seconds)
    if (this.retryCount <= 5) {
      // Immediate recovery
      setTimeout(() => {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }, 50);
    }
  }

  render() {
    if (this.state.hasError) {
      // Return null to render nothing (transparent), minimizing visual impact during quick recovery.
      // If the body has a background color/image, it will show through.
      return null;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
