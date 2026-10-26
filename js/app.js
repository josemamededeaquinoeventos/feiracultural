/**
 * 1ª Feira Cultural Tech & E-Sports - E.E. José Mamede de Aquino
 * JavaScript Interativo & Funcionalidades
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initCountdown();
  initModals();
  initForms();
  initSmoothScroll();
  initGamesCarousel();
  initGameRulesModal();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link, .mobile-menu .btn');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = mobileMenu.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Event Countdown Timer
   -------------------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Data do evento: 28 de Novembro de 2026 (ou cálculo dinâmico para garantir contagem positiva ativa)
  let eventDate = new Date('2026-11-28T08:00:00');
  const now = new Date();
  
  if (now > eventDate) {
    // Se a data já passou, configura para daqui a 30 dias para demonstração contínua
    eventDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  function update() {
    const current = new Date().getTime();
    const distance = eventDate.getTime() - current;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   4. Modals Controller (Inscrições & Programação)
   -------------------------------------------------------------------------- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloses = document.querySelectorAll('[data-close-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Fecha com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  // Filtros da Programação
  const scheduleTabs = document.querySelectorAll('.schedule-tab-btn');
  const scheduleItems = document.querySelectorAll('.timeline-item');

  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach(t => {
        t.style.background = '#e2e8f0';
        t.style.color = '#334155';
      });
      tab.style.background = '#2563eb';
      tab.style.color = '#ffffff';

      const filter = tab.getAttribute('data-filter');
      scheduleItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Forms & Leads Submission
   -------------------------------------------------------------------------- */
function initForms() {
  // Formulário Rápido da Seção CTA Final
  const quickForm = document.getElementById('quick-registration-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('captain-quick-email');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !email.includes('@')) {
        showToast('Por favor, informe um e-mail válido.', 'warning');
        return;
      }

      // Preenche automaticamente o modal completo e o abre
      const fullModal = document.getElementById('modal-inscricao');
      const modalEmailInput = document.getElementById('reg-email');
      if (modalEmailInput) {
        modalEmailInput.value = email;
      }

      if (fullModal) {
        fullModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Formulário Completo de Inscrição da Equipe
  const fullRegistrationForm = document.getElementById('full-registration-form');
  if (fullRegistrationForm) {
    fullRegistrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const teamName = document.getElementById('reg-team-name')?.value.trim();
      const captainName = document.getElementById('reg-captain-name')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const phone = document.getElementById('reg-phone')?.value.trim();
      const gameCategory = document.getElementById('reg-category')?.value;
      const schoolClass = document.getElementById('reg-class')?.value.trim();

      if (!teamName || !captainName || !email || !phone) {
        showToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
      }

      const registrationData = {
        id: 'MAMEDE-' + Math.floor(1000 + Math.random() * 9000),
        teamName,
        captainName,
        email,
        phone,
        gameCategory,
        schoolClass,
        timestamp: new Date().toISOString()
      };

      // Salva no LocalStorage
      try {
        const saved = JSON.parse(localStorage.getItem('mamede_inscricoes') || '[]');
        saved.push(registrationData);
        localStorage.setItem('mamede_inscricoes', JSON.stringify(saved));
      } catch (err) {
        console.warn('Erro ao salvar localmente:', err);
      }

      // Fecha o modal
      const modal = document.getElementById('modal-inscricao');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Limpa formulário
      fullRegistrationForm.reset();

      // Dispara Toast de Sucesso
      showToast(`🎉 Equipe "${teamName}" inscrita com sucesso! Código: ${registrationData.id}`, 'success');
    });
  }
}

/* --------------------------------------------------------------------------
   6. Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'warning') {
    toast.style.borderLeftColor = '#ff5722';
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* --------------------------------------------------------------------------
   7. Smooth Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Expõe showToast globalmente se necessário
window.showToast = showToast;

/* --------------------------------------------------------------------------
   8. Games Carousel (Carrossel Interativo de Jogos da Feira)
   -------------------------------------------------------------------------- */
function initGamesCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const pills = document.querySelectorAll('.carousel-pill-btn');
  const dots = document.querySelectorAll('.carousel-dot');
  const counterEl = document.querySelector('.carousel-counter-badge');
  const viewport = document.querySelector('.carousel-viewport');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5500;

  function updateSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Atualiza pills
    pills.forEach((pill, i) => {
      pill.classList.toggle('active', i === currentIndex);
    });

    // Centraliza o pill ativo suavemente dentro da barra SEM mover a página
    const pillsBar = document.querySelector('.carousel-pills-bar');
    if (pillsBar && pills[currentIndex]) {
      const activePill = pills[currentIndex];
      const targetLeft = activePill.offsetLeft - (pillsBar.clientWidth / 2) + (activePill.clientWidth / 2);
      pillsBar.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    }

    // Atualiza dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });

    // Atualiza o contador
    if (counterEl) {
      const activeSlide = slides[currentIndex];
      const gameName = activeSlide ? (activeSlide.getAttribute('data-game-name') || '') : '';
      const numStr = String(currentIndex + 1).padStart(2, '0');
      const totalStr = String(totalSlides).padStart(2, '0');
      counterEl.textContent = `SLIDE ${numStr} / ${totalStr} • ${gameName.toUpperCase()}`;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Controles de navegação anterior/próximo
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlide(currentIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlide(currentIndex + 1);
      resetAutoplay();
    });
  }

  // Navegação pelos pills
  pills.forEach((pill, i) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlide(i);
      resetAutoplay();
    });
  });

  // Navegação pelos dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      updateSlide(i);
      resetAutoplay();
    });
  });

  // Pausa ao passar o mouse ou focar
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    viewport.addEventListener('focusin', stopAutoplay);
    viewport.addEventListener('focusout', startAutoplay);

    // Suporte a Touch Swipe para celular e tablet
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchStartX - touchEndX;
      const threshold = 40; // sensibilidade do swipe
      if (swipeDistance > threshold) {
        updateSlide(currentIndex + 1);
      } else if (swipeDistance < -threshold) {
        updateSlide(currentIndex - 1);
      }
    }
  }

  // Suporte a teclas de setas do teclado
  document.addEventListener('keydown', (e) => {
    const jogosSection = document.getElementById('jogos');
    if (!jogosSection) return;
    const rect = jogosSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') {
      updateSlide(currentIndex - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      updateSlide(currentIndex + 1);
      resetAutoplay();
    }
  });

  // Inicializa o primeiro slide e autoplay
  updateSlide(0);
  startAutoplay();
}

/* --------------------------------------------------------------------------
   9. Pop-up Informativo com Regras dos Jogos e Formato do Torneio
   -------------------------------------------------------------------------- */
function initGameRulesModal() {
  const modal = document.getElementById('modal-regras-jogo');
  if (!modal) return;

  const ruleButtons = document.querySelectorAll('[data-open-rules]');
  const tabs = modal.querySelectorAll('.modal-rules-tab-btn');
  const panels = modal.querySelectorAll('.game-rule-panel');

  function selectGame(gameId) {
    if (!gameId) return;

    tabs.forEach(tab => {
      const matches = tab.getAttribute('data-game-tab') === gameId;
      tab.classList.toggle('active', matches);
      tab.setAttribute('aria-selected', matches ? 'true' : 'false');
    });

    panels.forEach(panel => {
      const matches = panel.getAttribute('data-game-panel') === gameId;
      panel.classList.toggle('active', matches);
    });

    // Rola suavemente a barra de abas interna do modal para a aba ativa
    const tabsBar = modal.querySelector('.modal-rules-tabs');
    const activeTab = modal.querySelector(`.modal-rules-tab-btn[data-game-tab="${gameId}"]`);
    if (tabsBar && activeTab) {
      tabsBar.scrollTo({
        left: activeTab.offsetLeft - (tabsBar.clientWidth / 2) + (activeTab.clientWidth / 2),
        behavior: 'smooth'
      });
    }
  }

  ruleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const gameId = btn.getAttribute('data-open-rules');
      selectGame(gameId);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const gameId = tab.getAttribute('data-game-tab');
      selectGame(gameId);
    });
  });
}


