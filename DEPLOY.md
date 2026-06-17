# Deploy — ronaldox.com.br/nascimento-team (Vercel)

O `ronaldox.com.br` está hospedado na **Vercel**. Para servir a landing page em
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

- [ ] `script.js` → `CONFIG.whatsapp` (número real), `CONFIG.whatsappMessage`, `CONFIG.vagas`, `CONFIG.mesReferencia`
- [ ] Foto do expert (hero) e foto do "Sobre" — trocar os blocos `.photo-placeholder` por `<img>`
- [ ] Depoimentos reais (seção `#depoimentos`)
- [ ] Valores dos planos (seção `#planos`) — hoje aparecem como `—`
