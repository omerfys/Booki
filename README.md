# 📖 Booki — Realistic Digital Handwritten Book Application

> A premium, interactive 3D digital book-writing experience simulating the tactile realism of writing in a physical hardcover book on an author's desk.

---

## 🌟 Key Features

### 1. 📚 3D Interactive Hardcover Book Engine
- Realistic hardcover bindings with grain textures: **Moroccan Leather**, **Linen Bookcloth**, **Royal Velvet**, **Florentine Marbled Paper**, and **Distressed Antique**.
- Gold, Silver, Bronze, and Blind Debossed foil title stamping.
- Natural page curvature, central spine depth, and multi-layer deckled stacked edge paper thickness.
- Realistic 3D opening and closing animations from closed hardcover to open two-page spread.
- Physics-based page flipping (drag corners, click, arrow keys) powered by StPageFlip.

### 2. ✍️ Real Stroke-Based Vector Handwriting Engine
- **Zero Standard/Cursive Fonts:** Characters are rendered exclusively through normalized vector stroke data.
- **Multilingual Script Stroke Systems:**
  - Full **Latin** alphabet, digits, and punctuation.
  - Dedicated **Turkish** script with authentic diacritics (`ç`, `ğ`, `ı`, `İ`, `ö`, `ş`, `ü`, `Ç`, `Ğ`, `Ş`, `Ö`, `Ü`).
  - European accents (`é`, `è`, `ê`, `ë`, `à`, `â`, `ñ`, `á`, `í`, `ó`, `ú`, `ä`, `ß`, `¿`, `¡`).
  - Dedicated Russian **Cyrillic** cursive strokes (`а–я`, `А–Я`).
  - Japanese **Hiragana** (`あ–ん`), Katakana, and key **Kanji** (`静`, `言`, `葉`, `白`, `紙`, `真`, `重`, `日`, `本`, `書`, `人`, `山`, `川`, `心`, `月`, `雨`, `筆`).
  - Hindi **Devanagari** consonants, vowels, and matras (`क–ह`, `अ–औ`) with continuous handwritten top horizontal **Shirorekha** headlines.
- **Controlled Randomization:** Per-character variations in angle, scale, baseline displacement, and Catmull-Rom micro-tremors preserving the author's handwriting identity.
- **Hard Margin Wrap:** Writing never overflows page borders or crosses the spine; long words and fast typing wrap automatically.

### 3. ✒️ Physical Desk Pen Stands & Instruments
- **Left Desk Stand:** Holds the **Graphite Pencil** (with eraser & ferrule) and **Ballpoint Pen**.
- **Right Desk Stand:** Holds the **Fountain Pen** (14k gold nib), **Artist Marker**, circular ceramic **Ink Wells**, and **Settings** calibration flyout.
- Pens elevate with realistic lift shadows and golden ambient rim light when picked up.

### 4. 🔊 Authentic Acoustic Sound Engine
- Studio-recorded acoustic sound playback for physical pencil strokes, pen scribbles, and page turns.
- Speed-aware cadence throttle and smooth voice crossfading preventing overlap clutter during fast typing.
- Toggle mute/unmute directly from the top bar.

### 5. 🌍 10 Unique International Writer Personas
- **Oliver Bennett (UK):** Classic, rhythmic archivist cursive.
- **Sofia Laurent (France):** Rounded, artistic, lyrical French cursive.
- **Luca Moretti (Italy):** Dramatic, irregular Italian flourishes.
- **Hana Nakamura (Japan):** Precise, delicate, balanced Zen handwriting.
- **Mateo García (Spain):** Warm, rhythmic Andalusian cursive.
- **Emma Schneider (Germany):** Structured, disciplined Black Forest hand.
- **Arjun Mehta (India):** Flowing script with continuous connected Shirorekha.
- **Elena Petrova (Russia):** Romantic Saint Petersburg Cyrillic cursive.
- **Ava Mitchell (USA):** Casual, open, informal reporter hand.
- **Deniz Yılmaz (Türkiye):** Fluid Turkish handwriting with rhythmic Ottoman curves.

### 6. 🔖 Realistic Ribbon Bookmark System
- Physical satin ribbon draped from the spine across pages with chevron swallowtail cut.
- Multiple ribbon colors (Crimson Red, Royal Navy, Forest Emerald, Antique Gold, Deep Violet, Burgundy Wine).
- Interactive flyout with note placement and jump-to-page navigation.

### 7. 🗄️ Multi-Volume Library & IndexedDB Persistence
- Automatic real-time persistence to IndexedDB (`booki-handwritten-db`).
- Manage multiple books: create, duplicate, rename, delete, and switch volumes.
- Full offline capability.

---

## 🚀 Getting Started

### Windows Quick Start
Simply double-click the included `start.bat`:
```cmd
start.bat
```
The script automatically verifies Node.js, installs dependencies if needed, launches Vite, and opens your browser at `http://localhost:5173`.

### Manual Start
```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **3D Page Flipping:** StPageFlip (`page-flip`)
- **Graphics:** HTML5 Canvas 2D (Device Pixel Ratio Crisp Vector Rendering)
- **Audio:** Web Audio API + Real Acoustic Recordings
- **Storage:** IndexedDB (`idb`)

---

## 📄 License

MIT License — Handcrafted with care.
