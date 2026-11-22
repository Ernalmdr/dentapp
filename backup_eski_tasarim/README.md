# Eski Tasarım Yedeği (Orijinal Sürüm)

Bu klasör, Figma tasarım aktarımı başlamadan önceki **tüm çalışan projeyi** (tüm sayfalar, bileşenler, mantık, public dosyaları ve mock veriler) eksiksiz olarak içerir.

**Yedeklenme Tarihi:** 22 Kasım 2026

## İçerik
- `src/app/` — Tüm orijinal sayfalar (dashboard, randevular, hastalar, finans, stok, raporlar, vb.)
- `src/components/` — Orijinal bileşenler, modallar, layout ve grafikler
- `src/lib/` — Tüm veri ve context dosyaları
- `public/` — Orijinal görseller ve asset'ler

## Nasıl Geri Yüklenir?
Eski tasarıma dönmek isterseniz:
1. `src` klasörünü silip bu klasördeki `src` klasörünü projenin köküne yapıştırabilirsiniz.
2. Veya PowerShell ile:
```powershell
Copy-Item -Path "backup_eski_tasarim\src\*" -Destination "src" -Recurse -Force
```
