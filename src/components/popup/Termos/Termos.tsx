import LegalLayout from '../../LegalLayout/LegalLayout'
import type { LegalPageData } from '../../LegalLayout/LegalLayout'

const data: LegalPageData = {
  tag: 'Oliveira Imóveis',
  title: 'Termos de Uso',
  updatedAt: 'Última atualização: junho de 2025',
  sections: [
    {
      blocks: [
        {
          type: 'paragraph',
          content:
            'Estes Termos de Uso regulam o acesso às páginas, formulários e canais digitais da Oliveira Imóveis relacionados à divulgação de imóveis, oportunidades comerciais e atendimento ao cliente.',
        },
      ],
    },
    {
      heading: '1. Uso do site',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Ao navegar pelo site ou enviar informações por formulário, você declara que fornecerá dados verdadeiros e utilizará os canais apenas para fins lícitos, como solicitar informações, agendar atendimento ou receber contato comercial.',
        },
      ],
    },
    {
      heading: '2. Informações sobre imóveis',
      blocks: [
        {
          type: 'paragraph',
          content:
            'As informações apresentadas sobre imóveis, valores, disponibilidade, condições comerciais e características podem ser atualizadas sem aviso prévio. A confirmação final deve ser feita diretamente com a equipe da Oliveira Imóveis.',
        },
      ],
    },
    {
      heading: '3. Formulários e WhatsApp',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Ao preencher um formulário, você autoriza a Oliveira Imóveis a utilizar os dados informados para contato, atendimento, análise de interesse e envio de informações relacionadas ao imóvel ou serviço solicitado.',
        },
      ],
    },
    {
      heading: '4. Responsabilidades',
      blocks: [
        {
          type: 'paragraph',
          content:
            'A Oliveira Imóveis busca manter suas páginas disponíveis e atualizadas, mas não garante funcionamento ininterrupto, ausência de erros técnicos ou disponibilidade permanente de links externos, como WhatsApp, plataformas de anúncios e ferramentas de análise.',
        },
      ],
    },
    {
      heading: '4.1. Isenção de responsabilidade sobre a pesquisa de mercado',
      lead: {
        type: 'paragraph',
        content:
          'A pesquisa de mercado fornecida pela Oliveira Imóveis é elaborada com base nas informações disponíveis no momento da solicitação, com caráter exclusivamente informativo e orientativo. O usuário declara que a solicita por livre e espontânea vontade, ciente de que:',
      },
      blocks: [
        {
          type: 'list',
          items: [
            'A pesquisa não constitui consultoria financeira, imobiliária ou jurídica.',
            'Os resultados, projeções e análises apresentados são estimativas, sujeitos a variações de mercado e circunstâncias externas não controláveis pela Oliveira Imóveis.',
            'A decisão de abrir, expandir ou manter um negócio é de responsabilidade exclusiva do usuário.',
            'A Oliveira Imóveis não se responsabiliza por perdas, prejuízos ou frustrações decorrentes do uso ou interpretação das informações contidas na pesquisa.',
          ],
        },
      ],
    },
    {
      heading: '5. Propriedade intelectual',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Textos, imagens, marcas, layouts e demais conteúdos das páginas da Oliveira Imóveis não devem ser copiados, reproduzidos ou utilizados sem autorização prévia.',
        },
      ],
    },
    {
      heading: '6. Privacidade',
      blocks: [
        {
          type: 'paragraph',
          content: (
            <>
              O tratamento de dados pessoais é descrito na{' '}
              <a href="/privacidade" rel="noopener">Política de Privacidade</a>,
              {' '}que integra estes Termos de Uso.
            </>
          ),
        },
      ],
    },
    {
      heading: '7. Alterações',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Estes termos podem ser atualizados para refletir mudanças nos serviços, canais de atendimento, exigências legais ou práticas comerciais.',
        },
      ],
    },
  ],
}

export default function Termos() {
  return <LegalLayout data={data} />
}
