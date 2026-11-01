# Testes funcionais

## Execução automatizada

```bash
npm test
npm run lint
npm run build
```

`npm test` executa Vitest em jsdom. Os testes de componente usam Testing Library; chamadas de API são simuladas nos testes de hooks para manter os resultados determinísticos e independentes da conexão.

## Matriz automatizada

| Arquivo | Cenário coberto |
|---|---|
| `src/components/converter/ConverterCard.test.jsx` | Cálculo do valor convertido; validação de zero; propagação de alterações do valor e moeda; inversão do par; mesma moeda; mensagem e nova tentativa após falha. |
| `src/hooks/useExchangeRate.test.jsx` | Moedas iguais não fazem chamada; troca para moedas iguais encerra loading durante requisição pendente; retorno de taxa para par distinto. |
| `src/hooks/useHistoricalRates.test.jsx` | Consulta do intervalo e agrupamento; ausência de chamada para moedas iguais; nova tentativa após erro. |
| `src/components/history/HistorySection.test.jsx` | Seleção do período e envio do período ativo ao hook. |
| `src/components/history/HistoryTable.test.jsx` | Busca por data localizada; ordenação crescente/decrescente sem mutar dados; CSV filtrado com valor convertido e BOM; desativação da exportação sem resultados. |

## Última execução registrada

No clone durante a elaboração destes documentos:

- **Vitest:** 5 arquivos e 16 testes passaram.
- **ESLint:** passou.
- **Build Vite:** passou.

Esses resultados referem-se à execução naquele estado do projeto. Execute novamente os comandos após alterações.

## Roteiro de verificação manual

| ID | Passos | Resultado esperado |
|---|---|---|
| MF-01 | Abrir a aplicação com conexão ativa. | Lista de moedas, taxa e histórico carregam; taxa mostra sua data efetiva. |
| MF-02 | Informar valor decimal com vírgula e alterar o valor. | Resultado recalcula sem nova consulta do par. |
| MF-03 | Informar vazio, texto inválido, zero ou valor negativo. | Mensagem de validação e nenhum valor convertido apresentado. |
| MF-04 | Alterar uma moeda e inverter o par. | O par é atualizado e a consulta correspondente é feita; chamadas antigas podem ser canceladas. |
| MF-05 | Selecionar a mesma moeda em ambos os lados. | Resultado 1:1, sem chamada de cotação ou indicador de loading preso; histórico informa que não há variação cambial. |
| MF-06 | Simular indisponibilidade da API. | Mensagem de erro e controle de nova tentativa aparecem. |
| MF-07 | Trocar cada opção do período histórico. | Botão ativo muda e gráfico, estatísticas e tabela correspondem ao período carregado. |
| MF-08 | Buscar uma data na tabela. | Apenas datas correspondentes ficam visíveis e o contador é atualizado. |
| MF-09 | Ordenar pela data e pela taxa nos dois sentidos. | Linhas mudam de ordem sem alterar a série original. |
| MF-10 | Exportar CSV com busca ativa. | Arquivo contém somente linhas visíveis, cabeçalho, par, data, taxa e conversão para o valor atual. |
| MF-11 | Buscar um termo sem correspondências. | Mensagem de vazio aparece e o botão CSV fica desativado. |
| MF-12 | Redimensionar a tela para mobile. | Conteúdo não fica inacessível; controles e tabela podem ser usados em viewport estreito. |

## Observações

- Os testes automatizados não substituem a verificação de layout em navegadores e resoluções reais.
- O roteiro manual é uma lista de validação a executar; não declara que todos os cenários foram verificados em dispositivos físicos.
- Para testar chamadas HTTP sem mocks, use a Collection descrita em [API_TESTS.md](./API_TESTS.md).
