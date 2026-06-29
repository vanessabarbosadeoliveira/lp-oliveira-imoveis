import LegalLayout from '../../LegalLayout/LegalLayout'
import type { LegalPageData } from '../../LegalLayout/LegalLayout'

const data: LegalPageData = {
  tag: 'Oliveira Imóveis',
  title: 'Política de Privacidade',
  updatedAt: 'Última atualização: junho de 2025',
  sections: [
    {
      blocks: [
        {
          type: 'paragraph',
          content:
            'Esta Política de Privacidade explica como a Oliveira Imóveis coleta, utiliza e protege dados pessoais enviados em suas páginas, formulários e canais digitais, em conformidade com a Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018.',
        },
      ],
    },
    {
      heading: '1. Dados coletados',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Podemos coletar dados fornecidos diretamente por você, como nome, e-mail, telefone/WhatsApp e mensagem de interesse. Também podemos registrar dados de navegação e origem da campanha, como página acessada, data, horário, dispositivo, fonte de tráfego e parâmetros UTM.',
        },
      ],
    },
    {
      heading: '2. Finalidade do uso',
      lead: {
        type: 'paragraph',
        content:
          'Os dados podem ser utilizados para:',
      },
      blocks: [
        {
          type: 'list',
          items: [
            'Responder solicitações feitas pelo formulário ou WhatsApp.',
            'Entrar em contato sobre imóveis, visitas e oportunidades comerciais.',
            'Organizar atendimento e histórico de relacionamento.',
            'Medir desempenho de campanhas e melhorar a comunicação.',
            'Cumprir obrigações legais e regulatórias quando necessário.'
          ],
        },
      ],
    },
    {
      heading: '3. Base legal',
      blocks: [
        {
          type: 'paragraph',
          content:
            'O tratamento pode ocorrer com base no consentimento fornecido no formulário, na execução de procedimentos preliminares relacionados ao atendimento solicitado, no legítimo interesse para melhoria dos serviços e no cumprimento de obrigações legais.',
        },
      ],
    },
    {
      heading: '4. Compartilhamento',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Os dados podem ser compartilhados com prestadores de serviço necessários para operação dos canais digitais, como ferramentas de hospedagem, análise, anúncios, CRM, automação e atendimento por WhatsApp. Esses parceiros devem utilizar os dados apenas para as finalidades contratadas.',
        },
      ],
    },
    {
      heading: '5. Cookies e ferramentas de medição',
      blocks: [
        {
          type: 'paragraph',
          content:
            'A página pode utilizar tecnologias como Google Analytics, Meta Pixel e parâmetros UTM para medir visitas, origem de campanhas, interações com formulário e cliques para WhatsApp. Essas informações ajudam a entender quais campanhas geram contatos mais qualificados.',
        },
      ],
    },
    {
      heading: '6. Conservação dos dados',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Os dados serão mantidos pelo tempo necessário para atendimento, relacionamento comercial, análise de campanhas e cumprimento de obrigações legais. Quando não forem mais necessários, poderão ser excluídos ou anonimizados.',
        },
      ],
    },
    {
      heading: '7. Direitos do titular',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Você pode solicitar confirmação de tratamento, acesso, correção, exclusão, anonimização, portabilidade, revogação de consentimento e informações sobre compartilhamento, conforme previsto na LGPD.',
        },
      ],
    },
    {
      heading: '8. Segurança',
      blocks: [
        {
          type: 'paragraph',
          content:
            'A Oliveira Imóveis adota medidas razoáveis para proteger dados pessoais contra acessos não autorizados, perda, alteração ou uso inadequado.',
        },
      ],
    },
    {
      heading: '9. Contato',
      blocks: [
        {
          type: 'paragraph',
          content: (
            <>
              Para dúvidas ou solicitações sobre privacidade, entre em contato pelo WhatsApp:{' '}
              <a href="tel:+5531999558360">(31) 99955-8360</a>.
            </>
          ),
        },
      ],
    },
    {
      heading: '10. Atualizações',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Esta Política de Privacidade pode ser atualizada periodicamente. A versão vigente será sempre a publicada nesta página.',
        },
      ],
    },
  ],
}

export default function Privacidade() {
  return <LegalLayout data={data} />
}
