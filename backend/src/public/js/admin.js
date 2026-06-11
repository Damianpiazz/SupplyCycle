// Confirmaciones en formularios de eliminación
document.querySelectorAll('[data-confirm]').forEach((el) => {
  el.addEventListener('submit', (e) => {
    if (!confirm(el.dataset.confirm || '¿Confirmás esta acción?')) {
      e.preventDefault();
    }
  });
});
