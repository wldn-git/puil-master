# ⚡ PUIL Master — Asisten & Kalkulator Instalasi Listrik SNI PUIL

Aplikasi web interaktif modern untuk mempermudah pemakaian, perhitungan, dan pemahaman **PUIL (Persyaratan Umum Instalasi Listrik)** berdasarkan standar resmi **SNI 0225:2020 (PUIL 2020)** dan **PUIL 2011** (Dirjen Ketenagalistrikan Kementerian ESDM / BSN).

![License](https://img.shields.io/badge/Standar-SNI%200225%3A2020-amber)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20Ready-black?logo=vercel)

---

## ✨ Fitur Utama

1. **⚡ Kalkulator KHA & Ukuran Penampang Kabel ($mm^2$)**
   - Mendukung sistem 1-Fasa (220V) dan 3-Fasa (380V).
   - Perhitungan Arus Beban ($I_b$), Kuat Hantar Arus izin ($I_z$), dan rekomendasi rating MCB ($I_n$).
   - Faktor koreksi suhu lingkungan dan jumlah sirkit berkas (Grouping factor) sesuai **Tabel 52-C1 PUIL**.
   - Perhitungan susut tegangan (*voltage drop* $\Delta V$) dengan auto-upsize kabel jika $\Delta V > 4\%$.
   - **Diagram Garis Tunggal (SLD)** interaktif dengan visualisasi jalur daya real-time.

2. **🔌 Proteksi Pemutus Sirkit (MCB & GPAS / RCD / ELCB)**
   - Simulator interaktif respon kurva trip MCB:
     - **Kurva B:** $3 - 5 \times I_n$ (pemanas/beban resistif).
     - **Kurva C:** $5 - 10 \times I_n$ (standar rumah tinggal & beban umum).
     - **Kurva D:** $10 - 20 \times I_n$ (motor industri & inrush besar).
   - Panduan kewajiban Gawai Proteksi Arus Sisa (GPAS/RCD):
     - **30 mA:** Wajib PUIL untuk seluruh stop kontak demi keselamatan nyawa manusia dari sentuh langsung.
     - **10 mA:** Area sangat basah (sauna, kolam renang, jacuzzi).
     - **300 mA:** Proteksi bahaya kebakaran isolasi gedung.

3. **🌐 Kalkulator Tahanan Pembumian (*Grounding*)**
   - Perhitungan tahanan pasak elektroda ($R$) berdasarkan resistivitas jenis tanah ($\rho$).
   - Pilihan panjang dan diameter batang elektroda tembaga.
   - Perhitungan elektroda paralel otomatis jika belum mencapai target aman PUIL ($\le 5\ \Omega$).

4. **🎨 Panduan Visual & Kode Warna Kabel SNI PUIL**
   - Komparasi visual warna penghantar **Standar Baru (PUIL 2011/2020)** vs **Standar Lama (PUIL 2000)** untuk sistem 1-fasa dan 3-fasa.
   - Panduan Zonasi Area Basah Kamar Mandi (Zona 0, 1, 2) sesuai PUIL Bagian 701 beserta syarat rating IP (*Ingress Protection*) dan tegangan aman SELV 12V.
   - Matriks kode proteksi IP (IP20, IP44, IP65, IP67, IP68).

5. **📑 Kamus & Referensi Cepat Pasal PUIL**
   - Pencarian instan pasal dan aturan penting PUIL (ketinggian sakelar, batas uji megger isolasi $0.5\ \text{M}\Omega$, penampang minimal stop kontak 2.5 $mm^2$, dll).

6. **📋 Checklist Audit Kelaikan Instalasi Listrik**
   - Formulir periksa kelaikan dengan skor kelulusan (%) otomatis dan deteksi syarat kritis keselamatan (SLO compliance).
   - Siap cetak atau diekspor ke PDF (*Print to PDF*).

---

## 🚀 Menjalankan di Lokal (Development)

Pastikan sudah terinstal **Node.js** (v18+).

```bash
# 1. Masuk ke folder proyek
cd "PUIL App"

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka URL lokal yang muncul (biasanya `http://localhost:5173`) di browser.

---

## 📦 Siapkan untuk Upload ke GitHub

Jalankan perintah berikut di terminal:

```bash
# 1. Periksa status git
git status

# 2. Tambahkan semua file proyek ke git
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi aplikasi PUIL Master lengkap dengan kalkulator dan panduan"

# 4. Ganti branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (ganti URL di bawah dengan repo Anda)
git remote add origin https://github.com/USERNAME_ANDA/puil-master.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## 🌐 Cara Deploy ke Vercel

### Metode 1: Lewat Dashboard Web Vercel (Paling Mudah & Otomatis)
1. Buka [https://vercel.com](https://vercel.com) dan login (disarankan pakai akun GitHub).
2. Klik tombol **"Add New..."** -> **"Project"**.
3. Pilih repository `puil-master` yang sudah Anda push ke GitHub.
4. Pengaturan framework akan otomatis terdeteksi sebagai **Vite**.
5. Klik **"Deploy"**.
6. Dalam hitungan detik, aplikasi Anda sudah live dengan domain gratis seperti `puil-master.vercel.app`.

### Metode 2: Lewat Vercel CLI (Dari Terminal)
```bash
# Instal Vercel CLI (jika belum)
npm i -g vercel

# Login dan deploy
vercel
```
Ikuti instruksi singkat di terminal (tekan `Enter` untuk opsi default).

---

## 📚 Landasan Regulasi & Referensi
- **SNI 0225:2020** — Persyaratan Umum Instalasi Listrik 2020 (PUIL 2020).
- **PUIL 2011** — Standar Nasional Indonesia SNI 0225:2011.
- **IEC 60364** — *Low-voltage electrical installations*.
- **SNI IEC 60898** — Pemutus Sirkit untuk Proteksi Arus Lebih Rumah Tangga (MCB).
