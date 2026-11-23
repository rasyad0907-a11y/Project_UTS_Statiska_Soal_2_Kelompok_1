/* main.js - Inisialisasi aplikasi dan event listener umum.
   Setiap modul hanya aktif jika elemennya ada di halaman yang sedang dibuka. */
(function () {
  'use strict';
  const App = window.App;

  /* Tandai menu navigasi halaman aktif */
  function markActiveNav() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach((a) => {
      if (a.getAttribute('href').split('/').pop() === current) a.setAttribute('aria-current', 'page');
    });
  }

  /* Tab Modul A / Modul B pada halaman gabungan (probabilitas.html) */
  function initTabs() {
    const tabs = Array.from(document.querySelectorAll('.page-tabs .tab'));
    if (!tabs.length) return;
    const ids = tabs.map((t) => t.dataset.target);
    const show = (id, updateHash = true) => {
      if (!ids.includes(id)) id = ids[0];
      tabs.forEach((t) => { const on = t.dataset.target === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      ids.forEach((pid) => (document.getElementById(pid).hidden = pid !== id));
      if (updateHash) history.replaceState(null, '', '#' + id);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t.dataset.target));
      t.addEventListener('keydown', (ev) => {
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        const next = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus(); show(next.dataset.target);
      });
    });
    window.addEventListener('hashchange', () => show(location.hash.slice(1), false));
    show(location.hash.slice(1) || ids[0], false);
  }

  document.addEventListener('DOMContentLoaded', () => {
    markActiveNav();
    initTabs();
    if (App.modulA) App.modulA.init();
    if (App.modulBCond) App.modulBCond.init();
    if (App.modulBBayes) App.modulBBayes.init();
  });
})();