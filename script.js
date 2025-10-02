// Minimal helper: phone mask (BR), math captcha (client-side), WhatsApp redirect
(function() {
  const phoneInput = document.getElementById('phone');
  const form = document.getElementById('form');

  const WHATSAPP_NUMBER_E164 = '5543996289935';

  function maskBrPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  }

  function sanitizePhoneToE164(brMasked) {
    const digits = brMasked.replace(/\D/g, '');
    if (digits.length < 10) return null;
    const withCc = digits.startsWith('55') ? digits : `55${digits}`;
    return withCc;
  }

  function buildWhatsappMessage(formData) {
    const { name, email, phone, product } = formData;
    const lines = [
      'Olá, gostaria de solicitar um orçamento.',
      `Nome: ${name}`,
      `Email: ${email}`,
      `Celular: ${phone}`,
      `Produto: ${product}`
    ];
    return encodeURIComponent(lines.join('\n'));
  }


  async function sendFormToApi(formData) {
    try {
      await fetch('https://nodesapi.tecskill.com.br/webhook/amos_troncos_lp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (e) { console.error('Webhook error', e); }
  }

  async function onSubmit(event) {
    event.preventDefault();
    const name = (document.getElementById('name').value || '').trim();
    const email = (document.getElementById('email').value || '').trim();
    const phoneMasked = (phoneInput.value || '').trim();
    const product = (document.getElementById('product').value || '').trim();

    if (!name || !email || !phoneMasked || !product) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }


    const phoneE164 = sanitizePhoneToE164(phoneMasked);
    if (!phoneE164) { alert('Número de celular inválido.'); return; }

    // Prepare payload for API
    const payload = { name, email, phone: phoneMasked, product };
    await sendFormToApi(payload);

    const target = WHATSAPP_NUMBER_E164 || phoneE164;
    const msg = buildWhatsappMessage(payload);
    const url = `https://wa.me/${target}?text=${msg}`;
    window.location.href = url;
  }

  function onPhoneInput(e) { e.target.value = maskBrPhone(e.target.value); }

  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    if (phoneInput) phoneInput.addEventListener('input', onPhoneInput);
    if (form) form.addEventListener('submit', onSubmit);
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
      heroCta.addEventListener('click', function(e) {
        const href = heroCta.getAttribute('href');
        if (href && href.startsWith('#')) { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }
      });
    }
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    
    // Initialize Swiper for testimonials and benefits on mobile
    function initSwiper() {
      console.log('Initializing Swipers...');
      console.log('Swiper available:', !!window.Swiper);
      console.log('Window width:', window.innerWidth);
      
      if (window.Swiper) {
        // Initialize Testimonials Swiper
        if (document.querySelector('.testimonials-swiper')) {
          try {
            // Destroy existing instance if any
            if (swiperInstance) {
              swiperInstance.destroy(true, true);
            }
            
            // Count slides to determine if loop should be enabled
            const testimonialSlideCount = document.querySelectorAll('.testimonials-swiper .swiper-slide').length;
            console.log('Testimonials slides:', testimonialSlideCount);
            
            swiperInstance = new Swiper('.testimonials-swiper', {
              slidesPerView: 1,
              spaceBetween: 20,
              loop: testimonialSlideCount > 1,
              autoplay: testimonialSlideCount > 1 ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false,
              pagination: {
                el: '.testimonials-swiper .swiper-pagination',
                clickable: true,
              },
              // Touch and navigation settings
              touchRatio: 1,
              touchAngle: 45,
              grabCursor: true,
              allowTouchMove: true,
              touchStartPreventDefault: false,
              touchMoveStopPropagation: false,
              simulateTouch: true,
              // Navigation arrows (hidden but functional)
              navigation: {
                nextEl: '.testimonials-swiper .swiper-button-next',
                prevEl: '.testimonials-swiper .swiper-button-prev',
              },
              // Keyboard control
              keyboard: {
                enabled: true,
                onlyInViewport: true,
              },
              on: {
                init: function () {
                  console.log('Testimonials Swiper initialized');
                },
                slideChange: function () {
                  console.log('Testimonials slide changed to:', this.activeIndex);
                }
              }
            });
            console.log('Testimonials Swiper initialized successfully');
          } catch (error) {
            console.error('Error initializing Testimonials Swiper:', error);
          }
        }
        
        // Initialize Benefits Swiper
        if (document.querySelector('.benefits-swiper')) {
          try {
            const benefitsSlideCount = document.querySelectorAll('.benefits-swiper .swiper-slide').length;
            console.log('Benefits slides:', benefitsSlideCount);
            
            const benefitsSwiper = new Swiper('.benefits-swiper', {
              slidesPerView: 1,
              spaceBetween: 20,
              loop: benefitsSlideCount > 1,
              autoplay: benefitsSlideCount > 1 ? {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false,
              pagination: {
                el: '.benefits-swiper .swiper-pagination',
                clickable: true,
              },
              // Touch and navigation settings
              touchRatio: 1,
              touchAngle: 45,
              grabCursor: true,
              allowTouchMove: true,
              touchStartPreventDefault: false,
              touchMoveStopPropagation: false,
              simulateTouch: true,
              // Navigation arrows (hidden but functional)
              navigation: {
                nextEl: '.benefits-swiper .swiper-button-next',
                prevEl: '.benefits-swiper .swiper-button-prev',
              },
              // Keyboard control
              keyboard: {
                enabled: true,
                onlyInViewport: true,
              },
              on: {
                init: function () {
                  console.log('Benefits Swiper initialized');
                },
                slideChange: function () {
                  console.log('Benefits slide changed to:', this.activeIndex);
                }
              }
            });
            console.log('Benefits Swiper initialized successfully');
            return benefitsSwiper;
          } catch (error) {
            console.error('Error initializing Benefits Swiper:', error);
            return null;
          }
        }
      } else {
        console.log('Swiper not available');
        return null;
      }
    }
    
    // Initialize swiper only on mobile
    let swiperInstance = null;
    
    function initSwiperIfMobile() {
      if (window.innerWidth < 768) {
        if (!swiperInstance) {
          swiperInstance = initSwiper();
        }
      } else {
        if (swiperInstance) {
          swiperInstance.destroy(true, true);
          swiperInstance = null;
        }
      }
    }
    
    // Initialize swiper after a short delay to ensure DOM is ready
    setTimeout(initSwiperIfMobile, 100);
    
    // Handle window resize to enable/disable swiper
    function handleResize() {
      initSwiperIfMobile();
    }
    
    window.addEventListener('resize', handleResize);
  });
})();


