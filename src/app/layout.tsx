import "./globals.css";

import { Inter, Lato, Ubuntu } from "next/font/google";

import { AuthProvider } from "@/contexts/auth-context";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"]
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"]
});

export function generateViewport() {
  return {
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
    themeColor: "#501843",
    colorScheme: "light",
  };
}

export const metadata: Metadata = {
  metadataBase: new URL("https://trevo-pass.vercel.app"),

  applicationName: "Trevo Açaí - Trevo Pass",
  title: {
    default: "Trevo Pass",
    template: "%s | Trevo Açaí",
  },

  description:
    "Trevo Pass é o programa de fidelidade oficial da Trevo Açaí. Acumule pontos, ganhe recompensas e aproveite benefícios exclusivos em todas as lojas.",

  authors: [{ name: "David Almeida" }],
  creator: "David Almeida",

  manifest: "/assets/seo/site.webmanifest",

  appleWebApp: {
    capable: true,
    title: "Trevo Pass",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },

  icons: {
    icon: [
      {
        url: "/assets/seo/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/seo/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/assets/seo/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/assets/seo/safari-pinned-tab.svg",
        color: "#501843",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${lato.variable} ${ubuntu.variable} bg-slate-100 antialiased`}>
        <AuthProvider>
          <Toaster position="bottom-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
