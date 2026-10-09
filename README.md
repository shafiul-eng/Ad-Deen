# Ad-Deen (আদ-দ্বীন)

![License](https://img.shields.io/badge/License-MIT-C9A24B) ![Language](https://img.shields.io/badge/Language-Bengali-1F6F5C) ![Tech](https://img.shields.io/badge/Tech-Vanilla_JS-1F6F5C) ![Offline](https://img.shields.io/badge/Offline-First-C9A24B)

**Ad-Deen** is a fully offline, ad-free, Bengali-language Islamic web application centered around the five daily prayers. It automatically surfaces time-specific deeds, supplications (duas), and reminders tailored to each prayer window.

## Key Features

- **Prayer Times:** Accurate offline calculations using mathematical formulas based on latitude/longitude, complete with a live countdown timer.
- **Quran:** Pre-loaded essential surahs (Ayatul Kursi, 3 Quls, Al-Fatiha) for instant offline access + full 114 Surah library (cached locally on your device after the initial online load).
- **Prayers & Duas:** Comprehensive Masnoon Dua collection, Sunnah checklist, and customizable personal Dua book.
- **Islamic Tools:** Zakat, Fidya, and Kaffara calculators; trackers for Qaza, Witr, Tahajjud, and fasting; digital multi-Tasbih counter; and accurate Hijri calendar integration.
- **Education & Learning:** Hadith collections, biographies of the Prophets and Sahabah, interactive quizzes, Myths vs. Facts guide, Islamic dictionary, baby names directory, and a Halal food E-code guide.
- **Journaling & Reflection:** Shukr (gratitude) & Muhasaba (self-evaluation) diary, 30-day habit calendar, personal Wasiyah (will) generator, and monthly progress reports.

## New: Worship (Ibadah) Tab

- **Alarms & Notifications:**
  - Adhan alerts for all 5 daily prayers plus Sunrise, Ishraq, Duha (Chasht), Awwabin, Tahajjud, and Jummah preparation.
  - Flexible offsets (from -30 minutes before to +10 minutes after prayer times).
  - Custom alarms (Daily, Weekly, Monthly via Gregorian or Hijri calendar, or One-time).
  - Snooze functionality and custom Adhan audio file support.
- **Worship Tracker:** Daily (18), Weekly (12), and Monthly (10) checklists with manual reset capabilities and visual progress bars.
- **Qibla Compass & Event Countdown:** Interactive Qibla direction finder and live countdowns for key Islamic events (Ramadan, Eid, Day of Arafah, Ashura, Ayyam al-Beed, etc.).
- **Settings & Customization:** Light/Dark themes, 4 color schemes, adjustable font sizes, seamless data backup & restore, PWA installation support, and manual Hijri date adjustment (±2 days).

> ⚠️ **Note on Web Alarms:** As a web application, scheduled alarms will trigger only while the app or browser remains active (including in background tabs). For background alarms when the app is completely closed, convert the project into a native Android app using Capacitor with the Local Notifications plugin.

## Deployment via GitHub Pages

1. Upload project files to the `main` branch of your repository.
2. Navigate to **Settings** → **Pages** → **Source** and select **GitHub Actions**.
3. Push your changes; `.github/workflows/pages.yml` will handle automated deployment.

## Technical Highlights

- **Zero Dependencies:** Built with pure `index.html` and `assets/features.js` — no build steps, bundlers, or external libraries required.
- **Privacy-First:** All personal data is stored strictly inside local device storage (`localStorage`). Zero telemetry, tracking, or remote server calls.
- **Smart Caching:** Full Quran text is fetched once from the [alquran.cloud](https://alquran.cloud) API (Tanzil.net source) and cached locally for complete offline usability thereafter.

## Disclaimer

All information provided within this application is intended for educational purposes. For critical decisions regarding prayer schedules, Zakat calculations, Fidya, Kaffara, or legal rulings (Fiqh), please consult a qualified local Islamic scholar.

---

Made with ♥ for the Ummah.  
**Ad-Deen** | Developed by Shafiul Islam
