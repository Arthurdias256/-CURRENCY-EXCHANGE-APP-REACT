# Requisitos do projeto

## Objetivo

Desenvolver uma aplicação web de página única (SPA) para consultar taxas de câmbio, converter valores e analisar cotações históricas usando a API pública Frankfurter, sem substituir dados reais por valores simulados.

## Escopo funcional

| ID | Requisito | Situação |
|---|---|---|
| RF-01 | Consultar a lista de moedas disponíveis na Frankfurter. | Implementado |
| RF-02 | Permitir escolher moedas de origem e destino e inverter o par. | Implementado |
| RF-03 | Validar valores vazios, inválidos ou menores ou iguais a zero. | Implementado |
| RF-04 | Consultar a taxa atual do par e calcular o valor convertido no cliente. | Implementado |
| RF-05 | Exibir a taxa e a data efetiva retornadas pela API. | Implementado |
| RF-06 | Tratar carregamento, erros de rede/API e permitir nova tentativa. | Implementado |
| RF-07 | Converter moedas iguais sem solicitar uma taxa à API. | Implementado |
| RF-08 | Consultar o histórico em oito períodos: 7d, 15d, 30d, 3m, 6m, 1y, 5y e 10y. | Implementado |
| RF-09 | Apresentar um gráfico e estatísticas do intervalo escolhido. | Implementado |
| RF-10 | Agrupar por mês as consultas de histórico de 5 e 10 anos. | Implementado |
| RF-11 | Exibir uma tabela das cotações do par e período selecionados. | Implementado |
| RF-12 | Filtrar a tabela por data e ordenar por data ou taxa. | Implementado |
| RF-13 | Exportar para CSV as linhas visíveis da tabela com data, par, valor convertido e taxa. | Implementado |
| RF-14 | Disponibilizar uma Collection do Postman para explorar os endpoints usados. | Implementado |
| RF-15 | Criar e publicar protótipos navegáveis no Figma. | Pendente; este projeto contém apenas a especificação em [FIGMA.md](./FIGMA.md) |

## Requisitos não funcionais

| ID | Requisito | Critério |
|---|---|---|
| RNF-01 | Utilizar React, JavaScript/JSX e Vite. | Dependências e estrutura do projeto |
| RNF-02 | Manter responsabilidades separadas entre apresentação, hooks, serviços e utilitários. | Organização de `src/` |
| RNF-03 | Adaptar a interface a telas menores. | Layouts responsivos definidos nos CSS Modules |
| RNF-04 | Fornecer nomes acessíveis, rótulos e estados de validação nos controles. | HTML semântico e atributos ARIA nos componentes |
| RNF-05 | Não exigir chave de API nem enviar valores para um serviço próprio. | Consultas diretas à API pública; conversão no navegador |
| RNF-06 | Validar alterações com lint, build e testes automatizados. | `npm run lint`, `npm run build` e `npm test` |
| RNF-07 | Não apresentar a taxa de referência como cotação intradiária em tempo real. | A API publica taxas de referência; a data efetiva pode ser anterior ao dia atual |

## Fora do escopo atual

- Contas, autenticação, backend ou persistência de conversões do usuário.
- Registro permanente de conversões realizadas.
- Filtro por moeda na tabela: o par é definido no conversor e aplicado ao histórico.
- Edição de dados, gráficos comparativos de vários pares ou cálculo de tarifas.
- Protótipos efetivamente criados no Figma.

## Dependências externas e limitações

- A disponibilidade e cobertura histórica dependem da Frankfurter e das fontes oficiais que ela agrega.
- Fins de semana, feriados ou pares com cobertura limitada podem resultar em uma data efetiva anterior à atual.
- Em intervalos longos, o agrupamento mensal pode fazer o último ponto do gráfico divergir da cotação atual.
- Sem conexão com a API, consultas que ainda não foram carregadas não podem ser substituídas por cotações fictícias.

## Critérios de aceite

1. A aplicação inicia com `npm run dev`, passa em `npm run lint` e gera a versão de produção com `npm run build`.
2. `npm test` executa os testes automatizados do conversor, hooks e histórico sem falhas.
3. A Collection do Postman pode ser importada e suas cinco requisições usam a API Frankfurter v2 sem autenticação.
4. A busca, a ordenação e a exportação CSV operam sobre os registros do período e par exibidos.
5. Os materiais distinguem recursos existentes, verificações realizadas e itens ainda pendentes.
