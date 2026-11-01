# Currency Exchange App

SPA em React para conversão e análise de moedas, desenvolvida como projeto acadêmico com a API pública [Frankfurter](https://frankfurter.dev/).

> **Status:** Conversor com bandeiras de países nos seletores, histórico de 8 períodos, gráfico, tabela com busca e ordenação, exportação CSV, interface em português/inglês/espanhol, temas claro/escuro, Collection do Postman e documentação acadêmica implementados usando dados reais da Frankfurter API v2. O arquivo do protótipo Figma está disponível na [documentação](./FIGMA.md).

## Objetivo

Centralizar a consulta de taxas de câmbio, a conversão de valores e a análise do histórico de moedas em uma única aplicação, com dados reais e uma interface organizada.

## Funcionalidades atuais

- Conversão automática entre duas moedas com a taxa mais recente da API.
- Seleção entre 170 moedas disponíveis, com destaque para as principais.
- Imagens de bandeiras de países/territórios nos seletores pesquisáveis; carregadas do FlagCDN, moedas sem país único usam um ícone neutro e imagens indisponíveis têm fallback para emoji.
- Inversão rápida das moedas de origem e destino.
- Exibição do valor convertido, da taxa aplicada e da data efetiva da cotação.
- Validação de valores vazios, inválidos ou menores ou iguais a zero.
- Tratamento de loading, erro de conexão, moeda inválida e tentativa de nova consulta.
- Suporte a conversão entre a mesma moeda, sem chamada desnecessária à API.
- Interface em português, inglês e espanhol, com preferência salva no navegador.
- Tema claro e escuro, com preferência salva no navegador.
- Formatação de valores e datas de acordo com o idioma selecionado, incluindo taxas muito pequenas (ex.: BTC).
- Histórico de cotações em 8 períodos: 7d, 15d, 30d, 3m, 6m, 1y, 5y e 10y.
- Gráfico de evolução da taxa com tooltip por data.
- Resumo do período com última cotação (ou último dado), mínima, máxima e variação percentual.
- Períodos de 5 e 10 anos agrupados por mês pela API para manter o gráfico legível.
- Gráfico carregado sob demanda (code splitting), mantendo o bundle inicial leve.
- Tabela de cotações do período, com busca por data e ordenação por data ou taxa.
- Exportação CSV dos registros visíveis, incluindo data, moedas, taxa e valor convertido para o valor informado no conversor.

## Tecnologias

- React 19
- JavaScript + JSX
- Vite 8
- CSS Modules
- ESLint
- Fetch API + async/await
- Custom Hooks (`useCurrencies`, `useExchangeRate` e `useHistoricalRates`)
- Frankfurter API v2
- Recharts (gráfico de histórico)

## Pré-requisitos

- Node.js `^20.19.0` ou `>=22.12.0`
- npm 9 ou superior
- Git

## Instalação

```bash
cd currency-exchange-app
npm install
```

## Como executar

```bash
npm run dev
```

Acesse o endereço exibido no terminal, normalmente <http://localhost:5173>.

Outros scripts disponíveis:

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # pré-visualiza a versão de produção
npm run lint     # executa o ESLint
npm test         # executa os testes automatizados
```

Os testes usam Vitest e Testing Library para verificar conversão, estados do hook de cotação, seleção e carregamento de períodos históricos, busca, ordenação e exportação CSV.

## Como utilizar

1. Informe um valor no campo **Valor**.
2. Selecione a moeda de origem em **De**.
3. Selecione a moeda de destino em **Para**.
4. Use o botão central para inverter as moedas.
5. O resultado é atualizado automaticamente; a cotação é consultada quando o par de moedas muda.

A conversão é calculada no navegador a partir da taxa retornada pela API. A data exibida é a data efetiva da cotação, que pode ser anterior à data atual em pares com menor cobertura.

### Histórico e gráfico

1. Escolha o par de moedas no conversor.
2. Role até a seção **Histórico**.
3. Selecione um dos 8 períodos: **7d**, **15d**, **30d**, **3m**, **6m**, **1y**, **5y** ou **10y**.
4. O gráfico e os cards de resumo são atualizados automaticamente.
5. Consulte a tabela abaixo do gráfico; use a busca para localizar uma data e os cabeçalhos **Data** e **Taxa** para ordenar.
6. Clique em **Exportar CSV** para baixar os registros atualmente filtrados e ordenados. O valor convertido usa o valor informado no conversor.

Nos períodos de 5 e 10 anos a API agrupa os dados por mês; por isso o último ponto pode diferir da cotação atual exibida no conversor. O rodapé da seção informa essa condição.

## Estrutura atual

```text
src/
├── components/
│   ├── converter/
│   │   ├── ConversionResult.jsx
│   │   ├── ConversionResult.module.css
│   │   ├── ConverterCard.jsx
│   │   ├── ConverterCard.module.css
│   │   ├── ConverterCard.test.jsx
│   │   ├── CurrencySelect.jsx
│   │   └── CurrencySelect.module.css
│   ├── history/
│   │   ├── HistorySection.jsx
│   │   ├── HistorySection.module.css
│   │   ├── HistorySection.test.jsx
│   │   ├── HistoryStats.jsx
│   │   ├── HistoryStats.module.css
│   │   ├── HistoryTable.jsx
│   │   ├── HistoryTable.module.css
│   │   ├── HistoryTable.test.jsx
│   │   ├── RateChart.jsx
│   │   └── RateChart.module.css
│   └── layout/
│       ├── Header.jsx
│       └── Header.module.css
├── constants/
│   ├── api.js
│   ├── currencies.js
│   └── periods.js
├── hooks/
│   ├── useCurrencies.js
│   ├── useExchangeRate.js
│   ├── useExchangeRate.test.jsx
│   ├── useHistoricalRates.js
│   └── useHistoricalRates.test.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── Dashboard.module.css
├── services/
│   └── frankfurterApi.js
├── styles/
│   └── globals.css
├── test/
│   └── setup.js
├── utils/
│   ├── currency.js
│   └── date.js
├── App.jsx
├── App.module.css
└── main.jsx
```

## API

A aplicação usa a **Frankfurter API v2** (`https://api.frankfurter.dev/v2`), que não exige chave de acesso.

Endpoints utilizados:

| Finalidade | Endpoint |
|---|---|
| Moedas disponíveis | `GET /v2/currencies` |
| Taxa de um par | `GET /v2/rate/{base}/{quote}` |
| Histórico por período | `GET /v2/rates?from=...&to=...&base=...&quotes=...` |

Nos períodos de 5 e 10 anos, o histórico é solicitado com `group=month`.

### Postman

Importe `postman/Currency Exchange App.postman_collection.json` no Postman. A collection inclui consultas de moedas, taxa atual, conversão calculada com a taxa retornada e histórico diário ou agrupado por mês. Edite as variáveis da collection (`base`, `quote`, `amount`, `fromDate` e `toDate`) para testar outros valores. A API não exige autenticação.

## Documentação acadêmica

- [Requisitos e critérios de aceite](./REQUIREMENTS.md)
- [Protótipo e especificação para o Figma](./FIGMA.md)
- [Arquitetura e responsabilidades dos componentes](./COMPONENTS.md)
- [Casos e execução de testes da API](./API_TESTS.md)
- [Matriz de testes funcionais](./FUNCTION_TESTS.md)
- [Registro de uso de IA](./AI_USAGE.md)
- [Collection do Postman](./postman/Currency%20Exchange%20App.postman_collection.json)

### Períodos do histórico

| Período | Intervalo | Agrupamento |
|---|---|---|
| `7d` | últimos 7 dias | diário |
| `15d` | últimos 15 dias | diário |
| `30d` | últimos 30 dias | diário |
| `3m` | últimos 3 meses | diário |
| `6m` | últimos 6 meses | diário |
| `1y` | último 1 ano | diário |
| `5y` | últimos 5 anos | mensal |
| `10y` | últimos 10 anos | mensal |

### Tratamento de erros

- `400`: consulta inválida.
- `404`: cotação não encontrada para o par.
- `422`: moeda inválida ou indisponível.
- Falha de rede: mensagem específica com opção de tentar novamente.

## Status do projeto

- [x] Estrutura React + Vite
- [x] CSS Modules e estilos globais
- [x] Primeiro componente (`Header`)
- [x] Conversor de moedas
- [x] Integração com a Frankfurter API v2
- [x] Estados de loading, erro e validação
- [x] Inversão de moedas
- [x] Histórico e gráfico
- [x] Tabela de cotações com busca por data e ordenação
- [x] Exportação CSV
- [x] Documentação acadêmica (`REQUIREMENTS.md`, `FIGMA.md`, `COMPONENTS.md`, `API_TESTS.md`, `FUNCTION_TESTS.md`, `AI_USAGE.md`)
- [x] Collection do Postman
- [x] Arquivo do protótipo no Figma (link disponível em `FIGMA.md`)

## Créditos

Projeto acadêmico desenvolvido com React e Vite. Dados de câmbio fornecidos pela [Frankfurter API](https://frankfurter.dev/).
