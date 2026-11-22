import { Container, Footer, Header } from "@/components/layout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description: "Termos de uso do programa de fidelidade Trevo Pass.",
};

const sections = [
  {
    title: "1. Sobre o Trevo Pass",
    paragraphs: [
      "O Trevo Pass é um programa de fidelidade da Trevo Açaí. Por meio do aplicativo, participantes podem acompanhar pontos, consultar movimentações e, quando disponíveis, trocar pontos por recompensas oferecidas pelo programa.",
      "Ao criar uma conta ou utilizar o aplicativo, você declara que leu estes termos. Caso não concorde com eles, não utilize o serviço.",
    ],
  },
  {
    title: "2. Conta e responsabilidades do participante",
    paragraphs: [
      "O cadastro deve utilizar informações verdadeiras, atuais e pertencentes ao participante. Cada pessoa é responsável por manter a confidencialidade de suas credenciais e por comunicar a Trevo Açaí caso suspeite de uso não autorizado da conta.",
      "A conta é pessoal e não deve ser compartilhada ou utilizada para manipular o programa, obter pontos indevidamente ou realizar atividades ilícitas.",
    ],
  },
  {
    title: "3. Pontos e movimentações",
    paragraphs: [
      "Os pontos são concedidos conforme as regras vigentes do programa e podem depender de compras elegíveis, campanhas ou outras ações divulgadas pela Trevo Açaí. O aplicativo apresenta o saldo e, quando disponível, o histórico de movimentações.",
      "Pontos não são dinheiro, não podem ser convertidos em espécie nem transferidos, salvo se uma regra específica do programa permitir. A Trevo Açaí poderá corrigir movimentações comprovadamente duplicadas, incorretas ou obtidas em desacordo com estes termos, preservados os direitos do consumidor.",
    ],
  },
  {
    title: "4. Recompensas e resgates",
    paragraphs: [
      "As recompensas podem variar por loja, campanha, disponibilidade e período. Cada recompensa poderá ter requisitos próprios, como quantidade de pontos, prazo de validade ou local de utilização; essas condições serão informadas no aplicativo ou no momento da oferta.",
      "Um resgate somente será considerado concluído após a confirmação apresentada pelo aplicativo ou pela equipe da loja. Uma recompensa indisponível ou expirada não poderá ser resgatada, salvo disposição legal em contrário.",
    ],
  },
  {
    title: "5. Campanhas e alterações das regras",
    paragraphs: [
      "Campanhas promocionais podem ter regras, duração, limites e critérios de participação próprios. A participação em uma campanha não é automática: é necessário cumprir as condições divulgadas para ela.",
      "A Trevo Açaí poderá atualizar estes termos e as regras do programa. Alterações relevantes serão comunicadas pelos canais disponíveis. A versão vigente será publicada nesta página com sua data de atualização.",
    ],
  },
  {
    title: "6. Disponibilidade e uso adequado",
    paragraphs: [
      "O aplicativo pode passar por manutenção, atualizações ou indisponibilidades temporárias. A Trevo Açaí buscará restabelecer o serviço, sem garantir funcionamento ininterrupto ou livre de erros.",
      "Não é permitido tentar acessar contas ou sistemas de terceiros, interferir no funcionamento do aplicativo, falsificar transações ou utilizar o serviço para fraude. Violações poderão resultar em restrições ou suspensão da conta, observadas a legislação e a possibilidade de contestação.",
    ],
  },
  {
    title: "7. Privacidade e atendimento",
    paragraphs: [
      "O tratamento de dados pessoais relacionado ao Trevo Pass é explicado na Política de Privacidade, disponível nesta aplicação. Ela descreve os dados utilizados, finalidades, compartilhamentos e direitos dos titulares.",
      "Para dúvidas sobre estes termos, sobre pontos ou recompensas, utilize os canais oficiais de atendimento da Trevo Açaí divulgados nas lojas ou nos canais institucionais da marca.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1 bg-slate-100 py-8 md:py-12">
        <Container className="px-4 md:px-8">
          <article className="mx-auto max-w-3xl rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <header className="mb-8 border-b border-violet-100 pb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                Trevo Pass
              </p>
              <h1 className="mt-2 text-3xl font-bold text-violet-950 sm:text-4xl">
                Termos de Serviço
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Última atualização: 22 de novembro de 2026
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                Estes termos explicam as condições de uso do Trevo Pass e do
                programa de fidelidade da Trevo Açaí.
              </p>
            </header>

            <div className="space-y-7">
              {sections.map((section) => (
                <section key={section.title} className="space-y-2">
                  <h2 className="text-lg font-bold text-violet-950">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-7 text-slate-600">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
