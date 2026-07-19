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
        <div className="hidden h-screen w-64 md:block"></div>
        {children}
        <div className="w-full h-20 md:hidden"></div>
        <TabBar />
      </Container>
    </ProtectedRoute>
  );
}
