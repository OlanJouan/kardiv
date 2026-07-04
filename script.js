(function () {
  'use strict';

  // Remplacer ces IDs par ceux fournis par Formspree (https://formspree.io)
  const FORMSPREE_CONTACT_ID = 'TON_ID_CONTACT';
  const FORMSPREE_NEWSLETTER_ID = 'TON_ID_NEWSLETTER';

  function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = 'form-message ' + type;
  }

  async function submitFormspree(endpoint, formData, successMessage, statusElement) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        showMessage(statusElement, successMessage, 'success');
        return true;
      } else {
        const data = await response.json().catch(() => ({}));
        showMessage(statusElement, data.error || 'Une erreur est survenue. Veuillez réessayer.', 'error');
        return false;
      }
    } catch (error) {
      showMessage(statusElement, 'Une erreur est survenue. Vérifiez votre connexion.', 'error');
      return false;
    }
  }

  const newsletterForm = document.getElementById('newsletterForm');
  const formMessage = document.getElementById('formMessage');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterForm.email.value.trim();

      if (!email || !email.includes('@')) {
        showMessage(formMessage, 'Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      const formData = new FormData(newsletterForm);
      const endpoint = `https://formspree.io/f/${FORMSPREE_NEWSLETTER_ID}`;
      const ok = await submitFormspree(
        endpoint,
        formData,
        'Merci ! Vous êtes inscrite à la newsletter Kardiv.',
        formMessage
      );
      if (ok) newsletterForm.reset();
    });
  }

  const contactForm = document.getElementById('contactForm');
  const contactMessageStatus = document.getElementById('contactMessageStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value;
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        showMessage(contactMessageStatus, 'Veuillez remplir tous les champs.', 'error');
        return;
      }

      if (!email.includes('@')) {
        showMessage(contactMessageStatus, 'Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      const formData = new FormData(contactForm);
      const endpoint = `https://formspree.io/f/${FORMSPREE_CONTACT_ID}`;
      const ok = await submitFormspree(
        endpoint,
        formData,
        'Merci pour votre message. Nous vous répondrons sous 24 heures.',
        contactMessageStatus
      );
      if (ok) contactForm.reset();
    });
  }
})();
