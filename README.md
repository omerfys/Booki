<div align="center">

# Booki

**Realistic Digital Handwritten Book Application & Physical Writing Engine**

*An authentic, interactive 3D digital book-writing experience recreating the tactile sensation of owning a physical notebook on a wooden desk. Built with React 19, TypeScript, Vite, Tailwind CSS, HTML5 Canvas, and StPageFlip.*

<p align="center">
  <a href="README.tr.md">Türkçe</a> • <b>English</b>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-0078D4?style=flat-square&logo=windows&logoColor=white)](https://github.com/omerfys/Booki)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

**Booki** is a dedicated digital book-writing application engineered to recreate the physical, tactile experience of writing in an actual book on an author's desk.

Unlike conventional digital text editors or note-taking applications, Booki completely replaces standard digital typography with a dedicated vector stroke-based handwriting engine. Keystrokes are converted in real time into continuous, pressure-sensitive handwritten strokes on realistic textured paper, flanked by desktop pen stands with physical writing instruments and authentic acoustic feedback.

---

## Feature Showcase

| Module | Purpose | Description |
|:---|:---:|:---|
| **3D Hardcover Book** | Physical Anatomy | Hardcover bindings in Moroccan leather, linen bookcloth, royal velvet, and Florentine marbled paper with gold foil stamping and realistic deckled page edge thickness. |
| **Page-Flip Physics** | Page Navigation | Realistic page-turning animations powered by StPageFlip. Drag page corners with mouse or touch, use keyboard arrow keys, or click corner curl zones. |
| **Vector Handwriting** | Stroke Engine | Zero standard or cursive fonts. Characters are rendered exclusively through normalized multi-segment vector strokes with human variation. |
| **Desktop Pen Stands** | Desk Workspace | Flanking the book on the left and right sides: Left stand holds the Graphite Pencil and Ballpoint Pen; Right stand holds the Fountain Pen, Marker, Ink Wells, and Settings. |
| **Multilingual Support** | Global Scripts | Dedicated stroke models for Latin, Turkish diacritics (ç, ğ, ı, İ, ö, ş, ü), Cyrillic cursive, Japanese Hiragana and Kanji, and Hindi Devanagari with Shirorekha. |
| **Acoustic Audio Engine** | Physical Feedback | High-definition acoustic sound playback for pencil graphite scraping, ballpoint rolling glide, fountain pen metallic nib scratch, and 3-phase paper rustle. |
| **Ribbon Bookmarks** | Reading Navigation | Realistic satin ribbon attached to the book spine, draggable placement, color selection, and bookmark management drawer. |
| **Bindery & Library** | Persistence | Real-time offline autosave to IndexedDB. Multi-volume library to create, duplicate, rename, and manage independent books. |

---

## Key Capabilities

### 1. Interactive 3D Hardcover Book Engine
- **Authentic Cover Materials:** Choose between Moroccan Leather, Woven Bookcloth, Royal Velvet, Florentine Marbled Paper, and Distressed Antique.
- **Foil Tooling & Embossing:** Custom embossed titles with Gold Foil, Silver Foil, Antique Bronze, or Blind Deboss stamping.
- **Two-Page Spread:** Natural page curvature near the spine with graduated valley shading, and layered deckled edges along lateral margins simulating a physical book block.
- **Smooth 3D Transitions:** Animated opening from a closed hardcover book on a wooden desk to the open spread, and closing back with a solid desk thump.

### 2. Pure Vector Stroke Handwriting Engine
- **No Digital Fonts:** Characters are rendered directly onto high-DPI HTML5 Canvas using normalized vector stroke data.
- **Controlled Randomization:** Natural variation on every character instance (subtle angle jitter, micro-tremors, scale variation, baseline drift) so repeating characters never look identical.
- **Hard Margin Wrap:** Characters never cross page margins or enter the spine; long words and fast typing wrap automatically to the next line.
- **Strict Line Alignment:** Text baseline mathematically matches the printed paper ruling lines with sub-pixel precision across every row.

### 3. Dedicated Multilingual Script Systems
- **Latin & European:** Full A-Z, a-z, numerals, punctuation, and European diacritics (é, è, ê, ë, à, â, ñ, á, í, ó, ú, ä, ß, ¿, ¡).
- **Turkish Script:** Dedicated stroke definitions preserving native character geometry for ç, ğ, ı, İ, ö, ş, ü, Ç, Ğ, Ş, Ö, Ü.
- **Cyrillic Script:** Authentic Russian cursive forms for lowercase and uppercase Cyrillic letters.
- **Japanese Script:** Hiragana (あ–ん), Katakana, and key Kanji (静, 言, 葉, 白, 紙, 真, 重, 京, 都, 日, 本, 書, 人, 山, 川, 心, 月, 雨, 筆) with proper stroke order.
- **Hindi Devanagari:** Consonant and vowel stroke paths with continuous top horizontal Shirorekha headlines connecting words.

### 4. 10 International Writer Personas
Each character possesses an independent handwriting profile controlling slant, curvature, proportions, baseline jitter, and stroke dynamics:
- **Oliver Bennett (United Kingdom):** Classic, elegant, slightly slanted archivist cursive.
- **Sofia Laurent (France):** Rounded, artistic, flowing French cursive.
- **Luca Moretti (Italy):** Dramatic, dynamic, irregular Italian flourishes.
- **Hana Nakamura (Japan):** Delicate, precise, balanced Zen handwriting.
- **Mateo Garcia (Spain):** Warm, rhythmic Andalusian cursive.
- **Emma Schneider (Germany):** Structured, disciplined, uniform Black Forest hand.
- **Arjun Mehta (India):** Flowing script with continuous connected Shirorekha.
- **Elena Petrova (Russia):** Romantic Saint Petersburg Cyrillic cursive.
- **Ava Mitchell (United States):** Casual, open, informal reporter hand.
- **Deniz Yilmaz (Turkiye):** Fluid Turkish handwriting with rhythmic Ottoman curves.

*Previously written content retains the handwriting style of the character who originally penned it.*

### 5. Desktop Pen Stands & Writing Instruments
Flanking the book on the left and right sides of the wooden desk:
- **Pencil:** Graphite texture, paper grain speckle, and pressure fade.
- **Ballpoint Pen:** Fluid rolling ink line, crisp edge definition, velocity-sensitive distribution.
- **Fountain Pen:** Calligraphic flex nib angle dynamics, wet ink pooling at turns.
- **Marker:** Translucent felt tip with fibrous edge bleed.
- **Desk Stands:** Left stand holds the Pencil and Ballpoint; Right stand holds the Fountain Pen, Marker, ceramic Ink Wells, and Calibration Settings.

### 6. Acoustic Sound Engine
- Authentic acoustic playback for physical pencil strokes, pen scribbles, and paper turns.
- Speed-aware cadence throttle and smooth voice crossfading preventing audio clutter during fast typing.
- Single-click audio mute/unmute toggle in the top navigation bar.

### 7. Multi-Volume Library & Storage
- Real-time autosave to local IndexedDB (`booki-handwritten-db`).
- Manage multiple independent books with separate titles, covers, paper varieties, and handwriting settings.
- Fully offline functional with zero external network dependencies.

---

## Architecture

```
+--------------------------------------------------------+
|                      Booki Workspace                   |
+--------------------------+-----------------------------+
|   Desk Pen Stand (Left)  |   3D Hardcover Book Spread  |   Desk Pen Stand (Right)
|   - Graphite Pencil      |   - StPageFlip Engine       |   - Fountain Pen & Marker
|   - Ballpoint Pen        |   - Canvas 2D Page Renderer |   - Ink Wells & Settings
+--------------------------+-----------------------------+-------------------------+
|                  Stroke-Based Vector Handwriting Engine                          |
+--------------------------+-----------------------------+-------------------------+
|  10 Character Profiles   |  Multilingual Script Engine |  Acoustic Sound Engine  |
|  (Slant, Jitter, Rhythm) |  (Latin, TR, CYR, JP, IN)   |  (Pencil, Pen, Paper)   |
+--------------------------+-----------------------------+-------------------------+
|                   IndexedDB Persistent Local Storage                             |
+----------------------------------------------------------------------------------+
```

---

## Getting Started

### Prerequisites
- **Node.js:** 18.0 or later
- **npm:** 9.0 or later

### Windows Quick Start
Double-click `start.bat` in the project root folder:
```cmd
start.bat
```
The script verifies Node.js, installs dependencies if needed, starts the local server, and opens your default browser at `http://localhost:5173`.

### Manual Start
```bash
# 1. Clone the repository
git clone https://github.com/omerfys/Booki.git
cd Booki

# 2. Install dependencies
npm install

# 3. Run automated tests
npm test

# 4. Start development server
npm run dev

# 5. Build for production
npm run build
```

---

## Privacy & Offline-First Design

- **Zero Cloud Dependence:** All handwriting generation, stroke calculations, and page-turning physics run entirely on your local machine.
- **Local Storage:** Books, pages, and stroke data are stored in your browser's private IndexedDB database.
- **Zero Telemetry:** Booki collects no personal data, analytics, or usage statistics.

---

## License

This project is licensed under the [MIT License](LICENSE).
