import { Container } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { TabBar } from "@/components/layout/tab-bar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Container className="min-h-screen flex flex-col">
        {children}
        <TabBar />
      </Container>
    </ProtectedRoute>
  );
}
