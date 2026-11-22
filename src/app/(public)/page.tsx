import { Container, Footer, Header } from "@/components/layout";

import Image from "next/image";
import { LaminatedLink } from "@/components/ui/laminated";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trevo Pass - Programa de Fidelidade Trevo Açaí",

  description:
    "Trevo Pass é o programa oficial de fidelidade da Trevo Açaí. Acumule pontos a cada compra, resgate recompensas e aproveite benefícios exclusivos em todas as lojas.",

  keywords: [
    "açaí",
    "programa de fidelidade",
    "Trevo Açaí",
    "pontos",
    "recompensas",
    "app de fidelidade",
    "PWA",
  ],

  openGraph: {
    title: "Trevo Pass - Programa de Fidelidade Trevo Açaí",
    description:
      "Acumule pontos, resgate recompensas e aproveite benefícios exclusivos com o Trevo Pass.",
    url: "https://next-trevo-pass.vercel.app",
    siteName: "Trevo Açaí",
    images: [
      {
        url: "/assets/seo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trevo Pass - Programa de Fidelidade Trevo Açaí",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Trevo Pass - Programa de Fidelidade Trevo Açaí",
    description:
      "Acumule pontos, resgate recompensas e aproveite benefícios exclusivos com o Trevo Pass.",
    images: ["/assets/seo/og-image.png"],
  },

  alternates: {
    canonical: "https://next-trevo-pass.vercel.app",
  },
};

export default function Home() {
  const benefits = [
    {
      icon: "/icons/gain-points.png",
      title: "Ganhe Pontos",
      description: "Compre nas lojas e acumule pontos a cada compra",
      alt: "",
    },
    {
      icon: "/icons/claim-rewards.png",
      title: "Resgate Prêmios",
      description: "Troque seus pontos por descontos e produtos",
      alt: "",
    },
    {
      icon: "/icons/exclusive-benefits.png",
      title: "Benefícios Exclusivos",
      description: "Desbloqueie vantagens especiais e ofertas",
      alt: "",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="w-full bg-slate-100">
        <Container className="flex flex-col gap-8 px-4 py-8 md:p-8 lg:p-12">
          <picture className="flex flex-col items-center">
            <source
              media="(max-width: 768px)"
              srcSet="/illustrations/hero-mobile.png"
            />
            <source
              media="(max-width: 1200px)"
              srcSet="/illustrations/hero-tablet.png"
            />
            <img
              src="/illustrations/hero-desktop.png"
              alt="hero trevo pass"
              className="max-h-96"
            />
          </picture>
          <LaminatedLink
            href="/register"
            color="yellow"
            size="lg"
            className="text-center max-w-75 mx-auto"
          >
            Cadastre-se Agora!
          </LaminatedLink>
          <ul className="flex flex-col md:flex-row gap-8 items-center justify-between">
            {benefits.map((el, index) => (
              <li
                key={index}
                className="flex flex-row items-center gap-4 flex-1 w-full bg-slate-200 p-4 rounded-md shadow-md md:flex-col md:gap-2 lg:max-w-75"
              >
                <Image
                  src={el.icon}
                  width={128}
                  height={128}
                  sizes="(min-width: 768px) 128px, 56px"
                  alt={el.alt}
                  className="w-14 md:w-32 h-auto"
                />
                <div className="flex flex-col">
                  <span className="text-base text-violet-900 font-ubuntu font-bold md:text-center">
                    {el.title}
                  </span>
                  <span className="text-xs text-violet-700 font-ubuntu font-normal md:text-center">
                    {el.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
