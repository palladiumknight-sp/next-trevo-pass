import { Container, Footer, Header } from "@/components/layout";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Trevo Pass utiliza dados pessoais no programa de fidelidade Trevo Açaí.",
};

const sections = [
  {
    title: "1. Quem trata os dados",
    paragraphs: [
      "A Trevo Açaí, responsável pelo programa Trevo Pass, trata os dados pessoais necessários para operar a conta e as funcionalidades do programa. Antes da publicação definitiva deste documento, a empresa responsável deve inserir sua razão social, CNPJ, endereço e canal oficial de privacidade.",
    ],
  },
  {
    title: "2. Dados que podem ser utilizados",
    paragraphs: [
      "Para cadastro e identificação da conta, o Trevo Pass utiliza dados informados pelo participante, como nome, e-mail, CPF e telefone, além do identificador de conta gerado pelo serviço de autenticação.",
      "Para operar o programa, podem ser registrados saldo e nível de fidelidade, pontos acumulados, resgates, compras ou eventos elegíveis, loja relacionada, campanha ou recompensa, datas e identificadores das transações. Os dados efetivamente coletados dependem dos recursos habilitados no aplicativo.",
    ],
  },
  {
    title: "3. Para que usamos os dados",
    paragraphs: [
      "Os dados são utilizados para criar e manter a conta, autenticar o participante, registrar pontos e resgates, exibir o histórico, aplicar regras do programa, prevenir fraude, prestar atendimento e cumprir obrigações legais.",
      "Quando houver campanhas ou comunicações promocionais, os dados poderão ser utilizados para administrá-las e enviar comunicações conforme as preferências do participante e a legislação aplicável.",
    ],
  },
  {
    title: "4. Bases legais e compartilhamento",
    paragraphs: [
      "O tratamento ocorre conforme as bases legais aplicáveis da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), incluindo execução do programa solicitado, cumprimento de obrigações legais, exercício regular de direitos e, quando necessário, consentimento ou legítimo interesse avaliado conforme a lei.",
      "Os dados podem ser processados por fornecedores que apoiam a operação do aplicativo, como serviços de autenticação, banco de dados, hospedagem e infraestrutura. Esses fornecedores devem utilizá-los conforme instruções e medidas contratuais aplicáveis. Dados também podem ser compartilhados quando exigido por lei ou necessário para proteger direitos e prevenir fraude.",
    ],
  },
  {
    title: "5. Armazenamento e segurança",
    paragraphs: [
      "Os dados são mantidos pelo período necessário para operar o programa, cumprir obrigações legais, resolver disputas e proteger direitos. O prazo pode variar conforme o tipo de dado e a finalidade.",
      "São adotadas medidas técnicas e organizacionais compatíveis com o serviço para proteger os dados. Nenhum sistema é completamente imune a incidentes; caso ocorra um incidente relevante, serão adotadas as medidas previstas na legislação aplicável.",
    ],
  },
  {
    title: "6. Direitos do titular",
    paragraphs: [
      "Nos termos da LGPD, o participante pode solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade, portabilidade quando aplicável, informação sobre compartilhamentos e revisão de decisões automatizadas, além de outros direitos previstos em lei.",
      "Também é possível solicitar informações sobre consentimento e sua revogação quando o tratamento se basear nessa hipótese. A exclusão de dados poderá estar sujeita a retenção exigida por lei ou necessária ao exercício de direitos.",
    ],
  },
  {
    title: "7. Como fazer uma solicitação",
    paragraphs: [
      "Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelos canais oficiais da Trevo Açaí divulgados nas lojas ou nos canais institucionais da marca. A equipe poderá solicitar informações para confirmar sua identidade antes de atender ao pedido.",
      "A Trevo Açaí poderá atualizar esta política para refletir mudanças no aplicativo, no programa ou na legislação. A versão vigente será publicada nesta página com a respectiva data de atualização.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                Política de Privacidade
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Última atualização: 22 de novembro de 2026
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                Esta política descreve como dados pessoais são utilizados para
                oferecer o programa de fidelidade Trevo Pass.
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
