# Oh, mon Dieu! — Website

Statische Website für die Parfummarke **Oh, mon Dieu!** (reines HTML/CSS/JS, kein Build-Tool nötig).

## Struktur

```
oh-mon-dieu/
├── index.html          Startseite
├── ueber-uns.html       Markenstory
├── produkte.html        Duft-Kollektion (noch ohne Kaufoption)
├── kontakt.html          Kontaktformular
├── css/style.css        Design-System (Farben, Typografie, Komponenten)
├── js/main.js           Mobile-Navigation, Formularvalidierung, Newsletter
└── images/              Bildmaterial (aktuell leer, siehe unten)
```

## Lokal ansehen

Kein Server nötig — `index.html` kann direkt im Browser geöffnet werden.
Für eine realistischere Vorschau (empfohlen, z.B. wegen der Google Fonts) reicht auch ein
einfacher lokaler Server:

```bash
cd oh-mon-dieu
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

In VS Code eignet sich dafür auch die Extension **Live Server**.

## Design

- **Farben:** Bordeaux (`--color-bordeaux`) als Hauptfarbe, Gold als Akzent, Creme als
  Hintergrund — abgeleitet aus der Umfrage zum Markenauftritt. Alle Farben liegen als
  CSS-Variablen in `css/style.css` ganz oben und lassen sich dort zentral anpassen.
- **Schriften:** „Cormorant Garamond" (Überschriften, Logo) + „Jost" (Fliesstext),
  beide über Google Fonts eingebunden.
- **Flakon-Platzhalter:** Die Duft-Visuals sind aktuell einfache CSS-Platzhalter
  (`.flakon-placeholder`). Sobald echte Produktfotos vorhanden sind, können sie in
  `images/` abgelegt und die Platzhalter-`div`s durch `<img>`-Tags ersetzt werden.

## Offene Punkte / nächste Schritte

- **Logo:** Der Schriftzug „Oh, mon Dieu!" ist aktuell als Text mit Cormorant Garamond
  Italic gesetzt. Sobald ein finales Logo-File existiert, kann es die `.logo`-Klasse
  ersetzen (z.B. als SVG in `images/logo.svg`).
- **Produktfotos:** Aktuell Platzhalter — echte Flakon-Fotos in `images/` ablegen und
  in den `.product-visual`- bzw. `.visual`-Containern verlinken.
- **Kontaktformular:** Validiert aktuell nur im Browser, versendet aber noch keine
  E-Mail. Für echten Versand z.B. [Formspree](https://formspree.io) oder Netlify Forms
  anbinden (siehe Kommentar in `kontakt.html`).
- **Newsletter-Formular:** Aktuell nur simuliertes Feedback (siehe Kommentar in
  `js/main.js`). Für einen echten Verteiler z.B. Mailchimp oder Brevo anbinden.
- **Shop / Shopify:** Die Produktkarten in `produkte.html` tragen bereits
  `data-product-id`-Attribute als Platzhalter für eine spätere Anbindung an Shopify
  (z.B. via Shopify Buy Button SDK) oder eine eigene Warenkorb-Lösung.

## Deployment

Da es sich um eine reine statische Website handelt, kann sie direkt über GitHub Pages,
Netlify oder Vercel gehostet werden — ohne weitere Konfiguration.
