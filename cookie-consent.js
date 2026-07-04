(function () {
  'use strict';

  const STORAGE_KEY = 'kardiv_cookie_consent';
  const GA_ID = 'G-XXXXXXXXXX'; // Remplacer par votre ID Google Analytics 4

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // localStorage may be blocked
    }
  }

  function loadGA() {
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return;
    if (window.gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'granted',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Gestion des cookies');
    banner.innerHTML = `
      <div class="cookie-inner">
        <p>
          Nous utilisons des cookies pour mesurer l'audience et améliorer votre expérience.
          En cliquant sur "Tout accepter", vous acceptez l'utilisation de cookies analytics.
          <a href="/contact#confidentialite">En savoir plus</a>.
        </p>
        <div class="cookie-actions">
          <button class="btn btn-primary" id="cookieAccept" type="button">Tout accepter</button>
          <button class="btn btn-outline" id="cookieRefuse" type="button">Refuser</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', () => {
      setConsent({ analytics: true, timestamp: Date.now() });
      hideBanner(banner);
      loadGA();
    });

    document.getElementById('cookieRefuse').addEventListener('click', () => {
      setConsent({ analytics: false, timestamp: Date.now() });
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.add('is-hidden');
    setTimeout(() => banner.remove(), 400);
  }

  function init() {
    const consent = getConsent();

    if (consent && consent.analytics) {
      loadGA();
    }

    if (!consent) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
      } else {
        createBanner();
      }
    }
  }

  init();
})();
