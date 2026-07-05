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

  function pulse(elements, ms) {
    elements.forEach(el => el.classList.add('needs-attention'));
    setTimeout(() => {
      elements.forEach(el => el.classList.remove('needs-attention'));
    }, ms || 1500);
  }

  document.addEventListener('click', function (e) {
    // Color button click (inside a price row)
    const colorBtn = e.target.closest('.color-btn');
    if (colorBtn) {
      e.preventDefault();
      e.stopPropagation();
      const row = colorBtn.closest('.price-row');
      if (row && !row.classList.contains('unavailable')) {
        // Ensure the parent row is selected first
        const block = row.parentNode;
        block.querySelectorAll('.price-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        // Update color selection
        row.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        colorBtn.classList.add('selected');
      }
      return;
    }

    // Select a price row
    const row = e.target.closest('.price-row');
    if (row && row.closest('.product-pricing') && !row.classList.contains('unavailable')) {
      const block = row.parentNode;
      block.querySelectorAll('.price-row').forEach(r => {
        r.classList.remove('selected');
        r.querySelectorAll('.color-btn.selected').forEach(b => b.classList.remove('selected'));
      });
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
        pulse(pricing.querySelectorAll('.price-row:not(.unavailable)'));
        return;
      }
      // If this row offers color options, require one to be picked
      const colorOptions = selected.querySelector('.color-options');
      const selectedColor = selected.querySelector('.color-btn.selected');
      if (colorOptions && !selectedColor) {
        pulse(selected.querySelectorAll('.color-btn'));
        return;
      }
      const productName = btn.dataset.productName || '';
      const label = selected.querySelector('.price-label');
      const value = selected.querySelector('.price-value');
      const material = label ? label.textContent.trim() : '';
      const price = value ? value.textContent.trim() : '';
      const colorText = selectedColor ? ' (' + selectedColor.textContent.trim() + ')' : '';
      const pageUrl = window.location.href;
      const message =
        'Merhaba, ' + productName + ' siparişi vermek istiyorum.\n' +
        'Seçim: ' + material + colorText + ' — ' + price + '\n' +
        pageUrl;
      window.open(WHATSAPP + '?text=' + encodeURIComponent(message), '_blank');
    }
  });
})();
