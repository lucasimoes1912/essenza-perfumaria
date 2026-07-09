# Essenza Perfumaria 🌸

E-commerce para **revenda de produtos O Boticário** (nome "Essenza" é provisório), com catálogo em banco de dados, controle de estoque, checkout via **Mercado Pago** (Pix, cartão e boleto), painel administrativo e área de revendedores. No ar no **Railway**.

> Este site não é o site oficial de O Boticário — é uma loja de revendedor independente, com o devido selo no rodapé.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **PostgreSQL** (Railway) via `pg` — schema e seed criados automaticamente no primeiro acesso ([lib/db.ts](lib/db.ts))
- **Mercado Pago** Checkout Pro (SDK oficial v2)
- Build por **Dockerfile** (Node 24, output standalone do Next)

## Funcionalidades

### Loja (pública)
- Home com destaques, catálogo com filtro por categoria (feminino/masculino/unissex) e página de produto com pirâmide olfativa (quando aplicável)
- Produtos sem "ml" (batom, sabonete, combo) não exibem tamanho nem notas — o marcador é `ml = 0`
- Carrinho persistido no navegador (localStorage), com barra de progresso para frete grátis
- **Estoque por quantidade**: badge "Últimas unidades" (≤3), "Esgotado" (0) com compra bloqueada, e seletor de quantidade limitado ao disponível
- Frascos ilustrados em SVG ([components/BottleArt.tsx](components/BottleArt.tsx)) — cores/formato configuráveis por produto, até haver fotos reais

### Checkout e pedidos
- `/api/checkout` valida **tudo no servidor** (preço vem do banco, nunca do navegador; estoque conferido) e cria a preferência no Mercado Pago
- Cada clique em "Pagar" registra um pedido (`orders`) com os itens congelados e `external_reference`
- `/api/webhook` recebe as notificações do MP, consulta o pagamento na API oficial e atualiza o status do pedido; **desconta o estoque apenas na primeira transição para "aprovado"** (notificações duplicadas não descontam duas vezes)
- Páginas de retorno: sucesso, pendente e erro

### Painel do lojista — `/admin`
- Login por senha única (`ADMIN_PASSWORD`), sessão expira em **12 horas**
- **Produtos**: CRUD completo — nome, slug, marca, categoria, preços (venda + "de" riscado), estoque, descrição, notas olfativas, cores/formato do frasco, destaque na home, ativar/desativar
- **Pedidos**: lista com itens, comprador, revendedor responsável e status traduzido
- **Revendedores**: cadastrar/editar/desativar contas, ver vendas pagas e total vendido por pessoa
- **Visão geral**: contagens e faturamento dos pedidos pagos

### Área do revendedor — `/revendedor`
- Cada revendedor tem login próprio (e-mail + senha, hash scrypt) criado pelo admin; sessão expira em **7 dias**
- **Link exclusivo de divulgação** (`/?rev=codigo`): o middleware grava um cookie de 30 dias e o checkout atribui o pedido ao revendedor
- O painel mostra apenas as **próprias** vendas (sem comissão calculada — só atribuição) e o botão de copiar o link

## Rodando localmente

```bash
npm install
npm run dev
```

Crie um `.env.local` a partir do [.env.example](.env.example). Para usar o banco do Railway em desenvolvimento, use a `DATABASE_PUBLIC_URL` do serviço Postgres — **atenção: é o banco de produção**, todo dado alterado localmente vale de verdade.

## Variáveis de ambiente

| Variável | O que é |
|---|---|
| `DATABASE_URL` | Conexão Postgres. No Railway, use a referência `${{Postgres.DATABASE_URL}}` (rede privada). |
| `ADMIN_PASSWORD` | Senha do `/admin`. Também é a chave que assina as sessões (admin e revendedor) — **trocá-la desloga todo mundo**. |
| `MP_ACCESS_TOKEN` | Access Token do Mercado Pago ([credenciais](https://www.mercadopago.com.br/developers/panel/app)). Sem ela o site funciona e o botão de pagar explica o que falta. |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ex.: `https://…up.railway.app`). Usada nos redirects do checkout, no webhook e no link dos revendedores. |
| `PORT` | Fixada em `3000` no Railway para casar com o target port do domínio (o Railway injetaria 8080). |

## Deploy no Railway

O projeto está no ar num projeto Railway com dois serviços: o app (este repositório, build via [Dockerfile](Dockerfile)) e o Postgres.

- Deploy manual: `railway up` na raiz (CLI já logada e linkada)
- O [Dockerfile](Dockerfile) usa `HOSTNAME=::` (IPv6 dual-stack) — **necessário** para o proxy do Railway alcançar o app; sem isso, 502
- Push no GitHub (`lucasimoes1912/essenza-perfumaria`) está conectado ao serviço, mas o auto-deploy por push ainda não foi confirmado — na dúvida, `railway up`

## Dados e catálogo

- O schema (products, orders, resellers) e o catálogo inicial são criados automaticamente no primeiro acesso quando a tabela está vazia — a semente é [lib/seed-products.ts](lib/seed-products.ts), hoje com os **8 itens reais** do estoque (importados da lista do fornecedor em 09/07/2026, **a preço de custo** — defina os preços de venda no admin!)
- No dia a dia, o estoque é mantido pelo painel `/admin` (chegou reposição → editar produto → somar unidades); não há sincronização com planilha externa por decisão de projeto
- Preços são armazenados em **centavos** (ex.: R$ 127,41 = `12741`)

## Estrutura

```
app/
  page.tsx                    # home (hero, destaques, categorias)
  produtos/                   # catálogo + página de produto (banco)
  carrinho/                   # sacola + botão de pagamento
  checkout/{sucesso,erro,pendente}/  # retorno do Mercado Pago
  api/checkout/               # valida carrinho, cria pedido e preferência MP
  api/webhook/                # notificações MP → status + baixa de estoque
  admin/                      # painel do lojista (produtos, pedidos, revendedores)
  revendedor/                 # login e painel do revendedor
components/                   # Header, Footer, cards, carrinho, formulários admin
lib/
  config.ts                   # nome da marca, contato, frete grátis
  types.ts                    # tipos compartilhados
  db.ts                       # pool pg + schema + seed automáticos
  catalog.ts / orders.ts / resellers.ts  # acesso a dados
  admin-auth.ts / reseller-auth.ts       # sessões assinadas com expiração
  seed-products.ts            # catálogo-semente (lista real do estoque)
middleware.ts                 # captura ?rev=codigo → cookie de atribuição
Dockerfile                    # build determinístico p/ Railway
```

## Pendências conhecidas

1. `MP_ACCESS_TOKEN` de produção (ativa o pagamento real)
2. Nome definitivo da marca (trocar em [lib/config.ts](lib/config.ts))
3. Fotos reais dos produtos (substituir os SVGs)
4. Preços de venda (importados a custo — margem zero até ajustar no admin)
