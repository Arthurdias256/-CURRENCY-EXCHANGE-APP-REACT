# Testes da API

## API sob teste

- Serviço: Frankfurter API v2.
- URL base: `https://api.frankfurter.dev/v2`.
- Autenticação: não necessária.
- Requisições: GET com `Accept: application/json`.
- Collection: [`postman/Currency Exchange App.postman_collection.json`](./postman/Currency%20Exchange%20App.postman_collection.json).

## Endpoints e casos

| Caso | Endpoint | Verificações da Collection |
|---|---|---|
| Moedas disponíveis | `/currencies` | HTTP 200; corpo é lista não vazia; primeiro item inclui `iso_code` e `name`. |
| Taxa atual | `/rate/{base}/{quote}` | HTTP 200; códigos do par correspondem às variáveis; taxa positiva; data ISO. |
| Conversão | `/rate/{base}/{quote}` | HTTP 200; valor de entrada e taxa são positivos; calcula `amount × rate`. A API retorna a taxa, o cálculo é feito no cliente. |
| Histórico diário | `/rates?from=...&to=...&base=...&quotes=...` | HTTP 200; lista não vazia; data, moedas e taxa positiva em cada ponto. |
| Histórico mensal | `/rates?from=...&to=...&base=...&quotes=...&group=month` | HTTP 200; lista não vazia; cada ponto contém data e taxa positiva. |

## Como executar

1. No Postman, importe a Collection indicada acima.
2. Revise as variáveis `apiBase`, `base`, `quote`, `amount`, `fromDate`, `toDate`, `monthlyFromDate` e `monthlyToDate`.
3. Execute a Collection Runner. O intervalo diário e o mensal devem incluir datas com dados publicados para o par escolhido.
4. Confira as asserções de cada requisição e o corpo retornado.

Para executar no terminal com Newman, se estiver disponível:

```bash
npx newman run "postman/Currency Exchange App.postman_collection.json"
```

## Resultado registrado

Durante a validação desta Collection, as cinco requisições retornaram HTTP 200 e passaram as oito asserções automatizadas. A resposta da API pode mudar com o tempo; datas efetivas de cotação e valores não são constantes, portanto os testes validam estrutura e tipos em vez de valores fixos.

## Testes de falha complementares

Os casos abaixo são cenários para execução manual; não fazem parte das oito asserções atuais da Collection.

| Cenário | Ação | Resultado esperado |
|---|---|---|
| Código inválido no par | Consultar `/rate/XXX/YYY` | Resposta não-2xx ou sem taxa utilizável; a aplicação apresenta erro, sem inventar cotação. |
| Intervalo inválido | Inverter `from` e `to` ou enviar data malformada | Resposta de erro HTTP; verificar tratamento de consulta inválida. |
| Falha de rede | Desconectar ou bloquear o domínio temporariamente | A aplicação apresenta mensagem de conexão e oferece tentativa novamente. |
| Resposta não JSON | Simular resposta inválida em ambiente de teste | O serviço reporta formato inesperado/erro HTTP, sem assumir sucesso. |

## Limitações

- A taxa mais recente é uma cotação de referência, não uma cotação financeira intradiária garantida.
- Cobertura varia por moeda, data, calendário e fonte.
- Testes que acessam o serviço real precisam de conexão e podem falhar por indisponibilidade externa.
- O cálculo de conversão não corresponde a tarifas, spread bancário ou preço de execução.
