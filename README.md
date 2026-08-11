# Nascimento Team — Landing page

Landing page de consultoria online de treino e nutrição (Henrique Silvério do Nascimento).

> 📋 **Vai assumir ou continuar o projeto?** Leia primeiro o **[HANDOFF.md](./HANDOFF.md)** —
> documento completo de transferência (arquitetura, seções, regras de conteúdo,
> armadilhas e como continuar).

Página estática (HTML + CSS + JavaScript puro, **sem build**). Funciona em qualquer
hospedagem e em subdiretório — todos os caminhos são relativos, então roda em
`https://ronaldox.com.br/nascimento-team/` sem ajustes.

## Estrutura

```
index.html        → home (conteúdo e seções da página)
planos.html       → página /planos, com os valores de cada plano
styles.css        → estilos (paleta + DM Sans)
script.js         → configuração (WhatsApp/vagas) e interações
img/           → imagens e favicon
```

> `/planos` funciona pelo `cleanUrls` da Vercel. Localmente, abra `planos.html`.

## ✍️ O que personalizar antes de publicar

Tudo o que é placeholder está centralizado e comentado.

1. **WhatsApp e escassez** — `script.js`, objeto `CONFIG` no topo:
   - `whatsapp`: número real no formato `55` + DDD + número (só dígitos).
   - `whatsappMessage`: mensagem pré-preenchida.
   - `vagas` / `mesReferencia`: texto da barra de escassez.

2. **Fotos** — substituir os blocos `.photo-placeholder` por `<img>`:
   - Hero: adicione `img/henrique.jpg` e troque o `<figure class="photo-placeholder photo-placeholder--hero">` por `<img src="./img/henrique.jpg" alt="Henrique Silvério do Nascimento" />`.
   - Sobre: idem com `img/henrique-sobre.jpg`.

3. **Depoimentos** — seção `#depoimentos` no `index.html`: troque nome, texto e
   objetivo de cada `<article class="testimonial">` (duplique para ter mais).
   Recomendado: fotos de antes/depois e prints de mensagens.

4. **Planos** — seção `#planos`: os valores estão como `—`. Coloque os preços reais
   em cada `.plan__value` (ou mantenha "valores na conversa" como está hoje).

## 🎨 Identidade

- **Paleta** extraída de [nascimentoteam.com](https://nascimentoteam.com): roxo/violeta
  `#ba63ff` (primária) sobre fundo escuro `#0e0e0e`. Variáveis em `:root` no `styles.css`.
- **Tipografia**: DM Sans (Google Fonts).

## 🚀 Publicar em ronaldox.com.br/nascimento-team

O `ronaldox.com.br` está na **Vercel**. A landing fica neste repositório como um
projeto Vercel próprio (isolado dos seus arquivos) e o domínio apenas redireciona
`/nascimento-team` para ele via um pequeno *rewrite*.

👉 Passo a passo completo em **[DEPLOY.md](./DEPLOY.md)**.

> Migração futura para o domínio do cliente: como os caminhos são relativos, basta
> apontar o domínio novo para este projeto (ou mover os arquivos para o repo do
> cliente) — nada no código precisa mudar.
