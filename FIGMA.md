# Especificação para protótipos no Figma

> Este documento descreve telas e componentes para reprodução no Figma. Nenhum arquivo ou protótipo foi criado no Figma como parte desta etapa.

## Objetivo do protótipo

Representar a interface implementada do Currency Exchange App, incluindo conversão, consulta histórica, tabela, exportação CSV, seleção de idioma e alternância de tema. Os frames devem mostrar estados reais de interface, sem inserir resultados fictícios como se viessem da API.

## Frames recomendados

Criar duas páginas no arquivo Figma:

1. **Design system** — tokens de cor, tipografia, espaçamento e componentes.
2. **Aplicação** — frames desktop e mobile do dashboard e estados da interface.

| Frame | Dimensão sugerida | Conteúdo |
|---|---:|---|
| Dashboard desktop | 1440 × 1200 | Cabeçalho, destaque introdutório, conversor, histórico, estatísticas, gráfico e tabela |
| Dashboard mobile | 390 × 844, com conteúdo vertical rolável | Cabeçalho compacto, conversor em coluna, períodos em duas linhas e tabela responsiva |
| Conversor carregando | 1440 × 900 | Par escolhido e indicador de busca de cotação |
| Conversor com erro | 1440 × 900 | Mensagem de erro e ação para nova tentativa |
| Histórico carregando/sem dados | 1440 × 900 | Indicador ou mensagem contextual no painel |
| Histórico com resultados | 1440 × 1200 | Cards, gráfico, filtro, ordenação e exportação |

## Grid e layout

- Usar contêiner central de até 1120 px.
- Desktop: margem lateral mínima de 24 px; hero em duas colunas, com texto e conversor.
- Abaixo de 980 px: empilhar texto e conversor.
- Mobile: largura mínima de conteúdo de 320 px; margens laterais de 18 px.
- Cabeçalho fixo no topo, com marca à esquerda e estado do projeto à direita em telas largas.
- A seção de histórico aparece abaixo do hero e tem espaçamento vertical amplo.
- No painel do histórico, manter o cabeçalho, período, estatísticas, gráfico e tabela na mesma ordem da aplicação.

## Design tokens observados no código

| Token | Valor | Uso |
|---|---|---|
| Fundo | `#070d18` | Fundo principal |
| Superfície | `#0f1b2d` | Painéis e cards |
| Superfície elevada | `#142338` | Tooltip, cabeçalho da tabela |
| Texto principal | `#e8eef8` | Títulos e valores |
| Texto secundário | `#9aabc2` | Descrições e controles |
| Texto discreto | `#6f8199` | Metadados |
| Destaque | `#56e0c0` | Ações primárias, taxa e gráfico |
| Perigo | `#f87171` | Erros e variação negativa |
| Aviso | `#f5c26b` | Estados de atenção |
| Fonte | Segoe UI com fallbacks de sistema | Toda a aplicação |

Raios: 10 px para controles pequenos, 16 px para painéis médios e 24 px para cards principais. Usar bordas claras com baixa opacidade e sombras discretas em superfícies elevadas. O arquivo de referência para os tokens é `src/styles/globals.css`.

## Componentes e variantes

- **Header:** marca, nome do app, seletor Português/English/Español, botão claro/escuro, subtítulo e status de desenvolvimento; ocultar subtítulo/status em viewport estreito.
- **CurrencySelect:** rótulo, valor, imagem da bandeira, busca e opções agrupadas em moedas principais e demais moedas, estado desabilitado durante carregamento.
- **Campo de valor:** código da moeda prefixado; estados normal, focado e inválido.
- **Botão inverter:** ícone de setas; manter nome acessível “Inverter moedas”.
- **Resultado:** cotação, valor formatado, taxa, data efetiva; variantes carregando, erro, mesmo par e entrada inválida.
- **Seletor de período:** oito opções com estado ativo destacado.
- **Cards de estatísticas:** última cotação, mínima, máxima e variação; indicar visualmente variações positivas e negativas.
- **Gráfico:** área em destaque, eixos com datas/taxas e tooltip por ponto.
- **Tabela:** data, par, taxa, busca por data, cabeçalhos ordenáveis e botão Exportar CSV.

O seletor de idioma e o tema escolhido permanecem após recarregar a página. Represente os estados claro e escuro como variantes visuais do mesmo dashboard.

## Fluxos a prototipar

1. Usuário altera valor e observa o valor convertido atualizado sem nova consulta do par.
2. Usuário escolhe outro par e vê o estado de carregamento seguido do resultado.
3. Usuário inverte moedas.
4. Usuário seleciona período, consulta os dados, busca uma data, ordena e exporta as linhas visíveis.
5. Usuário encontra erro ou ausência de dados e compreende a ação disponível.

## Acessibilidade visual

- Contraste suficiente entre textos e superfícies escuras.
- Estados de foco visíveis nos campos, botões e seletores.
- Não usar apenas cor para comunicar variação: incluir sinal/ícone e valor percentual.
- Manter rótulos visíveis; ícones decorativos não devem substituir os nomes das ações.
- Apresentar áreas de toque confortáveis em mobile e permitir rolagem horizontal/vertical da tabela se necessário.

## Checklist para montar o arquivo

- [ ] Criar a página Design system e registrar os tokens.
- [ ] Criar componentes com variantes e estados.
- [ ] Montar os frames desktop e mobile.
- [ ] Prototipar navegação entre estados do dashboard.
- [ ] Conferir contraste, foco, conteúdo e dimensões com a aplicação aberta.
- [ ] Inserir neste documento o link do arquivo Figma depois de criado e compartilhado.
