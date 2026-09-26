// ============================================================
// data/registry.js — zentrales Länder-Register für das
// Kennzeichen-Modul. NICHT anfassen, wenn du nur ein Land
// hinzufügen willst - siehe stattdessen data/countries/ANLEITUNG.md.
//
// Jede Datei in data/countries/ ruft am Ende registerLand(name, config)
// auf und trägt sich damit selbst in LAENDER/LAENDER_ORDER ein. Die
// Reihenfolge der <script>-Tags in index.html bestimmt die Reihenfolge
// im Land-Dropdown der App.
// ============================================================
const LAENDER = {};
const LAENDER_ORDER = [];

function registerLand(name, config) {
  if (LAENDER[name]) {
    console.warn('Land "' + name + '" wurde mehrfach registriert - zweite Registrierung wird ignoriert.');
    return;
  }
  LAENDER[name] = config;
  LAENDER_ORDER.push(name);
}

// ============================================================
// LANDKARTEN: generisches Register fuer die optionale Umrisskarte
// eines Landes (siehe js/kennzeichen.js -> kzKarteAufbauen). Eine
// "<land>-karte.js"-Datei ruft registerKarte(name, daten) auf, mit:
//   viewBox:     SVG-viewBox-String, z.B. "0 0 600 800"
//   staatPfad:   ein Pfad (d-Attribut) fuer die Landesaussenlinie
//   regionPfade: { Regionsname: Pfad } - eine Flaeche pro Bundesland/
//                Region (Pflicht fuer eine funktionierende Karte)
//   bezirkPfade: optional, { Bezirksname: Pfad } fuer feinere Ebene
//   bezirkKuerzel, grenzpunkte, nachbarLabel: optionale Deko-Extras
// Fehlt regionPfade oder staatPfad, blendet js/kennzeichen.js die
// Karte fuer dieses Land einfach aus (siehe kzKarteAktualisieren).
// ============================================================
const LANDKARTEN = {};

function registerKarte(name, daten) {
  if (LANDKARTEN[name]) {
    console.warn('Karte fuer "' + name + '" wurde mehrfach registriert - zweite Registrierung wird ignoriert.');
    return;
  }
  LANDKARTEN[name] = daten;
}
