import { AppErrorState } from "@/components/feedback/app-error-state";

export default function NotFound() {
  return <AppErrorState kind="not-found" />;
}
