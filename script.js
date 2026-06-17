/* =================================================================
   NASCIMENTO TEAM — interações da landing page
   ================================================================= */

/* -----------------------------------------------------------------
   ⚙️  CONFIGURAÇÃO — edite apenas estes valores
   ----------------------------------------------------------------- */
const CONFIG = {
  // Número do WhatsApp no formato internacional: DDI + DDD + número (só dígitos).
  // Ex.: Brasil (55) + DDD 19 + 99999-9999  ->  '5519999999999'
  whatsapp: '5519999999999', // <-- TROQUE pelo número real do Henrique

  // Mensagem que já vem preenchida quando a pessoa abre o WhatsApp.
  whatsappMessage: 'Olá, Henrique! Vim pela landing page e quero saber mais sobre a consultoria de treino e nutrição.',

  // Barra de escassez (topo da página).
  vagas: 5,
  mesReferencia: 'junho',
};

/* -----------------------------------------------------------------
   Aplica links e textos a partir do CONFIG
   ----------------------------------------------------------------- */
(function applyConfig() {
  const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  document.querySelectorAll('[data-wa]').forEach((el) => {
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  const scarcity = document.querySelector('[data-scarcity]');
  if (scarcity) {
    scarcity.innerHTML =
      `Apenas <strong>${CONFIG.vagas} vagas</strong> disponíveis em ` +
      `<strong>${CONFIG.mesReferencia}</strong> — acompanhamento individual e limitado.`;
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

/* -----------------------------------------------------------------
   Header: sombra ao rolar
   ----------------------------------------------------------------- */
(function stickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* -----------------------------------------------------------------
   Menu mobile
   ----------------------------------------------------------------- */
(function mobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
})();

/* -----------------------------------------------------------------
   FAQ: comportamento de acordeão (abre um, fecha os outros)
   ----------------------------------------------------------------- */
(function faqAccordion() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();

/* -----------------------------------------------------------------
   Carrossel de depoimentos
   ----------------------------------------------------------------- */
(function carousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const dotsWrap = document.querySelector('[data-carousel-dots]');
  const slides = Array.from(track.children);

  const step = () => {
    const first = slides[0];
    const gap = parseFloat(getComputedStyle(track).columnGap || '20') || 20;
    return first.getBoundingClientRect().width + gap;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;

    if (dotsWrap) {
      const idx = Math.round(track.scrollLeft / step());
      dotsWrap.querySelectorAll('button').forEach((d, i) =>
        d.classList.toggle('is-active', i === idx)
      );
    }
  };

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  // Dots (um por slide)
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Ir para o depoimento ${i + 1}`);
      b.addEventListener('click', () => track.scrollTo({ left: step() * i, behavior: 'smooth' }));
      dotsWrap.appendChild(b);
    });
  }

  track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* -----------------------------------------------------------------
   Scroll reveal
   ----------------------------------------------------------------- */
(function scrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();
