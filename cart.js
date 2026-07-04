(function () {
  'use strict';

  const STORAGE_KEY = 'kardiv_cart';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage may be blocked
    }
  }

  function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' €';
  }

  function getCartElements() {
    return {
      drawer: document.getElementById('cartDrawer'),
      body: document.getElementById('cartBody'),
      total: document.getElementById('cartTotal'),
      count: document.querySelector('.cart-count'),
      closeBtn: document.getElementById('closeCart'),
      overlay: document.getElementById('cartOverlay'),
    };
  }

  function updateCartUI() {
    const cart = loadCart();
    const { body, total, count } = getCartElements();

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
    if (count) count.textContent = cart.length;
    if (total) total.textContent = formatPrice(cartTotal);

    if (!body) return;

    if (cart.length === 0) {
      body.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
      return;
    }

    body.innerHTML = cart
      .map(
        (item, index) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${formatPrice(item.price)}</p>
          </div>
          <button class="cart-remove" data-index="${index}" aria-label="Retirer ${item.name}">Retirer</button>
        </div>
      `
      )
      .join('');

    body.querySelectorAll('.cart-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        removeFromCart(index);
      });
    });
  }

  function openCart() {
    const { drawer, closeBtn } = getCartElements();
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    const { drawer } = getCartElements();
    if (!drawer) return;
    drawer.hidden = true;
    document.body.style.overflow = '';
    const openBtn = document.querySelector('.cart-btn');
    if (openBtn) openBtn.focus();
  }

  function addToCart(name, price) {
    const cart = loadCart();
    cart.push({ name, price });
    saveCart(cart);
    updateCartUI();
    openCart();
  }

  function removeFromCart(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
  }

  function getCheckoutElements() {
    return {
      modal: document.getElementById('checkoutModal'),
      overlay: document.getElementById('checkoutOverlay'),
      closeBtn: document.getElementById('closeCheckout'),
      summary: document.getElementById('checkoutSummary'),
      form: document.getElementById('checkoutForm'),
      success: document.getElementById('checkoutSuccess'),
      closeSuccess: document.getElementById('checkoutCloseSuccess'),
    };
  }

  function openCheckout() {
    const cart = loadCart();
    if (cart.length === 0) return;
    const { modal } = getCheckoutElements();
    if (!modal) return;
    closeCart();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    renderCheckoutSummary();
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeCheckout() {
    const { modal } = getCheckoutElements();
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.focus();
  }

  function resetCheckout() {
    const { form, success } = getCheckoutElements();
    if (form) {
      form.reset();
      form.hidden = false;
    }
    if (success) success.hidden = true;
  }

  function renderCheckoutSummary() {
    const cart = loadCart();
    const { summary } = getCheckoutElements();
    if (!summary) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemsHtml = cart
      .map((item) => `<p class="checkout-summary-item"><span>${item.name}</span><span>${formatPrice(item.price)}</span></p>`)
      .join('');
    summary.innerHTML = `
      <h3 class="checkout-summary-title">Récapitulatif</h3>
      ${itemsHtml}
      <p class="checkout-summary-total"><span>Total</span><span>${formatPrice(total)}</span></p>
    `;
  }

  function submitCheckout(e) {
    e.preventDefault();
    const { form, success } = getCheckoutElements();
    if (!form || !success) return;

    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const address = formData.get('address')?.trim();
    const city = formData.get('city')?.trim();
    const postal = formData.get('postal')?.trim();

    if (!name || !email || !phone || !address || !city || !postal) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    if (!email.includes('@')) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    form.hidden = true;
    success.hidden = false;
    saveCart([]);
    updateCartUI();
  }

  function initCart() {
    updateCartUI();

    const openBtn = document.querySelector('.cart-btn');
    const closeBtn = document.getElementById('closeCart');
    const overlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutCloseSuccess = document.getElementById('checkoutCloseSuccess');

    if (openBtn) openBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
    if (checkoutForm) checkoutForm.addEventListener('submit', submitCheckout);
    if (checkoutCloseSuccess) {
      checkoutCloseSuccess.addEventListener('click', () => {
        closeCheckout();
        resetCheckout();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeCheckout();
      }
    });

    document.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price, 10);
        if (name && !isNaN(price)) {
          addToCart(name, price);
        }
      });
    });
  }

  window.KardivCart = {
    add: addToCart,
    remove: removeFromCart,
    init: initCart,
    load: loadCart,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }
})();
