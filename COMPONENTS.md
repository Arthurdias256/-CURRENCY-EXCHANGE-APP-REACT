# Arquitetura e componentes

## Visão geral

A aplicação é uma SPA React. O componente `App` compõe o cabeçalho, o dashboard e o rodapé. O `Dashboard` mantém valor e par de moedas em uma única fonte de estado e os fornece ao conversor e ao histórico.

```text
main.jsx
└── App
    ├── Header
    └── Dashboard
        ├── ConverterCard
        │   ├── CurrencySelect
        │   └── ConversionResult
        └── HistorySection (carregamento sob demanda)
            ├── HistoryStats
            ├── RateChart
            └── HistoryTable
```

## Componentes

| Componente | Responsabilidade |
|---|---|
| `App` | Compor a estrutura de página e rodapé. |
| `Header` | Exibir identificação e estado do projeto. |
| `Dashboard` | Manter valor e moedas selecionadas; compartilhar esses dados entre conversor e histórico; inverter o par. |
| `ConverterCard` | Apresentar entrada, seletores, inversão e resultado. Integra `useCurrencies` e `useExchangeRate`. |
| `CurrencySelect` | Exibir as moedas disponíveis com agrupamento visual. |
| `ConversionResult` | Renderizar resultado, validação, carregamento, erro ou estado de mesma moeda. |
| `HistorySection` | Selecionar período e coordenar estados de consulta, resumo, gráfico e tabela. |
| `HistoryStats` | Calcular e apresentar último ponto, mínima, máxima e variação percentual do conjunto recebido. |
| `RateChart` | Plotar os pontos históricos com Recharts e tooltip. |
| `HistoryTable` | Buscar por data, ordenar os pontos sem mutar o array recebido e exportar CSV das linhas visíveis. |

Os estilos são separados em CSS Modules por componente. Tokens globais e regras comuns ficam em `src/styles/globals.css`.

## Hooks

| Hook | Responsabilidade |
|---|---|
| `useCurrencies` | Consultar e expor moedas, carregamento, erro e ação de nova tentativa. |
| `useExchangeRate` | Consultar a taxa do par, cancelar consultas obsoletas, expor estado de erro/loading e resolver o caso de moedas iguais sem API. |
| `useHistoricalRates` | Consultar a série de um par/período, calcular intervalo de datas, cancelar consulta obsoleta e permitir nova tentativa. |

Os hooks separam efeitos de rede da apresentação. Eles recebem os parâmetros necessários e devolvem dados e estados para os componentes.

## Serviço de API

`src/services/frankfurterApi.js` concentra a comunicação HTTP:

- `getCurrencies()` busca e normaliza moedas; usa cache em memória.
- `getRate(base, quote)` busca uma cotação do par.
- `getTimeSeries(base, quote, options)` consulta o histórico entre datas e opcionalmente agrupa por mês.
- `ApiError` diferencia erros HTTP e de conexão, preservando o status quando disponível.

A URL base fica em `src/constants/api.js`. A API pública Frankfurter v2 não exige chave.

## Utilitários e constantes

- `src/utils/currency.js`: parsing de valores em formato pt-BR, validação, cálculo e formatação.
- `src/utils/date.js`: cálculo dos intervalos e formatação de datas.
- `src/constants/currencies.js`: códigos de moedas destacados.
- `src/constants/periods.js`: períodos disponíveis, descrições e agrupamento.

## Fluxo dos dados

1. `Dashboard` inicializa o valor e o par.
2. `ConverterCard` consulta a cotação e calcula o valor convertido no navegador.
3. O mesmo par é enviado para `HistorySection`.
4. `useHistoricalRates` chama a API com intervalo definido pelo período selecionado.
5. Os pontos recebidos alimentam resumo, gráfico e tabela.
6. Busca e ordenação são estados locais da tabela; a exportação usa apenas as linhas atualmente visíveis e o valor atual do conversor.

## Testes automatizados

Os testes ficam próximos aos componentes/hooks e usam Vitest, jsdom e Testing Library. A configuração comum está em `src/test/setup.js` e `vite.config.js`. Consulte [FUNCTION_TESTS.md](./FUNCTION_TESTS.md) para a matriz de cobertura.
