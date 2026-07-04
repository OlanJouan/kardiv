(function () {
  'use strict';

  const headerHTML = `
  <header class="site-header" id="header">
    <div class="header-inner">
      <button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainNav">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <a href="index.html" class="logo" aria-label="Kardiv, retour à l'accueil">Kardiv</a>

      <nav class="main-nav" id="mainNav" aria-label="Navigation principale">
        <ul class="nav-list">
          <li><a href="parfums.html">Parfums</a></li>
          <li><a href="mode-femme.html">Mode Femme</a></li>
          <li><a href="histoire.html">La Maison</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <button class="icon-btn" id="searchToggle" aria-label="Rechercher">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button class="icon-btn account-btn" id="accountToggle" aria-label="Mon compte" hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <button class="icon-btn cart-btn" aria-label="Panier">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M6 6h15l-1.5 9h-12z"></path>
            <circle cx="9" cy="20" r="1"></circle>
            <circle cx="18" cy="20" r="1"></circle>
            <path d="M6 6L5 3H2"></path>
          </svg>
          <span class="cart-count" aria-hidden="true">0</span>
        </button>
      </div>
    </div>
  </header>
  `;

  const footerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">Kardiv</a>
          <p>Mode femme et parfums de luxe. Paris.</p>
        </div>
        <nav class="footer-nav" aria-label="Liens pied de page">
          <div>
            <h3>Boutique</h3>
            <ul>
              <li><a href="parfums.html">Parfums</a></li>
              <li><a href="mode-femme.html">Mode Femme</a></li>
              <li><a href="mode-femme.html#nouveautes">Nouveautés</a></li>
            </ul>
          </div>
          <div>
            <h3>La Maison</h3>
            <ul>
              <li><a href="histoire.html">Notre histoire</a></li>
              <li><a href="histoire.html#savoir-faire">Savoir-faire</a></li>
              <li><a href="contact.html">Carrières</a></li>
            </ul>
          </div>
          <div>
            <h3>Service client</h3>
            <ul>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="contact.html#livraison">Livraison & retours</a></li>
              <li><a href="contact.html#faq">FAQ</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Kardiv. Tous droits réservés.</p>
        <ul class="footer-legal">
          <li><a href="contact.html#mentions">Mentions légales</a></li>
          <li><a href="contact.html#confidentialite">Politique de confidentialité</a></li>
          <li><a href="contact.html#cgv">CGV</a></li>
        </ul>
      </div>
    </div>
  </footer>
  `;

  const cartDrawerHTML = `
  <div class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Votre panier" hidden>
    <div class="cart-overlay" id="cartOverlay"></div>
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Votre panier</h2>
        <button class="icon-btn close-cart" id="closeCart" aria-label="Fermer le panier">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="cart-body" id="cartBody">
        <p class="cart-empty">Votre panier est vide.</p>
      </div>
      <div class="cart-footer">
        <p class="cart-total">Total : <span id="cartTotal">0 €</span></p>
        <button class="btn btn-primary btn-block" id="checkoutBtn">Commander</button>
      </div>
    </div>
  </div>
  `;

  const searchOverlayHTML = `
  <div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Rechercher" hidden>
    <div class="search-backdrop" id="searchBackdrop"></div>
    <div class="search-panel">
      <div class="search-header">
        <label for="searchInput" class="sr-only">Rechercher</label>
        <input type="search" id="searchInput" class="search-input" placeholder="Rechercher un parfum, une robe..." autocomplete="off">
        <button class="icon-btn" id="closeSearch" aria-label="Fermer la recherche">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="search-results" id="searchResults" role="listbox" aria-label="Résultats de recherche"></div>
    </div>
  </div>
  `;

  const productsIndex = [
    { name: 'Velours', type: 'parfum', url: 'parfum-velours.html', keywords: 'velours parfum vanille iris musc' },
    { name: 'Nuit d\'Or', type: 'parfum', url: 'parfum-nuit-dor.html', keywords: 'nuit or parfum intense' },
    { name: 'Rose d\'Ivoire', type: 'parfum', url: 'parfum-rose-ivoire.html', keywords: 'rose ivoire eau toilette' },
    { name: 'Ambre Sacré', type: 'parfum', url: 'parfum-ambre-sacre.html', keywords: 'ambre sacré extrait parfum' },
    { name: 'Robe Dalia', type: 'mode', url: 'robe-dalia.html', keywords: 'robe dalia cocktail noir' },
    { name: 'Sac Lune', type: 'mode', url: 'sac-lune.html', keywords: 'sac lune cuir noir' },
    { name: 'Escarpins Aria', type: 'mode', url: 'escarpins-aria.html', keywords: 'escarpins aria cuir verni noir' },
    { name: 'Pull Céleste', type: 'mode', url: 'pull-celeste.html', keywords: 'pull céleste cachemire blanc' },
    { name: 'Manteau Iconique', type: 'mode', url: 'manteau-iconique.html', keywords: 'manteau iconique laine cachemire noir' },
    { name: 'Jupe Eline', type: 'mode', url: 'jupe-eline.html', keywords: 'jupe eline midi noire' },
    { name: 'Blazer Noa', type: 'mode', url: 'blazer-noa.html', keywords: 'blazer noa ajusté noir' },
    { name: 'Bottines Jade', type: 'mode', url: 'bottines-jade.html', keywords: 'bottines jade cuir noir' },
    { name: 'Sac Eclipse', type: 'mode', url: 'sac-eclipse.html', keywords: 'sac eclipse cuir noir' },
    { name: 'Top Sienna', type: 'mode', url: 'top-sienna.html', keywords: 'top sienna soie' },
    { name: 'Pantalon Lya', type: 'mode', url: 'pantalon-lya.html', keywords: 'pantalon lya large noir' },
    { name: 'Foulard Soie Kardiv', type: 'mode', url: 'foulard-soie.html', keywords: 'foulard soie accessoire' },
    { name: 'Éclat de Rose', type: 'parfum', url: 'parfum-eclat-rose.html', keywords: 'éclat rose parfum floral' },
    { name: 'Bois d\'Orient', type: 'parfum', url: 'parfum-bois-orient.html', keywords: 'bois orient parfum boisé' },
    { name: 'Lumière d\'Iris', type: 'parfum', url: 'parfum-lumiere-iris.html', keywords: 'lumière iris parfum poudré' },
    { name: 'Cuir Intense', type: 'parfum', url: 'parfum-cuir-intense.html', keywords: 'cuir intense parfum cuir' },
    { name: 'Fleur de Néroli', type: 'parfum', url: 'parfum-fleur-neroli.html', keywords: 'fleur néroli eau toilette' }
  ];

  const checkoutModalHTML = `
  <div class="checkout-modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Finaliser votre commande" hidden>
    <div class="checkout-overlay" id="checkoutOverlay"></div>
    <div class="checkout-panel">
      <div class="checkout-header">
        <h2>Finaliser votre commande</h2>
        <button class="icon-btn close-checkout" id="closeCheckout" aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="checkout-body" id="checkoutBody">
        <div id="checkoutSummary" class="checkout-summary"></div>
        <form class="checkout-form" id="checkoutForm" novalidate>
          <div class="form-group">
            <label for="checkoutName">Nom complet</label>
            <input type="text" id="checkoutName" name="name" required autocomplete="name">
          </div>
          <div class="form-group">
            <label for="checkoutEmail">Email</label>
            <input type="email" id="checkoutEmail" name="email" required autocomplete="email">
          </div>
          <div class="form-group">
            <label for="checkoutPhone">Téléphone</label>
            <input type="tel" id="checkoutPhone" name="phone" required autocomplete="tel">
          </div>
          <div class="form-group">
            <label for="checkoutAddress">Adresse de livraison</label>
            <textarea id="checkoutAddress" name="address" required autocomplete="street-address"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="checkoutCity">Ville</label>
              <input type="text" id="checkoutCity" name="city" required autocomplete="address-level2">
            </div>
            <div class="form-group">
              <label for="checkoutPostal">Code postal</label>
              <input type="text" id="checkoutPostal" name="postal" required autocomplete="postal-code">
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Confirmer la commande</button>
        </form>
        <div id="checkoutSuccess" class="checkout-success" hidden>
          <h3>Merci pour votre commande !</h3>
          <p>Un email de confirmation vous sera envoyé sous peu.</p>
          <button class="btn btn-primary btn-block" id="checkoutCloseSuccess">Retour à la boutique</button>
        </div>
      </div>
    </div>
  </div>
  `;

  function injectComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const cartPlaceholder = document.getElementById('cart-placeholder');

    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.outerHTML = footerHTML;
    if (cartPlaceholder) cartPlaceholder.outerHTML = cartDrawerHTML + searchOverlayHTML + checkoutModalHTML;

    initMenu();
    initHeaderScroll();
    initSearch();
  }

  function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      });

      mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        });
      });
    }
  }

  function initHeaderScroll() {
    const header = document.getElementById('header');
    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchBackdrop = document.getElementById('searchBackdrop');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchToggle || !searchOverlay) return;

    function openSearch() {
      searchOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      searchInput.focus();
    }

    function closeSearchPanel() {
      searchOverlay.hidden = true;
      document.body.style.overflow = '';
      searchToggle.focus();
    }

    searchToggle.addEventListener('click', openSearch);
    closeSearch.addEventListener('click', closeSearchPanel);
    searchBackdrop.addEventListener('click', closeSearchPanel);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchOverlay.hidden) {
        closeSearchPanel();
      }
    });

    function renderResults(query) {
      const term = query.trim().toLowerCase();
      if (term.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      const matches = productsIndex.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.keywords.toLowerCase().includes(term)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<p class="search-no-results">Aucun résultat trouvé.</p>';
        return;
      }

      searchResults.innerHTML = matches
        .map(
          (p) => `
          <a href="${p.url}" class="search-result-item" role="option">
            <span class="search-result-name">${p.name}</span>
            <span class="search-result-type">${p.type === 'parfum' ? 'Parfum' : 'Mode'}</span>
          </a>
        `
        )
        .join('');
    }

    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderResults(e.target.value), 150);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstResult = searchResults.querySelector('.search-result-item');
        if (firstResult) {
          window.location.href = firstResult.getAttribute('href');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectComponents);
  } else {
    injectComponents();
  }
})();
