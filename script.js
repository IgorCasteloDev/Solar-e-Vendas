// ============ MENU MOBILE ============
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');

    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
      });
    });

    // ============ SCROLL REVEAL ============
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section:not(.hero)').forEach(section => {
      observer.observe(section);
    });

    // ============ CONTADOR ANIMADO ============
    function animateCounter(element) {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const isPercentage = element.getAttribute('data-percentage') === 'true';

      const updateCounter = () => {
        current += step;
        if (current < target) {
          element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + (isPercentage ? '%' : '');
        }
      };
      updateCounter();
    }

    // Animar contadores quando aparecerem na tela
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-target]');
          counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
              animateCounter(counter);
              counter.classList.add('animated');
            }
          });
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-section, .co2').forEach(section => {
      counterObserver.observe(section);
    });

    // ============ CALCULADORA ============
    function calcularEconomia() {
      const conta = parseFloat(document.getElementById('conta').value);
      
      if (!conta || conta <= 0) {
        alert('Por favor, insira um valor válido!');
        return;
      }

      const economiaMensal = conta * 0.8;
      const economiaAnual = economiaMensal * 12;
      const economia25 = economiaAnual * 25;

      document.getElementById('economiaMensal').textContent = 
        'R$ ' + economiaMensal.toFixed(2);
      document.getElementById('economiaAnual').textContent = 
        'R$ ' + economiaAnual.toFixed(2);
      document.getElementById('economia25').textContent = 
        'R$ ' + economia25.toLocaleString('pt-BR', {minimumFractionDigits: 2});

      document.getElementById('calcResult').classList.add('show');
    }

    // ============ FILTRO GALERIA ============
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galeriaItems = document.querySelectorAll('.galeria-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        // Adiciona active no clicado
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galeriaItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });

    // ============ FAQ ACORDEÃO ============
    function toggleFaq(element) {
      const faqItem = element.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Abre o clicado se não estava aberto
      if (!isActive) {
        faqItem.classList.add('active');
      }
    }

    // ============ SCROLL TO TOP ============
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============ FORMULÁRIO ============
 // ============ FORMULÁRIO EMAILJS ============

// Configuração EmailJS
const EMAIL_CONFIG = {
  serviceID: 'service_2a8ywgn',
  templateID: 'template_o0sum5j',
  publicKey: 'wc0u9HFYaHirFQ1lN'
};

// Inicializa EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

// Elementos
const form = document.getElementById('contactForm');
const mensagemDiv = document.getElementById('mensagem');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('status');

// Atualiza status
function updateStatus(msg) {
  if (statusEl) statusEl.textContent = 'Status: ' + msg;
}

// Envio do formulário
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    mensagemDiv.style.display = 'none';
    updateStatus('Enviando mensagem...');

    const formData = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      mensagem: document.getElementById('mensagemTexto').value
    };

    try {
      await emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        formData
      );

      updateStatus('Mensagem enviada com sucesso ✓');
      mostrarMensagem(
        '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'sucesso'
      );
      form.reset();
    } catch (error) {
      updateStatus('Erro ao enviar mensagem');
      mostrarMensagem(
        '❌ Erro ao enviar. Tente novamente mais tarde.',
        'erro'
      );
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
    }
  });
}

// Exibe mensagem visual
function mostrarMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo}`;
  mensagemDiv.style.display = 'block';

  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 5000);
}


    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });