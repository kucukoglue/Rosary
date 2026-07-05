(function () {
  'use strict';

  const WHATSAPP = 'https://wa.me/905333014068';

  function isUnavailable(row) {
    const v = row.querySelector('.price-value');
    if (!v) return true;
    const txt = v.textContent.trim();
    return txt === '' || txt === '-' || txt === '—';
  }

  function initBlock(block) {
    const rows = block.querySelectorAll('.price-row');
    const available = [];
    rows.forEach(row => {
      if (isUnavailable(row)) {
        row.classList.add('unavailable');
      } else {
        available.push(row);
      }
    });
    // If only one selectable option, auto-select it.
    if (available.length === 1) {
      available[0].classList.add('selected');
    }
  }

  function init() {
    document.querySelectorAll('.product-pricing').forEach(initBlock);
  }

  document.addEventListener('DOMContentLoaded', init);

  // Also run on language change (translations may update prices later)
  window.addEventListener('rosary-lang-changed', init);

  document.addEventListener('click', function (e) {
    // Select a price row
    const row = e.target.closest('.price-row');
    if (row && row.closest('.product-pricing') && !row.classList.contains('unavailable')) {
      const block = row.parentNode;
      block.querySelectorAll('.price-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      return;
    }

    // Order button clicked
    const btn = e.target.closest('.order-btn');
    if (btn) {
      e.preventDefault();
      const context = btn.closest('.product-detail-info, .product-detail');
      if (!context) return;
      const pricing = context.querySelector('.product-pricing');
      if (!pricing) return;
      const selected = pricing.querySelector('.price-row.selected');
      if (!selected) {
        // No option chosen — visually flash the selectable rows for ~3.2s
        const rows = pricing.querySelectorAll('.price-row:not(.unavailable)');
        rows.forEach(r => r.classList.add('needs-attention'));
        setTimeout(() => {
          rows.forEach(r => r.classList.remove('needs-attention'));
        }, 2000);
        return;
      }
      const productName = btn.dataset.productName || '';
      const label = selected.querySelector('.price-label');
      const value = selected.querySelector('.price-value');
      const material = label ? label.textContent.trim() : '';
      const price = value ? value.textContent.trim() : '';
      const pageUrl = window.location.href;
      const message =
        'Merhaba, ' + productName + ' siparişi vermek istiyorum.\n' +
        'Seçim: ' + material + ' — ' + price + '\n' +
        pageUrl;
      window.open(WHATSAPP + '?text=' + encodeURIComponent(message), '_blank');
    }
  });
})();
