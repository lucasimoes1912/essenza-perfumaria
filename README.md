# Essenza Perfumaria 🌸

E-commerce de perfumes construído com **Next.js + TypeScript + Tailwind CSS**, com checkout via **Mercado Pago** (Pix, cartão e boleto), pronto para deploy no **Railway**.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Configuração

Copie `.env.example` para `.env.local` e preencha:

| Variável | O que é |
|---|---|
| `MP_ACCESS_TOKEN` | Access Token do Mercado Pago ([Painel de credenciais](https://www.mercadopago.com.br/developers/panel/app)). Use o token de **teste** para testar e o de **produção** para vender de verdade. |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (ex.: `https://seu-app.up.railway.app`). Usada nos redirects pós-pagamento. |

> Sem `MP_ACCESS_TOKEN` o site funciona normalmente; apenas o botão de pagamento exibe um aviso de "pagamento não configurado".

## Deploy no Railway

1. Crie um repositório Git e suba o projeto (`git init`, commit, push para o GitHub), **ou** use a CLI do Railway direto da pasta:
   ```bash
   npm i -g @railway/cli
   railway login
   railway init      # cria o projeto
   railway up        # faz o deploy
   ```
2. No painel do Railway, em **Variables**, adicione `MP_ACCESS_TOKEN` e `NEXT_PUBLIC_SITE_URL` (a URL que o Railway gerar em **Settings > Networking > Generate Domain**).
3. Pronto — cada `railway up` (ou push, se conectar o GitHub) gera um novo deploy.

## Personalização

- **Nome da loja, contato e frete grátis:** [lib/config.ts](lib/config.ts)
- **Produtos (nome, preço, notas, cores do frasco):** [lib/products.ts](lib/products.ts) — preços em **centavos**
- **Cores e fontes do tema:** [app/globals.css](app/globals.css)
- **Fotos reais:** hoje os produtos usam ilustrações SVG geradas em [components/BottleArt.tsx](components/BottleArt.tsx); quando tiver fotos, basta trocar o componente por `<Image>` nos cards.

## Estrutura

```
app/
  page.tsx                  # home (hero, destaques, categorias)
  produtos/                 # catálogo com filtro por categoria
  produtos/[slug]/          # página do produto
  carrinho/                 # sacola + botão de pagamento
  checkout/{sucesso,erro,pendente}/  # retorno do Mercado Pago
  api/checkout/             # cria a preferência de pagamento (server-side)
  api/webhook/              # notificações do Mercado Pago
components/                 # Header, Footer, carrinho (Context), cards, SVG dos frascos
lib/                        # config da loja + catálogo de produtos
```
