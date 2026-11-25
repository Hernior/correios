# Correios Toolkit v3

Aplicativo independente, estático, sem credenciais, sem backend e sem dependências de execução. Preserva a declaração de conteúdo v2 e adiciona o simulador de frete PAC/SEDEX.

## Executar e publicar

- Para testar localmente, execute `python -m http.server 8000` na raiz e abra `http://localhost:8000`. Não abra o HTML com file://, pois módulos e JSON precisam de HTTP.
- Publique todos os arquivos e diretórios na raiz do repositório, incluindo `.nojekyll`. Em Settings > Pages, selecione Deploy from a branch, main, / (root). Não exige build.
- Testes: `node --test tests/*.test.mjs` (Node 18+). Sintaxe: `node --check js/shipping.mjs`.

## Arquitetura

- `index.html`: declaração de conteúdo preservada, contêiner do simulador, navegação.
- `shipping.css`: visual responsivo, modo escuro automático, gráficos e carregamento.
- `js/shipping.mjs`: wizard, dados compartilhados, renderização SVG, cotações manuais e persistência opt-in.
- `js/rules.mjs`: cubagem, dimensões, peso, serviços, datas e consulta de tabelas.
- `js/cep.mjs`: consulta ViaCEP e máscara.
- `data/tarifas.json`: versão e fontes dos adicionais à vista, com registros de rotas inicialmente vazios.
- `tests/rules.test.mjs`: testes unitários, incluindo cenário histórico fornecido pelo solicitante (somente fixture; nenhum preço histórico alimenta a interface).

## Fontes e regras verificadas em 25/11/2026

- Dimensões: https://www2.correios.com.br/sistemas/precosprazos/Formato.cfm (caixa: 11 x 6 x 0,4 cm mínimos, cada dimensão até 100 cm, soma até 200 cm; rolo: comprimento 18–100 cm, diâmetro 5–91 cm, C+2D de 28–200 cm).
- Serviços nacionais: https://www.correios.com.br/enviar/encomendas/nacional/nacional (PAC e SEDEX à vista, 30 kg físicos, prazo a partir do próximo dia útil, exclusão de fins de semana e feriados; horário limite pode adicionar um dia).
- Cubagem: termo de encomendas nacionais de 31/01/2025, cláusulas 6.1–6.3, disponível em https://www.correios.com.br/enviar/precisa-de-ajuda/arquivos/contratos-formalizados-ate-fevereiro-de-2020/18-termo-de-condicoes-de-prestacao-de-servicos-de-encomendas-nacio-ns-sedex-e-pac.pdf . Divisor 6000; até 5 kg cúbicos, peso real; acima, maior dos dois. A regra é uma referência documental, não uma garantia da tarifação à vista para qualquer data. Para rolo, C×D² é aproximação de envoltória, não fórmula tarifária oficial confirmada; também mostramos volume geométrico.
- Adicionais: https://www.correios.com.br/enviar/servicos-adicionais/servicos-adicionais (vigência 12/04/2026; AR convencional à vista R$8,10, MP R$9,55, valor declarado 2% sobre excedente da indenização automática; limites PAC R$4.668,29 e SEDEX R$39.680,48).
- Indenização automática: https://www.correios.com.br/receber/encomenda/indenizacoes (R$25,63 para PAC e SEDEX).
- Simulador oficial: https://www2.correios.com.br/sistemas/precosprazos/ .
- APIs: https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1 e https://www.correios.com.br/atendimento/developers/manuais/manual-api-prazo (contrato habilitado e token Bearer). Não foram identificadas APIs públicas documentadas para cotação anônima; CORS não foi testado ao vivo. Não são usados endpoints não documentados, iframe ou proxies.

## Tarifas e resultados

A tabela de adicionais contém valores publicados, não uma tabela completa de frete por CEP. Não extrapolamos preços ou prazos. A data de vigência não garante que tarifas continuem válidas no futuro. Para atualizar, revise fontes, versão, vigência e valores em `data/tarifas.json`. A propriedade `routes` aceita registros documentados com correspondência exata de `origin`, `destination` (CEP sem hífen), `format`, `c`, `l`, `a`, `d` (medidas não aplicáveis = null), `weight`, `packaging`, `ar`, `mp`, `vd`, `value`, `service`, `validFrom`, `validUntil`, `source`, `freight`, `days`, `handling`, opcionalmente `insurance`, `arCost`, `mpCost`, `packagingCost`. Não use preços históricos de um único envio como tabela de estimativas. Valores monetários em reais numéricos, prazo inteiro em dias úteis. Registros são estimativas locais, não respostas oficiais ao vivo.

O usuário pode informar componentes manualmente. O total fica indisponível quando algum componente necessário estiver ausente; informe zero para cobranças inexistentes. Valores manuais substituem estimativas, e alterações nos dados do envio invalidam a cotação manual. O comparativo abrange PAC e SEDEX, sem garantia de disponibilidade por rota. Outros serviços exigem consulta oficial. A estimativa da entrega considera feriados nacionais fixos e feriados adicionais informados manualmente (incluindo móveis/locais); não considera horário limite automaticamente. A alerta de manuseio para rolos ou medidas acima de 70 cm é uma triagem conservadora, não uma regra tarifária validada. Nenhuma taxa de manuseio é presumida. Redução percentual de cubagem não equivale à economia financeira.

## Privacidade e testes

Sem dados pessoais incorporados na interface. O teste histórico contém apenas CEPs e características da encomenda explicitamente fornecidos para esse fim; não contém nomes, CPFs ou endereço completo. Rascunhos locais são opt-in, podem ser removidos, e a declaração e a simulação possuem armazenamento separado. A consulta ViaCEP envia somente CEP; a declaração oficial envia os campos via URL e pode aparecer no histórico do navegador.

Nove testes unitários passaram. Tentativa de teste Chromium/Playwright bloqueada pela política de navegação do ambiente (ERR_BLOCKED_BY_ADMINISTRATOR); não houve validação visual/E2E nem chamada real ao ViaCEP ou emissão do PDF nesta entrega.
