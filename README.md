# Drážka

Web smyšlené kavárny s administrací. Školní projekt a zároveň zkouška postupu pro další weby
(Astro + Sveltia CMS + GitHub Pages).

- **Web:** https://aracek.github.io/drazka/
- **Administrace:** https://aracek.github.io/drazka/admin/

## Jak se do administrace přihlásit

Přihlašuje se přes přístupový klíč z GitHubu. Klíč vytváříš jen jednou, prohlížeč si ho pak pamatuje.

1. Otevři administraci a klikni na **Sign In Using Access Token**.
2. V okně je odkaz na GitHub, který otevře stránku pro nový klíč s předvyplněným nastavením.
   Repozitář nech jen `drazka` a práva **Contents: Read and write**.
3. Klíč zkopíruj a vlož do administrace.

Klíč nikomu nedávej a nikam ho nevkládej, je to jako heslo k repozitáři. Učiteli administraci ukaž sám, přihlášený.
Tlačítko **Sign In with GitHub** tady nefunguje (potřebovalo by další službu), používej to s klíčem.

## Co se v administraci dá měnit

| Část | Co tam je |
| --- | --- |
| Menu | nápoje a jídlo, ceny, štítek Tip |
| Akce | poslechové večery, na webu jako vstupenky; proběhlé akce se samy schovají |
| Galerie | fotky v rámečku poštovní známky |
| Kavárna | název, slova v nadpisu, úvodní text a fotka, Právě hraje, O nás, adresa, e-mail, otevírací doba |

Po uložení se změna zapíše na GitHub a web se sám znovu nahraje. Trvá to asi minutu.

## Spuštění na počítači

```bash
npm install
npm run dev
```

Web pak běží na http://localhost:4321 a administrace na http://localhost:4321/admin/index.html.

## Nahrání na FTP (je vypnuté)

Web se po každé změně nahraje na GitHub Pages. Když budeš chtít i FTP (třeba školní server):

1. Na GitHubu otevři repozitář, pak **Settings → Secrets and variables → Actions**.
2. V záložce **Secrets** přidej `FTP_SERVER`, `FTP_UZIVATEL` a `FTP_HESLO`.
3. V záložce **Variables** přidej `FTP_ZAPNUTO` s hodnotou `true`.
4. Když má web na FTP běžet v podsložce, přidej i `FTP_SLOZKA` (složka na serveru, třeba `./drazka/`)
   a `FTP_ADRESA_WEBU` (začátek adresy, třeba `/drazka`).

Pak stačí v záložce **Actions** spustit **Nahrát web** znovu.

## Poděkování

Vstupenky, poštovní známky, měnící se nadpis a promáčknuté tlačítko jsou vlastní verze inspirované
studiemi [Kitchen od JP (dqnamo)](https://dqnamo.com/kitchen). Fotky jsou vygenerované přes Higgsfield.
