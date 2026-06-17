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

  // Barra de escassez — o número de vagas é calculado AUTOMATICAMENTE pela data.
  // Começa alto no dia 1 e desce ao longo do mês; renova sozinho na virada do mês.
  // O mês exibido também é automático (sempre o mês vigente).
  scarcity: {
    // Pontos de ancoragem [dia do mês, vagas]. Entre eles o valor é interpolado
    // (queda suave, poucas unidades por dia). Edite à vontade — mantenha em ordem
    // crescente de dia. Ex.: dia 01 = 8 vagas, dia 10 = 5, dia 20 = 3, dia 25+ = 1.
    schedule: [
      [1, 8],
      [10, 5],
      [20, 3],
      [25, 1],
    ],
    min: 1, // nunca exibe menos que isso
    max: 8, // nunca exibe mais que isso
  },
};

/* -----------------------------------------------------------------
   Barra de escassez automática — vagas caem ao longo do mês e o
   texto se renova sozinho na virada (sem troca manual).
   ----------------------------------------------------------------- */
const MESES_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

// Quantas vagas mostrar numa data (interpolação linear entre os pontos do schedule).
function vagasParaData(date = new Date()) {
  const dia = date.getDate();
  const pts = CONFIG.scarcity.schedule;
  let v;
  if (dia <= pts[0][0]) {
    v = pts[0][1];
  } else if (dia >= pts[pts.length - 1][0]) {
    v = pts[pts.length - 1][1];
  } else {
    for (let i = 0; i < pts.length - 1; i++) {
      const [d0, v0] = pts[i];
      const [d1, v1] = pts[i + 1];
      if (dia >= d0 && dia <= d1) {
        v = v0 + ((dia - d0) / (d1 - d0)) * (v1 - v0);
        break;
      }
    }
  }
  v = Math.round(v);
  return Math.max(CONFIG.scarcity.min, Math.min(CONFIG.scarcity.max, v));
}

// Frase completa da barra, com singular/plural e mês vigente.
function textoEscassez(date = new Date()) {
  const n = vagasParaData(date);
  const mes = MESES_PT[date.getMonth()];
  const vaga = n === 1 ? 'vaga' : 'vagas';
  const disp = n === 1 ? 'disponível' : 'disponíveis';
  return `Apenas <strong>${n} ${vaga}</strong> ${disp} em <strong>${mes}</strong> — acompanhamento individual e limitado.`;
}

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
  if (scarcity) scarcity.innerHTML = textoEscassez();

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
   Planos: alterna entre "Dieta ou Treino" e "Dieta + Treino"
   ----------------------------------------------------------------- */
(function planTabs() {
  const tabs = document.querySelectorAll('[data-plan-tab]');
  const groups = document.querySelectorAll('[data-plan-group]');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.planTab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      groups.forEach((g) => g.classList.toggle('is-hidden', g.dataset.planGroup !== key));
    });
  });
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
