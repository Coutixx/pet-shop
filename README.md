# PetShop Cotil

Aplicativo desktop para gerenciamento de um PetShop, desenvolvido para a disciplina de Desenvolvimento de Aplicativos Desktop (DAD).

## Tecnologias e arquitetura

Electron, TypeScript, SQLite e Bootstrap. A aplicação seguirá este fluxo:

```text
Interface (renderer) -> preload tipado -> IPC (main) -> service/repository -> SQLite
```

Cada módulo deve funcionar isoladamente com seus próprios dados de exemplo. Nenhuma pessoa deve aguardar o módulo de outra para começar: a ligação entre módulos ocorrerá somente na fase de integração.

## Divisão da equipe

| Integrante | Módulo independente | Entrega na integração |
| --- | --- | --- |
| Henrique | Backend, banco, usuários, clientes e ViaCEP | Persistência SQLite, IPC e segurança para todos os módulos |
| Julia | Produtos, estoque, dólar e dashboard | Catálogo e regra de disponibilidade ao pedido |
| Nycollas | Entregadores, checkout, frete e distância | Pedido vinculado a cliente, produtos e entregador |
| Enzo | Itens, recibo, histórico, e-mail e fluxo Git | Itens vinculados ao pedido e confirmação de venda |

## Roadmap paralelo

### Fase 1 - Preparação individual (todos podem começar ao mesmo tempo)

- [ ] **[Henrique]** Criar a base Electron com TypeScript, `main`, `preload` e `renderer`.
- [ ] **[Henrique]** Configurar scripts de desenvolvimento, build, lint, testes, CSP e `contextIsolation`.
- [ ] **[Henrique]** Definir contratos TypeScript compartilhados (`ClienteResumo`, `ProdutoResumo`, `PedidoRascunho`) sem implementar telas de terceiros.
- [ ] **[Julia]** Criar estrutura visual Bootstrap, navegação e layout-base do dashboard.
- [ ] **[Nycollas]** Criar wireframe e tela estática do caixa/checkout com dados simulados.
- [ ] **[Enzo]** Criar `develop`, modelo de Pull Request, padrão de branches e convenção de commits.
- [ ] **[Enzo]** Criar modelo visual de recibo e histórico usando dados simulados.

### Fase 2 - Módulo do Henrique: backend, banco e clientes

- [ ] **[Henrique]** Criar migrations SQLite para as seis tabelas exigidas.
- [ ] **[Henrique]** Criar diagrama do banco e documentar as chaves estrangeiras.
- [ ] **[Henrique]** Implementar classes e repositórios de `Usuario` e `Cliente`.
- [ ] **[Henrique]** Implementar login, logout, hash de senha e níveis de acesso.
- [ ] **[Henrique]** Implementar CRUD de clientes com tela própria.
- [ ] **[Henrique]** Integrar ViaCEP e tratar CEP inválido/falha de rede.
- [ ] **[Henrique]** Expor APIs IPC tipadas somente para usuários e clientes.
- [ ] **[Henrique]** Criar seed independente de usuários e clientes.
- [ ] **[Henrique]** Testar autenticação, permissões, CRUD de clientes e validação de entrada.

### Fase 3 - Módulo da Julia: produtos e estoque

- [ ] **[Julia]** Criar interface `Produto`, serviço e repositório local/mocado para desenvolvimento isolado.
- [ ] **[Julia]** Implementar tela e CRUD de produtos com dados de exemplo.
- [ ] **[Julia]** Implementar categoria, preço em BRL, preço em USD, importado e quantidade em estoque.
- [ ] **[Julia]** Integrar cotação do dólar com tratamento de falha da API.
- [ ] **[Julia]** Implementar regra local que identifica produto indisponível quando o estoque for zero.
- [ ] **[Julia]** Criar dashboard de produtos e indicadores de estoque.
- [ ] **[Julia]** Criar dados de demonstração e testes do módulo de produtos.

### Fase 4 - Módulo do Nycollas: entregadores, pedido e frete

- [ ] **[Nycollas]** Criar interface `Entregador` e CRUD com dados de exemplo.
- [ ] **[Nycollas]** Criar `PedidoRascunho` usando IDs e dados simulados de cliente/produto.
- [ ] **[Nycollas]** Implementar tela de checkout com carrinho local e cálculo de subtotal.
- [ ] **[Nycollas]** Integrar API de distância usando origem/destino de teste.
- [ ] **[Nycollas]** Definir e testar regra de cálculo de frete de forma isolada.
- [ ] **[Nycollas]** Registrar datas de criação/entrega no rascunho do pedido.
- [ ] **[Nycollas]** Criar testes para total, frete, checkout vazio e falha da API.

### Fase 5 - Módulo do Enzo: itens, confirmação e histórico

- [ ] **[Enzo]** Criar interface `ItemPedido` e funções de subtotal/total usando dados de exemplo.
- [ ] **[Enzo]** Garantir que o item preserve preço unitário e quantidade da venda.
- [ ] **[Enzo]** Criar recibo visual com um pedido simulado.
- [ ] **[Enzo]** Criar tela de histórico com pedidos simulados.
- [ ] **[Enzo]** Implementar serviço de e-mail com ambiente de teste ou mock, sem credenciais no código.
- [ ] **[Enzo]** Tratar falha de envio de e-mail sem invalidar a venda.
- [ ] **[Enzo]** Revisar PRs e manter o padrão de branches/commits documentado.

### Fase 6 - Integração planejada (somente quando os módulos isolados estiverem prontos)

- [ ] **[Henrique]** Criar/adaptar repositórios SQLite para `Produto`, `Entregador`, `Pedido` e `ItemPedido` a partir dos contratos entregues.
- [ ] **[Julia]** Substituir os dados de exemplo de produtos pela API IPC fornecida por Henrique.
- [ ] **[Nycollas]** Substituir os dados simulados de cliente, produto e entregador pelas APIs IPC; conectar o checkout ao pedido real.
- [ ] **[Enzo]** Conectar itens, recibo, histórico e e-mail ao pedido confirmado.
- [ ] **[Julia]** Conectar a validação de estoque ao fechamento da venda.
- [ ] **[Nycollas]** Conectar o cálculo de frete/distância ao total final do pedido.
- [ ] **[Henrique]** Validar transação de venda: gravar pedido, gravar itens e baixar estoque de forma atômica.
- [ ] **[Todos]** Executar um fluxo integrado: login -> cliente -> produto -> checkout -> frete -> confirmação -> recibo/histórico.

### Fase 7 - Entrega

- [ ] **[Henrique]** Preparar banco com dados de demonstração e gerar build testável.
- [ ] **[Julia]** Revisar consistência visual e navegação.
- [ ] **[Nycollas]** Revisar regras de pedido, frete e mensagens do checkout.
- [ ] **[Enzo]** Atualizar documentação de instalação, uso e histórico de decisões.
- [ ] **[Todos]** Revisar segurança, testes, checklist e Pull Requests.
- [ ] **[Henrique]** Criar a release final na branch `main`.

## Convenções Git

- [ ] **[Todos]** Trabalhar em uma branch `feature/<nome>-<modulo>` por tarefa.
- [ ] **[Todos]** Fazer ao menos um commit próprio por checkbox concluído.
- [ ] **[Todos]** Abrir Pull Request para `develop`; não fazer commit direto em `main` ou `develop`.
- [ ] **[Enzo]** Garantir que cada PR tenha revisão de pelo menos uma pessoa.

Exemplos:

```text
feat(henrique-clientes): adiciona consulta ViaCEP
feat(julia-produtos): cria regra de produto indisponivel
feat(nycollas-checkout): calcula frete do pedido
feat(enzo-recibo): exibe recibo da venda
```

## Critério de pronto para qualquer checkbox

- [ ] **[Responsável da tarefa]** Código em TypeScript, validado sem erros de compilação.
- [ ] **[Responsável da tarefa]** Módulo testado com dados próprios ou mock, sem depender de outro módulo.
- [ ] **[Responsável da tarefa]** Commit criado e checkbox marcado.
- [ ] **[Revisor do PR]** Pull Request revisado antes do merge em `develop`.
