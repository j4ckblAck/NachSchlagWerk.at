# Neues Land hinzufügen

Zwei Schritte, kein Eingriff in bestehenden Code nötig:

## 1. Neue Datei in diesem Ordner anlegen, z. B. `data/countries/xy.js`

```js
// data/countries/xy.js — <Ländername> (<Nationalitätszeichen>)
(function () {
  const KENNZEICHEN = [
    { code: "AB", bezirk: "Beispielstadt", bundesland: "Beispielregion" },
    // ... weitere Kürzel
  ];

  registerLand("Ländername", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Beispielregion"],       // Reihenfolge der Regionen/Gruppen
    regionen: ["Beispielregion"],      // für den Regionen-Filter in der Liste
    regionLabel: "Region",             // Bezeichnung, die in der App auftaucht
    euText: "XY",                      // Nationalitätszeichen im EU-Band
    emoji: "🏳️",                        // Flaggen-Emoji fürs Dropdown
    euFarbe: "#003399",                // Farbe des EU-Bandes (bei Nicht-EU z. B. Nationalfarbe)
    euStern: true,                     // false = kein EU-Sternenkreis (z. B. Nicht-EU-Land)
    nrMuster: "123 AB",                // Beispielnummer fürs Simulator-Schild
    hatWappen: false,                  // true nur, wenn jedes Kürzel ein eigenes Bild-Wappen hat (siehe Österreich)
    // optional: flagge: { typ: "h", farben: ["#fff", "#c8102e"] }  -> horizontale Streifen
    // optional: flagge: { typ: "v", farben: ["#000", "#f0c419", "#c8102e"] } -> vertikale Streifen
  });
})();
```

Die IIFE `(function () { ... })()` sorgt dafür, dass eigene Hilfsvariablen (z. B. `KENNZEICHEN`) nicht mit denen anderer Länder-Dateien kollidieren.

## 2. In `index.html` eine Zeile ergänzen

Im Abschnitt "Daten: Länder" einfach eine weitere Zeile nach demselben Muster hinzufügen:

```html
<script src="data/countries/xy.js"></script>
```

Die Position der Zeile bestimmt die Reihenfolge im Land-Dropdown der App.

Das war's — `registry.js`, `js/core.js` und `js/kennzeichen.js` bleiben unverändert. Die App liest neue Länder automatisch mit, sobald `registerLand(...)` aufgerufen wurde.

## Felder im Detail

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `kennzeichen` | ja | Array von `{ code, bezirk, bundesland }` – ein Eintrag pro Kürzel |
| `gruppen` | ja | Reihenfolge der `bundesland`-Werte für die Gruppenübersicht |
| `regionen` | ja | Liste für den Regionen-Filter in "Alle Kennzeichen durchsuchen" |
| `regionLabel` | ja | Anzeigename der Region (z. B. "Bundesland", "Kanton", "Provinz") |
| `euText` | ja | Kürzel im blauen EU-Band (z. B. "D", "F", "PL") |
| `emoji` | ja | Länder-Flaggen-Emoji fürs Dropdown |
| `euFarbe` | ja | Hintergrundfarbe des Bandes links |
| `euStern` | ja | `true` = 12 goldene EU-Sterne, `false` = kein Sternenkreis |
| `nrMuster` | ja | Beispiel-Nummernschild-Text für den Simulator |
| `hatWappen` | ja | `true`, wenn es ein `WAPPEN_DATEI`-Bild je Region gibt (bisher nur Österreich) |
| `chKreuz` | nein | `true` = Schweizer Kreuz statt EU-Band (nur Schweiz) |
| `dunkel` | nein | `true` = dunkle/schwarze Tafel (z. B. Liechtenstein) |
| `euBandRechts` | nein | `true` = zusätzliches blaues Feld rechts (z. B. Italien) |
| `flagge` | nein | `{ typ: "h"/"v", farben: [...] }` für ein einfaches Streifen-Icon statt Wappen |

Für Länder ohne echten Regionsbezug (z. B. seit 2022 Ungarn) reicht ein einziger Eintrag im `kennzeichen`-Array, dessen `bezirk`-Text das erklärt — siehe `hu.js` als Vorlage.
