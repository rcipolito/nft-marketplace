# KURIO — Arquitetura e Decisões Técnicas

## 1. Visão geral

A KURIO é uma aplicação frontend de marketplace de NFTs desenvolvida com React, TypeScript e Vite.

A arquitetura separa a interface, o gerenciamento de estado, o consumo de dados e os serviços simulados para facilitar a manutenção e a evolução do projeto.

O ambiente utiliza duas partes principais:

- **Frontend:** aplicação React hospedada na Vercel.
- **Servidor auxiliar:** serviço Node.js com Socket.IO hospedado no Render, responsável por preços e eventos de pedidos.

A API REST é simulada com Mock Service Worker (MSW), sem dependência de um backend privado.

## 2. Organização do projeto

| Diretório | Responsabilidade |
|---|---|
| `src/components` | Componentes de interface e elementos reutilizáveis |
| `src/routes` | Páginas e navegação |
| `src/services` | Comunicação com APIs |
| `src/contexts` | Estados compartilhados, quando aplicável |
| `src/mocks` | Handlers e dados simulados |
| `src/lib` | Configurações e utilitários |
| `server` | Servidor HTTP e Socket.IO |
| `tests` | Testes automatizados |
| `public` | Imagens e arquivos estáticos |

## 3. Navegação

A navegação utiliza TanStack Router, com rotas tipadas.

O catálogo utiliza parâmetros de URL para representar informações como busca, ordenação, paginação e limite de preço.

Essa abordagem permite compartilhar URLs com os filtros aplicados e preservar o estado de navegação.

A Vercel utiliza uma regra de reescrita para que as rotas funcionem também ao atualizar diretamente o navegador.

## 4. Gerenciamento de dados e estado

O projeto combina diferentes mecanismos conforme a responsabilidade de cada dado.

**TanStack Query:** utilizado no consumo e gerenciamento de dados remotos, incluindo estados de carregamento e erro.

**Context API:** utilizada para compartilhar estados da aplicação, como autenticação, favoritos e carrinho.

**URL:** utilizada para representar filtros e paginação do catálogo.

**Persistência local:** utilizada em partes do fluxo que precisam manter informações entre navegações e recarregamentos.

Essa separação evita concentrar todas as responsabilidades em um único estado global.

## 5. API REST e mocks

O MSW intercepta requisições REST e retorna dados simulados para o catálogo e outros fluxos da aplicação.

Os handlers estão definidos em `src/mocks/handlers.ts`.

A ativação dos mocks é controlada pela variável `VITE_ENABLE_MOCKS`.

O servidor HTTP separado disponibiliza `/api/prices`, utilizado para consultar os preços atuais dos NFTs.

Os mocks permitem executar e avaliar a aplicação sem credenciais privadas ou serviços de terceiros.

## 6. Comunicação em tempo real

A aplicação utiliza Socket.IO para receber eventos relacionados aos NFTs e aos pedidos.

O evento `nft.updated` comunica alterações de preços. As mensagens incluem uma versão do dado, permitindo identificar atualizações recebidas.

Os eventos `order.register`, `order.subscribe`, `order.unsubscribe` e `order.updated` compõem o fluxo de acompanhamento de pedidos.

O servidor mantém informações em memória e simula a confirmação de pedidos após um intervalo.

### Reconciliação entre REST e Socket.IO

A API HTTP fornece uma referência dos preços disponíveis, enquanto o Socket.IO comunica atualizações posteriores.

O campo `version` permite comparar versões e evitar que uma atualização antiga substitua um valor mais recente, quando essa verificação é aplicada pelo consumidor.

O comportamento efetivo também depende da disponibilidade da conexão e do tratamento implementado nos componentes.

## 7. Carrinho e checkout

O carrinho é gerenciado no frontend e utiliza os dados dos NFTs para apresentar itens e valores.

Os cálculos de valores em ETH utilizam uma representação apropriada para evitar problemas comuns de precisão com números decimais em JavaScript.

O checkout utiliza uma chave de idempotência para identificar a operação e reduzir o risco de processamento duplicado.

Como o projeto utiliza serviços simulados, não são realizados pagamentos reais nem transações em blockchain.

## 8. Autenticação e sessão

O fluxo de autenticação é simulado para permitir a navegação e a avaliação das telas relacionadas à conta.

Não há integração com um provedor real de identidade.

A sessão não deve ser interpretada como autenticação segura para uso em produção. Um ambiente real exigiria validação de credenciais no servidor, controle de autorização e políticas adequadas de expiração e renovação de sessão.

## 9. Tratamento de estados

A interface considera estados associados ao carregamento de dados e às respostas das operações.

A separação entre componentes, serviços e hooks facilita apresentar mensagens de carregamento, erro e ausência de resultados.

A cobertura desses estados varia conforme a funcionalidade implementada.

## 10. Testes e qualidade

O projeto utiliza TypeScript para validação estática e Playwright para testes automatizados de fluxos da aplicação.

Comandos principais:

```bash
pnpm build
pnpm lint
pnpm exec playwright test
```

O build combina verificação de TypeScript e geração dos arquivos de produção.

Os testes automatizados complementam a validação manual, mas não substituem testes de integração com serviços reais.

## 11. Deploy

O frontend está hospedado na Vercel:

https://nft-marketplace-rcipolito.vercel.app/

O servidor HTTP e Socket.IO está hospedado no Render:

https://kurio-socket.onrender.com/api/prices

A comunicação entre os serviços depende da configuração correta de CORS, especialmente da variável `FRONTEND_URL` no Render.

As variáveis `VITE_ENABLE_MOCKS` e `VITE_SOCKET_URL` são incorporadas ao frontend durante o build.

## 12. Decisões de interface e Figma

A interface foi construída a partir do protótipo disponibilizado no desafio, procurando preservar a identidade visual, a hierarquia das informações, as cores, a tipografia e a organização do marketplace.

Foram utilizados componentes reutilizáveis para facilitar a consistência entre as páginas.

**Desvios e limitações visuais:** a versão desktop recebeu maior atenção durante o desenvolvimento. A adaptação para telas menores pode apresentar diferenças em relação ao layout mobile do Figma e necessita de revisão adicional.

## 13. Limitações conhecidas

- O projeto utiliza APIs e autenticação simuladas.
- Não há banco de dados persistente para pedidos no servidor Socket.IO.
- A reinicialização do servidor pode eliminar dados mantidos em memória.
- A hospedagem do servidor pode apresentar períodos de inicialização ou indisponibilidade.
- Não há processamento real de pagamentos ou transações em blockchain.
- A experiência mobile não foi integralmente validada contra o protótipo.
- A aplicação não foi submetida a uma auditoria completa de acessibilidade, desempenho e segurança.

## 14. Melhorias futuras

- Consolidar a experiência responsiva para todas as resoluções do Figma.
- Ampliar os testes de integração e cenários de falha.
- Melhorar a recuperação automática após interrupções de conexão.
- Implementar autenticação e persistência em backend real.
- Expandir as verificações de acessibilidade e desempenho.
- Formalizar métricas e relatórios de auditoria.

---

Documento de arquitetura elaborado para apresentar as decisões técnicas e os limites da implementação entregue no desafio.