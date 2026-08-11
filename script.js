/* =================================================================
   NASCIMENTO TEAM — interações da landing page
   ================================================================= */

/* -----------------------------------------------------------------
   ⚙️  CONFIGURAÇÃO — edite apenas estes valores
   ----------------------------------------------------------------- */
const CONFIG = {
  // Número do WhatsApp no formato internacional: DDI + DDD + número (só dígitos).
  // Ex.: Brasil (55) + DDD 19 + 99999-9999  ->  '5519999999999'
  whatsapp: '5516997763003', // +55 16 99776-3003

  // Mensagem que já vem preenchida quando a pessoa abre o WhatsApp.
  whatsappMessage: 'Olá, Henrique! Vim pelo seu site e quero saber mais sobre a consultoria de treino e nutrição.',

  // Barra de escassez — o número de vagas é calculado AUTOMATICAMENTE pela data.
  // Começa alto no dia 1 e desce ao longo do mês; renova sozinho na virada do mês.
  // O mês exibido também é automático (sempre o mês vigente).
  scarcity: {
    // Pontos de ancoragem [dia do mês, vagas]. Entre eles o valor é interpolado
    // (queda suave, poucas unidades por dia). Edite à vontade — mantenha em ordem
    // crescente de dia. Ex.: dia 01 = 8 vagas, dia 10 = 5, dia 20 = 3, dia 25+ = 1.
    schedule: [
      [1, 12],
      [10, 7],
      [20, 3],
      [25, 1],
    ],
    min: 1, // nunca exibe menos que isso
    max: 12, // nunca exibe mais que isso
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
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
  const vaga = n === 1 ? 'vaga' : 'vagas';
  const disp = n === 1 ? 'disponível' : 'disponíveis';
  return `Apenas <strong>${n} ${vaga}</strong> ${disp} em <strong>${mesCap}</strong>.`;
}

/* -----------------------------------------------------------------
   Aplica links e textos a partir do CONFIG
   ----------------------------------------------------------------- */
(function applyConfig() {
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  document.querySelectorAll('[data-wa]').forEach((el) => {
    // Botões de plano levam uma mensagem personalizada (nome/tipo/valor do plano).
    let msg = CONFIG.whatsappMessage;
    const plan = el.closest('.plan');
    if (plan) {
      const nome = (plan.querySelector('.plan__name')?.textContent || '').trim();
      const grupo = plan.closest('[data-plan-group]')?.dataset.planGroup;
      const tipo = grupo === 'completo' ? 'Dieta + Treino (completo)' : 'Dieta ou Treino';
      const valor = (plan.querySelector('.plan__value')?.textContent || '').trim();
      msg = `Olá, Henrique! Vim pelo seu site e tenho interesse no Plano ${nome} (${tipo})` +
            (valor ? `, R$ ${valor}/mês` : '') + '. Pode me passar mais detalhes?';
    }
    el.setAttribute('href', waLink(msg));
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
   FAQ: abertura suave (anima a altura) + acordeão (abre um, fecha os outros)
   ----------------------------------------------------------------- */
(function faqSmooth() {
  const items = Array.from(document.querySelectorAll('.faq__item'));
  if (!items.length) return;

  const openItem = (item) => {
    const ans = item.querySelector('.faq__answer');
    item.open = true;
    const h = ans.scrollHeight;
    ans.style.height = '0px';
    ans.getBoundingClientRect(); // força reflow
    ans.style.height = h + 'px';
    const end = (e) => {
      if (e.propertyName !== 'height') return;
      ans.style.height = 'auto';
      ans.removeEventListener('transitionend', end);
    };
    ans.addEventListener('transitionend', end);
  };

  const closeItem = (item) => {
    const ans = item.querySelector('.faq__answer');
    ans.style.height = ans.scrollHeight + 'px';
    ans.getBoundingClientRect();
    ans.style.height = '0px';
    const end = (e) => {
      if (e.propertyName !== 'height') return;
      item.open = false;
      ans.style.height = '';
      ans.removeEventListener('transitionend', end);
    };
    ans.addEventListener('transitionend', end);
  };

  items.forEach((item) => {
    item.querySelector('summary').addEventListener('click', (e) => {
      e.preventDefault();
      if (item.open) {
        closeItem(item);
      } else {
        items.forEach((o) => { if (o !== item && o.open) closeItem(o); });
        openItem(item);
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
  const tabs = Array.from(document.querySelectorAll('[data-plan-tab]'));
  const groups = Array.from(document.querySelectorAll('[data-plan-group]'));
  const thumb = document.querySelector('.plan-switch__thumb');
  if (!tabs.length) return;
  let animating = false;

  const activeTab = () => tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
  const moveThumb = (btn) => {
    if (!thumb || !btn) return;
    thumb.style.width = btn.offsetWidth + 'px';
    thumb.style.transform = `translateX(${btn.offsetLeft}px)`;
  };

  // posição inicial do indicador, sem animar
  if (thumb) {
    thumb.style.transition = 'none';
    moveThumb(activeTab());
    requestAnimationFrame(() => { thumb.style.transition = ''; });
  }
  window.addEventListener('resize', () => moveThumb(activeTab()));

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (animating || tab.classList.contains('is-active')) return;
      const key = tab.dataset.planTab;
      const current = groups.find((g) => !g.classList.contains('is-hidden'));
      const next = groups.find((g) => g.dataset.planGroup === key);

      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      moveThumb(tab);

      if (!current || !next || current === next) return;
      animating = true;
      current.classList.add('is-leaving');
      window.setTimeout(() => {
        current.classList.add('is-hidden');
        current.classList.remove('is-leaving');
        next.classList.remove('is-hidden');
        next.classList.add('is-entering');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          next.classList.remove('is-entering');
          animating = false;
        }));
      }, 300);
    });
  });
})();

/* -----------------------------------------------------------------
   Depoimentos: pausa o marquee ao tocar (o hover do mouse é via CSS)
   ----------------------------------------------------------------- */
(function marqueePause() {
  const m = document.querySelector('[data-marquee]');
  if (!m) return;
  const pause = () => m.classList.add('is-paused');
  const resume = () => m.classList.remove('is-paused');
  m.addEventListener('touchstart', pause, { passive: true });
  m.addEventListener('touchend', resume);
  m.addEventListener('touchcancel', resume);
})();

/* -----------------------------------------------------------------
   Depoimentos no MOBILE: autoplay slide a slide

   No desktop os depoimentos continuam sendo o marquee infinito (CSS puro).
   No mobile (<=767px) o CSS desliga a animação e transforma a faixa num
   slider com scroll-snap; aqui o autoplay avança um slide por vez.
   - pausa enquanto a pessoa está arrastando e volta 6s depois;
   - pausa quando a seção sai da tela ou a aba fica em segundo plano;
   - respeita "prefers-reduced-motion".
   ----------------------------------------------------------------- */
(function testimonialsAutoplay() {
  const root = document.querySelector('[data-marquee]');
  if (!root) return;
  const track = root.querySelector('.marquee__track');
  if (!track) return;

  const isMobile = window.matchMedia('(max-width: 767px)');
  const stillPrefered = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL = 3800; // tempo de cada slide
  const RESUME_AFTER = 6000; // espera depois de a pessoa interagir

  let timer = null;
  let resumeTimer = null;
  let visible = true;

  // só os slides realmente exibidos (as cópias do loop ficam display:none)
  const slides = () => Array.from(track.children).filter((el) => el.offsetParent !== null);

  const advance = () => {
    const items = slides();
    if (items.length < 2) return;
    const port = root.clientWidth;
    const center = root.scrollLeft + port / 2;
    // primeiro slide cujo centro ainda está à frente do centro atual
    let next = items.find((el) => el.offsetLeft + el.offsetWidth / 2 > center + 4);
    if (!next) next = items[0]; // chegou ao fim: recomeça
    root.scrollTo({
      left: Math.max(0, next.offsetLeft - (port - next.offsetWidth) / 2),
      behavior: 'smooth',
    });
  };

  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };
  const start = () => {
    stop();
    if (!isMobile.matches || stillPrefered.matches || !visible || document.hidden) return;
    timer = setInterval(advance, INTERVAL);
  };
  const hold = () => {
    stop();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(start, RESUME_AFTER);
  };

  root.addEventListener('pointerdown', hold);
  root.addEventListener('touchstart', hold, { passive: true });
  root.addEventListener('wheel', hold, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      },
      { threshold: 0.15 }
    ).observe(root);
  }

  const onBreakpoint = () => {
    stop();
    clearTimeout(resumeTimer);
    if (isMobile.matches) root.scrollLeft = 0;
    start();
  };
  if (isMobile.addEventListener) isMobile.addEventListener('change', onBreakpoint);

  start();
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
