document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (menu && links) {
    const toggleMenu = (show) => {
      const isOpen = show !== undefined ? show : !links.classList.contains('open');
      links.classList.toggle('open', isOpen);
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.innerHTML = isOpen ? '✕' : '☰';
    };

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

    document.addEventListener('click', (e) => {
      if (links.classList.contains('open') && !links.contains(e.target) && !menu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === current));
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const top = document.querySelector('.top-btn');
  if (top) { window.addEventListener('scroll', () => top.classList.toggle('show', scrollY > 450)); top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' })); }
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) { const img = lightbox.querySelector('img'); document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => { img.src = item.dataset.full || item.querySelector('img').src; img.alt = item.querySelector('img').alt; lightbox.classList.add('open'); document.body.style.overflow = 'hidden' })); const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = '' }; lightbox.querySelector('button').addEventListener('click', close); lightbox.addEventListener('click', e => { if (e.target === lightbox) close() }); document.addEventListener('keydown', e => { if (e.key === 'Escape') close() }); }
  const form = document.querySelector('#enquiryForm');
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      const subjectInput = document.querySelector('#subject');
      if (subjectInput && !subjectInput.value) {
        subjectInput.value = `Enquiry about ${categoryParam}`;
      }
    }
    const msg = document.querySelector('#formMessage');
    const submitBtn = document.querySelector('#submitBtn');

    // BREVO EMAIL SERVICE CONFIGURATION
    const BREVO_API_KEY = window.BREVO_API_KEY || '';
    const RECIPIENT_EMAIL = 'nnibraz15@gmail.com';
    const RECIPIENT_NAME = 'Syed Farm House (SFH)';

    async function sendBrevoEmail(payloadData) {
      if (!BREVO_API_KEY) return false;
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: payloadData.name, email: payloadData.email || RECIPIENT_EMAIL },
            to: [{ email: RECIPIENT_EMAIL, name: RECIPIENT_NAME }],
            replyTo: payloadData.email ? { email: payloadData.email, name: payloadData.name } : undefined,
            subject: `[SFH Website Enquiry] ${payloadData.subject}`,
            htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #243127; border: 1px solid #d9ddcf; border-radius: 8px;"><h2 style="color: #234b2c; margin-top: 0;">New Farm Enquiry received from Syed Farm House Website</h2><hr style="border: 0; border-top: 1px solid #d9ddcf;"><p><strong>Sender Name:</strong> ${payloadData.name}</p><p><strong>Phone:</strong> ${payloadData.phone}</p><p><strong>Email:</strong> ${payloadData.email || 'Not provided'}</p><p><strong>Subject:</strong> ${payloadData.subject}</p><p><strong>Message:</strong></p><blockquote style="background: #fbfaf5; padding: 15px; border-left: 4px solid #234b2c; margin: 0;">${payloadData.message.replace(/\n/g, '<br>')}</blockquote><hr style="border: 0; border-top: 1px solid #d9ddcf; margin-top: 20px;"><small style="color: #667168;">Delivered automatically via Brevo Emailing Service for Syed Farm House.</small></div>`
          })
        });
        return response.ok;
      } catch (err) {
        console.error('Brevo API Error:', err);
        return false;
      }
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      msg.className = 'form-message';
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const email = String(data.get('email') || '').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (name.length < 2 || phone.length < 7 || !subject || message.length < 5) {
        msg.textContent = 'Please complete the required fields with valid information.';
        msg.classList.add('show', 'error');
        return;
      }
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.add('show', 'error');
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending via Brevo...'; }
      msg.textContent = 'Connecting to Brevo Emailing Service...';
      msg.classList.add('show');

      const payloadData = { name, phone, email, subject, message };
      const sentViaApi = await sendBrevoEmail(payloadData);

      if (sentViaApi) {
        msg.textContent = '✓ Success! Your enquiry has been sent directly to nnibraz15@gmail.com via Brevo Emailing Service.';
        msg.classList.add('show', 'success');
        form.reset();
      } else {
        const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\n\n${message}`;
        window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        msg.textContent = 'Opening your email client to complete sending enquiry to nnibraz15@gmail.com...';
        msg.classList.add('show', 'success');
      }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Enquiry via Brevo'; }
    });
  }
});
