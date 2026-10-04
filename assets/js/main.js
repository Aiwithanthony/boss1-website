// BOSS 1 – Electro Mechanical
const PHONE_TEL = '+61413404040';
const WHATSAPP = '61413404040';

// Mobile menu
(function () {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();

// FAQ: keep one answer open at a time
document.querySelectorAll('.faq__list').forEach((list) => {
  const items = list.querySelectorAll('details');
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  }));
});

// Booking forms -> WhatsApp message (the email button on the contact page posts normally)
document.querySelectorAll('form[data-whatsapp]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    const via = e.submitter ? e.submitter.value : 'whatsapp';
    if (via === 'email') return;
    e.preventDefault();
    const lines = ['Hi BOSS 1, I would like to book a mobile mechanic.'];
    form.querySelectorAll('[data-label]').forEach((el) => {
      const v = (el.value || '').trim();
      if (v) lines.push(`${el.dataset.label}: ${v}`);
    });
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
});

// Contact form result (?sent=1 / ?error=1 from contact.php)
(function () {
  const box = document.querySelector('.js-form-status');
  if (!box) return;
  const p = new URLSearchParams(location.search);
  if (p.has('sent')) {
    box.hidden = false;
    box.className = 'alert alert--ok js-form-status';
    box.textContent = 'Thanks — your message has been sent. We’ll get back to you soon. For anything urgent, call 0413 404 040.';
  } else if (p.has('error')) {
    box.hidden = false;
    box.className = 'alert alert--err js-form-status';
    box.textContent = 'Sorry, your message didn’t send. Please add a phone number or email, or call 0413 404 040.';
  }
})();

document.querySelectorAll('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
