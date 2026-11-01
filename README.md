# Currency Exchange App

SPA em React para conversão e análise de moedas, desenvolvida como projeto acadêmico com a API pública [Frankfurter](https://frankfurter.dev/).

> **Status:** Etapa 02 concluída — conversor funcional com dados reais da Frankfurter API v2. Histórico, gráficos, tabela, filtros e exportação CSV entram nas próximas etapas.

## Objetivo

Centralizar a consulta de taxas de câmbio, a conversão de valores e a análise do histórico de moedas em uma única aplicação, com dados reais e uma interface organizada.

## Funcionalidades atuais

- Conversão automática entre duas moedas com a taxa mais recente da API.
- Seleção entre 170 moedas disponíveis, com destaque para as principais.
- Inversão rápida das moedas de origem e destino.
- Exibição do valor convertido, da taxa aplicada e da data efetiva da cotação.
- Validação de valores vazios, inválidos ou menores ou iguais a zero.
- Tratamento de loading, erro de conexão, moeda inválida e tentativa de nova consulta.
- Suporte a conversão entre a mesma moeda, sem chamada desnecessária à API.
- Formatação de valores em pt-BR, incluindo taxas muito pequenas (ex.: BTC).

## Tecnologias

- React 19
- JavaScript + JSX
- Vite 8
- CSS Modules
- ESLint
- Fetch API + async/await
- Custom Hooks (`useCurrencies` e `useExchangeRate`)
- Frankfurter API v2
- Recharts (previsto para a etapa de gráficos)

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
```

## Como utilizar

1. Informe um valor no campo **Valor**.
2. Selecione a moeda de origem em **De**.
3. Selecione a moeda de destino em **Para**.
4. Use o botão central para inverter as moedas.
5. O resultado é atualizado automaticamente; a cotação é consultada quando o par de moedas muda.

A conversão é calculada no navegador a partir da taxa retornada pela API. A data exibida é a data efetiva da cotação, que pode ser anterior à data atual em pares com menor cobertura.

## Estrutura atual

```text
src/
├── components/
│   ├── converter/
│   │   ├── ConversionResult.jsx
│   │   ├── ConversionResult.module.css
│   │   ├── ConverterCard.jsx
│   │   ├── ConverterCard.module.css
│   │   ├── CurrencySelect.jsx
│   │   └── CurrencySelect.module.css
│   └── layout/
│       ├── Header.jsx
│       └── Header.module.css
├── constants/
│   ├── api.js
│   └── currencies.js
├── hooks/
│   ├── useCurrencies.js
│   └── useExchangeRate.js
├── pages/
│   ├── Dashboard.jsx
│   └── Dashboard.module.css
├── services/
│   └── frankfurterApi.js
├── styles/
│   └── globals.css
├── utils/
│   └── currency.js
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

Endpoints previstos para as próximas etapas:

| Finalidade | Endpoint |
|---|---|
| Histórico por período | `GET /v2/rates?from=...&to=...&base=...&quotes=...` |

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
- [ ] Histórico e gráfico
- [ ] Tabela, filtros e ordenação
- [ ] Exportação CSV
- [ ] Documentação completa (`REQUIREMENTS.md`, `FIGMA.md`, `COMPONENTS.md`, `API_TESTS.md`, `FUNCTION_TESTS.md`, `AI_USAGE.md`)
- [ ] Collection do Postman
- [ ] Protótipos no Figma

## Créditos

Projeto acadêmico desenvolvido com React e Vite. Dados de câmbio fornecidos pela [Frankfurter API](https://frankfurter.dev/).
