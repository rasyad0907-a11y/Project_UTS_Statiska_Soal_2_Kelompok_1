/* utils.js - Helper bersama: format angka, parsing input, komponen tabel, dan toast.
   Semua file memakai namespace global App agar bisa dibuka langsung dari file:// tanpa server. */
(function () {
  'use strict';
  const App = (window.App = window.App || {});

  App.EPS = 1e-9;
  App.$ = (id) => document.getElementById(id);

  /* Error khusus untuk kesalahan input pengguna */
  class InputError extends Error {}
  App.InputError = InputError;

  /* ---------- Format angka (gaya Indonesia: koma desimal) ---------- */
  App.fmt = (x) => (Math.abs(x) < App.EPS ? 0 : x).toLocaleString('id-ID', { maximumFractionDigits: 4 });
  App.pct = (x) => (x * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + '%';
  App.both = (x) => `${App.fmt(x)} (${App.pct(x)})`;
  App.close = (x, y) => Math.abs(x - y) < App.EPS;
  App.esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  App.badge = (ok) => `<span class="badge ${ok ? 'yes' : 'no'}">${ok ? 'Ya' : 'Tidak'}</span>`;

  /* ---------- Parsing input: "0,3" / "0.3" / "30%" -> angka 0..1 ---------- */
  App.parseProb = (raw, label) => {
    const text = String(raw == null ? '' : raw).trim();
    if (!text) throw new InputError(`${label} belum diisi.`);
    const isPercent = text.endsWith('%');
    let v = Number(text.replace('%', '').replace(',', '.').trim());
    if (Number.isNaN(v)) throw new InputError(`${label} bukan angka yang valid.`);
    if (isPercent) v /= 100;
    if (v < 0 || v > 1) throw new InputError(`${label} harus di antara 0 dan 1 (atau 0% sampai 100%).`);
    return v;
  };
  App.readProb = (id, label) => App.parseProb(App.$(id).value, label);

  /* ---------- Komponen tampilan ---------- */
  App.table = (rows, head = ['Ukuran', 'Rumus', 'Hasil']) =>
    `<div class="table-scroll"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
    rows.map((r) => `<tr><td>${r[0]}</td><td class="formula">${r[1]}</td><td class="val">${r[2]}</td></tr>`).join('') +
    `</tbody></table></div>`;
  App.meter = (v) => `<div class="meter"><span style="width:${Math.min(100, Math.max(0, v * 100))}%"></span></div>`;
  App.interp = (html) => `<div class="interp"><b>Interpretasi:</b> ${html}</div>`;

  /* ---------- Toast (notifikasi singkat) ---------- */
  App.toast = (message, type = 'info', ms = 2800) => {
    let box = App.$('toastBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toastBox';
      box.className = 'toast-box';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = message;
    box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
  };

  /* ---------- Jalankan aksi dengan penanganan error ---------- */
  App.showError = (outId, e) => {
    App.$(outId).innerHTML = `<div class="err">${App.esc(e.message)}</div>`;
    App.toast(e.message, 'error', 3600);
  };
  App.safe = (outId, fn) => {
    try { fn(); } catch (e) {
      if (e instanceof InputError) App.showError(outId, e);
      else { console.error(e); App.showError(outId, new Error('Terjadi kesalahan tak terduga. Periksa kembali input.')); }
    }
  };

  /* ---------- Bantuan form ---------- */
  App.setValues = (map) => Object.entries(map).forEach(([id, v]) => (App.$(id).value = v));
  App.clearValues = (ids, outId) => { ids.forEach((id) => (App.$(id).value = '')); if (outId) App.$(outId).innerHTML = ''; };
  App.bindActions = (actions) =>
    Object.entries(actions).forEach(([name, fn]) =>
      document.querySelectorAll(`[data-action="${name}"]`).forEach((btn) => btn.addEventListener('click', fn)));
  App.bindForm = (id, fn) => {
    const form = App.$(id);
    if (form) form.addEventListener('submit', (ev) => { ev.preventDefault(); fn(); });
  };
})();