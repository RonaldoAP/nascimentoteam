# Deploy (Vercel)

A página é estática (sem build) e vive no projeto Vercel
**`nascimentoteam`**. Hoje ela responde em `https://nascimentoteam.vercel.app`.

## Domínio próprio — nascimentoteam.com.br

Este é o caminho definitivo: a **home na raiz** do domínio e os valores em
**`/planos`**.

1. No painel da Vercel, abra o projeto **`nascimentoteam`** → *Settings →
   Domains* → **Add** → `nascimentoteam.com.br`.
2. Adicione também `www.nascimentoteam.com.br` e deixe a Vercel redirecionar o
   `www` para o domínio raiz (ela oferece isso na própria tela).
3. Siga os registros de DNS que a Vercel mostrar, no painel de onde o domínio foi
   registrado. Normalmente:
   - raiz (`@`) → registro **A** para `76.76.21.21`;
   - `www` → **CNAME** para `cname.vercel-dns.com`.
   A Vercel confirma sozinha quando o DNS propagar e emite o certificado HTTPS.
4. Confira depois de propagar:
   - `https://nascimentoteam.com.br` → home;
   - `https://nascimentoteam.com.br/planos` → página de planos.

**Nada no código precisa mudar.** As tags `canonical`/`og:url` das duas páginas
já apontam para `nascimentoteam.com.br`, e o `vercel.json` tem
`"cleanUrls": true` — é ele que faz `/planos` servir o `planos.html` (e
`/planos.html` redirecionar para `/planos`).

> Para testar localmente, use `planos.html` na URL: o `cleanUrls` só existe na
> Vercel.

---

## Alternativa — ronaldox.com.br/nascimento-team

Só é necessário se a página for servida **dentro** do `ronaldox.com.br` em vez
de ter domínio próprio. O `ronaldox.com.br` está hospedado na **Vercel**. Para servir a landing page em
`/nascimento-team` **sem misturar com os arquivos do seu site**, usamos dois projetos:

```
┌─────────────────────────────┐        rewrite/proxy        ┌──────────────────────────────┐
│ Projeto do ronaldox.com.br  │  /nascimento-team/*  ───▶   │ Projeto desta landing page    │
│ (seu site — só ganha ~4     │                             │ (repo RonaldoAP/nascimentoteam │
│  linhas de roteamento)      │                             │  100% isolado)                 │
└─────────────────────────────┘                             └──────────────────────────────┘
```

> A página inteira vive neste repositório. No projeto do seu domínio entra apenas uma
> regra de roteamento (nenhum arquivo da página). Como os caminhos são **relativos**, a
> migração futura para o domínio/repo do cliente é só apontar o domínio novo para o
> projeto Vercel — sem alterar o código.

---

## Passo 1 — Publicar este repositório na Vercel

1. Acesse <https://vercel.com/new> e importe o repositório **`RonaldoAP/nascimentoteam`**.
2. Configurações (Vercel detecta sozinho; confirme):
   - **Framework Preset:** Other
   - **Build Command:** *(vazio)*
   - **Output Directory:** *(vazio / raiz)*
   - **Production Branch:** a branch onde está o código (hoje `claude/dreamy-noether-yhi3oj`;
     se preferir, faça o merge para `main` e use `main` como produção).
3. Clique em **Deploy**. Ao final você terá uma URL de produção, ex.:
   `https://nascimentoteam.vercel.app`. **Anote essa URL** — ela é o destino do proxy.

> Teste direto: abrir `https://nascimentoteam.vercel.app` já deve mostrar a página completa.

---

## Passo 2 — Roteamento no projeto do ronaldox.com.br

No **repositório que serve o `ronaldox.com.br`**, edite (ou crie) o `vercel.json` na raiz
e acrescente as regras abaixo. Troque `nascimentoteam.vercel.app` pela URL real do Passo 1.

```json
{
  "redirects": [
    { "source": "/nascimento-team", "destination": "/nascimento-team/", "permanent": false }
  ],
  "rewrites": [
    { "source": "/nascimento-team/:path*", "destination": "https://nascimentoteam.vercel.app/:path*" }
  ]
}
```

Se o `vercel.json` já existir e tiver `redirects`/`rewrites`, **mescle** os itens dentro
dos arrays existentes (não duplique as chaves).

### Por que o `redirect`?
Ele garante a barra final (`/nascimento-team/`). Sem ela, os caminhos relativos
(`./styles.css`, `./script.js`, `./img/...`) apontariam para a raiz do domínio.
Com a barra, eles resolvem para `/nascimento-team/...` e o proxy entrega os arquivos certos.

Faça commit, deixe a Vercel publicar o projeto do domínio e pronto.

---

## Passo 3 — Testar

- <https://ronaldox.com.br/nascimento-team> → deve redirecionar para `.../nascimento-team/`
  e abrir a landing page.
- Conferir no navegador (aba **Network**) que `styles.css`, `script.js` e o favicon
  carregam de `/nascimento-team/...` com status **200**.

---

## Migração futura (domínio/repo do cliente)

Quando for migrar para o cliente, há dois caminhos — ambos sem mexer no código da página
(graças aos caminhos relativos):

- **Manter este projeto:** adicione o domínio do cliente em *Settings → Domains* deste
  projeto Vercel e remova o rewrite do `ronaldox.com.br`. A página passa a responder na
  raiz do domínio do cliente.
- **Mover para o repo do cliente:** copie os arquivos deste repositório para o repositório
  do cliente, conecte-o à Vercel e aponte o domínio. Nada no código precisa mudar.

---

## Antes de divulgar — checklist de conteúdo

Edite no repositório (tudo está comentado):

- [x] `script.js` → `CONFIG.whatsapp` (número real) e `CONFIG.whatsappMessage`;
      a barra de vagas é automática pela data
- [x] Fotos reais (hero, "Como eu trabalho", "Para quem é" e "Sobre")
- [x] Depoimentos reais (seção `#depoimentos`)
- [ ] **Confirmar com o Henrique os valores do `planos.html`** antes de divulgar
- [ ] Apontar `nascimentoteam.com.br` para o projeto na Vercel
