# Currency Exchange App

SPA em React para conversão e análise de moedas, desenvolvida como projeto acadêmico com a API pública [Frankfurter](https://frankfurter.dev/).

> **Status:** Etapa 01 concluída — estrutura React + Vite configurada e primeiro componente criado. O conversor e a integração com a API entram nas próximas etapas.

## Objetivo

Centralizar a consulta de taxas de câmbio, a conversão de valores e a análise do histórico de moedas em uma única aplicação, com dados reais e uma interface organizada.

## Tecnologias

- React 19
- JavaScript + JSX
- Vite 8
- CSS Modules
- ESLint
- Fetch API e async/await (próximas etapas)
- Frankfurter API v2 (próximas etapas)
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

## Estrutura atual

```text
src/
├── components/
│   └── layout/
│       ├── Header.jsx
│       └── Header.module.css
├── styles/
│   └── globals.css
├── App.jsx
├── App.module.css
└── main.jsx
```

A estrutura será ampliada conforme as etapas do projeto (conversor, histórico, gráficos, tabela, filtros e exportação CSV).

## API

A aplicação usará a **Frankfurter API v2** (`https://api.frankfurter.dev/v2`), que não exige chave de acesso.

Endpoints previstos:

| Finalidade | Endpoint |
|---|---|
| Moedas disponíveis | `GET /v2/currencies` |
| Taxa de um par | `GET /v2/rate/{base}/{quote}` |
| Histórico por período | `GET /v2/rates?from=...&to=...&base=...&quotes=...` |

> A API ainda **não está integrada** nesta etapa. Nenhum dado de cotação é exibido na interface atual.

## Status do projeto

- [x] Estrutura React + Vite
- [x] CSS Modules e estilos globais
- [x] Primeiro componente (`Header`)
- [x] ESLint e build de produção
- [ ] Conversor de moedas
- [ ] Integração com a API Frankfurter
- [ ] Histórico e gráfico
- [ ] Tabela, filtros e ordenação
- [ ] Exportação CSV
- [ ] Documentação completa e protótipos

## Créditos

Projeto acadêmico desenvolvido com React e Vite. Dados de câmbio fornecidos pela [Frankfurter API](https://frankfurter.dev/).
