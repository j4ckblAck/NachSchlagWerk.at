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
