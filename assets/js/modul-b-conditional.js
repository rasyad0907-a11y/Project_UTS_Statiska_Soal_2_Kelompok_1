/* modul-b-conditional.js - Modul B (bagian 1): probabilitas bersyarat.
   P(A|B) = P(A ∩ B) / P(B) */
(function () {
  'use strict';
  const App = window.App;
  const { $, fmt, pct, both, badge, EPS, InputError, close, table, meter, interp } = App;

  function compute({ a, b, ab }) {
    if (ab > Math.min(a, b) + EPS)
      throw new InputError(`P(A ∩ B) tidak boleh lebih besar dari P(A) maupun P(B) (maksimal ${fmt(Math.min(a, b))}).`);
    if (ab < Math.max(0, a + b - 1) - EPS)
      throw new InputError(`P(A ∩ B) terlalu kecil; minimal ${fmt(Math.max(0, a + b - 1))}.`);
    if (b === 0) throw new InputError('P(A|B) tidak terdefinisi karena P(B) = 0.');
    const aGb = ab / b;
    const bGa = a > 0 ? ab / a : null;
    const indep = close(ab, a * b);
    const relation = indep ? 'independen' : aGb > a ? 'positif' : 'negatif';
    return { a, b, ab, aGb, bGa, indep, relation };
  }

  function render(r) {
    const rows = [['P(A|B)', `P(A ∩ B) / P(B) = ${fmt(r.ab)} / ${fmt(r.b)}`, both(r.aGb)]];
    if (r.bGa !== null) rows.push(['P(B|A)', `P(A ∩ B) / P(A) = ${fmt(r.ab)} / ${fmt(r.a)}`, both(r.bGa)]);
    rows.push(['A dan B independen?', 'P(A|B) = P(A)', badge(r.indep)]);
    const tail = {
      independen: 'Karena P(A|B) sama dengan P(A), mengetahui B terjadi <b>tidak mengubah</b> peluang A (A dan B independen).',
      positif: `Mengetahui B terjadi <b>menaikkan</b> peluang A dari ${pct(r.a)} menjadi ${pct(r.aGb)} (hubungan positif).`,
      negatif: `Mengetahui B terjadi <b>menurunkan</b> peluang A dari ${pct(r.a)} menjadi ${pct(r.aGb)} (hubungan negatif).`
    }[r.relation];
    $('outCond').innerHTML = table(rows) + meter(r.aGb) +
      interp(`Jika B sudah diketahui terjadi, peluang A terjadi adalah <b>${pct(r.aGb)}</b>. ${tail}`);
  }

  const run = () => App.safe('outCond', () =>
    render(compute({ a: App.readProb('cA', 'P(A)'), b: App.readProb('cB', 'P(B)'), ab: App.readProb('cAB', 'P(A ∩ B)') })));

  function init() {
    if (!$('formCond')) return;
    App.bindForm('formCond', run);
    App.bindActions({
      'preset-cond': () => { App.setValues({ cA: '0,5', cB: '0,4', cAB: '0,3' }); run(); App.toast('Contoh dimuat: P(A)=0,5 ; P(B)=0,4 ; P(A∩B)=0,3'); },
      'reset-cond': () => App.clearValues(['cA', 'cB', 'cAB'], 'outCond')
    });
  }

  App.modulBCond = { compute, init };
})();