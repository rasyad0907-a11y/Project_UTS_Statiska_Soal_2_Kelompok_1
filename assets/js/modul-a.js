/* modul-a.js - Modul A: probabilitas dasar.
   P(A), komplemen, gabungan, irisan, kejadian saling lepas, dan kejadian independen. */
(function () {
  'use strict';
  const App = window.App;
  const { $, fmt, pct, both, badge, EPS, InputError, close, table, meter, interp } = App;

  /* ================= Logika (murni, tanpa DOM) ================= */
  function single(nARaw, nSRaw) {
    if (nARaw === '' || nSRaw === '') throw new InputError('n(A) dan n(S) harus diisi.');
    const nA = Number(nARaw), nS = Number(nSRaw);
    if (!Number.isInteger(nA) || !Number.isInteger(nS)) throw new InputError('n(A) dan n(S) harus bilangan bulat.');
    if (nS <= 0) throw new InputError('n(S) harus lebih dari 0.');
    if (nA < 0 || nA > nS) throw new InputError('n(A) harus di antara 0 dan n(S).');
    const p = nA / nS;
    return { nA, nS, p, pc: 1 - p };
  }

  /* rel: 'lepas' | 'indep' | 'umum' (pada 'umum', inter wajib diisi) */
  function twoEvents({ a, b, rel, inter }) {
    let how;
    if (rel === 'lepas') {
      if (a + b > 1 + EPS) throw new InputError('Untuk kejadian saling lepas, P(A) + P(B) tidak boleh lebih dari 1.');
      inter = 0;
      how = 'Saling lepas → P(A ∩ B) = 0';
    } else if (rel === 'indep') {
      inter = a * b;
      how = `Independen → P(A) × P(B) = ${fmt(a)} × ${fmt(b)}`;
    } else {
      const lo = Math.max(0, a + b - 1), hi = Math.min(a, b);
      if (inter < lo - EPS || inter > hi + EPS)
        throw new InputError(`P(A ∩ B) tidak konsisten. Nilainya harus di antara ${fmt(lo)} dan ${fmt(hi)}.`);
      how = 'Diberikan pada input';
    }
    const union = a + b - inter;
    return {
      a, b, rel, inter, union, how,
      ac: 1 - a, bc: 1 - b,
      onlyA: a - inter, onlyB: b - inter, neither: 1 - union,
      isLepas: close(inter, 0),
      isIndep: close(inter, a * b)
    };
  }

  /* ================= Tampilan ================= */
  function levelText(p) {
    if (p === 0) return 'Kejadian ini mustahil terjadi.';
    if (p === 1) return 'Kejadian ini pasti terjadi.';
    if (p < 0.2) return 'Kejadian ini tergolong sangat jarang terjadi.';
    if (p < 0.5) return 'Kejadian ini lebih kecil kemungkinannya untuk terjadi daripada tidak.';
    if (p === 0.5) return 'Kemungkinan terjadi dan tidak terjadi sama besar.';
    if (p < 0.8) return 'Kejadian ini lebih mungkin terjadi daripada tidak.';
    return 'Kejadian ini sangat mungkin terjadi.';
  }

  /* Diagram Venn SVG: jarak lingkaran mengikuti besar irisan */
  function venn(r) {
    const R = 64, cy = 100, minP = Math.min(r.a, r.b);
    const d = r.inter <= EPS || minP <= 0 ? 160 : Math.max(30, 130 - 100 * (r.inter / minP));
    const ax = 200 - d / 2, bx = 200 + d / 2;
    const overlap = d < 2 * R;
    const xA = overlap ? (ax - R + bx - R) / 2 : ax;
    const xI = (ax + bx) / 2;
    const xB = overlap ? (ax + R + bx + R) / 2 : bx;
    return `<svg class="venn" viewBox="0 0 400 200" role="img" aria-label="Diagram Venn kejadian A dan B">
      <defs><clipPath id="clipA"><circle cx="${ax}" cy="${cy}" r="${R}"/></clipPath></defs>
      <rect class="venn-s" x="2" y="2" width="396" height="196" rx="12"/>
      <circle class="venn-a" cx="${ax}" cy="${cy}" r="${R}"/>
      <circle class="venn-b" cx="${bx}" cy="${cy}" r="${R}"/>
      <circle class="venn-i" cx="${bx}" cy="${cy}" r="${R}" clip-path="url(#clipA)"/>
      <text class="venn-t" x="${ax}" y="${cy - R - 6}">A</text>
      <text class="venn-t" x="${bx}" y="${cy - R - 6}">B</text>
      <text x="${xA}" y="${cy + 4}">${pct(r.onlyA)}</text>
      ${r.inter > EPS ? `<text x="${xI}" y="${cy + 4}">${pct(r.inter)}</text>` : ''}
      <text x="${xB}" y="${cy + 4}">${pct(r.onlyB)}</text>
      <text class="venn-n" x="388" y="190">di luar A dan B: ${pct(r.neither)}</text>
    </svg>`;
  }

  function renderSingle(r) {
    $('outSingle').innerHTML =
      table([
        ['P(A)', `n(A) / n(S) = ${r.nA} / ${r.nS}`, both(r.p)],
        ["P(A') komplemen", `1 − P(A) = 1 − ${fmt(r.p)}`, both(r.pc)]
      ]) + meter(r.p) +
      interp(`Peluang A terjadi adalah <b>${pct(r.p)}</b>, sehingga peluang A <i>tidak</i> terjadi adalah ${pct(r.pc)}. ${levelText(r.p)}`);
  }

  function renderTwo(r) {
    const rows = [
      ['P(A)', 'Diketahui', both(r.a)],
      ["P(A') komplemen A", `1 − ${fmt(r.a)}`, both(r.ac)],
      ['P(B)', 'Diketahui', both(r.b)],
      ["P(B') komplemen B", `1 − ${fmt(r.b)}`, both(r.bc)],
      ['P(A ∩ B) irisan', r.how, both(r.inter)],
      ['P(A ∪ B) gabungan', `P(A) + P(B) − P(A ∩ B)<br>= ${fmt(r.a)} + ${fmt(r.b)} − ${fmt(r.inter)}`, both(r.union)],
      ['Kejadian saling lepas?', 'P(A ∩ B) = 0', badge(r.isLepas)],
      ['Kejadian independen?', 'P(A ∩ B) = P(A) × P(B)', badge(r.isIndep)]
    ];
    const relText = {
      lepas: 'Kejadian A dan B <b>saling lepas</b>, sehingga tidak mungkin terjadi bersamaan.',
      indep: 'Kejadian A dan B <b>independen</b>: terjadinya salah satu tidak memengaruhi peluang yang lain.',
      umum: 'Hubungan A dan B ditentukan dari nilai P(A ∩ B) yang diberikan.'
    }[r.rel];
    let extra = '';
    if (r.isLepas && r.a > 0 && r.b > 0) extra = ' Kejadian yang saling lepas dengan peluang positif <b>tidak mungkin independen</b>, karena jika A terjadi maka B pasti tidak terjadi.';
    if (r.isLepas && (r.a === 0 || r.b === 0)) extra = ' Karena salah satu kejadian mustahil (peluang 0), keduanya sekaligus saling lepas dan independen.';
    $('outTwo').innerHTML =
      `<div class="split"><div>${table(rows)}</div><div>${venn(r)}</div></div>` +
      interp(`${relText} Peluang A <i>atau</i> B terjadi (A ∪ B) adalah <b>${pct(r.union)}</b>, sedangkan peluang keduanya terjadi bersamaan (A ∩ B) adalah <b>${pct(r.inter)}</b>. Peluang tidak satu pun terjadi adalah ${pct(r.neither)}.${extra}`);
  }

  /* ================= Event ================= */
  const runSingle = () => App.safe('outSingle', () => renderSingle(single($('nA').value, $('nS').value)));

  const runTwo = () => App.safe('outTwo', () => {
    const rel = $('rel').value;
    const a = App.readProb('pA', 'P(A)'), b = App.readProb('pB', 'P(B)');
    const inter = rel === 'umum' ? App.readProb('pAB', 'P(A ∩ B)') : null;
    renderTwo(twoEvents({ a, b, rel, inter }));
  });

  const toggleInter = () => ($('boxInter').hidden = $('rel').value !== 'umum');

  function init() {
    if (!$('formSingle')) return;               // halaman ini tidak memuat Modul A
    App.bindForm('formSingle', runSingle);
    App.bindForm('formTwo', runTwo);
    $('rel').addEventListener('change', toggleInter);
    App.bindActions({
      'preset-single': () => { App.setValues({ nA: 13, nS: 52 }); runSingle(); App.toast('Contoh dimuat: kartu hati dari 52 kartu'); },
      'reset-single': () => App.clearValues(['nA', 'nS'], 'outSingle'),
      'preset-two': () => { App.setValues({ pA: '0,3', pB: '0,4', rel: 'lepas' }); toggleInter(); runTwo(); App.toast('Contoh soal dimuat: P(A)=0,3 ; P(B)=0,4 ; saling lepas'); },
      'reset-two': () => { App.clearValues(['pA', 'pB', 'pAB'], 'outTwo'); $('rel').value = 'lepas'; toggleInter(); }
    });
  }

  App.modulA = { single, twoEvents, init };
})();