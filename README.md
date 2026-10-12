# KURIO — NFT Marketplace

Aplicação de marketplace de NFTs desenvolvida como teste técnico para a vaga de **Junior Frontend Developer na Jungle Gaming**.

O projeto apresenta um catálogo de NFTs com filtros e ordenação, páginas de detalhes, favoritos, carrinho de compras e fluxo de checkout. A aplicação utiliza uma API simulada com Mock Service Worker (MSW) e um servidor Socket.IO para eventos em tempo real.

## Demonstração

- **Aplicação:** https://nft-marketplace-rcipolito.vercel.app/
- **Código-fonte:** https://github.com/rcipolito/nft-marketplace
- **Servidor de eventos:** https://kurio-socket.onrender.com/api/prices

## Tecnologias

- React e TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Router
- TanStack Query
- Axios
- Mock Service Worker (MSW)
- Socket.IO
- Playwright
- pnpm

## Funcionalidades

- Catálogo de NFTs com paginação, busca, filtros e ordenação
- Página de detalhes de cada NFT
- Sistema de favoritos
- Carrinho de compras
- Autenticação simulada
- Fluxo de checkout e acompanhamento de pedidos
- Atualizações de preços por Socket.IO
- Layout baseado no protótipo disponibilizado no Figma
- Testes automatizados com Playwright

## Requisitos

- Node.js compatível com o projeto
- pnpm
- Navegador moderno

## Instalação

Clone o repositório:

```bash
git clone https://github.com/rcipolito/nft-marketplace.git
cd nft-marketplace
```

Instale as dependências:

```bash
pnpm install --frozen-lockfile
```

## Configuração do ambiente

Crie um arquivo `.env.development` na raiz do projeto:

```env
VITE_ENABLE_MOCKS=true
VITE_SOCKET_URL=http://localhost:3001
```

As variáveis são:

| Variável | Descrição |
|---|---|
| `VITE_ENABLE_MOCKS` | Ativa os handlers simulados do MSW |
| `VITE_SOCKET_URL` | Endereço do servidor Socket.IO e da API de preços |
| `FRONTEND_URL` | Origem permitida pelo CORS do servidor Socket.IO |
| `PORT` | Porta HTTP do servidor Socket.IO; padrão local: 3001 |

O servidor utiliza `FRONTEND_URL=http://localhost:5173` por padrão no ambiente local.

As variáveis com prefixo `VITE_` são públicas e não devem conter credenciais privadas.

## Executar localmente

Para iniciar o frontend e o servidor Socket.IO simultaneamente:

```bash
pnpm dev:all
```

A aplicação estará disponível em:

http://localhost:5173

Também é possível executar os serviços separadamente:

```bash
pnpm dev
```

```bash
pnpm dev:socket
```

**Observação:** a aplicação depende do servidor de preços para determinadas operações dos mocks. Para testar todos os fluxos, utilize `pnpm dev:all`.

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o frontend |
| `pnpm dev:socket` | Inicia o servidor Socket.IO |
| `pnpm dev:all` | Inicia os dois serviços |
| `pnpm build` | Executa a verificação TypeScript e gera o build |
| `pnpm preview` | Visualiza o build de produção |
| `pnpm lint` | Executa o ESLint |
| `pnpm exec playwright test` | Executa os testes automatizados |
| `pnpm start:socket` | Inicia o servidor Socket.IO |

## Mocks e dados simulados

O projeto utiliza o **Mock Service Worker (MSW)** para simular as respostas da API REST.

Os handlers ficam em:

```text
src/mocks/handlers.ts
```

O servidor de eventos e preços está em:

```text
server/socket.ts
```

O MSW é ativado quando `VITE_ENABLE_MOCKS=true`.

Os dados são fictícios e destinados à avaliação do fluxo da aplicação. Não há necessidade de conectar um banco de dados ou serviços privados.

## API REST simulada

Principais endpoints utilizados pela aplicação:

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/api/nfts` | Listagem de NFTs com filtros e paginação |
| GET | `/api/nfts/:id` | Detalhes de um NFT |
| GET | `/api/cart/nfts` | Dados dos NFTs utilizados no carrinho |
| GET | `/api/prices` | Consulta de preços no servidor HTTP do Socket.IO |

O endpoint `/api/prices` é fornecido pelo servidor Node.js, enquanto os endpoints do catálogo são simulados pelo MSW.

## Eventos em tempo real

O servidor Socket.IO fornece atualizações de preços e eventos relacionados aos pedidos.

| Evento | Finalidade |
|---|---|
| `nft.updated` | Informa uma atualização de preço |
| `order.register` | Registra um pedido para acompanhamento |
| `order.subscribe` | Inscreve o cliente nas atualizações de um pedido |
| `order.unsubscribe` | Cancela o acompanhamento de um pedido |
| `order.updated` | Informa uma atualização de status do pedido |

As atualizações de preços possuem um campo `version`, utilizado para identificar a versão do dado recebido.

## Testes

Para executar os testes automatizados:

```bash
pnpm exec playwright test
```

Os testes Playwright cobrem fluxos da aplicação e devem ser executados com o ambiente necessário disponível, conforme a configuração do projeto.

Para verificar a compilação de produção:

```bash
pnpm build
```

Para verificar o código com ESLint:

```bash
pnpm lint
```

## Deploy

A aplicação utiliza dois serviços:

- **Vercel:** hospedagem do frontend React/Vite.
- **Render:** hospedagem do servidor HTTP e Socket.IO.

No ambiente de produção, as variáveis `VITE_ENABLE_MOCKS` e `VITE_SOCKET_URL` devem ser configuradas antes do build do frontend.

O Render precisa autorizar a origem do frontend por meio de `FRONTEND_URL`.

O projeto inclui `vercel.json` para permitir acesso direto às rotas da aplicação.

## Limitações conhecidas

- A API de catálogo e os fluxos de autenticação são simulados; não existe backend de produção com banco de dados.
- Os dados de pedidos mantidos em memória pelo servidor podem ser perdidos quando o processo reinicia.
- A disponibilidade dos eventos em tempo real depende do serviço hospedado no Render.
- A implementação visual pode apresentar diferenças em relação ao protótipo original, especialmente em resoluções ainda não completamente ajustadas.

## Arquitetura

As decisões técnicas, a organização do código, as estratégias de estado e as limitações estão documentadas em `ARCHITECTURE.md`.

## Referência visual

Protótipo disponibilizado para o teste técnico:

https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1&p=f

---

Projeto desenvolvido para fins de avaliação técnica.