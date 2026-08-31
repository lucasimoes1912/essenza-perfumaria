# Essenza Perfumaria 🌸

E-commerce para **revenda de produtos O Boticário** (nome "Essenza" é provisório), com catálogo em banco de dados, controle de estoque, checkout via **Mercado Pago** (Pix, cartão e boleto), painel administrativo e área de revendedores. No ar no **Railway**.

> Este site não é o site oficial de O Boticário — é uma loja de revendedor independente, com o devido selo no rodapé.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **PostgreSQL** (Railway) via `pg` — schema e seed criados automaticamente no primeiro acesso ([lib/db.ts](lib/db.ts))
- **Mercado Pago** Checkout Pro (SDK oficial v2)
- Build por **Dockerfile** (Node 24, output standalone do Next)

## Design

Direção editorial, definida em [app/globals.css](app/globals.css) — todos os tokens ficam no bloco `@theme`.

- **Paleta**: fundo `#F1F3EE` (verde-cinza pálido, referência ao vidro do flacon), tinta `#181A14`, e o acento é **íris** `#4C3F72` — a raiz de íris (orris) é o material mais caro da perfumaria. Auxiliares: `rust` para alerta de estoque, `moss` para confirmação.
- **Tipografia**: **Bodoni Moda** para display (a didone é a letra da publicidade de perfumaria desde os anos 20), **Archivo** para texto e **DM Mono** para a camada técnica — categoria, concentração, ml, fases olfativas. As classes utilitárias `.display` e `.label` cobrem os dois extremos.
- **Assinatura**: a **escada olfativa** ([components/NoteLadder.tsx](components/NoteLadder.tsx)) — topo, coração e fundo com o tempo real de cada fase na pele. Aparece só quando o produto tem notas cadastradas; batom e combo capilar simplesmente não a exibem.
- **Componentes de casca**: `.btn`, `.btn-ghost`, `.field` (campo com fio embaixo, sem caixa) e `.link-rule`. Sem cantos arredondados e sem sombras — a hierarquia vem de fios de 1px e espaço.
- Os nomes de token antigos (`gold`, `sand`, `ivory`, `line`, `stone-warm`) continuam definidos como aliases da nova paleta, então `/admin` e `/revendedor` seguem coerentes sem terem sido reescritos.
- A animação de abertura da home respeita `prefers-reduced-motion`.

## Funcionalidades

### Loja (pública)
- Home com capa editorial (o produto em destaque aparece com a ficha completa), índice por categoria, catálogo com filtro (feminino/masculino/unissex) e página de produto com a escada olfativa (quando o produto tem notas)
- Produtos sem "ml" (batom, sabonete, combo) não exibem tamanho nem notas — o marcador é `ml = 0`
- Carrinho persistido no navegador (localStorage), com aviso de quanto falta para o frete grátis
- **Estoque por quantidade**: badge "Últimas unidades" (≤3), "Esgotado" (0) com compra bloqueada, e seletor de quantidade limitado ao disponível
- Frascos ilustrados em SVG ([components/BottleArt.tsx](components/BottleArt.tsx)) — cores/formato configuráveis por produto, até haver fotos reais

### Entrega e frete
- No carrinho, o cliente escolhe o método: **receber em casa** ou **retirar em mãos**
- **Receber em casa**: endereço completo com preenchimento automático pelo CEP (ViaCEP) e **frete por estado** — tabela com as 27 UFs ([lib/shipping-regions.ts](lib/shipping-regions.ts) semeia por região: Sudeste R$ 15,90 → Norte R$ 28,90), cotada em tempo real via `/api/frete?uf=XX` e **editável em `/admin/frete`**
- **Retirar em mãos**: sem frete; o formulário pede só nome e telefone, e o local/horário é combinado por WhatsApp após o pagamento
- Frete **grátis** acima de `freeShippingMin` (hoje R$ 299, em [lib/config.ts](lib/config.ts)); `flatShippingFee` é apenas fallback para UF ausente da tabela
- O frete exibido no carrinho é cortesia — **o servidor recalcula tudo no checkout** e grava frete, método (`delivery_method`) e endereço no pedido

### Checkout e pedidos
- `/api/checkout` valida **tudo no servidor** (preço vem do banco, nunca do navegador; estoque conferido; frete recalculado pela UF ou zerado na retirada) e cria a preferência no Mercado Pago (o frete entra como item próprio)
- Cada clique em "Pagar" registra um pedido (`orders`) com os itens congelados, frete, método de entrega, endereço e `external_reference`
- `/api/webhook` recebe as notificações do MP, consulta o pagamento na API oficial e atualiza o status do pedido; **desconta o estoque apenas na primeira transição para "aprovado"** (notificações duplicadas não descontam duas vezes)
- Páginas de retorno: sucesso, pendente e erro

### Painel do lojista — `/admin`
- Login por senha única (`ADMIN_PASSWORD`), sessão expira em **12 horas**
- **Produtos**: CRUD completo — nome, slug, marca, categoria, preços (venda + "de" riscado), estoque, descrição, notas olfativas, cores/formato do frasco, destaque na home, ativar/desativar
- **Pedidos**: lista com itens, frete, endereço de entrega (ou badge de retirada em mãos + telefone), comprador, revendedor responsável e status traduzido
- **Revendedores**: cadastrar/editar/desativar contas, ver vendas pagas e total vendido por pessoa
- **Frete**: tabela de valores por UF, agrupada por região, salva direto no banco (sem deploy)
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

- O schema (products, orders, resellers, shipping_rates) e o catálogo inicial são criados automaticamente no primeiro acesso quando a tabela está vazia — a semente é [lib/seed-products.ts](lib/seed-products.ts), hoje com os **8 itens reais** do estoque (importados da lista do fornecedor em 09/07/2026, **a preço de custo** — defina os preços de venda no admin!)
- No dia a dia, o estoque é mantido pelo painel `/admin` (chegou reposição → editar produto → somar unidades); não há sincronização com planilha externa por decisão de projeto
- Preços são armazenados em **centavos** (ex.: R$ 127,41 = `12741`)

## Estrutura

```
app/
  page.tsx                    # home (hero, destaques, categorias)
  produtos/                   # catálogo + página de produto (banco)
  carrinho/                   # sacola, entrega×retirada, endereço e pagamento
  checkout/{sucesso,erro,pendente}/  # retorno do Mercado Pago
  api/checkout/               # valida carrinho+frete, cria pedido e preferência MP
  api/frete/                  # cotação de frete por UF (usada pelo carrinho)
  api/webhook/                # notificações MP → status + baixa de estoque
  admin/                      # painel do lojista (produtos, pedidos, revendedores, frete)
  revendedor/                 # login e painel do revendedor
components/                   # Header, Footer, cards, carrinho, formulários admin
lib/
  config.ts                   # nome da marca, contato, frete grátis/fallback
  types.ts                    # tipos compartilhados
  db.ts                       # pool pg + schema + seed automáticos
  catalog.ts / orders.ts / resellers.ts  # acesso a dados
  shipping.ts / shipping-regions.ts      # tabela de frete por UF
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
5. Valores da tabela de frete são estimativas por região — ajustar em `/admin/frete` conforme a cidade de origem
6. Evolução futura de frete: integração SuperFrete/Melhor Envio (cotação real dos Correios + etiqueta com desconto; exigirá peso/dimensões por produto)
