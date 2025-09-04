import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo); // Debugging
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="text-red-500">{this.state.error.message}</p>
          <details className="mt-4">
            <summary className="cursor-pointer text-indigo-600">Error Details</summary>
            <pre className="text-sm text-gray-600">{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);