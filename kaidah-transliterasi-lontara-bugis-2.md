# Kaidah Transliterasi Latin ke Aksara Lontara Bugis
## Pedoman Praktis Berbasis Pelafalan Fonetis (Tervalidasi)

---

> **⚠️ CATATAN PENTING**
> 
> Dokumen ini merupakan **pedoman praktis hasil adaptasi** berdasarkan prinsip dasar sistem abugida Lontara, **bukan pedoman resmi** dari lembaga pemerintah atau akademis. Kaidah ini disusun untuk keperluan implementasi engine transliterasi nama Latin/asing ke aksara Lontara dengan pendekatan **fonetis (berbasis pelafalan)**.

---

## Daftar Isi

1. [Prinsip Dasar Aksara Lontara](#1-prinsip-dasar-aksara-lontara)
2. [Tabel Aksara Dasar](#2-tabel-aksara-dasar)
3. [Tabel Diakritik Vokal](#3-tabel-diakritik-vokal)
4. [Aturan Transliterasi](#4-aturan-transliterasi)
5. [Penanganan Huruf Asing](#5-penanganan-huruf-asing)
6. [Contoh Transliterasi Tervalidasi](#6-contoh-transliterasi-tervalidasi)
7. [Algoritma Transliterasi](#7-algoritma-transliterasi)
8. [Tanda Baca](#8-tanda-baca)

---

## 1. Prinsip Dasar Aksara Lontara

### 1.1 Karakteristik Sistem Abugida

| Karakteristik | Penjelasan |
|---------------|------------|
| Vokal Inheren | Setiap aksara dasar = konsonan + vokal /a/ |
| Diakritik | Vokal lain (/i/, /u/, /e/, /o/, /ə/) ditandai dengan diakritik |
| Tanpa Virama | Tidak memiliki tanda pemati vokal (tidak ada "huruf mati") |
| Arah Tulis | Kiri ke kanan |

### 1.2 Prinsip Utama Transliterasi

```
┌─────────────────────────────────────────────────────────────┐
│  PRINSIP INTI: Transliterasi berdasarkan CARA PENGUCAPAN    │
│  (bunyi/fonetis), BUKAN berdasarkan ejaan Latin.            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tabel Aksara Dasar

### 2.1 Aksara Dasar (23 Huruf)

| No | Bunyi | Aksara | Unicode | Catatan |
|----|-------|--------|---------|---------|
| 1 | ka | ᨀ | U+1A00 | |
| 2 | ga | ᨁ | U+1A01 | |
| 3 | nga | ᨂ | U+1A02 | Nasal |
| 4 | ngka | ᨃ | U+1A03 | Pranasal (Bugis) |
| 5 | pa | ᨄ | U+1A04 | |
| 6 | ba | ᨅ | U+1A05 | |
| 7 | ma | ᨆ | U+1A06 | |
| 8 | mpa | ᨇ | U+1A07 | Pranasal (Bugis) |
| 9 | ta | ᨈ | U+1A08 | |
| 10 | da | ᨉ | U+1A09 | |
| 11 | na | ᨊ | U+1A0A | |
| 12 | nra | ᨋ | U+1A0B | Pranasal (Bugis) |
| 13 | ca | ᨌ | U+1A0C | |
| 14 | ja | ᨍ | U+1A0D | |
| 15 | nya | ᨎ | U+1A0E | Nasal |
| 16 | nca | ᨏ | U+1A0F | Pranasal (Bugis) |
| 17 | ya | ᨐ | U+1A10 | |
| 18 | ra | ᨑ | U+1A11 | |
| 19 | la | ᨒ | U+1A12 | |
| 20 | wa | ᨓ | U+1A13 | |
| 21 | sa | ᨔ | U+1A14 | |
| 22 | a | ᨕ | U+1A15 | Vokal mandiri |
| 23 | ha | ᨖ | U+1A16 | Pengaruh Arab |

### 2.2 Aksara Nasal

| Aksara | Bunyi | Unicode | Pola Latin |
|--------|-------|---------|------------|
| ᨂ | nga | U+1A02 | ng + vokal |
| ᨎ | nya | U+1A0E | ny + vokal |

### 2.3 Aksara Pranasal (Khusus Bugis)

| Aksara | Bunyi | Unicode | Pola Latin |
|--------|-------|---------|------------|
| ᨃ | ngka | U+1A03 | ngk, nk |
| ᨇ | mpa | U+1A07 | mp |
| ᨋ | nra | U+1A0B | nr |
| ᨏ | nca | U+1A0F | nc, nj |

---

## 3. Tabel Diakritik Vokal

| Vokal | Diakritik | Unicode | Contoh |
|-------|-----------|---------|--------|
| /a/ | (inheren) | - | ᨀ = ka |
| /i/ | ◌ᨗ | U+1A17 | ᨀᨗ = ki |
| /u/ | ◌ᨘ | U+1A18 | ᨀᨘ = ku |
| /e/ | ᨙ◌ | U+1A19 | ᨀᨙ = ke |
| /o/ | ◌ᨚ | U+1A1A | ᨀᨚ = ko |
| /ə/ | ◌ᨛ | U+1A1B | ᨀᨛ = kə (pepet) |

**Catatan:** Dalam Unicode, diakritik ditulis **SETELAH** aksara dasar.

---

## 4. Aturan Transliterasi

### 4.1 Aturan Konsonan Akhir Kata

| Konsonan Akhir | Perlakuan | Contoh |
|----------------|-----------|--------|
| **n** | Diabaikan | Umra**n** → U-me-ra |
| **m** | Diabaikan | Ahma**d** → A-he-ma |
| **ng** | Diabaikan | Uju**ng** → U-ju |
| **l** | Diabaikan | Jendera**l** → Je-de-ra |
| **r, s, t, k, p, b, d, dll** | Dapat vokal /a/ | Bugi**s** → Bu-gi-sa |

### 4.2 Aturan Kluster Konsonan

#### A. Nasal + Konsonan Stop → Nasal Diabaikan

| Kluster | Perlakuan | Contoh |
|---------|-----------|--------|
| n + t | n diabaikan | Pi**nt**ar → Pi-**t**a-ra |
| n + d | n diabaikan | Pa**nd**ang → Pa-**d**a |
| n + k | Gunakan pranasal ᨃ | Fa**nk**ar → Pa-**ngk**a-ra |
| n + c | Gunakan pranasal ᨏ | A**nc**a → A-**nc**a |
| m + p | Gunakan pranasal ᨇ | A**mp**ar → A-**mp**a-ra |
| n + j | Gunakan pranasal ᨏ | A**nj**ing → A-**nc**i |

#### B. Konsonan + Konsonan Lain → Konsonan Pertama Dapat /e/

| Kluster | Perlakuan | Contoh |
|---------|-----------|--------|
| m + r | m dapat /e/ | U**mr**an → U-**me**-ra |
| h + m | h dapat /e/ | A**hm**ad → A-**he**-ma |

### 4.3 Aturan Vokal

| Situasi | Aturan | Contoh |
|---------|--------|--------|
| Vokal di awal kata | Gunakan aksara ᨕ + diakritik | **I**ka → ᨕᨗᨀ |
| Vokal setelah konsonan | Gunakan diakritik | k**i** → ᨀᨗ |
| Vokal inheren /a/ | Tidak perlu diakritik | k**a** → ᨀ |

### 4.4 Aturan Konsonan Ganda

| Situasi | Aturan | Contoh |
|---------|--------|--------|
| Konsonan ganda (mm, ss, ll, dll) | Ditulis sekali | Muha**mm**ad → Mu-ha-ma |

---

## 5. Penanganan Huruf Asing

| Huruf Latin | Substitusi | Aksara | Alasan |
|-------------|------------|--------|--------|
| F | P | ᨄ | Bunyi terdekat |
| V | B | ᨅ | Bunyi terdekat |
| Z | J | ᨍ | Bunyi terdekat |
| Q | K | ᨀ | Bunyi sama |
| X | KS | ᨀᨔ | Dipecah |

---

## 6. Contoh Transliterasi Tervalidasi

### 6.1 Tabel Contoh Lengkap

| Nama | Proses | Suku Kata | Lontara |
|------|--------|-----------|---------|
| Fankar | f→p, nk→ngka | Pa-ngka-ra | ᨄᨃᨑ |
| Umran | mr→me-r, n akhir skip | U-me-ra | ᨕᨘᨆᨙᨑ |
| Pintar | nt→t, r→ra | Pi-ta-ra | ᨄᨗᨈᨑ |
| Ahmad | hm→he-m, d akhir skip | A-he-ma | ᨕᨖᨙᨆ |
| Muhammad | mm→m, d akhir skip | Mu-ha-ma | ᨆᨘᨖᨆ |
| Makassar | ss→s, r→ra | Ma-ka-sa-ra | ᨆᨀᨔᨑ |
| Bugis | s→sa | Bu-gi-sa | ᨅᨘᨁᨗᨔ |
| Ujung Pandang | ng akhir skip, nd→d, ng akhir skip | U-ju Pa-da | ᨕᨘᨍᨘ ᨄᨉ |
| Jenderal | nd→d, l akhir skip | Je-de-ra | ᨍᨙᨉᨙᨑ |

### 6.2 Detail Breakdown

#### Fankar → ᨄᨃᨑ
```
F  a  n  k  a  r
│  │  └──┬──┘  │
p  a   ngka    ra
│  │     │     │
ᨄ  -    ᨃ     ᨑ
   (inheren)
```

#### Ujung Pandang → ᨕᨘᨍᨘ ᨄᨉ
```
U  j  u  ng    P  a  n  d  a  ng
│  │  │  │     │  │  │  │  │  │
│  └──┘  │     │  │  └──┘  │  │
U   ju  skip   Pa   (skip) da skip
│    │         │           │
ᨕᨘ   ᨍᨘ        ᨄ           ᨉ
```

#### Jenderal → ᨍᨙᨉᨙᨑ
```
J  e  n  d  e  r  a  l
│  │  │  │  │  │  │  │
└──┘  │  └──┘  └──┘  │
 Je  skip de   ra   skip
 │        │    │
 ᨍᨙ       ᨉᨙ   ᨑ
```

---

## 7. Algoritma Transliterasi

### 7.1 Urutan Prioritas Parsing

```
1. Kluster 3 huruf: ngk → ᨃ
2. Kluster 2 huruf: 
   - Pranasal: nk, mp, nr, nc, nj
   - Nasal: ng, ny
3. Konsonan tunggal
4. Vokal mandiri
```

### 7.2 Pseudocode

```
FUNGSI transliterasi(teks):
    teks = normalisasi(teks)
    hasil = []
    i = 0
    
    SELAMA i < panjang(teks):
        
        // 1. Cek pranasal 3 huruf (ngk)
        JIKA cocok("ngk"):
            tambah(PRANASAL["ngk"])
            tambah_vokal_jika_ada()
            LANJUT
        
        // 2. Cek pranasal/nasal 2 huruf
        JIKA cocok("nk", "mp", "nr", "nc", "nj"):
            tambah(PRANASAL[...])
            tambah_vokal_jika_ada()
            LANJUT
            
        JIKA cocok("ng", "ny"):
            JIKA di_akhir_kata():
                skip()  // diabaikan
            LAIN:
                tambah(NASAL[...])
                tambah_vokal_jika_ada()
            LANJUT
        
        // 3. Cek konsonan tunggal
        JIKA adalah_konsonan(karakter):
            JIKA diikuti_vokal():
                tambah(KONSONAN + DIAKRITIK)
            LAIN JIKA diikuti_konsonan():
                JIKA nasal_sebelum_stop():  // n+t, n+d, dll
                    skip()  // nasal diabaikan
                LAIN:
                    tambah(KONSONAN + diakritik_e)  // dapat /e/
            LAIN JIKA di_akhir_kata():
                JIKA adalah_nasal_atau_l():  // n, m, ng, l
                    skip()  // diabaikan
                LAIN:
                    tambah(KONSONAN)  // dapat /a/ inheren
            LANJUT
        
        // 4. Cek vokal mandiri
        JIKA adalah_vokal(karakter):
            tambah(AKSARA_A + DIAKRITIK)
            LANJUT
    
    KEMBALIKAN gabung(hasil)
```

### 7.3 Peta Karakter (untuk implementasi)

```python
# Konsonan Dasar
KONSONAN = {
    'k': 'ᨀ', 'g': 'ᨁ', 'p': 'ᨄ', 'b': 'ᨅ',
    'm': 'ᨆ', 't': 'ᨈ', 'd': 'ᨉ', 'n': 'ᨊ',
    'c': 'ᨌ', 'j': 'ᨍ', 'y': 'ᨐ', 'r': 'ᨑ',
    'l': 'ᨒ', 'w': 'ᨓ', 's': 'ᨔ', 'h': 'ᨖ',
}

# Nasal
NASAL = {
    'ng': 'ᨂ',
    'ny': 'ᨎ',
}

# Pranasal
PRANASAL = {
    'ngk': 'ᨃ',
    'nk': 'ᨃ',
    'mp': 'ᨇ',
    'nr': 'ᨋ',
    'nc': 'ᨏ',
    'nj': 'ᨏ',
}

# Diakritik
DIAKRITIK = {
    'i': 'ᨗ',
    'u': 'ᨘ',
    'e': 'ᨙ',
    'o': 'ᨚ',
    'ə': 'ᨛ',
}

# Substitusi huruf asing
SUBSTITUSI = {
    'f': 'p',
    'v': 'b',
    'z': 'j',
    'q': 'k',
}

# Aksara vokal mandiri
AKSARA_A = 'ᨕ'

# Konsonan akhir yang diabaikan
SKIP_AKHIR = ['n', 'm', 'l']  # + 'ng' (ditangani terpisah)

# Konsonan stop (untuk aturan nasal + stop)
KONSONAN_STOP = ['t', 'd', 'k', 'g', 'p', 'b', 'c', 'j', 's']
```

---

## 8. Tanda Baca

| Nama | Simbol | Unicode | Fungsi |
|------|--------|---------|--------|
| Pallawa | ᨞ | U+1A1E | Pemisah (seperti koma) |
| Pallawa Dua | ᨟ | U+1A1F | Pemisah bab/akhir (seperti titik) |

---

## Ringkasan Aturan Cepat

```
┌────────────────────────────────────────────────────────────────┐
│ ATURAN CEPAT TRANSLITERASI LONTARA                             │
├────────────────────────────────────────────────────────────────┤
│ 1. Huruf asing: F→P, V→B, Z→J, Q→K                             │
│ 2. Konsonan ganda: ditulis sekali (mm→m, ss→s)                 │
│ 3. Kluster nk/ngk, mp, nc/nj, nr: gunakan aksara pranasal      │
│ 4. Nasal (n,m) + stop (t,d,k,p,b,c,j,s): nasal diabaikan       │
│ 5. Konsonan + konsonan lain: konsonan pertama dapat /e/        │
│ 6. Akhir kata n, m, ng, l: diabaikan                           │
│ 7. Akhir kata r, s, t, k, dll: dapat vokal /a/                 │
│ 8. Vokal di awal: gunakan aksara ᨕ + diakritik                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Sumber Referensi

| Sumber | Keterangan |
|--------|------------|
| Wikipedia Indonesia | Aksara Lontara |
| Balai Bahasa Sulawesi Selatan | Dokumentasi resmi |
| Unicode Consortium | Buginese Block (U+1A00–U+1A1F) |
| Prof. Nurhayati Rahman (Unhas) | Penelitian aksara Lontara |

---

## Changelog

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 2025-01-01 | Dokumen awal |
| 2.0 | 2025-01-01 | Validasi aturan: Fankar, Umran, Muhammad, Makassar, Bugis, Ujung Pandang, Jenderal |

---

*Dokumen ini disusun untuk keperluan implementasi engine transliterasi Latin ke Lontara Bugis.*
