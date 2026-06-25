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
            'A Oliveira Imóveis utiliza os dados informados nesta landing page para atendimento comercial, análise de interesse em locação e envio da pesquisa estratégica gratuita solicitada pelo usuário.',
        },
      ],
    },
    {
      heading: 'Dados coletados',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Podemos coletar nome, e-mail, WhatsApp, tipo de negócio, momento de expansão e região ou interesse informado no contato.',
        },
      ],
    },
    {
      heading: 'Finalidade do uso',
      blocks: [
        {
          type: 'list',
          items: [
            'Entrar em contato sobre a pesquisa estratégica gratuita.',
            'Entender o perfil do negócio e o interesse de locação.',
            'Enviar informações sobre imóveis comerciais e oportunidades relacionadas.',
            'Melhorar o atendimento e a comunicação da Oliveira Imóveis.',
          ],
        },
      ],
    },
    {
      heading: 'Compartilhamento',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Os dados não são vendidos. Podem ser utilizados em ferramentas necessárias para recebimento do formulário, atendimento, WhatsApp, anúncios e análise de desempenho da página.',
        },
      ],
    },
    {
      heading: 'Direitos do usuário',
      blocks: [
        {
          type: 'paragraph',
          content:
            'Você pode solicitar correção, atualização ou exclusão dos seus dados, bem como pedir a interrupção dos contatos comerciais.',
        },
      ],
    },
    {
      heading: 'Contato',
      blocks: [
        {
          type: 'paragraph',
          content: (
            <>
              Para dúvidas ou solicitações sobre privacidade, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@oliveiraimoveis.ia.br">contato@oliveiraimoveis.ia.br</a>.
            </>
          ),
        },
      ],
    },
  ],
}

export default function Privacidade() {
  return <LegalLayout data={data} />
}
