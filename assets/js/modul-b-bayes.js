/* modul-b-bayes.js - Modul B (bagian 2): Teorema Bayes + simulasi filter phishing.
   P(E)   = P(E|H)·P(H) + P(E|H')·P(H')      (probabilitas total)
   P(H|E) = P(E|H)·P(H) / P(E)               (Teorema Bayes) */
(function () {
  'use strict';
  const App = window.App;
  const { $, fmt, pct, both, esc, InputError, table, meter, interp } = App;

  const TOTAL_EMAIL = 10000, TOTAL_CELLS = 1000;
  const SWEEP = [0.01, 0.02, 0.05, 0.08, 0.1, 0.2, 0.3, 0.5];

  /* ================= Logika ================= */
  function compute({ prior, sens, fpr, N = 10000 }) {
    if (!(N >= 1)) throw new InputError('Populasi ilustrasi harus minimal 1.');
    const joint = sens * prior;                       // P(E ∩ H)
    const pE = joint + fpr * (1 - prior);             // P(E)
    if (pE === 0) throw new InputError('P(E) = 0, sehingga P(H|E) tidak terdefinisi.');
    const post = joint / pE;                          // P(H|E)
    const pNE = 1 - pE;
    return {
      prior, sens, fpr, N, joint, pE, post,
      postNeg: pNE <= 0 ? null : ((1 - sens) * prior) / pNE,   // P(H|E')
      falseAlarm: 1 - post,
      lift: prior > 0 ? post / prior : null,
      tp: N * prior * sens, fn: N * prior * (1 - sens),
      fp: N * (1 - prior) * fpr, tn: N * (1 - prior) * (1 - fpr)
    };
  }
  const posterior = (prior, sens, fpr) => {
    const pE = sens * prior + fpr * (1 - prior);
    return pE === 0 ? 0 : (sens * prior) / pE;
  };

  /* ================= Simulasi (frekuensi alami) ================= */
  /* Bagi 1.000 kotak ke 4 kelompok dengan metode sisa terbesar agar totalnya tepat. */
  function simCells(res) {
    const scale = TOTAL_CELLS / res.N, out = {}, rest = [];
    let used = 0;
    ['tp', 'fp', 'fn', 'tn'].forEach((k) => {
      const v = res[k] * scale;
      out[k] = Math.floor(v); used += out[k]; rest.push([k, v - out[k]]);
    });
    rest.sort((x, y) => y[1] - x[1]);
    for (let i = 0; used < TOTAL_CELLS; i++, used++) out[rest[i % 4][0]]++;
    return out;
  }
  function simRun({ prior, sens, fpr }) {
    const res = compute({ prior, sens, fpr, N: TOTAL_EMAIL });
    const counts = simCells(res);
    // Urutan kotak: ditandai dulu (tp, fp), lalu tidak ditandai (fn, tn)
    const list = ['tp', 'fp', 'fn', 'tn'].flatMap((k) => Array(counts[k]).fill(k));
    return { res, counts, list, sweep: SWEEP.map((p) => ({ prior: p, post: posterior(p, sens, fpr) })) };
  }

  /* ================= Tampilan ================= */
  function renderBayes(r, names) {
    const h = esc(names.h), e = esc(names.e);
    const f = (x) => x.toLocaleString('id-ID', { maximumFractionDigits: 1 });
    const rows = [
      [`P(${h}) prior`, 'Diketahui', both(r.prior)],
      [`P(${h}') bukan ${h}`, '1 − P(H)', both(1 - r.prior)],
      [`P(${e}|${h}) sensitivitas`, 'Diketahui', both(r.sens)],
      [`P(${e}|${h}') false positive`, 'Diketahui', both(r.fpr)],
      [`<b>1. P(${e})</b>`, `P(E|H)·P(H) + P(E|H')·P(H')<br>= ${fmt(r.sens)}×${fmt(r.prior)} + ${fmt(r.fpr)}×${fmt(1 - r.prior)}`, both(r.pE)],
      [`<b>2. P(${h}|${e})</b> Bayes`, `P(E|H)·P(H) / P(E)<br>= ${fmt(r.joint)} / ${fmt(r.pE)}`, both(r.post)],
      [`P(bukan ${h}|${e})`, '1 − P(H|E)', both(r.falseAlarm)]
    ];
    if (r.postNeg !== null) rows.push([`P(${h}|tidak ${e})`, "P(E'|H)·P(H) / P(E')", both(r.postNeg)]);

    const freq = `<div class="table-scroll"><table style="margin-top:14px"><thead><tr><th>Dari ${f(r.N)} kasus</th><th>${e}</th><th>tidak ${e}</th><th>Total</th></tr></thead><tbody>
      <tr><td>${h}</td><td>${f(r.tp)}</td><td>${f(r.fn)}</td><td>${f(r.tp + r.fn)}</td></tr>
      <tr><td>bukan ${h}</td><td>${f(r.fp)}</td><td>${f(r.tn)}</td><td>${f(r.fp + r.tn)}</td></tr>
      <tr><td><b>Total</b></td><td><b>${f(r.tp + r.fp)}</b></td><td><b>${f(r.fn + r.tn)}</b></td><td><b>${f(r.N)}</b></td></tr></tbody></table></div>`;

    let why = '';
    if (r.post < r.sens - 0.05 && r.prior < 0.5)
      why = ` Meski sensitivitasnya ${pct(r.sens)}, hasilnya jauh lebih kecil karena prevalensi ${h} hanya ${pct(r.prior)}: kasus bukan ${h} jauh lebih banyak, sehingga false positive (${pct(r.fpr)}) ikut menyumbang banyak tanda.`;
    const lift = r.lift ? ` Bukti ini menaikkan peluang ${h} sekitar ${r.lift.toLocaleString('id-ID', { maximumFractionDigits: 1 })}× dari peluang awal (${pct(r.prior)}).` : '';
    const neg = r.postNeg !== null ? ` Jika kasus <i>tidak</i> ${e}, peluangnya tetap ${h} hanya ${pct(r.postNeg)}.` : '';

    $('outBayes').innerHTML = table(rows) + meter(r.post) + freq +
      interp(`Dari seluruh kasus, <b>${pct(r.pE)}</b> akan <i>${e}</i>. Jika suatu kasus sudah <i>${e}</i>, peluang kasus itu benar-benar <i>${h}</i> adalah <b>${pct(r.post)}</b>, dan sisanya ${pct(r.falseAlarm)} adalah alarm palsu.${why}${lift}${neg}`);
  }

  function renderSim(s, now) {
    const { res, list, sweep } = s;
    const f = (x) => Math.round(x).toLocaleString('id-ID');
    const rows = sweep.map((x) => {
      const isNow = Math.abs(x.prior - now.prior) < 0.0005;
      return `<tr class="${isNow ? 'now' : ''}"><td>${pct(x.prior)}</td><td class="val">${pct(x.post)}</td><td><div class="mini"><span style="width:${x.post * 100}%"></span></div></td></tr>`;
    }).join('');
    $('outSim').innerHTML = `
      <div class="stats">
        <div class="stat"><span>P(ditandai)</span><b>${pct(res.pE)}</b></div>
        <div class="stat hi"><span>P(phishing | ditandai)</span><b>${pct(res.post)}</b></div>
        <div class="stat"><span>Alarm palsu di antara yang ditandai</span><b>${pct(res.falseAlarm)}</b></div>
      </div>
      <div class="dots" aria-label="Simulasi 10.000 email">${list.map((k) => `<i class="${k}"></i>`).join('')}</div>
      <div class="legend">
        <span><i style="background:var(--tp)"></i>Phishing &amp; ditandai (${f(res.tp)})</span>
        <span><i style="background:var(--fp)"></i>Bukan phishing tapi ditandai (${f(res.fp)})</span>
        <span><i style="background:var(--fn)"></i>Phishing lolos (${f(res.fn)})</span>
        <span><i style="background:var(--tn)"></i>Bukan phishing &amp; lolos (${f(res.tn)})</span>
      </div>
      ${interp(`Dari 10.000 email, ${f(res.tp + res.fp)} email ditandai sistem. Hanya ${f(res.tp)} di antaranya yang benar-benar phishing, atau <b>${pct(res.post)}</b>. Kotak merah dan kuning di bagian awal grid adalah email yang ditandai: semakin banyak kuning, semakin sering sistem salah menandai.`)}
      <h3 class="subhead">Pengaruh prevalensi terhadap P(phishing | ditandai)</h3>
      <p class="sub">Sensitivitas ${pct(now.sens)} dan false positive ${pct(now.fpr)} tetap; hanya prevalensi yang diubah.</p>
      <div class="table-scroll"><table><thead><tr><th>Prevalensi</th><th>P(phishing | ditandai)</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  /* ================= Event ================= */
  const runBayes = () => App.safe('outBayes', () => {
    const r = compute({
      prior: App.readProb('prior', 'P(H) / prevalensi'),
      sens: App.readProb('sens', 'P(E|H) / sensitivitas'),
      fpr: App.readProb('fpr', "P(E|H') / false positive"),
      N: Number($('popN').value) || 10000
    });
    renderBayes(r, { h: $('hName').value.trim() || 'H', e: $('eName').value.trim() || 'E' });
  });

  const runSim = () => App.safe('outSim', () => {
    const now = { prior: Number($('simPrior').value) / 100, sens: Number($('simSens').value) / 100, fpr: Number($('simFpr').value) / 100 };
    $('valPrior').textContent = $('simPrior').value.replace('.', ',') + '%';
    $('valSens').textContent = $('simSens').value.replace('.', ',') + '%';
    $('valFpr').textContent = $('simFpr').value.replace('.', ',') + '%';
    renderSim(simRun(now), now);
  });

  function init() {
    if ($('formBayes')) {
      App.bindForm('formBayes', runBayes);
      App.bindActions({
        'preset-bayes': () => {
          App.setValues({ hName: 'phishing', eName: 'ditandai sistem', prior: '8%', sens: '92%', fpr: '3%', popN: 10000 });
          runBayes(); App.toast('Contoh filter phishing dimuat: 8% / 92% / 3%');
        },
        'reset-bayes': () => { App.clearValues(['prior', 'sens', 'fpr'], 'outBayes'); App.setValues({ hName: 'phishing', eName: 'ditandai sistem', popN: 10000 }); }
      });
    }
    if ($('simPrior')) {
      ['simPrior', 'simSens', 'simFpr'].forEach((id) => $(id).addEventListener('input', runSim));
      App.bindActions({ 'reset-sim': () => { App.setValues({ simPrior: 8, simSens: 92, simFpr: 3 }); runSim(); } });
      runSim();
    }
  }

  App.modulBBayes = { compute, posterior, simRun, init };
})();