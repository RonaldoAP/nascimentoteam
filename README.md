# Nascimento Team — Landing page

Landing page de consultoria online de treino e nutrição (Henrique Silvério do Nascimento).

Página estática (HTML + CSS + JavaScript puro, **sem build**). Funciona em qualquer
hospedagem e em subdiretório — todos os caminhos são relativos, então roda em
`https://ronaldox.com.br/nascimento-team/` sem ajustes.

## Estrutura

```
index.html        → conteúdo e seções da página
styles.css        → estilos (paleta + DM Sans)
script.js         → configuração (WhatsApp/vagas) e interações
assets/           → imagens e favicon
```

## ✍️ O que personalizar antes de publicar

Tudo o que é placeholder está centralizado e comentado.

1. **WhatsApp e escassez** — `script.js`, objeto `CONFIG` no topo:
   - `whatsapp`: número real no formato `55` + DDD + número (só dígitos).
   - `whatsappMessage`: mensagem pré-preenchida.
   - `vagas` / `mesReferencia`: texto da barra de escassez.

2. **Fotos** — substituir os blocos `.photo-placeholder` por `<img>`:
   - Hero: adicione `assets/henrique.jpg` e troque o `<figure class="photo-placeholder photo-placeholder--hero">` por `<img src="./assets/henrique.jpg" alt="Henrique Silvério do Nascimento" />`.
   - Sobre: idem com `assets/henrique-sobre.jpg`.

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

Por ser estático, basta servir os arquivos na pasta `nascimento-team/` do site.
O método depende de como o `ronaldox.com.br` está hospedado — ver detalhes na
conversa. Opções comuns:

- **Hospedagem própria / cPanel**: enviar os arquivos para `public_html/nascimento-team/` via FTP/painel.
- **GitHub Pages**: publicar este repositório e apontar o caminho/subdomínio desejado.
- **Netlify / Vercel / Cloudflare Pages**: conectar o repositório e configurar o domínio.

> Migração futura para o domínio do cliente: como os caminhos são relativos, basta
> mover a pasta para a raiz do novo domínio — nada no código precisa mudar.
