/* ═══════════════════════════════════════════════════════════════
   SOLAR E VENDAS — SCRIPT PRINCIPAL 2026
   ═══════════════════════════════════════════════════════════════

   CONFIGURAÇÃO DA API DO GOOGLE REVIEWS
   ──────────────────────────────────────
   Para carregar avaliações reais do Google, siga estes passos:

   1. CRIE UM PROJETO NO GOOGLE CLOUD CONSOLE
      - Acesse: https://console.cloud.google.com/
      - Clique em "Novo Projeto" e dê um nome
      - Acesse "APIs e Serviços" > "Biblioteca"
      - Ative: "Maps JavaScript API" e "Places API"

   2. CRIE UMA CHAVE DE API
      - Vá em "APIs e Serviços" > "Credenciais"
      - Clique em "Criar Credenciais" > "Chave de API"
      - Restrinja ao domínio do seu site (segurança)
      - Copie a chave gerada

   3. ENCONTRE O SEU PLACE ID
      - Acesse: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
      - Pesquise "Solar e Vendas Fortaleza"
      - Copie o Place ID (começa com ChIJ...)
      - Alternativamente: no Google Maps, clique no seu negócio
        e observe a URL (contém o place_id)

   4. CONFIGURE ABAIXO:
   ─────────────────────────────────────────────────────────────── */

const GOOGLE_CONFIG = {
  apiKey:  'SUA_CHAVE_AQUI',     // ← substitua pela sua chave de API
  placeId: 'SEU_PLACE_ID_AQUI'  // ← substitua pelo seu Place ID
};

/*  CUSTO ESTIMADO:
    O Google Maps Platform oferece US$200 de crédito gratuito/mês.
    A Places API custa US$0.017 por requisição.
    Com o crédito gratuito = ~11.700 carregamentos de avaliações/mês. Gratuito! */

/* ─────────────────────────────────────────────────────────────── */

// ════════════════════════════════════════════════════════════════
// 1. HEADER — Scroll Effect
// ════════════════════════════════════════════════════════════════
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ════════════════════════════════════════════════════════════════
// 2. MENU MOBILE
// ════════════════════════════════════════════════════════════════
const menuToggle = document.getElementById('menuToggle');
const navbar     = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuToggle.classList.toggle('open');
});

// Fecha ao clicar em link
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuToggle.classList.remove('open');
  });
});

// Fecha ao clicar fora
document.addEventListener('click', (e) => {
  if (navbar.classList.contains('active') &&
      !navbar.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    navbar.classList.remove('active');
    menuToggle.classList.remove('open');
  }
});

// ════════════════════════════════════════════════════════════════
// 3. HERO CANVAS — Animação de Energia Solar
//    (Partículas de luz, raios de energia, células hexagonais)
// ════════════════════════════════════════════════════════════════
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], rays = [], hexes = [];
  const PARTICLE_COUNT = 80;
  const RAY_COUNT      = 6;
  const HEX_ROWS       = 6;
  const HEX_COLS       = 10;

  // ── Resize
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildHexGrid();
  }

  // ── Hexagonal grid (solar panel cells)
  function buildHexGrid() {
    hexes = [];
    const size = Math.min(W, H) / 14;
    const cols = Math.ceil(W / (size * 1.73)) + 2;
    const rows = Math.ceil(H / (size * 1.5))  + 2;
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * size * 1.73 + (r % 2 === 0 ? 0 : size * 0.865);
        const y = r * size * 1.5;
        hexes.push({ x, y, size, alpha: Math.random() * 0.04 + 0.01 });
      }
    }
  }

  function hexPath(x, y, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + s * Math.cos(angle);
      const py = y + s * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  // ── Energy particles (photons)
  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     -10,
      vx:    (Math.random() - 0.5) * 0.6,
      vy:    Math.random() * 1.5 + 0.5,
      size:  Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.3,
      color: Math.random() > 0.5 ? '#f5c518' : '#ff8c00',
      life:  Math.random() * 0.5 + 0.5,
      decay: Math.random() * 0.003 + 0.001
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.y = Math.random() * H; // spread on init
      particles.push(p);
    }
  }

  // ── Sun rays
  function createRay(index) {
    const spread = W * 0.3;
    const sunX   = W * 0.82;
    const sunY   = H * 0.08;
    const angle  = (index / RAY_COUNT) * Math.PI * 0.7 + Math.PI * 0.3;
    return {
      sunX, sunY,
      angle,
      length: Math.random() * H * 0.5 + H * 0.3,
      width:  Math.random() * 40 + 10,
      alpha:  Math.random() * 0.06 + 0.02,
      pulse:  Math.random() * Math.PI * 2,
      speed:  Math.random() * 0.01 + 0.005
    };
  }

  function initRays() {
    rays = [];
    for (let i = 0; i < RAY_COUNT; i++) rays.push(createRay(i));
  }

  // ── Draw loop
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
    bg.addColorStop(0, '#1e3248');
    bg.addColorStop(0.5, '#2a3d52');
    bg.addColorStop(1, '#2e4460');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw hex grid
    hexes.forEach(h => {
      hexPath(h.x, h.y, h.size);
      ctx.strokeStyle = `rgba(245, 197, 24, ${h.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Sun glow
    const sunX  = W * 0.82;
    const sunY  = H * 0.08;
    const glow1 = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.35);
    glow1.addColorStop(0,   'rgba(245,197,24,0.18)');
    glow1.addColorStop(0.3, 'rgba(255,140,0,0.07)');
    glow1.addColorStop(1,   'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    // Sun core
    const core = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 70);
    core.addColorStop(0,   'rgba(255,255,200,0.9)');
    core.addColorStop(0.2, 'rgba(245,197,24,0.7)');
    core.addColorStop(0.6, 'rgba(255,140,0,0.2)');
    core.addColorStop(1,   'transparent');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Rays
    rays.forEach(r => {
      r.pulse += r.speed;
      const alpha = r.alpha * (0.7 + 0.3 * Math.sin(r.pulse));
      const grad  = ctx.createLinearGradient(
        r.sunX, r.sunY,
        r.sunX + Math.cos(r.angle) * r.length,
        r.sunY + Math.sin(r.angle) * r.length
      );
      grad.addColorStop(0, `rgba(245,197,24,${alpha * 2})`);
      grad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(r.sunX, r.sunY);

      const perpX = Math.cos(r.angle + Math.PI / 2) * r.width * 0.5;
      const perpY = Math.sin(r.angle + Math.PI / 2) * r.width * 0.5;
      const endX  = r.sunX + Math.cos(r.angle) * r.length;
      const endY  = r.sunY + Math.sin(r.angle) * r.length;

      ctx.moveTo(r.sunX - perpX * 0.1, r.sunY - perpY * 0.1);
      ctx.lineTo(r.sunX + perpX * 0.1, r.sunY + perpY * 0.1);
      ctx.lineTo(endX + perpX, endY + perpY);
      ctx.lineTo(endX - perpX, endY - perpY);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x     += p.vx;
      p.y     += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > H + 20) {
        particles[i] = createParticle();
        continue;
      }

      // Glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      glow.addColorStop(0, p.color);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = p.alpha * 0.4;
      ctx.fillStyle   = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  // Init
  window.addEventListener('resize', resize, { passive: true });
  resize();
  initParticles();
  initRays();
  draw();
})();

// ════════════════════════════════════════════════════════════════
// 4. SCROLL REVEAL
// ════════════════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ════════════════════════════════════════════════════════════════
// 5. CONTADOR ANIMADO (Stats Strip)
// ════════════════════════════════════════════════════════════════
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const fps      = 60;
  const step     = target / (duration / (1000 / fps));
  let   current  = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };
  tick();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = '1';
          animateCounter(el);
        }
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-strip').forEach(s => counterObserver.observe(s));

// ════════════════════════════════════════════════════════════════
// 6. CALCULADORA DE ECONOMIA
// ════════════════════════════════════════════════════════════════
function calcularEconomia() {
  const raw   = document.getElementById('conta').value;
  const conta = parseFloat(raw);

  // Limite 7 dígitos (máx R$ 9.999.999)
  if (raw.replace(/\D/g, '').length > 7) {
    document.getElementById('conta').value = raw.slice(0, 7);
    return;
  }

  if (!conta || conta <= 0) {
    const input = document.getElementById('conta');
    input.style.borderColor = '#ef4444';
    input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }, 2000);
    return;
  }

  const mensal  = conta * 0.8;
  const anual   = mensal * 12;
  const anos25  = anual * 25;

  const fmt = (val) => val.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  document.getElementById('economiaMensal').textContent = 'R$ ' + fmt(mensal);
  document.getElementById('economiaAnual').textContent  = 'R$ ' + fmt(anual);
  document.getElementById('economia25').textContent     = 'R$ ' + fmt(anos25);

  const result = document.getElementById('calcResult');
  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Enter key trigger
document.getElementById('conta')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calcularEconomia();
});

// ════════════════════════════════════════════════════════════════
// 7. AVALIAÇÕES GOOGLE
// ════════════════════════════════════════════════════════════════
/*
  COMO FUNCIONA:
  ─────────────────────────────────────────────────────────────
  A função loadGoogleReviews() carrega o SDK do Google Maps
  com sua chave de API. Quando o SDK está pronto, ele chama
  initPlacesReviews() que usa o PlacesService para buscar
  detalhes do seu negócio, incluindo avaliações.

  O Google retorna no máximo 5 avaliações (as mais relevantes).

  Se a API não estiver configurada (chave = 'SUA_CHAVE_AQUI'),
  as avaliações hardcoded no HTML continuam sendo exibidas.

  FORMATO DO RETORNO DA API:
  {
    name: "Nome do Avaliador",
    rating: 5,
    text: "Texto da avaliação...",
    time: 1234567890,          // timestamp Unix
    profile_photo_url: "https://..."
  }
  ─────────────────────────────────────────────────────────────
*/
function loadGoogleReviews() {
  if (GOOGLE_CONFIG.apiKey === 'SUA_CHAVE_AQUI') {
    console.info('💡 Solar e Vendas: Configure sua API Key do Google nas variáveis GOOGLE_CONFIG no script.js para carregar avaliações reais!');
    return; // usa o fallback hardcoded no HTML
  }

  // Carrega o Google Maps SDK dinamicamente
  const script    = document.createElement('script');
  script.src      = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_CONFIG.apiKey}&libraries=places&callback=initPlacesReviews`;
  script.async    = true;
  script.defer    = true;
  script.onerror  = () => console.warn('Erro ao carregar Google Maps API');
  document.head.appendChild(script);
}

// Callback chamado pelo SDK do Google Maps quando carregado
window.initPlacesReviews = function () {
  const dummy   = document.createElement('div');
  const service = new google.maps.places.PlacesService(dummy);

  service.getDetails({
    placeId: GOOGLE_CONFIG.placeId,
    fields:  ['reviews', 'rating', 'user_ratings_total', 'name']
  }, (place, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !place.reviews) {
      console.warn('Google Places API: sem dados', status);
      return;
    }

    // Atualiza o badge de nota geral
    const ratingNum   = document.getElementById('googleRatingNum');
    const ratingCount = document.getElementById('googleRatingCount');

    if (ratingNum)   ratingNum.textContent   = place.rating?.toFixed(1) || '5.0';
    if (ratingCount) ratingCount.textContent = `${place.user_ratings_total || ''} avaliações no Google`;

    // Substitui os cards
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    place.reviews.slice(0, 5).forEach((rev, i) => {
      const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
      const date  = new Date(rev.time * 1000).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      const init  = rev.author_name?.charAt(0).toUpperCase() || '?';

      // Avatar: usa foto do Google se disponível, senão gera pelo ui-avatars
      const avatarContent = rev.profile_photo_url
        ? `<img src="${rev.profile_photo_url}" alt="${rev.author_name}" />`
        : `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author_name)}&background=1a2744&color=f5c518&size=88&bold=true&rounded=true" alt="${rev.author_name}" />`;

      const card = document.createElement('div');
      card.className = 'review-card';
      card.setAttribute('data-reveal', '');
      card.setAttribute('data-delay', String(i * 80));

      card.innerHTML = `
        <div class="review-header">
          <div class="reviewer-avatar">${avatarContent}</div>
          <div class="reviewer-info">
            <strong>${rev.author_name}</strong>
            <span class="review-source">
              <svg viewBox="0 0 24 24" width="13" height="13">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google · ${date}
            </span>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <p>"${rev.text}"</p>
      `;

      grid.appendChild(card);

      // Re-observe para reveal animation
      revealObserver.observe(card);
    });
  });
};

// Inicia o carregamento das avaliações
loadGoogleReviews();

// ════════════════════════════════════════════════════════════════
// 8. FILTRO DE PROJETOS
// ════════════════════════════════════════════════════════════════
const filterBtns   = document.querySelectorAll('.filter-btn');
const projetoItems = document.querySelectorAll('.projeto-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projetoItems.forEach(item => {
      const match = filter === 'all' || item.getAttribute('data-category') === filter;

      if (match) {
        item.style.opacity   = '0';
        item.style.display   = 'block';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity .35s ease, transform .35s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'scale(1)';
        });
      } else {
        item.style.transition = 'opacity .25s ease, transform .25s ease';
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.95)';
        setTimeout(() => {
          if (item.getAttribute('data-category') !== filter && filter !== 'all') {
            item.style.display = 'none';
          }
        }, 260);
      }
    });
  });
});

// ════════════════════════════════════════════════════════════════
// 9. FAQ ACORDEÃO
// ════════════════════════════════════════════════════════════════
function toggleFaq(btn) {
  const item     = btn.closest('.faq-item');
  const isActive = item.classList.contains('active');

  // Fecha todos
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

  // Abre o clicado (se não estava aberto)
  if (!isActive) item.classList.add('active');
}

// ════════════════════════════════════════════════════════════════
// 10. SCROLL TO TOP
// ════════════════════════════════════════════════════════════════
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════════
// 11. FORMULÁRIO — EmailJS
// ════════════════════════════════════════════════════════════════

// ── Filtros de input em tempo real ───────────────────────────

// Nome: aceita apenas letras (incluindo acentuadas) e espaços
const inputNome = document.getElementById('nome');
if (inputNome) {
  inputNome.addEventListener('input', function () {
    const cursor = this.selectionStart;
    const cleaned = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    if (this.value !== cleaned) {
      this.value = cleaned;
      // Mantém a posição do cursor após a limpeza
      this.setSelectionRange(cursor - 1, cursor - 1);
    }
  });
}

// Telefone: aceita apenas dígitos, espaços, parênteses e hífen
const inputTel = document.getElementById('telefone');
if (inputTel) {
  inputTel.addEventListener('input', function () {
    const cursor = this.selectionStart;
    const cleaned = this.value.replace(/[^0-9\s()\-+]/g, '');
    if (this.value !== cleaned) {
      this.value = cleaned;
      this.setSelectionRange(cursor - 1, cursor - 1);
    }
  });
}

// ─────────────────────────────────────────────────────────────
const EMAIL_CONFIG = {
  serviceID:  'service_2a8ywgn',
  templateID: 'template_o0sum5j',
  publicKey:  'wc0u9HFYaHirFQ1lN'
};

emailjs.init(EMAIL_CONFIG.publicKey);

const contactForm = document.getElementById('contactForm');
const mensagemDiv = document.getElementById('mensagem');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validação extra no envio (cobre colagem e autopreenchimento)
    const nomeVal = document.getElementById('nome').value;
    const telVal  = document.getElementById('telefone').value;

    if (/[^a-zA-ZÀ-ÿ\s]/.test(nomeVal)) {
      showMensagem('⚠️ O campo Nome deve conter apenas letras e espaços.', 'erro');
      document.getElementById('nome').focus();
      return;
    }

    if (/[^0-9\s()\-+]/.test(telVal)) {
      showMensagem('⚠️ O campo WhatsApp deve conter apenas números.', 'erro');
      document.getElementById('telefone').focus();
      return;
    }

    const btnText = submitBtn.querySelector('span');
    submitBtn.disabled     = true;
    btnText.textContent    = 'Enviando...';
    mensagemDiv.style.display = 'none';

    const formData = {
      nome:     document.getElementById('nome').value,
      email:    document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      mensagem: document.getElementById('mensagemTexto').value
    };

    try {
      await emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        formData
      );
      showMensagem('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'sucesso');
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showMensagem('❌ Erro ao enviar. Tente novamente ou ligue: (85) 9785-7791', 'erro');
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = 'Enviar e Receber Orçamento';
    }
  });
}

function showMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className   = `mensagem ${tipo}`;
  mensagemDiv.style.display = 'block';
  mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { mensagemDiv.style.display = 'none'; }, 6000);
}

// ════════════════════════════════════════════════════════════════
// 12. SMOOTH SCROLL para links âncora
// ════════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ════════════════════════════════════════════════════════════════
// 13. ACTIVE NAV LINK on scroll
//     rootMargin '-80px 0px -65% 0px' cria uma zona de detecção
//     logo abaixo do header (80px) até 35% da tela — o link fica
//     dourado quando a seção está na área de leitura principal.
// ════════════════════════════════════════════════════════════════
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar a:not(.nav-cta)');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)' : '';
      });
    }
  });
}, {
  rootMargin: '-80px 0px -65% 0px',
  threshold: 0
});

sections.forEach(s => navObserver.observe(s));