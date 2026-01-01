import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// WIJA - WARISAN JEJAK KELUARGA
// Demo Aplikasi Pohon Keluarga Digital dengan Aksara Lontara
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// KONFIGURASI AKSARA LONTARA
// ─────────────────────────────────────────────────────────────────────────────────

const LONTARA_CONFIG = {
  consonantBase: {
    'k': 'ᨀ', 'g': 'ᨁ', 'ng': 'ᨂ',
    'p': 'ᨄ', 'b': 'ᨅ', 'm': 'ᨆ',
    't': 'ᨈ', 'd': 'ᨉ', 'n': 'ᨊ',
    'c': 'ᨌ', 'j': 'ᨍ', 'ny': 'ᨎ',
    'y': 'ᨐ', 'r': 'ᨑ', 'l': 'ᨒ', 'w': 'ᨓ',
    's': 'ᨔ', 'h': 'ᨖ'
  },
  vowels: {
    'a': 'ᨕ', 'i': 'ᨕᨗ', 'u': 'ᨕᨘ', 'e': 'ᨕᨙ', 'o': 'ᨕᨚ'
  },
  vowelMarkers: {
    'i': 'ᨗ', 'u': 'ᨘ', 'e': 'ᨙ', 'o': 'ᨚ'
  },
  clusters: {
    'ngk': 'ᨃ', 'mp': 'ᨇ', 'nr': 'ᨋ', 'nc': 'ᨏ'
  },
  foreignLetters: {
    'f': { lontara: 'ᨄ', base: 'p', desc: 'F → PA' },
    'v': { lontara: 'ᨅ', base: 'b', desc: 'V → BA' },
    'z': { lontara: 'ᨍ', base: 'j', desc: 'Z → JA' },
    'x': { lontara: 'ᨀᨔ', base: 'ks', desc: 'X → KS' },
    'q': { lontara: 'ᨀ', base: 'k', desc: 'Q → KA' },
    'sy': { lontara: 'ᨔ', base: 's', desc: 'SY → SA' },
    'kh': { lontara: 'ᨖ', base: 'h', desc: 'KH → HA' },
    'gh': { lontara: 'ᨁ', base: 'g', desc: 'GH → GA' },
    'th': { lontara: 'ᨈ', base: 't', desc: 'TH → TA' },
    'dh': { lontara: 'ᨉ', base: 'd', desc: 'DH → DA' },
    'ts': { lontara: 'ᨌ', base: 'c', desc: 'TS → CA' }
  },
  punctuation: { '.': '᨞', ',': '᨟', ' ': ' ' }
};

// ─────────────────────────────────────────────────────────────────────────────────
// ENGINE TRANSLITERASI
// ─────────────────────────────────────────────────────────────────────────────────

function transliterateLatin(text) {
  if (!text) return { lontara: '', details: [] };
  
  const input = text.toLowerCase();
  let result = '';
  const details = [];
  let i = 0;

  while (i < input.length) {
    const remaining = input.slice(i);
    let matched = false;

    // 1. Clusters (3 chars)
    for (const [cluster, lontara] of Object.entries(LONTARA_CONFIG.clusters)) {
      if (remaining.startsWith(cluster)) {
        const nextChar = input[i + cluster.length];
        const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
        if (vowel) {
          result += lontara + vowel;
          details.push({ latin: cluster + nextChar, lontara: lontara + vowel, type: 'cluster' });
          i += cluster.length + 1;
        } else if (nextChar === 'a') {
          result += lontara;
          details.push({ latin: cluster + 'a', lontara, type: 'cluster' });
          i += cluster.length + 1;
        } else {
          result += lontara;
          details.push({ latin: cluster, lontara, type: 'cluster' });
          i += cluster.length;
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // 2. Foreign letters (2 chars)
    const twoChar = remaining.slice(0, 2);
    if (LONTARA_CONFIG.foreignLetters[twoChar]) {
      const foreign = LONTARA_CONFIG.foreignLetters[twoChar];
      const nextChar = input[i + 2];
      const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
      if (vowel) {
        result += foreign.lontara + vowel;
        details.push({ latin: twoChar + nextChar, lontara: foreign.lontara + vowel, type: 'foreign', note: foreign.desc });
        i += 3;
      } else if (nextChar === 'a') {
        result += foreign.lontara;
        details.push({ latin: twoChar + 'a', lontara: foreign.lontara, type: 'foreign', note: foreign.desc });
        i += 3;
      } else {
        result += foreign.lontara;
        details.push({ latin: twoChar, lontara: foreign.lontara, type: 'foreign', note: foreign.desc });
        i += 2;
      }
      continue;
    }

    // 3. Digraphs (ng, ny)
    if (remaining.startsWith('ng') && !remaining.startsWith('ngk')) {
      const nextChar = input[i + 2];
      const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
      if (vowel) {
        result += 'ᨂ' + vowel;
        details.push({ latin: 'ng' + nextChar, lontara: 'ᨂ' + vowel, type: 'consonant' });
        i += 3;
      } else if (nextChar === 'a') {
        result += 'ᨂ';
        details.push({ latin: 'nga', lontara: 'ᨂ', type: 'consonant' });
        i += 3;
      } else {
        result += 'ᨂ';
        details.push({ latin: 'ng', lontara: 'ᨂ', type: 'consonant' });
        i += 2;
      }
      continue;
    }

    if (remaining.startsWith('ny')) {
      const nextChar = input[i + 2];
      const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
      if (vowel) {
        result += 'ᨎ' + vowel;
        details.push({ latin: 'ny' + nextChar, lontara: 'ᨎ' + vowel, type: 'consonant' });
        i += 3;
      } else if (nextChar === 'a') {
        result += 'ᨎ';
        details.push({ latin: 'nya', lontara: 'ᨎ', type: 'consonant' });
        i += 3;
      } else {
        result += 'ᨎ';
        details.push({ latin: 'ny', lontara: 'ᨎ', type: 'consonant' });
        i += 2;
      }
      continue;
    }

    // 4. Foreign letters (1 char)
    const oneChar = remaining[0];
    if (LONTARA_CONFIG.foreignLetters[oneChar]) {
      const foreign = LONTARA_CONFIG.foreignLetters[oneChar];
      const nextChar = input[i + 1];
      const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
      if (vowel) {
        result += foreign.lontara + vowel;
        details.push({ latin: oneChar + nextChar, lontara: foreign.lontara + vowel, type: 'foreign', note: foreign.desc });
        i += 2;
      } else if (nextChar === 'a') {
        result += foreign.lontara;
        details.push({ latin: oneChar + 'a', lontara: foreign.lontara, type: 'foreign', note: foreign.desc });
        i += 2;
      } else {
        result += foreign.lontara;
        details.push({ latin: oneChar, lontara: foreign.lontara, type: 'foreign', note: foreign.desc });
        i += 1;
      }
      continue;
    }

    // 5. Regular consonants
    if (LONTARA_CONFIG.consonantBase[oneChar]) {
      const consonant = LONTARA_CONFIG.consonantBase[oneChar];
      const nextChar = input[i + 1];
      const vowel = LONTARA_CONFIG.vowelMarkers[nextChar];
      if (vowel) {
        result += consonant + vowel;
        details.push({ latin: oneChar + nextChar, lontara: consonant + vowel, type: 'consonant' });
        i += 2;
      } else if (nextChar === 'a') {
        result += consonant;
        details.push({ latin: oneChar + 'a', lontara: consonant, type: 'consonant' });
        i += 2;
      } else {
        result += consonant;
        details.push({ latin: oneChar, lontara: consonant, type: 'consonant' });
        i += 1;
      }
      continue;
    }

    // 6. Vowels
    if (LONTARA_CONFIG.vowels[oneChar]) {
      result += LONTARA_CONFIG.vowels[oneChar];
      details.push({ latin: oneChar, lontara: LONTARA_CONFIG.vowels[oneChar], type: 'vowel' });
      i += 1;
      continue;
    }

    // 7. Punctuation
    if (LONTARA_CONFIG.punctuation[oneChar]) {
      result += LONTARA_CONFIG.punctuation[oneChar];
      details.push({ latin: oneChar, lontara: LONTARA_CONFIG.punctuation[oneChar], type: 'punctuation' });
      i += 1;
      continue;
    }

    // 8. Numbers (keep as is)
    if (/[0-9]/.test(oneChar)) {
      result += oneChar;
      details.push({ latin: oneChar, lontara: oneChar, type: 'number' });
      i += 1;
      continue;
    }

    i += 1;
  }

  return { lontara: result, details };
}

// ─────────────────────────────────────────────────────────────────────────────────
// GENERATION CALCULATOR (Dynamic - No stored generation field)
// ─────────────────────────────────────────────────────────────────────────────────

function calculateGeneration(personId, rootId, personsMap) {
  if (!personId || !rootId || !personsMap.size) return -1;
  
  const visited = new Set();
  const queue = [{ id: rootId, gen: 1 }];
  
  while (queue.length > 0) {
    const { id, gen } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    
    if (id === personId) return gen;
    
    const person = personsMap.get(id);
    if (!person) continue;
    
    for (const childId of (person.childIds || [])) {
      if (!visited.has(childId)) {
        queue.push({ id: childId, gen: gen + 1 });
      }
    }
  }
  
  return -1;
}

function getGenerationLabel(gen) {
  const labels = {
    1: 'Leluhur',
    2: 'Anak',
    3: 'Cucu',
    4: 'Cicit',
    5: 'Canggah',
    6: 'Wareng',
    7: 'Udeg-udeg',
    8: 'Gantung Siwur'
  };
  return labels[gen] || `Generasi ke-${gen}`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────────

const INITIAL_PERSONS = [
  {
    id: 'p1',
    firstName: 'Andi',
    lastName: 'Mappanyukki',
    gender: 'male',
    birthDate: '1920-01-15',
    deathDate: '1990-05-20',
    isLiving: false,
    birthPlace: 'Bone, Sulawesi Selatan',
    occupation: 'Petani',
    isRootAncestor: true,
    parentIds: [],
    spouseIds: ['p2'],
    childIds: ['p3', 'p4'],
    position: { x: 400, y: 50 }
  },
  {
    id: 'p2',
    firstName: 'Siti',
    lastName: 'Aminah',
    gender: 'female',
    birthDate: '1925-03-10',
    deathDate: '1995-08-15',
    isLiving: false,
    birthPlace: 'Wajo, Sulawesi Selatan',
    occupation: 'Ibu Rumah Tangga',
    isRootAncestor: false,
    parentIds: [],
    spouseIds: ['p1'],
    childIds: ['p3', 'p4'],
    position: { x: 600, y: 50 }
  },
  {
    id: 'p3',
    firstName: 'Budiman',
    lastName: 'Mappanyukki',
    gender: 'male',
    birthDate: '1950-07-20',
    isLiving: true,
    birthPlace: 'Makassar',
    occupation: 'Pengusaha',
    isRootAncestor: false,
    parentIds: ['p1', 'p2'],
    spouseIds: ['p5'],
    childIds: ['p6', 'p7'],
    position: { x: 300, y: 200 }
  },
  {
    id: 'p4',
    firstName: 'Fatimah',
    lastName: 'Mappanyukki',
    gender: 'female',
    birthDate: '1955-12-05',
    isLiving: true,
    birthPlace: 'Makassar',
    occupation: 'Guru',
    isRootAncestor: false,
    parentIds: ['p1', 'p2'],
    spouseIds: [],
    childIds: [],
    position: { x: 500, y: 200 }
  },
  {
    id: 'p5',
    firstName: 'Rahmawati',
    lastName: 'Kadir',
    gender: 'female',
    birthDate: '1955-04-18',
    isLiving: true,
    birthPlace: 'Gowa',
    occupation: 'Dokter',
    isRootAncestor: false,
    parentIds: [],
    spouseIds: ['p3'],
    childIds: ['p6', 'p7'],
    position: { x: 500, y: 200 }
  },
  {
    id: 'p6',
    firstName: 'Firman',
    lastName: 'Mappanyukki',
    gender: 'male',
    birthDate: '1980-09-12',
    isLiving: true,
    birthPlace: 'Makassar',
    occupation: 'Insinyur',
    isRootAncestor: false,
    parentIds: ['p3', 'p5'],
    spouseIds: [],
    childIds: ['p8'],
    position: { x: 250, y: 350 }
  },
  {
    id: 'p7',
    firstName: 'Zahra',
    lastName: 'Mappanyukki',
    gender: 'female',
    birthDate: '1985-02-28',
    isLiving: true,
    birthPlace: 'Makassar',
    occupation: 'Arsitek',
    isRootAncestor: false,
    parentIds: ['p3', 'p5'],
    spouseIds: [],
    childIds: [],
    position: { x: 450, y: 350 }
  },
  {
    id: 'p8',
    firstName: 'Ariq',
    lastName: 'Mappanyukki',
    gender: 'male',
    birthDate: '2010-06-15',
    isLiving: true,
    birthPlace: 'Jakarta',
    occupation: 'Pelajar',
    isRootAncestor: false,
    parentIds: ['p6'],
    spouseIds: [],
    childIds: [],
    position: { x: 250, y: 500 }
  }
];

// ─────────────────────────────────────────────────────────────────────────────────
// KOMPONEN UI
// ─────────────────────────────────────────────────────────────────────────────────

// Tab Button
const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 rounded-t-lg ${
      active 
        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg' 
        : 'bg-white text-stone-600 hover:bg-amber-50'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden sm:inline">{children}</span>
  </button>
);

// Person Node untuk Tree
const PersonNode = ({ person, selected, onClick, scriptMode, generation, personsMap }) => {
  const { lontara } = useMemo(() => 
    transliterateLatin(`${person.firstName} ${person.lastName}`), 
    [person.firstName, person.lastName]
  );
  
  const bgColor = person.gender === 'male' 
    ? 'from-blue-50 to-blue-100 border-blue-300' 
    : person.gender === 'female'
    ? 'from-pink-50 to-pink-100 border-pink-300'
    : 'from-gray-50 to-gray-100 border-gray-300';
  
  const selectedClass = selected ? 'ring-4 ring-amber-400 shadow-xl scale-105' : '';
  
  return (
    <div
      onClick={onClick}
      className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 ${selectedClass}`}
      style={{ left: person.position.x, top: person.position.y }}
    >
      <div className={`p-3 rounded-xl border-2 bg-gradient-to-br ${bgColor} shadow-md min-w-[140px]`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
            person.gender === 'male' ? 'bg-blue-500' : person.gender === 'female' ? 'bg-pink-500' : 'bg-gray-500'
          }`}>
            {person.gender === 'male' ? '👨' : person.gender === 'female' ? '👩' : '👤'}
          </div>
          <div className="flex-1">
            {(scriptMode === 'latin' || scriptMode === 'both') && (
              <div className="font-semibold text-sm text-stone-800">
                {person.firstName}
              </div>
            )}
            {(scriptMode === 'lontara' || scriptMode === 'both') && (
              <div className="font-lontara text-amber-700 text-sm">
                {transliterateLatin(person.firstName).lontara}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-stone-500 space-y-0.5">
          {person.birthDate && (
            <div>🎂 {person.birthDate.split('-')[0]}{person.deathDate ? ` - ${person.deathDate.split('-')[0]}` : ''}</div>
          )}
          <div className="flex items-center gap-1">
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">
              {getGenerationLabel(generation)}
            </span>
          </div>
        </div>
        
        {!person.isLiving && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-stone-400 rounded-full flex items-center justify-center text-white text-[8px]">
            ✝
          </div>
        )}
      </div>
    </div>
  );
};

// Person Form Modal
const PersonFormModal = ({ person, onSave, onClose, isNew }) => {
  const [formData, setFormData] = useState(person || {
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    occupation: '',
    isLiving: true
  });
  
  const { lontara } = useMemo(() => 
    transliterateLatin(`${formData.firstName} ${formData.lastName}`),
    [formData.firstName, formData.lastName]
  );
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-t-2xl">
          <h2 className="text-xl font-bold">{isNew ? '➕ Tambah Anggota' : '✏️ Edit Anggota'}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Name Preview */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-sm text-amber-600 mb-1">Preview Nama:</div>
            <div className="font-semibold">{formData.firstName} {formData.lastName}</div>
            <div className="font-lontara text-2xl text-amber-700">{lontara}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nama Depan *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Masukkan nama depan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nama Belakang *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Masukkan nama belakang"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Jenis Kelamin *</label>
            <div className="flex gap-4">
              {['male', 'female'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="text-amber-600"
                  />
                  <span>{g === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Kota/Daerah"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isLiving}
                onChange={(e) => setFormData({...formData, isLiving: e.target.checked})}
                className="text-amber-600 rounded"
              />
              <span className="text-sm">Masih hidup</span>
            </label>
          </div>
          
          {!formData.isLiving && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Tanggal Wafat</label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData({...formData, deathDate: e.target.value})}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Pekerjaan</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Pekerjaan/Profesi"
            />
          </div>
        </div>
        
        <div className="flex gap-3 p-4 border-t bg-stone-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition"
          >
            {isNew ? 'Tambah' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Transliteration Reference Card
const TranslitCard = ({ latin, lontara, description, type }) => {
  const bgColors = {
    consonant: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
    vowel: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    foreign: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    cluster: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
  };
  
  return (
    <div className={`p-3 rounded-xl border-2 ${bgColors[type]} hover:shadow-lg transition-all cursor-pointer hover:scale-105`}>
      <div className="text-center">
        <div className="text-3xl font-lontara mb-1">{lontara}</div>
        <div className="text-lg font-bold text-stone-700 uppercase">{latin}</div>
        {description && <div className="text-xs text-stone-500 mt-1">{description}</div>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export default function WijaApp() {
  // State
  const [activeTab, setActiveTab] = useState('tree');
  const [persons, setPersons] = useState(INITIAL_PERSONS);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [scriptMode, setScriptMode] = useState('both');
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [translitInput, setTranslitInput] = useState('');
  const [zoom, setZoom] = useState(1);
  const [familyName] = useState('Keluarga Mappanyukki');
  
  // Computed
  const personsMap = useMemo(() => {
    const map = new Map();
    persons.forEach(p => map.set(p.id, p));
    return map;
  }, [persons]);
  
  const rootAncestorId = useMemo(() => {
    const root = persons.find(p => p.isRootAncestor);
    return root?.id;
  }, [persons]);
  
  const selectedPerson = useMemo(() => 
    persons.find(p => p.id === selectedPersonId),
    [persons, selectedPersonId]
  );
  
  const translitResult = useMemo(() => 
    transliterateLatin(translitInput),
    [translitInput]
  );
  
  const familyStats = useMemo(() => {
    const living = persons.filter(p => p.isLiving).length;
    const deceased = persons.filter(p => !p.isLiving).length;
    const males = persons.filter(p => p.gender === 'male').length;
    const females = persons.filter(p => p.gender === 'female').length;
    
    let maxGen = 0;
    persons.forEach(p => {
      const gen = calculateGeneration(p.id, rootAncestorId, personsMap);
      if (gen > maxGen) maxGen = gen;
    });
    
    return { total: persons.length, living, deceased, males, females, generations: maxGen };
  }, [persons, rootAncestorId, personsMap]);
  
  // Handlers
  const handleSavePerson = (formData) => {
    if (editingPerson) {
      setPersons(prev => prev.map(p => 
        p.id === editingPerson.id ? { ...p, ...formData } : p
      ));
    } else {
      const newPerson = {
        ...formData,
        id: `p${Date.now()}`,
        parentIds: [],
        spouseIds: [],
        childIds: [],
        isRootAncestor: false,
        position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 }
      };
      setPersons(prev => [...prev, newPerson]);
    }
    setShowPersonForm(false);
    setEditingPerson(null);
  };
  
  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setShowPersonForm(true);
  };
  
  const handleDeletePerson = (personId) => {
    if (confirm('Yakin ingin menghapus anggota ini?')) {
      setPersons(prev => prev.filter(p => p.id !== personId));
      setSelectedPersonId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Buginese&display=swap');
        .font-lontara { font-family: 'Noto Sans Buginese', serif; }
        .tree-canvas::-webkit-scrollbar { width: 8px; height: 8px; }
        .tree-canvas::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .tree-canvas::-webkit-scrollbar-thumb { background: #d4a574; border-radius: 4px; }
      `}</style>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="font-lontara text-3xl">ᨓᨗᨍ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  WIJA
                  <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded">v5.0</span>
                </h1>
                <p className="text-amber-200 text-sm">Warisan Jejak Keluarga</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Script Mode Toggle */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg p-1">
                {['latin', 'both', 'lontara'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setScriptMode(mode)}
                    className={`px-3 py-1.5 rounded text-sm transition ${
                      scriptMode === mode 
                        ? 'bg-white text-amber-700 font-medium' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {mode === 'latin' ? 'Latin' : mode === 'lontara' ? 'ᨒᨚᨈᨑ' : 'Keduanya'}
                  </button>
                ))}
              </div>
              
              {/* Family Name */}
              <div className="text-right hidden sm:block">
                <div className="text-sm text-amber-200">Keluarga Aktif</div>
                <div className="font-semibold">{familyName}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <nav className="bg-white/80 backdrop-blur shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            <TabButton active={activeTab === 'tree'} onClick={() => setActiveTab('tree')} icon="🌳">
              Pohon Keluarga
            </TabButton>
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon="👥">
              Anggota
            </TabButton>
            <TabButton active={activeTab === 'transliterate'} onClick={() => setActiveTab('transliterate')} icon="✍️">
              Transliterasi
            </TabButton>
            <TabButton active={activeTab === 'reference'} onClick={() => setActiveTab('reference')} icon="📖">
              Referensi Aksara
            </TabButton>
            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon="📊">
              Statistik
            </TabButton>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: POHON KELUARGA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'tree' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPerson(null); setShowPersonForm(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center gap-2"
                >
                  <span>➕</span> Tambah Anggota
                </button>
                {selectedPerson && (
                  <>
                    <button
                      onClick={() => handleEditPerson(selectedPerson)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeletePerson(selectedPerson.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      🗑️ Hapus
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500">Zoom:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
            
            {/* Tree Canvas */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-stone-700 to-stone-800 text-white px-4 py-3 flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <span>🌳</span>
                  {scriptMode === 'lontara' ? (
                    <span className="font-lontara">{transliterateLatin(familyName).lontara}</span>
                  ) : scriptMode === 'both' ? (
                    <span>{familyName} <span className="font-lontara text-amber-300">({transliterateLatin(familyName).lontara})</span></span>
                  ) : (
                    <span>{familyName}</span>
                  )}
                </h2>
                <div className="text-sm text-stone-300">
                  {persons.length} anggota • {familyStats.generations} generasi
                </div>
              </div>
              
              <div 
                className="tree-canvas relative overflow-auto bg-gradient-to-br from-stone-50 to-amber-50"
                style={{ height: '500px' }}
              >
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '800px', minHeight: '600px' }}>
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '800px', minHeight: '600px' }}>
                    {persons.map(person => {
                      return person.childIds.map(childId => {
                        const child = personsMap.get(childId);
                        if (!child) return null;
                        
                        const x1 = person.position.x + 70;
                        const y1 = person.position.y + 80;
                        const x2 = child.position.x + 70;
                        const y2 = child.position.y;
                        
                        return (
                          <path
                            key={`${person.id}-${childId}`}
                            d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                            stroke="#d4a574"
                            strokeWidth="2"
                            fill="none"
                          />
                        );
                      });
                    })}
                    
                    {/* Spouse Lines */}
                    {persons.map(person => {
                      if (person.gender !== 'male') return null;
                      return person.spouseIds.map(spouseId => {
                        const spouse = personsMap.get(spouseId);
                        if (!spouse) return null;
                        
                        return (
                          <line
                            key={`spouse-${person.id}-${spouseId}`}
                            x1={person.position.x + 140}
                            y1={person.position.y + 40}
                            x2={spouse.position.x}
                            y2={spouse.position.y + 40}
                            stroke="#ec4899"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        );
                      });
                    })}
                  </svg>
                  
                  {/* Person Nodes */}
                  {persons.map(person => (
                    <PersonNode
                      key={person.id}
                      person={person}
                      selected={selectedPersonId === person.id}
                      onClick={() => setSelectedPersonId(person.id === selectedPersonId ? null : person.id)}
                      scriptMode={scriptMode}
                      generation={calculateGeneration(person.id, rootAncestorId, personsMap)}
                      personsMap={personsMap}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Selected Person Detail */}
            {selectedPerson && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3">
                  <h3 className="font-semibold">Detail Anggota</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                      selectedPerson.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                    }`}>
                      {selectedPerson.gender === 'male' ? '👨' : '👩'}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-stone-800">
                          {selectedPerson.firstName} {selectedPerson.lastName}
                        </div>
                        <div className="font-lontara text-xl text-amber-600">
                          {transliterateLatin(`${selectedPerson.firstName} ${selectedPerson.lastName}`).lontara}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-stone-500">Generasi</div>
                          <div className="font-medium">{getGenerationLabel(calculateGeneration(selectedPerson.id, rootAncestorId, personsMap))}</div>
                        </div>
                        <div>
                          <div className="text-stone-500">Tempat Lahir</div>
                          <div className="font-medium">{selectedPerson.birthPlace || '-'}</div>
                        </div>
                        <div>
                          <div className="text-stone-500">Tanggal Lahir</div>
                          <div className="font-medium">{selectedPerson.birthDate || '-'}</div>
                        </div>
                        <div>
                          <div className="text-stone-500">Pekerjaan</div>
                          <div className="font-medium">{selectedPerson.occupation || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: ANGGOTA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">Daftar Anggota Keluarga</h2>
              <button
                onClick={() => { setEditingPerson(null); setShowPersonForm(true); }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition"
              >
                ➕ Tambah Anggota
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {persons.map(person => {
                const gen = calculateGeneration(person.id, rootAncestorId, personsMap);
                const { lontara } = transliterateLatin(`${person.firstName} ${person.lastName}`);
                
                return (
                  <div
                    key={person.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => { setSelectedPersonId(person.id); setActiveTab('tree'); }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          person.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                        }`}>
                          {person.gender === 'male' ? '👨' : '👩'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-stone-800">
                            {person.firstName} {person.lastName}
                          </div>
                          <div className="font-lontara text-amber-600 text-sm">{lontara}</div>
                        </div>
                        {!person.isLiving && (
                          <span className="text-stone-400">✝</span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          {getGenerationLabel(gen)}
                        </span>
                        {person.birthDate && (
                          <span className="text-stone-500">
                            🎂 {person.birthDate.split('-')[0]}
                          </span>
                        )}
                        {person.occupation && (
                          <span className="text-stone-500">
                            💼 {person.occupation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: TRANSLITERASI */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'transliterate' && (
          <div className="space-y-6">
            {/* Input */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-stone-700 to-stone-800 text-white px-4 py-3">
                <h2 className="font-semibold">📝 Masukkan Teks Latin</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={translitInput}
                  onChange={(e) => setTranslitInput(e.target.value)}
                  placeholder="Ketik teks dalam huruf Latin di sini... (contoh: Selamat datang di Sulawesi)"
                  className="w-full h-32 p-4 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg resize-none"
                />
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-stone-500">Contoh:</span>
                  {['Selamat pagi', 'Sulawesi Selatan', 'Festival musik', 'Terima kasih'].map((sample) => (
                    <button
                      key={sample}
                      onClick={() => setTranslitInput(sample)}
                      className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Output */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <span className="font-lontara">ᨒ</span> Hasil Lontara
                </h2>
              </div>
              <div className="p-6">
                <div className="min-h-32 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-100">
                  {translitResult.lontara ? (
                    <div className="font-lontara text-4xl text-stone-800 leading-relaxed text-center break-words">
                      {translitResult.lontara}
                    </div>
                  ) : (
                    <div className="text-stone-400 text-center text-lg italic">
                      Hasil transliterasi akan muncul di sini...
                    </div>
                  )}
                </div>
                
                {/* Detail Breakdown */}
                {translitResult.details.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-stone-700 mb-3">Detail Transliterasi:</h3>
                    <div className="flex flex-wrap gap-2">
                      {translitResult.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                            detail.type === 'foreign' 
                              ? 'bg-purple-100 text-purple-800' 
                              : detail.type === 'vowel'
                              ? 'bg-emerald-100 text-emerald-800'
                              : detail.type === 'cluster'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span className="font-mono">{detail.latin}</span>
                          <span>→</span>
                          <span className="font-lontara text-lg">{detail.lontara}</span>
                          {detail.note && (
                            <span className="text-xs opacity-75">({detail.note})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: REFERENSI AKSARA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'reference' && (
          <div className="space-y-6">
            {/* Konsonan Dasar */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3">
                <h2 className="font-semibold">Konsonan Dasar (23 Aksara)</h2>
              </div>
              <div className="p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {Object.entries({
                  'ka': 'ᨀ', 'ga': 'ᨁ', 'nga': 'ᨂ', 'ngka': 'ᨃ',
                  'pa': 'ᨄ', 'ba': 'ᨅ', 'ma': 'ᨆ', 'mpa': 'ᨇ',
                  'ta': 'ᨈ', 'da': 'ᨉ', 'na': 'ᨊ', 'nra': 'ᨋ',
                  'ca': 'ᨌ', 'ja': 'ᨍ', 'nya': 'ᨎ', 'nca': 'ᨏ',
                  'ya': 'ᨐ', 'ra': 'ᨑ', 'la': 'ᨒ', 'wa': 'ᨓ',
                  'sa': 'ᨔ', 'a': 'ᨕ', 'ha': 'ᨖ'
                }).map(([latin, lontara]) => (
                  <TranslitCard key={latin} latin={latin} lontara={lontara} type="consonant" />
                ))}
              </div>
            </div>
            
            {/* Vokal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3">
                <h2 className="font-semibold">Vokal Mandiri</h2>
              </div>
              <div className="p-6 grid grid-cols-5 gap-4">
                {Object.entries(LONTARA_CONFIG.vowels).map(([latin, lontara]) => (
                  <TranslitCard key={latin} latin={latin} lontara={lontara} type="vowel" />
                ))}
              </div>
            </div>
            
            {/* Huruf Asing */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3">
                <h2 className="font-semibold">Huruf Asing (Pendekatan Fonologis)</h2>
              </div>
              <div className="p-6">
                <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-purple-800 text-sm">
                    <strong>⚠️ Catatan:</strong> Huruf-huruf berikut tidak ada dalam aksara Lontara tradisional. 
                    Transliterasi menggunakan pendekatan fonologis dengan memilih bunyi terdekat.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(LONTARA_CONFIG.foreignLetters).map(([latin, data]) => (
                    <TranslitCard 
                      key={latin} 
                      latin={latin} 
                      lontara={data.lontara} 
                      description={data.desc}
                      type="foreign" 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: STATISTIK */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Anggota', value: familyStats.total, icon: '👥', color: 'amber' },
                { label: 'Masih Hidup', value: familyStats.living, icon: '💚', color: 'green' },
                { label: 'Almarhum', value: familyStats.deceased, icon: '🕊️', color: 'stone' },
                { label: 'Generasi', value: familyStats.generations, icon: '🌳', color: 'blue' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-stone-800">{stat.value}</div>
                      <div className="text-sm text-stone-500">{stat.label}</div>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gender Distribution */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-stone-700 to-stone-800 text-white px-4 py-3">
                <h2 className="font-semibold">Distribusi Gender</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👨</span>
                      <span className="font-medium">Laki-laki</span>
                      <span className="ml-auto font-bold text-blue-600">{familyStats.males}</span>
                    </div>
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(familyStats.males / familyStats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👩</span>
                      <span className="font-medium">Perempuan</span>
                      <span className="ml-auto font-bold text-pink-600">{familyStats.females}</span>
                    </div>
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 rounded-full transition-all"
                        style={{ width: `${(familyStats.females / familyStats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Family Info */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3">
                <h2 className="font-semibold">Informasi Keluarga</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="font-lontara text-4xl text-amber-600">
                      {transliterateLatin(familyName.split(' ')[1] || 'W').lontara[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-stone-800">{familyName}</div>
                    <div className="font-lontara text-xl text-amber-600">
                      {transliterateLatin(familyName).lontara}
                    </div>
                    <div className="mt-2 text-sm text-stone-500">
                      Asal: Sulawesi Selatan • Didirikan: 1920
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </main>
      
      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-lontara text-3xl text-amber-400 mb-2">ᨓᨗᨍ</div>
          <div className="text-lg font-semibold">WIJA - Warisan Jejak Keluarga</div>
          <div className="text-sm text-stone-500 mt-1">
            Aplikasi Pohon Keluarga Digital dengan Aksara Lontara
          </div>
          <div className="text-xs text-stone-600 mt-4">
            v5.0 • No Generation Field • Auto-Transliteration • Foreign Letters Support
          </div>
        </div>
      </footer>
      
      {/* Person Form Modal */}
      {showPersonForm && (
        <PersonFormModal
          person={editingPerson}
          onSave={handleSavePerson}
          onClose={() => { setShowPersonForm(false); setEditingPerson(null); }}
          isNew={!editingPerson}
        />
      )}
    </div>
  );
}
