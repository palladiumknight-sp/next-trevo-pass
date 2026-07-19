import { Container, SideBar, TabBar } from "@/components/layout";

import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Container className="flex flex-col md:flex-row w-full md:max-h-full">
        <SideBar />
        {children}
        <TabBar />
      </Container>
    </ProtectedRoute>
  );
}
