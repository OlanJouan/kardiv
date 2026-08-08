(function () {
  'use strict';

  // Clé d'accès Web3Forms (https://web3forms.com) reliée à l'email de contact du site.
  const WEB3FORMS_ACCESS_KEY = 'a337745d-aaae-4f5e-82ef-38beb14c7f35';
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = 'form-message ' + type;
  }

  async function submitWeb3Forms(formData, successMessage, statusElement) {
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        showMessage(statusElement, successMessage, 'success');
        return true;
      } else {
        showMessage(statusElement, data.message || 'Une erreur est survenue. Veuillez réessayer.', 'error');
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
      formData.append('subject', 'Nouvelle inscription à la newsletter Kardiv');
      const ok = await submitWeb3Forms(
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
      const ok = await submitWeb3Forms(
        formData,
        'Merci pour votre message. Nous vous répondrons sous 24 heures.',
        contactMessageStatus
      );
      if (ok) contactForm.reset();
    });
  }
})();
