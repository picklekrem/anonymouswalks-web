# blip Web — Claude Instructions

## Marka & İsim

- Uygulama artık **blip** — eski adı AnonymousWalks'tu, yürüyüş teması kaldırıldı
- "blip" her zaman küçük harf yazılır (teknik/yasal bağlamlar hariç)
- Konsept: anonim sesli sohbet. Bir ses, bir yabancı, sohbet biter her şey gider.
- Renk paleti: bg `#000000`, surface `#111111`, border `#1C1C1C`, accent `#6E56CF` (mor), gradient `#8b7cf8→#6E56CF→#a78bfa`
- Font: Poppins (globals.css'de tanımlı)
- Slogan — TR: "bir ses. bir yabancı. hepsi bu." / EN: "Appear. Talk. Gone."
- Hedef pazar: Türkiye (ilk faz), dil: TR öncelikli

## Bilinen Teknik Borçlar

- `app/privacy/page.tsx` ve `app/support/page.tsx` içinde hâlâ eski e-posta var: `support@anonwalksandtalks.com` — yeni domain belirlendikçe güncelle
- `app/layout.tsx`'te URL `https://blipapp.com` olarak güncellendi ama domain henüz satın alınmadı
