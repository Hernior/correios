(() => {
  'use strict';
  const key = 'correios-toolkit-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  const modes = ['auto', 'light', 'dark'];
  const labels = {auto: 'Automático', light: 'Claro', dark: 'Escuro'};
  let mode = 'auto';
  try {
    const saved = localStorage.getItem(key);
    if (modes.includes(saved)) mode = saved;
  } catch {}
  function apply() {
    document.documentElement.dataset.theme = mode === 'auto' ? (system.matches ? 'dark' : 'light') : mode;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    button.dataset.mode = mode;
    button.querySelector('span').textContent = labels[mode];
    button.title = `Tema: ${labels[mode]}. Alternar para ${labels[next].toLowerCase()}`;
    button.setAttribute('aria-label', button.title);
  }
  apply();
  system.addEventListener('change', apply);
  addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    mode = modes.includes(event.newValue) ? event.newValue : 'auto';
    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme-toggle').addEventListener('click', () => {
      mode = modes[(modes.indexOf(mode) + 1) % modes.length];
      try {
        if (mode === 'auto') localStorage.removeItem(key);
        else localStorage.setItem(key, mode);
      } catch {}
      apply();
    });
  });
})();
