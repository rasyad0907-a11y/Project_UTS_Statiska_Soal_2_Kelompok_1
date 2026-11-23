# Kalkulator Probabilitas & Teorema Bayes

Aplikasi web interaktif untuk menghitung dan memahami konsep probabilitas dasar, probabilitas bersyarat, serta Teorema Bayes. Proyek ini dibuat sebagai bagian dari UTS Statistika – Soal 2.

Aplikasi dirancang dengan tampilan responsif, perhitungan otomatis, visualisasi, dan interpretasi hasil agar pengguna lebih mudah memahami konsep probabilitas dalam kehidupan sehari-hari.

**Website:** https://rasyad0907-a11y.github.io/Project_UTS_Statiska_Soal_2_Kelompok_1/pages/probabilitas.html

---

## Anggota Kelompok 1

| No. | NIM | Nama Anggota |
|:---:|:---:|---|
| 1 | 2503010024 | Riyad Hiyan Arizki |
| 2 | 2503010025 | Muhammad Rasyad Mubarok |
| 3 | 2503010035 | Wafik Muhammad Almajdi |
| 4 | 2503010051 | Reva Nur Budiman |
| 5 | 2503010132 | Allya Hericka Putri |

---

## Fitur Utama

### Modul A – Probabilitas Dasar

Menyediakan perhitungan beberapa konsep dasar dalam teori probabilitas:

- **Probabilitas Tunggal:** Menghitung peluang suatu kejadian berdasarkan jumlah kejadian dan ruang sampel.
- **Komplemen:** Menghitung peluang suatu kejadian tidak terjadi.
- **Gabungan (Union):** Menghitung peluang kejadian A atau B terjadi.
- **Irisan (Intersection):** Menghitung peluang dua kejadian terjadi secara bersamaan.
- **Kejadian Saling Lepas:** Menghitung probabilitas dua kejadian yang tidak dapat terjadi bersamaan.
- **Kejadian Independen:** Menghitung probabilitas dua kejadian yang tidak saling memengaruhi.
- **Diagram Venn:** Menampilkan visualisasi hubungan antara dua kejadian.

### Modul B – Probabilitas Bersyarat & Teorema Bayes

Membahas probabilitas dengan informasi atau kondisi tambahan:

- **Probabilitas Bersyarat:** Menghitung peluang suatu kejadian berdasarkan kejadian lain yang telah terjadi.
- **Teorema Bayes:** Menghitung probabilitas berdasarkan informasi atau bukti yang tersedia.
- **Probabilitas Total:** Menghitung peluang keseluruhan suatu bukti.
- **Simulasi Filter Phishing:** Menampilkan simulasi pendeteksian email phishing berdasarkan sensitivitas, prevalensi, dan false positive.
- **Visualisasi 10.000 Email:** Menampilkan ilustrasi hasil deteksi dalam bentuk kotak-kotak visual.
- **Analisis Prevalensi:** Memperlihatkan pengaruh perubahan prevalensi terhadap hasil probabilitas Bayes.

---

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Membuat struktur halaman web |
| CSS3 | Mengatur tampilan, desain, dan responsivitas |
| JavaScript | Mengolah perhitungan dan interaksi aplikasi |
| SVG | Membuat visualisasi Diagram Venn |
| GitHub Pages | Hosting aplikasi agar dapat diakses secara online |

Aplikasi dibuat menggunakan Vanilla JavaScript tanpa framework atau library eksternal untuk proses perhitungan.

---

## Struktur Folder

```text
Project_UTS_Statiska_Soal_2_Kelompok_1/
│
├── index.html
├── README.md
│
├── pages/
│   ├── probabilitas.html
│   ├── modul-a.html
│   └── modul-b.html
│
└── assets/
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── utils.js
        ├── main.js
        ├── modul-a.js
        ├── modul-b-conditional.js
        └── modul-b-bayes.js
```

---

## Penjelasan File JavaScript

| File | Fungsi |
|---|---|
| `utils.js` | Menyediakan fungsi umum seperti format angka, parsing probabilitas, tabel hasil, notifikasi, dan validasi input. |
| `main.js` | Mengatur navigasi aktif, perpindahan tab, dan inisialisasi modul. |
| `modul-a.js` | Mengelola perhitungan probabilitas dasar, komplemen, gabungan, irisan, dan Diagram Venn. |
| `modul-b-conditional.js` | Mengelola perhitungan probabilitas bersyarat. |
| `modul-b-bayes.js` | Mengelola perhitungan Teorema Bayes dan simulasi filter phishing. |

---

## Rumus yang Digunakan

### 1. Probabilitas Dasar

Peluang suatu kejadian:

$$P(A)=\\frac{n(A)}{n(S)}$$

Komplemen:

$$P(A')=1-P(A)$$

### 2. Gabungan Dua Kejadian

$$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$$

### 3. Kejadian Independen

$$P(A\\cap B)=P(A)\\times P(B)$$

### 4. Probabilitas Bersyarat

$$P(A|B)=\\frac{P(A\\cap B)}{P(B)}$$

### 5. Teorema Bayes

$$P(H|E)=\\frac{P(E|H)\\times P(H)}{P(E)}$$

Dengan probabilitas total:

$$P(E)=P(E|H)P(H)+P(E|H')P(H')$$

---

## Cara Menjalankan

Aplikasi dapat dijalankan secara langsung melalui browser tanpa instalasi framework atau server khusus.

1. Download atau clone repository ini.
2. Ekstrak folder proyek jika diunduh dalam format ZIP.
3. Buka folder proyek menggunakan Visual Studio Code.
4. Jalankan file `index.html` menggunakan browser.
5. Pilih modul probabilitas yang ingin digunakan.

Aplikasi juga telah di-hosting menggunakan GitHub Pages sehingga dapat diakses secara online melalui link berikut:

**https://rasyad0907-a11y.github.io/Project_UTS_Statiska_Soal_2_Kelompok_1/pages/probabilitas.html**

---

## Fitur Tambahan

- Tampilan responsif untuk desktop dan perangkat mobile.
- Navigasi antarhalaman.
- Tab untuk berpindah antara Modul A dan Modul B.
- Input probabilitas mendukung format desimal koma, desimal titik, dan persentase.
- Validasi input untuk mencegah perhitungan yang tidak sesuai.
- Tombol contoh soal dan reset perhitungan.
- Hasil perhitungan dilengkapi rumus dan interpretasi.
- Visualisasi hasil untuk membantu pemahaman materi.

---

## Tujuan Pembuatan

Proyek ini bertujuan untuk membantu proses pembelajaran Statistika, khususnya materi probabilitas dan Teorema Bayes, melalui aplikasi web yang interaktif dan mudah digunakan.

---

**Project UTS Statistika – Soal 2**  
**Kelompok 1**  
Program Studi Teknik Informatika
