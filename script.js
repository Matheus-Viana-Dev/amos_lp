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
  });
})();


