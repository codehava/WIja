# Kaidah Transliterasi Latin ke Aksara Lontara Bugis

## 1. Pengantar Sistem Aksara Lontara Bugis

Aksara Lontara Bugis adalah sistem tulis tradisional suku Bugis (Sulawesi Selatan). Aksara ini termasuk **abugida**, yaitu setiap konsonan dasar memiliki vokal inheren /a/. Vokal lain ditambahkan menggunakan diakritik (tanda vokal).

### Karakteristik Utama:
- **23 aksara dasar** (konsonan + vokal inheren /a/)
- **4 diakritik vokal** untuk mengubah vokal /a/ menjadi /i/, /u/, /e/, /o/
- **1 tanda pembunuh vokal** (pallawa/virama) - opsional, jarang digunakan
- **Tidak ada huruf kapital**
- **Ditulis dari kiri ke kanan**

---

## 2. Tabel Aksara Dasar (Konsonan + Vokal /a/)

| No | Latin | Lontara | Unicode | Nama Aksara |
|----|-------|---------|---------|-------------|
| 1  | ka    | ᨀ       | U+1A00  | ka          |
| 2  | ga    | ᨁ       | U+1A01  | ga          |
| 3  | nga   | ᨂ       | U+1A02  | nga         |
| 4  | ngka  | ᨃ       | U+1A03  | ngka        |
| 5  | pa    | ᨄ       | U+1A04  | pa          |
| 6  | ba    | ᨅ       | U+1A05  | ba          |
| 7  | ma    | ᨆ       | U+1A06  | ma          |
| 8  | mpa   | ᨇ       | U+1A07  | mpa         |
| 9  | ta    | ᨈ       | U+1A08  | ta          |
| 10 | da    | ᨉ       | U+1A09  | da          |
| 11 | na    | ᨊ       | U+1A0A  | na          |
| 12 | nra   | ᨋ       | U+1A0B  | nra         |
| 13 | ca    | ᨌ       | U+1A0C  | ca          |
| 14 | ja    | ᨍ       | U+1A0D  | ja          |
| 15 | nya   | ᨎ       | U+1A0E  | nya         |
| 16 | nca   | ᨏ       | U+1A0F  | nca         |
| 17 | ya    | ᨐ       | U+1A10  | ya          |
| 18 | ra    | ᨑ       | U+1A11  | ra          |
| 19 | la    | ᨒ       | U+1A12  | la          |
| 20 | wa    | ᨓ       | U+1A13  | wa          |
| 21 | sa    | ᨔ       | U+1A14  | sa          |
| 22 | a     | ᨕ       | U+1A15  | a           |
| 23 | ha    | ᨖ       | U+1A16  | ha          |

---

## 3. Tabel Diakritik Vokal

| Vokal | Diakritik | Unicode | Posisi    | Contoh       |
|-------|-----------|---------|-----------|--------------|
| -i    | ᨗ         | U+1A17  | Atas      | ᨀᨗ = ki     |
| -u    | ᨘ         | U+1A18  | Bawah     | ᨀᨘ = ku     |
| -e    | ᨙ         | U+1A19  | Depan     | ᨙᨀ = e + ka = ke (atau ᨀᨙ) |
| -o    | ᨚ         | U+1A1A  | Belakang  | ᨀᨚ = ko     |
| -é/ê  | ᨛ         | U+1A1B  | (variasi) | untuk é/ê    |

### Catatan Penting tentang Vokal /e/:
- Dalam Unicode, diakritik /e/ (U+1A19) ditempatkan **setelah** aksara dasar
- Secara visual, diakritik /e/ muncul di **depan** aksara
- Contoh: `ka + e = ᨀᨙ` secara Unicode, tapi dibaca "ke"

---

## 4. Vokal Mandiri (di Awal Kata)

| Vokal | Penulisan Lontara | Keterangan                    |
|-------|-------------------|-------------------------------|
| a     | ᨕ                 | Aksara "a" mandiri            |
| i     | ᨕᨗ                | Aksara "a" + diakritik i      |
| u     | ᨕᨘ                | Aksara "a" + diakritik u      |
| e     | ᨕᨙ atau ᨙᨕ        | Aksara "a" + diakritik e      |
| o     | ᨕᨚ                | Aksara "a" + diakritik o      |

---

## 5. Algoritma Transliterasi

### 5.1 Langkah-langkah Utama

```
1. Normalisasi input (lowercase, hapus karakter invalid)
2. Tokenisasi menjadi suku kata
3. Untuk setiap suku kata:
   a. Identifikasi konsonan awal (jika ada)
   b. Identifikasi vokal
   c. Petakan ke aksara Lontara + diakritik
4. Gabungkan hasil
```

### 5.2 Aturan Pemetaan Konsonan

```python
KONSONAN_MAP = {
    # Konsonan tunggal
    'k': 'ᨀ',   # ka
    'g': 'ᨁ',   # ga
    'p': 'ᨄ',   # pa
    'b': 'ᨅ',   # ba
    'm': 'ᨆ',   # ma
    't': 'ᨈ',   # ta
    'd': 'ᨉ',   # da
    'n': 'ᨊ',   # na
    'c': 'ᨌ',   # ca
    'j': 'ᨍ',   # ja
    'y': 'ᨐ',   # ya
    'r': 'ᨑ',   # ra
    'l': 'ᨒ',   # la
    'w': 'ᨓ',   # wa
    's': 'ᨔ',   # sa
    'h': 'ᨖ',   # ha
    
    # Konsonan rangkap (harus diproses lebih dulu!)
    'ng': 'ᨂ',  # nga
    'ny': 'ᨎ',  # nya
    'ngk': 'ᨃ', # ngka (prenasalized)
    'mp': 'ᨇ',  # mpa (prenasalized)
    'nr': 'ᨋ',  # nra (prenasalized)
    'nc': 'ᨏ',  # nca (prenasalized)
}
```

### 5.3 Aturan Pemetaan Vokal

```python
VOKAL_MAP = {
    'a': '',      # Vokal inheren, tidak perlu diakritik
    'i': 'ᨗ',     # Diakritik i (U+1A17)
    'u': 'ᨘ',     # Diakritik u (U+1A18)
    'e': 'ᨙ',     # Diakritik e (U+1A19)
    'o': 'ᨚ',     # Diakritik o (U+1A1A)
    'é': 'ᨛ',     # Diakritik é (U+1A1B) - opsional
    'ê': 'ᨛ',     # Sama dengan é
}

VOKAL_MANDIRI = 'ᨕ'  # Aksara "a" (U+1A15)
```

---

## 6. Aturan Khusus dan Edge Cases

### 6.1 Vokal di Awal Kata
```
Jika suku kata dimulai dengan vokal:
- Gunakan aksara "a" (ᨕ) sebagai pembawa
- Tambahkan diakritik vokal jika bukan /a/

Contoh:
- "api"  → ᨕᨄᨗ (a + pi)
- "ikan" → ᨕᨗᨀᨊ (i + ka + na)
- "uang" → ᨕᨘᨕᨂ (u + a + nga)
```

### 6.2 Konsonan Akhir Suku Kata (Coda)
```
Lontara tradisional TIDAK menulis konsonan akhir!

Contoh:
- "makan" → ᨆᨀᨊ (ma-ka-na, bukan ma-kan)
- "pintar" → ᨄᨗᨈᨑ (pi-ta-ra)

Opsi modern: gunakan pallawa (virama) untuk membunuh vokal
- Pallawa: ◌᨞ atau ◌᨟ (jarang digunakan)
```

### 6.3 Konsonan Rangkap
```
Prioritas parsing (dari terpanjang):
1. ngk → ᨃ
2. ng  → ᨂ
3. ny  → ᨎ
4. mp  → ᨇ
5. nr  → ᨋ
6. nc  → ᨏ

Contoh:
- "nganga" → ᨂᨂ (nga + nga)
- "nyanyian" → ᨎᨎᨗᨕᨊ (nya + nyi + a + na)
```

### 6.4 Huruf Latin yang Tidak Ada di Lontara
```
Transliterasi/adaptasi:
- 'f' → 'p' (ᨄ)
- 'v' → 'b' atau 'w' (ᨅ atau ᨓ)
- 'z' → 'j' atau 's' (ᨍ atau ᨔ)
- 'x' → 'ks' (ᨀᨔ)
- 'q' → 'k' (ᨀ)

Atau bisa diabaikan/ditolak dengan pesan error.
```

### 6.5 Vokal Ganda (Diftong)
```
Diftong diperlakukan sebagai dua suku kata:
- "ai" → a + i → ᨕᨕᨗ (a + i)
- "au" → a + u → ᨕᨕᨘ (a + u)

Atau dengan pendekatan lain:
- "ai" → ᨕᨗ (vokal i langsung pada aksara a)
```

### 6.6 Konsonan Geminasi (Dobel)
```
Konsonan dobel ditulis sekali saja:
- "Allah" → ᨕᨒᨖ (a + la + ha)
- "inna" → ᨕᨗᨊ (i + na)
```

---

## 7. Pseudocode Algoritma

```
function transliterasi(text):
    text = lowercase(text)
    text = hapus_karakter_invalid(text)
    
    syllables = tokenize_syllables(text)
    result = ""
    
    for each syllable in syllables:
        result += convert_syllable(syllable)
    
    return result

function convert_syllable(syllable):
    onset = ""      # Konsonan awal
    nucleus = ""    # Vokal
    coda = ""       # Konsonan akhir (diabaikan di Lontara tradisional)
    
    # Parse onset (konsonan rangkap dulu)
    if starts_with(syllable, "ngk"): onset = "ngk"; syllable = syllable[3:]
    else if starts_with(syllable, "ng"): onset = "ng"; syllable = syllable[2:]
    else if starts_with(syllable, "ny"): onset = "ny"; syllable = syllable[2:]
    else if starts_with(syllable, "mp"): onset = "mp"; syllable = syllable[2:]
    else if starts_with(syllable, "nr"): onset = "nr"; syllable = syllable[2:]
    else if starts_with(syllable, "nc"): onset = "nc"; syllable = syllable[2:]
    else if is_consonant(syllable[0]): onset = syllable[0]; syllable = syllable[1:]
    
    # Parse nucleus (vokal)
    if is_vowel(syllable[0]):
        nucleus = syllable[0]
        syllable = syllable[1:]
    else:
        nucleus = "a"  # Default jika tidak ada vokal eksplisit
    
    # Coda diabaikan untuk Lontara tradisional
    
    # Generate output
    if onset == "":
        # Vokal di awal suku kata
        base = VOKAL_MANDIRI  # ᨕ
    else:
        base = KONSONAN_MAP[onset]
    
    if nucleus == "a":
        return base
    else:
        return base + VOKAL_MAP[nucleus]

function tokenize_syllables(text):
    # Pola suku kata bahasa Indonesia/Bugis:
    # (K)(K)V(K) - Konsonan opsional + Vokal + Konsonan opsional
    
    # Gunakan regex atau state machine
    # Pattern: (ng|ny|ngk|mp|nr|nc|[kgpbtdnmcjyrlwsh])?[aiueo](ng|[kgpbtdnmcjyrlwsh])?
    
    return split_by_syllable_pattern(text)
```

---

## 8. Contoh Transliterasi

| Latin       | Suku Kata      | Lontara    | Keterangan                    |
|-------------|----------------|------------|-------------------------------|
| bugis       | bu-gi-sa       | ᨅᨘᨁᨗᨔ      | bu + gi + sa (tanpa konsonan akhir) |
| lontara     | lo-ta-ra       | ᨒᨚᨈᨑ      | lo + ta + ra                  |
| makassar    | ma-ka-sa-ra    | ᨆᨀᨔᨑ      | ma + ka + sa + ra             |
| sulawesi    | su-la-we-si    | ᨔᨘᨒᨓᨙᨔᨗ    | su + la + we + si             |
| indonesia   | i-do-ne-si-a   | ᨕᨗᨉᨚᨊᨙᨔᨗᨕ  | i + do + ne + si + a          |
| selamat     | se-la-ma-ta    | ᨔᨙᨒᨆᨈ     | se + la + ma + ta             |
| pagi        | pa-gi          | ᨄᨁᨗ       | pa + gi                       |
| malam       | ma-la-ma       | ᨆᨒᨆ       | ma + la + ma                  |
| ngopi       | ngo-pi         | ᨂᨚᨄᨗ      | ngo + pi                      |
| nyamuk      | nya-mu-ku      | ᨎᨆᨘᨀᨘ     | nya + mu + ku                 |

---

## 9. Tanda Baca Lontara

| Fungsi          | Simbol | Unicode |
|-----------------|--------|---------|
| Pallawa (koma)  | ᨞      | U+1A1E  |
| Pallawa (titik) | ᨟      | U+1A1F  |

---

## 10. Catatan Implementasi

### 10.1 Unicode Combining
- Diakritik adalah *combining characters*
- Harus ditempatkan setelah aksara dasar dalam string
- Rendering engine akan menggabungkan secara visual

### 10.2 Font Support
- Pastikan sistem/browser mendukung Unicode block: Buginese (U+1A00–U+1A1F)
- Font yang mendukung: Noto Sans Buginese, Aksara Bugis, dll.

### 10.3 Validasi Input
- Hanya terima karakter: a-z, spasi
- Beri opsi untuk handling karakter asing (adaptasi/reject)

### 10.4 Mode Penulisan
- **Tradisional**: Abaikan konsonan akhir suku kata
- **Modern**: Gunakan pallawa untuk konsonan akhir (opsional)

---

## 11. Referensi

1. Unicode Standard - Buginese Block (U+1A00–U+1A1F)
2. Matthes, B.F. (1874). Boegineesche Spraakkunst
3. Noorduyn, J. (1993). A Critical Survey of Studies on the Languages of Sulawesi
4. Wikipedia: Lontara script

---

## 12. Template Kode (Python)

```python
class LontaraTransliterator:
    
    KONSONAN = {
        'ngk': 'ᨃ', 'ng': 'ᨂ', 'ny': 'ᨎ', 'mp': 'ᨇ', 'nr': 'ᨋ', 'nc': 'ᨏ',
        'k': 'ᨀ', 'g': 'ᨁ', 'p': 'ᨄ', 'b': 'ᨅ', 'm': 'ᨆ',
        't': 'ᨈ', 'd': 'ᨉ', 'n': 'ᨊ', 'c': 'ᨌ', 'j': 'ᨍ',
        'y': 'ᨐ', 'r': 'ᨑ', 'l': 'ᨒ', 'w': 'ᨓ', 's': 'ᨔ', 'h': 'ᨖ',
    }
    
    VOKAL = {
        'a': '', 'i': 'ᨗ', 'u': 'ᨘ', 'e': 'ᨙ', 'o': 'ᨚ',
    }
    
    AKSARA_A = 'ᨕ'
    
    def transliterasi(self, text: str) -> str:
        text = text.lower()
        syllables = self._tokenize(text)
        return ''.join(self._convert(s) for s in syllables)
    
    def _tokenize(self, text: str) -> list:
        import re
        pattern = r'(ngk|ng|ny|mp|nr|nc|[kgpbtdnmcjyrlwsh])?([aiueo])(ng|[kgpbtdnmcjyrlwsh])?'
        return re.findall(pattern, text)
    
    def _convert(self, syllable: tuple) -> str:
        onset, nucleus, coda = syllable
        
        if onset:
            base = self.KONSONAN.get(onset, '')
        else:
            base = self.AKSARA_A
        
        vokal = self.VOKAL.get(nucleus, '')
        
        return base + vokal

# Penggunaan
trans = LontaraTransliterator()
print(trans.transliterasi("bugis"))      # ᨅᨘᨁᨗᨔ
print(trans.transliterasi("selamat"))    # ᨔᨙᨒᨆᨈ
```

---

*Dokumen ini disusun sebagai panduan teknis untuk implementasi engine transliterasi Latin ke Lontara Bugis.*
