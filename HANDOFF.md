# HANDOFF — Landing page Nascimento Team

Documento de transferência do projeto. Quem assumir a partir daqui consegue
entender **tudo o que foi feito** e **continuar com autonomia total**, usando o
mesmo repositório.

> **Resumo em uma frase:** landing page estática (HTML + CSS + JS puro, **sem
> build**) de consultoria online de treino e nutrição do Henrique Silvério do
> Nascimento, publicada na Vercel em **https://nascimentoteam.vercel.app**.

---

## Índice

1. [Visão geral e stack](#1-visão-geral-e-stack)
2. [Deploy, ambiente e Git](#2-deploy-ambiente-e-git)
3. [Estrutura de arquivos](#3-estrutura-de-arquivos)
4. [Sistema de design (tokens)](#4-sistema-de-design-tokens)
5. [Anatomia da página (seção por seção)](#5-anatomia-da-página-seção-por-seção)
6. [JavaScript (`script.js`)](#6-javascript-scriptjs)
7. [Responsividade e larguras "boxed"](#7-responsividade-e-larguras-boxed)
8. [Imagens: como tratar e otimizar](#8-imagens-como-tratar-e-otimizar)
9. [Regras de conteúdo do cliente](#9-regras-de-conteúdo-do-cliente)
10. [Receitas: como fazer as alterações mais comuns](#10-receitas-como-fazer-as-alterações-mais-comuns)
11. [Armadilhas conhecidas (leia antes de mexer)](#11-armadilhas-conhecidas-leia-antes-de-mexer)
12. [Como verificar as mudanças](#12-como-verificar-as-mudanças)
13. [Histórico de decisões](#13-histórico-de-decisões)
14. [Pendências e próximos passos](#14-pendências-e-próximos-passos)

---

## 1. Visão geral e stack

- **O que é:** página única (one-page) de captação para a consultoria. O
  objetivo de conversão é levar o visitante ao **WhatsApp**.
- **Stack:** `index.html` + `styles.css` + `script.js`. **Nenhum framework,
  nenhum build, nenhuma dependência de node.** Abrir o `index.html` no navegador
  já mostra a página inteira.
- **Caminhos relativos** (`./styles.css`, `./img/...`): a página funciona na raiz
  de um domínio ou em subpasta, sem ajustes.
- **Tipografia:** DM Sans (Google Fonts, carregada no `<head>`).
- **Paleta:** extraída do site oficial nascimentoteam.com — roxo `#ba63ff` sobre
  fundo escuro `#0e0e0e`.
- **Tamanho:** ~1.720 linhas no total (index 605 / styles 786 / script 330).

---

## 2. Deploy, ambiente e Git

### Vercel
- O projeto está publicado na Vercel: **https://nascimentoteam.vercel.app**.
- **Domínio próprio:** `nascimentoteam.com.br` (DNS propagando). A home fica na
  raiz e os valores em **`/planos`**. As tags `canonical`/`og:url` das duas
  páginas já apontam para esse domínio.
- **URLs limpas:** o `vercel.json` usa `"cleanUrls": true`, então `/planos` serve
  o `planos.html` (e `/planos.html` redireciona para `/planos`). **Ao abrir os
  arquivos localmente ou por um servidor simples, use `planos.html` na URL** — o
  `cleanUrls` só existe na Vercel.
- **Branch de produção na Vercel:** `claude/dreamy-noether-yhi3oj`. **Todo push
  nessa branch dispara um deploy automático** (leva ~10–30s para ir ao ar).
- Não há build: a Vercel só serve os arquivos estáticos. `vercel.json` define
  cache das imagens (`/img/*` → `immutable`, 1 ano) e headers de segurança.
- **`DEPLOY.md`** explica como, no futuro, servir a página em
  `ronaldox.com.br/nascimento-team` (via rewrite) ou migrar para o domínio do
  cliente. Nada no código precisa mudar (caminhos relativos).

### Git — como trabalhar
- **Branch de trabalho atual:** `claude/dreamy-noether-yhi3oj`.
- O **cliente sobe imagens pelo próprio GitHub** (aparecem como commits
  "Add files via upload" na branch remota). **Antes de começar, sempre puxe:**
  ```bash
  git fetch origin claude/dreamy-noether-yhi3oj
  git merge --ff-only origin/claude/dreamy-noether-yhi3oj
  ```
- Fluxo normal: editar → commit descritivo → `git push origin claude/dreamy-noether-yhi3oj`
  → conferir ao vivo em nascimentoteam.vercel.app.
- **Ainda não existe Pull Request.** Se o time preferir um fluxo mais limpo, dá
  para fazer merge dessa branch na `main` e apontar a `main` como branch de
  produção na Vercel. Combine isso com o responsável antes.

---

## 3. Estrutura de arquivos

```
index.html        → home (todas as seções da página principal)
planos.html       → página /planos, com os valores de cada plano
styles.css        → estilos (tokens em :root + responsividade no fim do arquivo)
script.js         → CONFIG (no topo) + interações
vercel.json       → headers de cache/segurança
README.md         → visão geral e o que personalizar
DEPLOY.md         → passo a passo de publicação/roteamento na Vercel
HANDOFF.md        → este documento
img/
  favicon.svg
  henrique.jpg            → foto da HERO (800x1200)
  henrique-sobre.webp     → foto do "Sobre" (bio) — 1000x1500
  IMG_2227.JPG            → foto do 6º box de "Para quem é" — 1200x1800
  IMG_2218.JPG            → foto da dobra "Como eu trabalho" (espelhada via CSS)
  IMG_2720.JPG           → original sem uso na página (2 MB, NÃO é servida ao visitante)
  depoimentos/
    depoimento-01.webp … depoimento-19.webp   → prints reais dos alunos (carrossel)
```

---

## 4. Sistema de design (tokens)

Tudo é controlado por variáveis CSS no `:root` (topo do `styles.css`). Mudou a
variável, mudou o site inteiro.

```css
/* Marca */
--primary:#ba63ff; --primary-light:#c875ff; --primary-dark:#8939bf; --primary-deep:#59307a;
/* Neutros escuros */
--bg:#0e0e0e; --bg-2:#141414; --surface:#181818; --surface-2:#1f1f1f;
--border:rgba(255,255,255,.08); --border-strong:rgba(255,255,255,.14);
/* Texto */
--text:#fff; --text-soft:#edf0f2; --text-muted:#b3b3b3; --text-dim:#808080;
/* Apoio */
--green:#179151; --radius:16px; --radius-lg:24px;
--maxw:1280px;                 /* largura do conteúdo — muda por faixa no fim do arquivo */
--shadow:…; --glow:…; --ease:cubic-bezier(.22,1,.36,1);
--dot-bg:radial-gradient(...); --dot-size:22px 22px;   /* fundo de pontos sutil */
```

- **Fundo de pontos** (`--dot-bg`) aplicado ao `body`, `.section--alt` e ao rodapé.
- **Botões:** classe base `.btn` + variações `--primary` (roxo com halo/glow),
  `--ghost` (contorno), `--lg`/`--sm`/`--block`. Texto em **caixa normal** (só a
  inicial maiúscula) e `letter-spacing` reduzido — padrão pedido pelo cliente.
- **Ícones:** biblioteca **Lucide** (SVG inline, baseados em traço:
  `fill="none" stroke="currentColor"`). Foram baixados de
  `unpkg.com/lucide-static` e colados no HTML. **Exceção:** o glifo do WhatsApp é
  desenhado à mão, porque a Lucide não tem ícone de marca.

---

## 5. Anatomia da página (seção por seção)

Ordem no `index.html` (cada bloco tem um comentário `<!-- N. NOME -->`):

| # | Seção (id) | O que é / detalhes |
|---|------------|--------------------|
| 00 | Barra de escassez + Header | Barra roxa com "Apenas X vagas disponíveis em [Mês]." (número e mês automáticos, ver §6). Header fixo (sticky) com logo + navegação. **No mobile: logo + menu hambúrguer, sem botão de WhatsApp** (removido a pedido do cliente). |
| 1 | Hero (`.hero`, âncora `#topo`) | Título grande + subtítulo + CTA "Entrar em contato" + microcopy + foto (`henrique.jpg`) com borda roxa e selo "100%". **No mobile a foto vem depois do CTA.** |
| 2 | `#para-quem` — "Para quem é" | Grade de 6 boxes: 5 cartões de texto "É para você que .0X" + **1 box de foto** (`IMG_2227.JPG`). Abaixo, o **box de alerta amarelo** ("Honestidade antes de tudo"). Gap entre boxes reduzido a pedido. |
| 3 | `#metodo` — "Como eu trabalho" | Layout 2 colunas: à esquerda um **aside sticky** (cabeçalho + foto `IMG_2218.JPG`, espelhada horizontalmente via `.flip-h`); à direita **3 pilares que empilham com efeito sticky**. Cada pilar tem ícone Lucide (dedo/**digital**, **maçã**, **cérebro-circuito**), número gigante em marca d'água ao fundo e brilho roxo. |
| 4 | `#processo` — "Como funciona" | Linha do tempo (timeline) de 4 passos. |
| 5 | `#incluso` — "O que está incluso" | Grade de features (o que o aluno recebe). |
| 6 | `#depoimentos` — Prova social | **Desktop:** carrossel infinito full-width (marquee CSS) com 19 prints reais (duplicados para 38 itens), fade nas bordas e pausa no hover. **Mobile (≤767px):** o marquee é desligado e vira um **slider com scroll-snap que avança sozinho, um slide por vez** (função `testimonialsAutoplay`); as cópias do loop ficam `display:none`. |
| 7 | `#planos` — Planos | Abas ("Dieta ou Treino" / "Dieta + Treino completo") com thumb deslizante. Cartões de plano **sem preço** (só entregáveis, em checklist ✓/✗) + botão **"Ver os valores de cada plano"**, que leva para `/planos`. |
| 8 | `#sobre` — Sobre | Bio do Henrique (texto à esquerda) + **foto com moldura roxa** (`henrique-sobre.webp`) à direita, na altura do texto. |
| 9 | `#faq` — Dúvidas frequentes | Acordeão com abertura suave (altura animada). Cabeçalho: rótulo "FAQ" + título "Dúvidas frequentes", centralizado. |
| 10 | `#contato` — CTA final | Chamada final para o WhatsApp. |
| — | Botão flutuante de WhatsApp | Fixo no canto inferior direito, verde `#25d366`, com anel pulsante e leve flutuação — réplica do botão do ronaldox.com.br. |

Padrões de cabeçalho: `.section-head` (com modificador `--center` para centralizar
rótulo + título). Todo elemento com a classe `.reveal` aparece com animação ao
entrar na tela (ver `scrollReveal` em §6).

---

## 6. JavaScript (`script.js`)

O arquivo começa com um objeto **`CONFIG`** (é aqui que se edita o essencial) e
depois traz funções e IIFEs de comportamento.

### CONFIG (edite estes valores)
```js
const CONFIG = {
  whatsapp: '5516997763003',                 // DDI+DDD+número, só dígitos
  whatsappMessage: 'Olá, Henrique! Vim pelo seu site e quero saber mais sobre a consultoria de treino e nutrição.',
  scarcity: {
    schedule: [[1,12],[10,7],[20,3],[25,1]], // [dia do mês, nº de vagas]
    min: 1, max: 12,
  },
};
```

### Comportamentos (na ordem do arquivo)
- **`vagasParaData` / `textoEscassez`** — a barra de escassez é **automática**:
  o nº de vagas é interpolado linearmente entre os pontos do `schedule` conforme
  o **dia do mês**, e o **mês é o vigente** (renova sozinho na virada). O mês sai
  sempre com **inicial maiúscula**. Ex.: dia 20 → "Apenas 3 vagas disponíveis em
  Julho."
- **`applyConfig`** — preenche **todos** os links `[data-wa]` com `https://wa.me/…`.
  Os botões dentro de um `.plan` recebem uma **mensagem personalizada** com o nome
  e o tipo do plano. Também injeta o texto da barra de escassez.
- **`stickyHeader`** — compacta/sombreia o header ao rolar.
- **`mobileNav`** — abre/fecha o menu hambúrguer.
- **`faqSmooth`** — anima a altura ao abrir/fechar cada item do FAQ.
- **`carousel`** — carrossel antigo de depoimentos (**hoje sem uso**; o
  depoimentos virou marquee via CSS). A função é inofensiva (sai cedo se não achar
  o elemento). Pode ser removida numa limpeza futura.
- **`planTabs`** — troca as abas de planos com transição suave (thumb + fade).
- **`marqueePause`** — pausa o marquee de depoimentos no **toque** (o pause no
  hover do mouse é feito por CSS).
- **`testimonialsAutoplay`** — só age no **mobile** (≤767px): avança os
  depoimentos de slide em slide a cada 3,8s. Pausa enquanto a pessoa arrasta
  (volta 6s depois), quando a seção sai da tela e quando a aba fica em segundo
  plano; respeita `prefers-reduced-motion`.
- **`scrollReveal`** — IntersectionObserver que adiciona `.is-visible` aos
  elementos `.reveal`.

---

## 7. Responsividade e larguras "boxed"

O conteúdo é **limitado por largura** conforme o dispositivo (pedido do cliente).
Isso é controlado pela variável `--maxw`, redefinida por faixa no fim do
`styles.css`:

| Faixa (largura da tela) | `--maxw` | Observações |
|---|---|---|
| Desktop (padrão) | **1280px** | 3 colunas de planos |
| ≤ 1439px (notebook) | **900px** | planos empilham |
| ≤ 1023px (tablet) | **800px** | nav vira hambúrguer; hero/sobre/método empilham; "Para quem é" em 2 colunas |
| ≤ 767px (mobile) | **400px** | tudo em 1 coluna; padding lateral 14px (usa a largura toda); textos de corpo em 0.92rem; **depoimentos um por vez** |
| ≤ 420px | 400px | ajustes finos de padding/botão |

Pontos importantes:
- O `body` usa **`overflow-x: clip`** (não `hidden`) — obrigatório para o efeito
  sticky dos pilares e do aside funcionarem (ver §11).
- Headlines de seção usam `clamp(2rem, …)` → **mínimo 32px** no mobile.
- Marquee no mobile: cada item = `min(80vw, 300px)` e a animação fica mais lenta,
  para caber ~um por vez e ficar legível.

---

## 8. Imagens: como tratar e otimizar

| Arquivo | Onde aparece | Observação |
|---|---|---|
| `henrique.jpg` (800x1200) | Hero | — |
| `henrique-sobre.webp` (1000x1500, ~100KB) | Sobre | recorte de `IMG_4094` (screenshot 1170x2532) |
| `IMG_2227.JPG` (1200x1800, ~368KB) | Para quem é (6º box) | servida direta |
| `IMG_2218.JPG` (1200x1800, ~330KB) | Método | **espelhada** por CSS (`.flip-h`) |
| `IMG_2720.JPG` (2 MB) | — | **não é servida**; pode ser removida se quiser enxugar o repo |
| `depoimentos/depoimento-01..19.webp` (480x1040) | Depoimentos | ~840KB no total |

**Regras práticas:**
- **Sempre otimizar antes de subir para a página.** Originais de câmera chegam
  com 4000x6000 / ~16MB; devem ir para o tamanho de exibição (ex.: 1200px de
  largura) e, quando possível, **WebP**. Reduzir para o tamanho de exibição não
  gera perda visível.
- Neste ambiente **não há `sharp`/ImageMagick**; a otimização foi feita via
  **canvas do Chromium (Puppeteer)** — carrega a imagem, desenha num canvas no
  tamanho alvo e exporta `toDataURL('image/webp', 0.86)`. Qualquer máquina com
  ImageMagick/`cwebp` resolve mais fácil.
- **Cache da Vercel para `/img/*` é `immutable` (1 ano).** Se **trocar o conteúdo
  mantendo o nome do arquivo**, o CDN pode continuar servindo o antigo — prefira
  **renomear** o arquivo (ou versionar no nome) ao substituir uma imagem.

---

## 9. Regras de conteúdo do cliente

Convenções acordadas — **respeite todas** ao editar textos:

1. **Sem travessões (—) em nenhum texto visível.** Use vírgula, parênteses ou
   reescreva. (Comentários de código podem ter, não aparecem na página.)
2. **Barra de escassez:** "Apenas X vagas disponíveis em [Mês]." — mês **sempre
   com inicial maiúscula**, sem frase extra.
3. **Mensagens de WhatsApp** dizem **"Vim pelo seu site"** (não "landing page").
4. **Botões** em caixa normal (só a inicial maiúscula) e com `letter-spacing`
   reduzido.
5. **Larguras boxed** por dispositivo (1280 / 900 / 800 / 400) — não estourar.
6. **Home sem preço**; os valores ficam em `/planos` (`planos.html`).
7. Identidade visual da marca: roxo `#ba63ff` sobre fundo escuro; DM Sans.

---

## 10. Receitas: como fazer as alterações mais comuns

- **Trocar o número/mensagem do WhatsApp:** `script.js` → `CONFIG.whatsapp` e
  `CONFIG.whatsappMessage`. Todos os botões `[data-wa]` se atualizam sozinhos.
- **Ajustar a curva de vagas:** `script.js` → `CONFIG.scarcity.schedule`
  (`[dia, vagas]`, em ordem crescente de dia), `min`/`max`.
- **Adicionar/trocar depoimentos:** suba os prints em `img/depoimentos/`, otimize
  para WebP e ajuste a lista no `#depoimentos` do `index.html` (lembre de manter o
  **conjunto duplicado**: os mesmos itens repetidos para o loop infinito).
- **Trocar uma foto e reenquadrar:** otimize/recorte para WebP, atualize o `src`
  no `index.html`. Para enquadrar dentro do box, use `object-fit: cover` +
  `object-position` (evite `border-radius` na imagem dentro de `.photo-frame`, ver §11).
- **Alterar um preço:** edite o `.plan__value` (e o `.plan__cash`, o valor à
  vista) no `planos.html`. O `applyConfig` já inclui "R$ X/mês" na mensagem do
  WhatsApp automaticamente.
- **Mudar cor/raio/sombra global:** variáveis no `:root`.

---

## 11. Armadilhas conhecidas (leia antes de mexer)

1. **Sticky x overflow:** os pilares e o aside do "Como eu trabalho" usam
   `position: sticky`. Isso **quebra** se algum ancestral tiver `overflow: hidden`.
   Por isso o `body` usa **`overflow-x: clip`**. Não troque por `hidden`.
2. **Imagem dentro de `.photo-frame`:** a moldura já recorta com `overflow:hidden`
   + `border-radius`. A imagem interna deve ter **`border-radius: 0`** — se ganhar
   raio próprio, os cantos ficam desiguais (frestas escuras). *(Foi exatamente o
   último bug corrigido.)*
3. **`.about__media` (foto da bio) no mobile precisa de largura definida**
   (`width: min(360px, 100%)`). Como a imagem e a legenda são `position:absolute`,
   um `margin-inline:auto` sozinho fazia o box **colapsar para ~4px** (a foto
   "sumia").
4. **`scroll-behavior: smooth`** atrapalha medições em testes automatizados de
   screenshot — role de forma instantânea nos testes.
5. **Ambiente sandbox e certificados:** ao rodar Puppeteer aqui, o Google Fonts /
   CDNs falham no TLS. Use `--ignore-certificate-errors` + `acceptInsecureCerts:
   true`. Para conferir o site ao vivo via `curl`, use `Cache-Control: no-cache` e
   um parâmetro de cache-busting.
6. **Ícones Lucide** são SVG inline (traço). Ao adicionar um, pegue o oficial em
   `unpkg.com/lucide-static/icons/NOME.svg` e cole os `<path>` mantendo
   `fill="none" stroke="currentColor"`.

---

## 12. Como verificar as mudanças

Não há suíte de testes; a verificação é **visual + checagem de overflow**. O que
foi usado (scripts ficaram numa pasta temporária, fora do repo — recrie se
precisar):

- **Screenshots com Puppeteer/Chromium** em várias larguras (1440, 1280, 1024,
  1023, 800, 768, 430, 390) para conferir cada dobra.
- **Teste de overflow horizontal:** para cada viewport, garantir
  `document.documentElement.scrollWidth ≤ largura + 1`. A página deve passar em
  **todos** os breakpoints (nenhuma barra de rolagem horizontal).
- **Verificação ao vivo:** após o push, esperar o deploy e conferir em
  nascimentoteam.vercel.app (via navegador ou `curl` com no-cache, procurando por
  marcadores do que mudou).

Chromium já vem instalado no ambiente (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`).

---

## 13. Histórico de decisões

Resumo cronológico (mais recente no topo) do que já foi entregue — o histórico
completo está no `git log`:

- Igualou as bordas da foto da bio (imagem sem raio próprio dentro da moldura).
- Corrigiu a foto da bio que colapsava no mobile (largura definida).
- Rodada grande de refino mobile: boxed 400px usando a largura toda, textos de
  corpo menores, **remoção do botão de WhatsApp do header** (+ hambúrguer no
  mobile), foto da hero depois do CTA, headlines 27→32px, gap menor em "Para quem
  é", **remoção de todos os travessões**, depoimentos **um por vez no mobile**,
  "Fale comigo no WhatsApp" sozinho em roxo, e mensagens com "Vim pelo seu site".
- Trocou a foto de "Para quem é" (IMG_2720, tronco pra cima) e o ícone do pilar
  "Sem radicalismo" (maçã).
- Inverteu o cabeçalho do FAQ.
- Redesenhou os pilares (ícones + marca d'água + brilho) e o botão de WhatsApp
  (estilo ronaldox.com.br).
- Depoimentos viraram **carrossel infinito** com fade e pausa.
- Ícones migrados para **Lucide**; 3 cabeçalhos centralizados; stats do hero
  removidos.
- Curva de escassez ajustada (12 → 1 ao longo do mês).
- Fundo de pontos, `text-balance`, foto da bio na altura do texto.
- Planos sem preço; Sobre; FAQ suave; método em 2 colunas com pilares sticky.
- Otimização das fotos grandes; foto real da hero; alinhamento topo.
- Base: escassez automática, larguras por dispositivo, botões glow, deploy Vercel.

---

## 14. Pendências e próximos passos

- **Preços:** os valores vivem em `/planos` (`planos.html`) e vieram do PDF de
  planos do cliente (commit `d7309f0`). **Confirme com o Henrique antes de
  divulgar** — a receita de edição está em §10.
- **Domínio:** apontar `nascimentoteam.com.br` para este projeto na Vercel
  (DNS em propagação). O `DEPLOY.md` cobre também o cenário
  `ronaldox.com.br/nascimento-team`. Nenhum dos dois exige mudança de código.
- **Limpeza opcional:** remover `IMG_2720.JPG` (2 MB, não servida) e a função
  `carousel()` do `script.js` (sem uso).
- **Fluxo Git:** avaliar merge da branch de trabalho para `main` e apontar `main`
  como produção na Vercel (combine com o responsável).
- Textos e depoimentos são reais e já revisados; a página está pronta para
  divulgação.

---

*Dúvidas sobre qualquer decisão: comece pelo `git log` (mensagens de commit
descritivas) e pelos comentários dentro do `index.html`, `styles.css` e
`script.js` — tudo o que é configurável está comentado no código.*
