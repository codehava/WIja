# Kaidah Transliterasi Latin ke Aksara Lontara Bugis
## Pedoman Praktis Berbasis Pelafalan Fonetis (Tervalidasi v3)

---

> **⚠️ CATATAN PENTING**
> 
> Dokumen ini merupakan **pedoman praktis hasil adaptasi** berdasarkan prinsip dasar sistem abugida Lontara, **bukan pedoman resmi** dari lembaga pemerintah atau akademis. Kaidah ini disusun untuk keperluan implementasi engine transliterasi nama Latin/asing ke aksara Lontara dengan pendekatan **fonetis (berbasis pelafalan)**.

---

## Daftar Isi

1. [Prinsip Dasar](#1-prinsip-dasar)
2. [Tabel Aksara](#2-tabel-aksara)
3. [Aturan Konsonan Akhir Kata](#3-aturan-konsonan-akhir-kata)
4. [Aturan Kluster Konsonan](#4-aturan-kluster-konsonan)
5. [Aturan Vokal](#5-aturan-vokal)
6. [Penanganan Huruf Asing](#6-penanganan-huruf-asing)
7. [Contoh Transliterasi Tervalidasi](#7-contoh-transliterasi-tervalidasi)
8. [Algoritma Transliterasi](#8-algoritma-transliterasi)
9. [Ringkasan Aturan Cepat](#9-ringkasan-aturan-cepat)

---

## 1. Prinsip Dasar

### 1.1 Karakteristik Sistem Abugida

| Karakteristik | Penjelasan |
|---------------|------------|
| Vokal Inheren | Setiap aksara dasar = konsonan + vokal /a/ |
| Diakritik | Vokal lain ditandai dengan diakritik |
| Tanpa Virama | Tidak ada tanda pemati vokal |
| Arah Tulis | Kiri ke kanan |

### 1.2 Prinsip Utama

```
┌─────────────────────────────────────────────────────────────┐
│  PRINSIP INTI: Transliterasi berdasarkan CARA PENGUCAPAN    │
│  (bunyi/fonetis), BUKAN berdasarkan ejaan Latin.            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Tabel Aksara

### 2.1 Aksara Dasar

| Bunyi | Aksara | Unicode | | Bunyi | Aksara | Unicode |
|-------|--------|---------|---|-------|--------|---------|
| ka | ᨀ | U+1A00 | | ja | ᨍ | U+1A0D |
| ga | ᨁ | U+1A01 | | nya | ᨎ | U+1A0E |
| nga | ᨂ | U+1A02 | | nca | ᨏ | U+1A0F |
| ngka | ᨃ | U+1A03 | | ya | ᨐ | U+1A10 |
| pa | ᨄ | U+1A04 | | ra | ᨑ | U+1A11 |
| ba | ᨅ | U+1A05 | | la | ᨒ | U+1A12 |
| ma | ᨆ | U+1A06 | | wa | ᨓ | U+1A13 |
| mpa | ᨇ | U+1A07 | | sa | ᨔ | U+1A14 |
| ta | ᨈ | U+1A08 | | a | ᨕ | U+1A15 |
| da | ᨉ | U+1A09 | | ha | ᨖ | U+1A16 |
| na | ᨊ | U+1A0A | | | | |
| nra | ᨋ | U+1A0B | | | | |
| ca | ᨌ | U+1A0C | | | | |

### 2.2 Diakritik Vokal

| Vokal | Diakritik | Unicode | Contoh |
|-------|-----------|---------|--------|
| /a/ | (inheren) | - | ᨀ = ka |
| /i/ | ◌ᨗ | U+1A17 | ᨀᨗ = ki |
| /u/ | ◌ᨘ | U+1A18 | ᨀᨘ = ku |
| /e/ | ◌ᨙ | U+1A19 | ᨀᨙ = ke |
| /o/ | ◌ᨚ | U+1A1A | ᨀᨚ = ko |

### 2.3 Tanda Baca

| Nama | Simbol | Unicode | Fungsi |
|------|--------|---------|--------|
| Pallawa | ᨞ | U+1A1E | Pemisah (koma) |
| Pallawa Dua | ᨟ | U+1A1F | Akhir kalimat (titik) |

---

## 3. Aturan Konsonan Akhir Kata

### 3.1 Konsonan Akhir yang DIABAIKAN

| Konsonan | Contoh | Hasil |
|----------|--------|-------|
| **n** | Umra**n** | U-me-ra |
| **m** | Isla**m** | I-sa-la |
| **ng** | Uju**ng** | U-ju |
| **l** | Jendera**l** | Je-de-ra |
| **d** | Ahma**d** | A-he-ma |
| **t** | Jum'a**t** | Ju-ma |
| **k** | Raza**k** | Ra-sa |
| **b** | - | - |
| **p** | - | - |
| **g** | - | - |
| **h** | - | - |

### 3.2 Konsonan Akhir yang DAPAT Vokal /a/

| Konsonan | Contoh | Hasil |
|----------|--------|-------|
| **r** | Makassa**r** | Ma-ka-sa-**ra** |
| **s** | Bugi**s** | Bu-gi-**sa** |

---

## 4. Aturan Kluster Konsonan

### 4.1 Kluster yang Konsonan Pertama DIABAIKAN

| Kluster | Contoh | Proses | Hasil |
|---------|--------|--------|-------|
| **mb** | So**mb**a | mb→b | So-ba |
| **mp** | Lo**mp**oa | mp→p | Lo-po-a |
| **nt** | Pi**nt**ar | nt→t | Pi-ta-ra |
| **nd** | Pa**nd**ang | nd→d | Pa-da |
| **ngg** | Mi**ngg**u | ngg→g | Mi-gu |
| **nr** | Sa**nr**ego | nr→r | Sa-re-go |
| **rm** | Sudi**rm**an | rm→m | Su-di-ma |
| **bt** | Sa**bt**u | bt→t | Sa-tu |

**Pola:** Nasal/Sonorant + Obstruent → Nasal/Sonorant diabaikan

### 4.2 Kluster yang Menggunakan Aksara Pranasal

| Kluster | Aksara | Contoh | Hasil |
|---------|--------|--------|-------|
| **nk** / **ngk** | ᨃ (ngka) | Fa**nk**ar | Pa-**ngka**-ra |
| **nc** / **nj** | ᨏ (nca) | A**nj**ing | A-**nci** |

**Catatan:** Gunakan aksara pranasal jika kluster diikuti vokal.

### 4.3 Kluster yang Konsonan Pertama DAPAT Vokal /a/

| Kluster | Contoh | Proses | Hasil |
|---------|--------|--------|-------|
| **lt** | Su**lt**an | lt→la-ta | Su-**la-ta** |
| **bd** | A**bd**ul | bd→ba-du | A-**ba-du**-la |

### 4.4 Kluster yang Konsonan Pertama DAPAT Vokal /e/

| Kluster | Contoh | Proses | Hasil |
|---------|--------|--------|-------|
| **hm** | A**hm**ad | hm→he-ma | A-**he-ma** |
| **mr** | U**mr**an | mr→me-ra | U-**me-ra** |

---

## 5. Aturan Vokal

### 5.1 Vokal di Awal Kata

Gunakan aksara **ᨕ** (a) sebagai pembawa + diakritik jika perlu.

| Vokal | Hasil | Contoh |
|-------|-------|--------|
| a- | ᨕ | **A**hmad → ᨕᨖᨙᨆ |
| i- | ᨕᨗ | **I**slam → ᨕᨗᨔᨒ |
| u- | ᨕᨘ | **U**jung → ᨕᨘᨍᨘ |
| e- | ᨕᨙ | **E**ko → ᨕᨙᨀᨚ |
| o- | ᨕᨚ | **O**pu → ᨕᨚᨄᨘ |

### 5.2 Vokal Berurutan (Diftong/Hiatus)

Vokal berurutan ditulis **TERPISAH** dengan aksara ᨕ.

| Pola | Contoh | Proses | Hasil |
|------|--------|--------|-------|
| ai | F**ai**sal | a-i | Pa-**i**-sa |
| ae | Bawakar**ae**ng | a-e | Ba-wa-ka-ra-**e** |
| au | Al**au**ddin | a-u | A-la-**u**-di |
| oa | Lomp**oa** | o-a | Lo-po-**a** |
| ea | - | e-a | - |

### 5.3 Konsonan Ganda

Konsonan ganda ditulis **SEKALI** saja.

| Pola | Contoh | Hasil |
|------|--------|-------|
| ll | Ba**ll**a | Ba-la |
| pp | Ra**pp**ocini | Ra-po-ci-ni |
| kk | Panaku**kk**ang | Pa-na-ku-ka |
| nn | Mara**nn**u | Ma-ra-nu |
| ss | Maka**ss**ar | Ma-ka-sa-ra |
| dd | Alau**dd**in | A-la-u-di |

---

## 6. Penanganan Huruf Asing

| Huruf | Substitusi | Contoh |
|-------|------------|--------|
| **F** | P | **F**aisal → **P**aisal |
| **V** | B | **V**alid → **B**alid |
| **Z** | S | Ra**z**ak → Ra**s**ak |
| **Q** | K | **Q**uran → **K**uran |
| **X** | KS | E**x**tra → E**ks**tra |

**Catatan:** Z → S (bukan J) berdasarkan contoh Razak → Ra-sa.

---

## 7. Contoh Transliterasi Tervalidasi

### 7.1 Nama Orang

| Latin | Proses | Suku Kata | Lontara |
|-------|--------|-----------|---------|
| Jenderal Sudirman | nd→d, l skip, rm→m, n skip | Je-de-ra Su-di-ma | ᨍᨙᨉᨙᨑ ᨔᨘᨉᨗᨆ |
| Pangeran Diponegoro | ng, n skip, r→ra | Pa-nge-ra Di-po-ne-go-ro | ᨄᨂᨙᨑ ᨉᨗᨄᨚᨊᨙᨁᨚᨑᨚ |
| Sultan Alauddin | lt→la-ta, n skip, dd→d, n skip | Su-la-ta A-la-u-di | ᨔᨘᨒᨈ ᨕᨒᨕᨘᨉᨗ |
| Opu Daeng Risadju | ng skip, dj→j | O-pu Da-e Ri-sa-ju | ᨕᨚᨄᨘ ᨉᨕᨙ ᨑᨗᨔᨍᨘ |
| Tun Abdul Razak | n skip, bd→ba-du, l→la, z→s, k skip | Tu A-ba-du-la Ra-sa | ᨈᨘ ᨕᨅᨉᨘᨒ ᨑᨔ |
| Faisal | f→p, ai→a-i, l skip | Pa-i-sa | ᨄᨕᨗᨔ |
| Muhammad | mm→m, d skip | Mu-ha-ma | ᨆᨘᨖᨆ |
| Ahmad | hm→he-m, d skip | A-he-ma | ᨕᨖᨙᨆ |

### 7.2 Nama Tempat

| Latin | Proses | Suku Kata | Lontara |
|-------|--------|-----------|---------|
| Ujung Pandang | ng skip, nd→d, ng skip | U-ju Pa-da | ᨕᨘᨍᨘ ᨄᨉ |
| Sulawesi | normal | Su-la-we-si | ᨔᨘᨒᨓᨙᨔᨗ |
| Nusantara | nt→t, r→ra | Nu-sa-ta-ra | ᨊᨘᨔᨈᨑ |
| Bawakaraeng | ng skip | Ba-wa-ka-ra-e | ᨅᨓᨀᨑᨕᨙ |
| Makassar | ss→s, r→ra | Ma-ka-sa-ra | ᨆᨀᨔᨑ |
| Somba Opu | mb→b | So-ba O-pu | ᨔᨚᨅ ᨕᨚᨄᨘ |
| Balla Lompoa | ll→l, mp→p | Ba-la Lo-po-a | ᨅᨒ ᨒᨚᨄᨚᨕ |
| Karebosi | normal | Ka-re-bo-si | ᨀᨑᨙᨅᨚᨔᨗ |
| Rappocini | pp→p | Ra-po-ci-ni | ᨑᨄᨚᨌᨗᨊᨗ |
| Panaikang | ng skip | Pa-na-i-ka | ᨄᨊᨕᨗᨀ |
| Panakukkang | kk→k, ng skip | Pa-na-ku-ka | ᨄᨊᨀᨘᨀ |

### 7.3 Nama Hari

| Latin | Proses | Suku Kata | Lontara |
|-------|--------|-----------|---------|
| Jum'at | t skip | Ju-ma | ᨍᨘᨆ |
| Sabtu | bt→t | Sa-tu | ᨔᨈᨘ |
| Minggu | ngg→g | Mi-gu | ᨆᨗᨁᨘ |

### 7.4 Kata Umum

| Latin | Proses | Suku Kata | Lontara |
|-------|--------|-----------|---------|
| Lontara | nt→t, r→ra | Lo-ta-ra | ᨒᨚᨈᨑ |
| Bugis | s→sa | Bu-gi-sa | ᨅᨘᨁᨗᨔ |
| Bonto | nt→t | Bo-to | ᨅᨚᨈᨚ |
| Marannu | nn→n | Ma-ra-nu | ᨆᨑᨊᨘ |
| Arung Sanrego | ng skip, nr→r | A-ru Sa-re-go | ᨕᨑᨘ ᨔᨑᨙᨁᨚ |

---

## 8. Algoritma Transliterasi

### 8.1 Urutan Prioritas Parsing

```
1. Normalisasi (huruf asing, konsonan ganda, lowercase)
2. Kluster 3 huruf: ngk, ngg
3. Kluster 2 huruf: ng, ny, nk, mp, mb, nt, nd, nc, nj, nr, rm, bt, lt, bd, hm, mr
4. Konsonan tunggal
5. Vokal (mandiri atau sebagai diakritik)
```

### 8.2 Pseudocode

```
FUNGSI transliterasi(teks):
    teks = normalisasi(teks)
    hasil = []
    i = 0
    
    SELAMA i < panjang(teks):
        
        // Cek kluster 3 huruf
        JIKA cocok("ngk"):
            tambah(PRANASAL_NGKA)
            tambah_vokal()
            LANJUT
        JIKA cocok("ngg"):
            // ngg → g (skip ng)
            i += 2
            tambah(KONSONAN["g"])
            tambah_vokal()
            LANJUT
        
        // Cek kluster 2 huruf
        JIKA cocok("ng", "ny") DAN di_akhir_kata():
            skip()
            LANJUT
        JIKA cocok("ng"):
            tambah(NASAL_NGA)
            tambah_vokal()
            LANJUT
        JIKA cocok("ny"):
            tambah(NASAL_NYA)
            tambah_vokal()
            LANJUT
        JIKA cocok("nk"):
            tambah(PRANASAL_NGKA)
            tambah_vokal()
            LANJUT
        JIKA cocok("nc", "nj"):
            tambah(PRANASAL_NCA)
            tambah_vokal()
            LANJUT
        JIKA cocok("mb", "mp", "nt", "nd", "nr", "rm", "bt"):
            skip_pertama()
            tambah(KONSONAN[kedua])
            tambah_vokal()
            LANJUT
        JIKA cocok("lt", "bd"):
            tambah(KONSONAN[pertama])  // dengan vokal /a/
            tambah(KONSONAN[kedua])
            tambah_vokal()
            LANJUT
        JIKA cocok("hm", "mr"):
            tambah(KONSONAN[pertama] + DIAKRITIK_E)
            tambah(KONSONAN[kedua])
            tambah_vokal()
            LANJUT
        
        // Konsonan tunggal
        JIKA adalah_konsonan(karakter):
            JIKA di_akhir_kata():
                JIKA karakter DALAM ['r', 's']:
                    tambah(KONSONAN + vokal_a_inheren)
                LAIN:
                    skip()  // diabaikan
            LAIN:
                tambah(KONSONAN)
                tambah_vokal()
            LANJUT
        
        // Vokal mandiri
        JIKA adalah_vokal(karakter):
            tambah(AKSARA_A + DIAKRITIK)
            LANJUT
    
    KEMBALIKAN gabung(hasil)
```

### 8.3 Peta Karakter

```python
# Konsonan Dasar
KONSONAN = {
    'k': 'ᨀ', 'g': 'ᨁ', 'p': 'ᨄ', 'b': 'ᨅ',
    'm': 'ᨆ', 't': 'ᨈ', 'd': 'ᨉ', 'n': 'ᨊ',
    'c': 'ᨌ', 'j': 'ᨍ', 'y': 'ᨐ', 'r': 'ᨑ',
    'l': 'ᨒ', 'w': 'ᨓ', 's': 'ᨔ', 'h': 'ᨖ',
}

# Nasal & Pranasal
NASAL = { 'ng': 'ᨂ', 'ny': 'ᨎ' }
PRANASAL = { 'ngk': 'ᨃ', 'nk': 'ᨃ', 'nc': 'ᨏ', 'nj': 'ᨏ' }

# Diakritik
DIAKRITIK = { 'i': 'ᨗ', 'u': 'ᨘ', 'e': 'ᨙ', 'o': 'ᨚ' }

# Substitusi
SUBSTITUSI = { 'f': 'p', 'v': 'b', 'z': 's', 'q': 'k' }

# Kluster yang konsonan pertama DIABAIKAN
SKIP_CLUSTER = ['mb', 'mp', 'nt', 'nd', 'nr', 'rm', 'bt', 'ngg']

# Kluster yang konsonan pertama dapat /a/
VOWEL_A_CLUSTER = ['lt', 'bd']

# Kluster yang konsonan pertama dapat /e/
VOWEL_E_CLUSTER = ['hm', 'mr']

# Konsonan akhir yang DIABAIKAN
SKIP_FINAL = ['n', 'm', 'l', 'd', 't', 'k', 'b', 'p', 'g', 'h', 'c', 'j', 'w', 'y']
# + 'ng' (ditangani terpisah)

# Konsonan akhir yang DAPAT /a/
VOWEL_FINAL = ['r', 's']

# Aksara vokal mandiri
AKSARA_A = 'ᨕ'
```

---

## 9. Ringkasan Aturan Cepat

```
┌─────────────────────────────────────────────────────────────────┐
│ ATURAN CEPAT TRANSLITERASI LONTARA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ HURUF ASING:                                                    │
│   F→P, V→B, Z→S, Q→K                                            │
│                                                                 │
│ KONSONAN GANDA:                                                 │
│   mm, ss, ll, dd, kk, nn, pp → ditulis sekali                   │
│                                                                 │
│ KLUSTER - SKIP KONSONAN PERTAMA:                                │
│   mb, mp, nt, nd, ngg, nr, rm, bt → konsonan kedua saja         │
│                                                                 │
│ KLUSTER - GUNAKAN PRANASAL:                                     │
│   nk/ngk → ᨃ (ngka),  nc/nj → ᨏ (nca)                           │
│                                                                 │
│ KLUSTER - DAPAT VOKAL:                                          │
│   lt, bd → dapat /a/,  hm, mr → dapat /e/                       │
│                                                                 │
│ AKHIR KATA - DIABAIKAN:                                         │
│   n, m, ng, l, d, t, k, b, p, g, h, c, j, w, y                   │
│                                                                 │
│ AKHIR KATA - DAPAT /a/:                                         │
│   r, s                                                          │
│                                                                 │
│ VOKAL BERURUTAN:                                                │
│   ai, ae, au, oa, dll → dipisah dengan aksara ᨕ                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Changelog

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 2025-01-01 | Dokumen awal |
| 2.0 | 2025-01-01 | Validasi aturan dasar |
| 3.0 | 2025-01-01 | Update dari contoh PDF: aturan kluster mb/mp/rm/bt/ngg/nr, konsonan akhir t/k, vokal berurutan, Z→S |

---

*Dokumen ini disusun berdasarkan analisis contoh transliterasi yang tervalidasi.*
