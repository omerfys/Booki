<div align="center">

# Booki

**Gerçekçi Dijital El Yazısı Kitap Uygulaması & Fiziksel Yazım Motoru**

*Ahşap bir yazar masasında gerçek bir fiziksel deftere yazma hissini yeniden canlandıran özgün ve etkileşimli 3D dijital kitap deneyimi. React 19, TypeScript, Vite, Tailwind CSS, HTML5 Canvas ve StPageFlip ile geliştirilmiştir.*

<p align="center">
  <b>Türkçe</b> • <a href="README.md">English</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-0078D4?style=flat-square&logo=windows&logoColor=white)](https://github.com/omerfys/Booki)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Genel Bakış (Overview)

**Booki**, sıradan bir metin düzenleyici veya not alma uygulaması yerine, ahşap bir masa üzerinde duran gerçek bir kitaba el yazısıyla yazma deneyimini birebir dijital ortamda yaşatmak üzere tasarlanmış kapsamlı bir kitap yazma uygulamasıdır.

Booki, geleneksel dijital yazı tipleri (fontlar) veya basit italik yazı stilleri kullanmaz. Bunun yerine, klavyeden girilen her bir tuşu gerçek zamanlı olarak vektörel vuruş verilerine dönüştüren özel bir el yazısı motoru barındırır. Sayfanın iki yanında konumlanan masa kalemlikleri, gerçekçi kağıt dokuları ve fiziksel temas akustiği ile eksiksiz bir fiziksel yazım ortamı sunar.

---

## Görsel Vitrin (Feature Showcase)

| Modül / Özellik | Amaç | Açıklama |
|:---|:---:|:---|
| **3D Ciltli Kitap** | Fiziksel Anatomi | Fas derisi, keten kütüphane kumaşı, kraliyet kadifesi ve Floransa ebru kağıdı kapaklar; altın yaldız başlık baskısı ve katmanlı kağıt kalınlığı derinliği. |
| **Sayfa Çevirme Fiziği** | Sayfa Gezintisi | StPageFlip motoru ile desteklenen fiziksel sayfa bükülme ve katlanma animasyonları. Sayfa köşelerinden fare veya dokunmatik ekranla tutarak çevirme, köşe tıklamaları veya klavye ok tuşları. |
| **Vektörel El Yazısı** | Vuruş Motoru | Standart veya el yazısı fontları kullanılmaz. Karakterler doğrudan normalize edilmiş çok parçalı vektör eğrileri ve kontrollü insan varyasyonlarıyla çizilir. |
| **Masaüstü Kalemlikleri** | Çalışma Masası Düzeni | Kitabın solunda Kurşun Kalem ve Tükenmez Kalem standı; sağında Dolma Kalem, Keçeli Kalem, Mürekkep Hokkaları ve Ayar Menüsü yer alır. |
| **Çok Dilli Yazım Sistemi** | Evrensel Alfabeler | Latin alfabesi, Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü), Rusça Kiril el yazısı, Japonca Hiragana ve Kanji ile Hintçe Devanagari için özel vuruş yolları. |
| **Akustik Ses Motoru** | Fiziksel Geri Bildirim | Kurşun kalem grafit sürtünmesi, tükenmez kalem yuvarlanma akışı, dolma kalem metalik uç tırmalaması ve 3 aşamalı kağıt çevirme sesleri. |
| **Şerit Ayraç Sistemi** | Okuma Gezintisi | Kitap sırtına bağlı saten kurdele ayraç, sürükleyerek sayfa işaretleme, renk seçenekleri ve ayraç yönetim paneli. |
| **Cilt Atölyesi & Kütüphane** | Kalıcı Depolama | IndexedDB ile gerçek zamanlı yerel otomatik kaydetme. Bağımsız ciltler oluşturma, kopyalama, yeniden adlandırma ve yönetme imkanı. |

---

## Temel Yetenekler

### 1. Etkileşimli 3D Ciltli Kitap Motoru
- **Özgün Cilt Malzemeleri:** Fas Derisi (Moroccan Leather), Keten Cilt Bezi (Woven Bookcloth), Kraliyet Kadifesi (Royal Velvet), Floransa Ebru Kağıdı (Florentine Marbled) ve Eskitme Antika (Distressed Antique) seçenekleri.
- **Yaldız ve Kabartma Baskı:** Altın Yaldız, Gümüş Yaldız, Antik Bronz veya Gömme Kör Baskı ile kapak üzerine başlık işleme.
- **Çift Sayfa Açılımı:** Sırtta kademeli gölgelendirmeyle doğal sayfa eğriliği ve yan kenarlarda gerçek bir kitabın sayfa kalınlığını hissettiren katmanlı kenar yapısı.
- **3D Açılma ve Kapanma:** Masada kapalı duran ciltli kitabın 3D animasyonla açılması ve tok bir vuruş sesiyle kapanması.

### 2. Vektörel Çizim Tabanlı El Yazısı Motoru
- **Sıfır Dijital Font:** Karakterler yüksek çözünürlüklü HTML5 Canvas üzerine doğrudan normalize edilmiş vektörel vuruş verileriyle çizilir.
- **Kontrollü Rastlantısallık:** Her harfte açı, boyut, taban çizgisi oynaması ve Catmull-Rom mikro-titremeleri uygulanarak aynı harfin her yazılışında doğal insan varyasyonu korunur.
- **Sert Kenar Sınırı (Hard Margin Wrap):** Yazılar sayfa kenarlarını veya sırt çizgisini aşamaz; uzun kelimeler veya hızlı yazımlarda harfler sağ sınıra ulaştığında otomatik olarak bir alt satıra geçer.
- **Kusursuz Çizgi Hizalaması:** Harflerin taban çizgisi kağıt üzerindeki defter çizgileriyle matematiksel olarak kilitlenmiştir; harfler her satırda doğrudan çizginin üzerine oturur.

### 3. Özel Çok Dilli Yazım Sistemleri
- **Latin ve Avrupa Dilleri:** Tam A-Z, a-z, rakamlar, noktalama işaretleri ve Avrupa aksanları (é, è, ê, ë, à, â, ñ, á, í, ó, ú, ä, ß, ¿, ¡).
- **Türkçe Karakter Sistemi:** ç, ğ, ı, İ, ö, ş, ü, Ç, Ğ, Ş, Ö, Ü karakterleri için özgün vuruş geometrileri.
- **Kiril El Yazısı:** Rusça küçük ve büyük harfler için otantik el yazısı vuruş modelleri.
- **Japonca Yazım:** Hiragana (あ–ん), Katakana ve temel Kanji karakterleri (静, 言, 葉, 白, 紙, 真, 重, 京, 都, 日, 本, 書, 人, 山, 川, 心, 月, 雨, 筆) için doğru vuruş sıraları.
- **Hintçe Devanagari:** Ünsüz ve ünlü vuruş yolları ile kelimelerin üzerini birleştiren kesintisiz Şirorekha üst çizgisi.

### 4. 10 Özgün Uluslararası Yazar Karakteri
Her karakterin eğim, kıvrım, oranlar, taban çizgisi ve yazım hızını belirleyen bağımsız bir el yazısı profili bulunur:
- **Oliver Bennett (Birleşik Krallık):** Klasik, zarif, ritmik arşivci el yazısı.
- **Sofia Laurent (Fransa):** Yuvarlak, sanatsal, lirik Fransız el yazısı.
- **Luca Moretti (İtalya):** Coşkulu, dinamik, düzensiz İtalyan kıvrımları.
- **Hana Nakamura (Japonya):** Narin, dengeli, düzenli Zen el yazısı.
- **Mateo Garcia (İspanya):** Sıcak, ritmik Endülüs el yazısı.
- **Emma Schneider (Almanya):** Yapılandırılmış, disiplinli Kara Orman el yazısı.
- **Arjun Mehta (Hindistan):** Şirorekha bağlantılı akıcı Hint el yazısı.
- **Elena Petrova (Rusya):** Romantik Saint Petersburg Kiril el yazısı.
- **Ava Mitchell (Amerika Birleşik Devletleri):** Rahat, samimi, doğal haberci el yazısı.
- **Deniz Yılmaz (Türkiye):** Ritmik Osmanlı esintili kıvrımlarla akıcı Türkçe el yazısı.

*Daha önce yazılmış sayfalar, o sayfayı yazan karakterin el yazısı kimliğini korumaya devam eder.*

### 5. Masaüstü Kalemlikleri & Yazım Araçları
Ahşap masanın üzerinde kitabın sol ve sağ tarafına yerleştirilmiş kalemlikler:
- **Kurşun Kalem:** Grafit dokusu, pütürlü kağıt sürtünmesi ve basınca duyarlı çizgi yoğunluğu.
- **Tükenmez Kalem:** Akıcı mürekkep çizgisi, net kenar keskinliği, hıza duyarlı akış.
- **Dolma Kalem:** Kaligrafik esnek uç açı dinamikleri, yön değişimlerinde mürekkep birikmesi.
- **Keçeli Kalem:** Yarı saydam gözenekli keçe ucu ve lifli kenar yayılması.
- **Masa Standları:** Sol stand Kurşun Kalem ve Tükenmez Kalemi tutar; Sağ stand Dolma Kalem, Keçeli Kalem, seramik Mürekkep Hokkaları ve İnce Ayar panelini barındırır.

### 6. Akustik Ses Motoru
- Kurşun kalem grafit sürtünmesi, tükenmez kalem yuvarlanma akışı ve sayfa çevirme için fiziksel akustik sesler.
- Hızlı yazımda seslerin üst üste binmesini engelleyen hız kadansı koruması ve yumuşak çapraz geçiş (voice crossfade).
- Üst çubuktan tek tıkla sesi açma ve kapatma kontrolü.

### 7. Çok Ciltli Kütüphane & Depolama
- Tarayıcının yerel IndexedDB veritabanına (`booki-handwritten-db`) sıfır veri kaybıyla gerçek zamanlı otomatik kaydetme.
- Bağımsız başlıklara, kapaklara, kağıt türlerine ve el yazısı ayarlarına sahip birden fazla cilt oluşturma ve yönetme.
- Dış sunucu veya internet bağlantısı gerektirmeyen tam çevrimdışı çalışma mimarisi.

---

## Mimari

```
+--------------------------------------------------------+
|                      Booki Workspace                   |
+--------------------------+-----------------------------+
|   Masa Kalemliği (Sol)   |   3D Ciltli Kitap Açılımı   |   Masa Kalemliği (Sağ)
|   - Kurşun Kalem         |   - StPageFlip Motoru       |   - Dolma Kalem & Keçeli
|   - Tükenmez Kalem       |   - Canvas 2D Sayfa Çizici  |   - Hokkalar & Ayarlar
+--------------------------+-----------------------------+-------------------------+
|                  Vektörel Çizim Tabanlı El Yazısı Motoru                         |
+--------------------------+-----------------------------+-------------------------+
|   10 Yazar Profili       |  Çok Dilli Yazım Motoru     |  Akustik Ses Motoru     |
|   (Eğim, Ritim, Titreme) |  (Latin, TR, Kiril, JP, IN) |  (Grafit, Uç, Kağıt)    |
+--------------------------+-----------------------------+-------------------------+
|                   IndexedDB Kalıcı Yerel Depolama                                |
+----------------------------------------------------------------------------------+
```

---

## Başlangıç ve Kurulum

### Gereksinimler
- **Node.js:** 18.0 veya üzeri
- **npm:** 9.0 veya üzeri

### Windows Tek Tıkla Başlatma
Proje ana dizinindeki `start.bat` dosyasına çift tıklayın:
```cmd
start.bat
```
Betik Node.js kurulumunu kontrol eder, gerekirse bağımlılıkları yükler, yerel sunucuyu başlatır ve varsayılan tarayıcınızda `http://localhost:5173` adresini açar.

### Manuel Başlatma
```bash
# 1. Depoyu klonlayın
git clone https://github.com/omerfys/Booki.git
cd Booki

# 2. Bağımlılıkları yükleyin
npm install

# 3. Otomatik testleri çalıştırın
npm test

# 4. Geliştirme sunucusunu başlatın
npm run dev

# 5. Üretim (Production) derlemesi
npm run build
```

---

## Gizlilik ve Çevrimdışı Tasarım

- **Sıfır Bulut Bağımlılığı:** Tüm el yazısı hesaplamaları, vuruş geometrileri ve sayfa çevirme fiziği tamamen yerel donanımınızda çalışır.
- **Yerel Depolama:** Kitaplar, sayfalar ve vektörel vuruş verileri tarayıcınızın özel IndexedDB veritabanında saklanır.
- **Sıfır Telemetri:** Booki hiçbir kişisel veriyi, kullanım kaydını veya analitik bilgisini toplamaz.

---

## Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak lisanslanmıştır.
