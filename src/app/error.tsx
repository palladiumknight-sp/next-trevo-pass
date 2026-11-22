"use client";

import { AppErrorState } from "@/components/feedback/app-error-state";

interface AppErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppErrorBoundary({
  error,
  reset,
}: AppErrorBoundaryProps) {
  void error;

  return <AppErrorState kind="unexpected" onRetry={reset} />;
}
