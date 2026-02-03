"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState =
  | { status: "idle" }
  | { status: "error"; error: Error; errorInfo?: ErrorInfo };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { status: "idle" };
  }

  static getDerivedStateFromError(error: Error): { status: "error"; error: Error } {
    return { status: "error", error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState((s) => (s.status === "error" ? { ...s, errorInfo } : s));
  }

  render(): ReactNode {
    if (this.state.status !== "error") return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <section
        className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
        role="alert"
        aria-label="Error boundary"
      >
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="mt-1 text-sm">{this.state.error.message}</p>
        <button
          type="button"
          onClick={() => this.setState({ status: "idle" })}
          className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          aria-label="Retry"
          tabIndex={0}
        >
          Retry
        </button>
      </section>
    );
  }
}
