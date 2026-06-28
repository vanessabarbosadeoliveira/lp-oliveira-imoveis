-- Run this AFTER schema.sql in Supabase > SQL Editor
-- Seeds: form fields for the research platform

INSERT INTO public.form_fields
  (key, label, field_type, placeholder, hint, required)
VALUES
  (
    'segmento',
    'Qual é o seu segmento / produto / franquia?',
    'text',
    'Ex: Pilates, estética, pet shop, franquia…',
    null,
    true
  ),
  (
    'ticket_medio',
    'Qual é o ticket médio que você pretende praticar?',
    'currency',
    'R$ 0,00',
    null,
    true
  ),
  (
    'publico_alvo',
    'Quem é o seu público-alvo?',
    'textarea',
    'Ex: Mulheres de 25–45 anos, classe B/C, interessadas em bem-estar…',
    'Descreva a classe social, perfil e faixa etária.',
    true
  ),
  (
    'experiencia_segmento',
    'Você já tem experiência neste segmento? Se sim, há quanto tempo?',
    'textarea',
    'Ex: Sim, 3 anos gerenciando uma unidade em São Paulo.',
    null,
    true
  ),
  (
    'meta_faturamento_mes1',
    'Qual é a sua meta de faturamento para o 1º mês?',
    'currency',
    'R$ 0,00',
    null,
    true
  ),
  (
    'meta_faturamento_6m',
    'Qual é a sua meta de faturamento para 6 meses?',
    'currency',
    'R$ 0,00',
    null,
    true
  ),
  (
    'area_minima',
    'Qual é a área mínima necessária para o seu negócio?',
    'number',
    '0',
    'em m²',
    true
  ),
  (
    'prioridade_localizacao',
    'O que é mais importante para você na localização?',
    'textarea',
    'Ex: Fluxo de pedestres, estacionamento próximo, visibilidade da fachada…',
    null,
    true
  ),
  (
    'regiao_bairro',
    'Em qual região / bairro pensa em implantar este empreendimento?',
    'text',
    'Ex: Savassi, Buritis, Centro…',
    null,
    true
  ),
  (
    'orcamento_aluguel',
    'Qual o valor de aluguel + condomínio + IPTU que pretende pagar?',
    'currency',
    'R$ 0,00',
    'Valor mensal total.',
    true
  );

-- ─────────────────────────────────────────────────────────────
-- FORM TEMPLATE: Pesquisa de Mercado V5
-- ─────────────────────────────────────────────────────────────

INSERT INTO public.form_templates (slug, title, description, llm_prompt_template, sort_order)
VALUES (
  'pesquisa-mercado',
  'Pesquisa de Mercado V5',
  'Pesquisa de mercado completa seguindo a Metodologia V5 Oliveira Imóveis — análise de região, concorrência, ecossistema de referral, viabilidade financeira e Score V5.',
  $prompt$
Você é Clóvis, especialista em pesquisa de mercado da Rede Oliveira Imóveis.

Execute uma pesquisa de mercado completa seguindo a Metodologia V5 Oliveira Imóveis para o empresário abaixo.

---

DADOS DO EMPRESÁRIO E NEGÓCIO:
- Segmento / produto / franquia: {{segmento}}
- Ticket médio alvo: {{ticket_medio}}
- Público-alvo: {{publico_alvo}}
- Experiência no segmento: {{experiencia_segmento}}
- Meta de faturamento — Mês 1: {{meta_faturamento_mes1}}
- Meta de faturamento — 6 meses: {{meta_faturamento_6m}}
- Área mínima necessária: {{area_minima}} m²
- Critérios de localização valorizados: {{prioridade_localizacao}}

DADOS DO IMÓVEL:
- Região / bairro de preferência: {{regiao_bairro}}
- Custo mensal do imóvel (aluguel + condomínio + IPTU): R$ {{orcamento_aluguel}}

---

EXECUTE AS 7 ETAPAS OBRIGATÓRIAS:

ETAPA 1 — Análise da Região
- Analisar a região informada: {{regiao_bairro}}
- População do bairro (IBGE Censo mais recente)
- Perfil socioeconômico predominante
- Valor do m² (posicionamento relativo na cidade)
- Bairros vizinhos no catchment (raio 3–5km)

ETAPA 2 — Mapeamento de Concorrência (via Google Maps)
REGRA INVIOLÁVEL: Verificar TODOS os concorrentes via Google Maps antes de qualquer afirmação.
Buscar concorrentes em: {{regiao_bairro}}
Para cada concorrente, levantar:
- Nome, endereço exato, nota, nº de avaliações, horário de funcionamento
- Classificação: mesmo eixo / eixo perpendicular / polo consolidado
- Nível de ameaça: ALTA / MÉDIA / BAIXA com justificativa
Insight: concorrente com nota baixa e poucos reviews no mesmo eixo = oportunidade.

ETAPA 3 — Ecossistema de Referral
Mapear via Google Maps em {{regiao_bairro}}:
- Médicos / clínicas / labs do segmento {{segmento}} no bairro
- Âncoras de fluxo (supermercados, farmácias, academias próximas)
- Parceiros potenciais (convênio, indicação, material de ponto)
- Priorizar players com alto volume de avaliações (= alto fluxo de pessoas)

ETAPA 4 — Análise Financeira
- Custo fixo do imóvel informado: R$ {{orcamento_aluguel}}
- Breakeven em nº de vendas/mês: R$ {{orcamento_aluguel}} ÷ R$ {{ticket_medio}}
- Curva de ramp-up projetada: meses 1–3 / 4–6 / 6+
- Payback estimado do investimento inicial
- % aluguel/faturamento por fase (saudável: <8%)
- Comparar com metas: R$ {{meta_faturamento_mes1}} (mês 1) e R$ {{meta_faturamento_6m}} (6 meses)

ETAPA 5 — Score V5 (escala 0–10)
- Demanda comprovada no eixo
- Força da concorrência direta (inverso)
- Qualidade do ecossistema de referral
- Viabilidade financeira do ponto
- Diferencial da região (âncoras, fluxo, acessibilidade)
Score ≥ 7,5 = FAVORÁVEL · Score 5–7,4 = ATENÇÃO · Score < 5 = DESFAVORÁVEL

ETAPA 6 — 3 Condições para o Sucesso
Liste 3 ações concretas que o empresário deve tomar para o score se confirmar na prática.

ETAPA 7 — Disclaimer
"Esta pesquisa foi elaborada pela Oliveira Imóveis como instrumento de inteligência de mercado. Não constitui garantia de resultado, rentabilidade ou sucesso do empreendimento. A decisão final é de responsabilidade exclusiva do empreendedor."

---

FORMATO DE ENTREGA:
Relatório completo em Markdown com seções claras, tabela de concorrentes, Score V5 destacado, 3 condições para o sucesso e disclaimer ao final.
  $prompt$,
  1
);

-- Link all 10 fields to the template, in order, with section groupings
INSERT INTO public.form_template_fields (form_template_id, form_field_id, sort_order, section)
SELECT
  t.id,
  f.id,
  x.sort_order,
  x.section
FROM public.form_templates t
CROSS JOIN (VALUES
  ('segmento',               1, 'Sobre o negócio'),
  ('ticket_medio',           2, 'Sobre o negócio'),
  ('publico_alvo',           3, 'Sobre o negócio'),
  ('experiencia_segmento',   4, 'Sobre o negócio'),
  ('meta_faturamento_mes1',  5, 'Metas financeiras'),
  ('meta_faturamento_6m',    6, 'Metas financeiras'),
  ('area_minima',            7, 'Sobre o espaço'),
  ('prioridade_localizacao', 8, 'Sobre a localização'),
  ('regiao_bairro',          9, 'Sobre a localização'),
  ('orcamento_aluguel',     10, 'Sobre a localização')
) AS x(field_key, sort_order, section)
JOIN public.form_fields f ON f.key = x.field_key
WHERE t.slug = 'pesquisa-mercado';
