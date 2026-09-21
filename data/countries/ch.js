// data/countries/ch.js — Schweiz: Kantonskuerzel + Sonderkennzeichen.
(function () {
// ============================================================
// Schweiz: Kantonskuerzel (identisch mit den echten Kfz-Kennzeichen)
// ============================================================
const SCHWEIZ_KENNZEICHEN = [
  { code: "ZH", bezirk: "Zürich",               bundesland: "Schweiz" },
  { code: "BE", bezirk: "Bern",                 bundesland: "Schweiz" },
  { code: "LU", bezirk: "Luzern",               bundesland: "Schweiz" },
  { code: "UR", bezirk: "Uri",                  bundesland: "Schweiz" },
  { code: "SZ", bezirk: "Schwyz",               bundesland: "Schweiz" },
  { code: "OW", bezirk: "Obwalden",             bundesland: "Schweiz" },
  { code: "NW", bezirk: "Nidwalden",            bundesland: "Schweiz" },
  { code: "GL", bezirk: "Glarus",               bundesland: "Schweiz" },
  { code: "ZG", bezirk: "Zug",                  bundesland: "Schweiz" },
  { code: "FR", bezirk: "Freiburg",             bundesland: "Schweiz" },
  { code: "SO", bezirk: "Solothurn",            bundesland: "Schweiz" },
  { code: "BS", bezirk: "Basel-Stadt",          bundesland: "Schweiz" },
  { code: "BL", bezirk: "Basel-Landschaft",     bundesland: "Schweiz" },
  { code: "SH", bezirk: "Schaffhausen",         bundesland: "Schweiz" },
  { code: "AR", bezirk: "Appenzell Ausserrhoden", bundesland: "Schweiz" },
  { code: "AI", bezirk: "Appenzell Innerrhoden", bundesland: "Schweiz" },
  { code: "SG", bezirk: "St. Gallen",           bundesland: "Schweiz" },
  { code: "GR", bezirk: "Graubünden",           bundesland: "Schweiz" },
  { code: "AG", bezirk: "Aargau",               bundesland: "Schweiz" },
  { code: "TG", bezirk: "Thurgau",              bundesland: "Schweiz" },
  { code: "TI", bezirk: "Tessin",               bundesland: "Schweiz" },
  { code: "VD", bezirk: "Waadt",                bundesland: "Schweiz" },
  { code: "VS", bezirk: "Wallis",               bundesland: "Schweiz" },
  { code: "NE", bezirk: "Neuenburg",            bundesland: "Schweiz" },
  { code: "GE", bezirk: "Genf",                 bundesland: "Schweiz" },
  { code: "JU", bezirk: "Jura",                 bundesland: "Schweiz" },
];
const SCHWEIZ_KANTONE = SCHWEIZ_KENNZEICHEN.map(k => k.bezirk);

// Sonderkennzeichen (Quelle: Wikipedia "Kontrollschild (Schweiz)" /
// "Diplomatenkennzeichen", Sep 2026 gegengeprueft).
const CH_SONDERKENNZEICHEN = [
  // Militaerkennzeichen sind schwarz (nicht weiss wie normale CH-Schilder)
  // und tragen KEIN Kantonswappen am Schluss - nur das Kreuz am Anfang.
  { code: "M",  bezirk: "Militär (Armee, Grenzwachtkorps)", bundesland: "Sonderkennzeichen", dunkel: true, keinWappen: true },
  { code: "CD", bezirk: "Corps Diplomatique",                            bundesland: "Sonderkennzeichen" },
  { code: "CC", bezirk: "Corps Consulaire",                              bundesland: "Sonderkennzeichen" },
  { code: "AT", bezirk: "Administratives und technisches Personal",      bundesland: "Sonderkennzeichen" },
];

  registerLand("Schweiz", {
    kennzeichen: SCHWEIZ_KENNZEICHEN.concat(CH_SONDERKENNZEICHEN),
    gruppen: ["Schweiz", "Sonderkennzeichen"],
    regionen: SCHWEIZ_KANTONE.concat(["Sonderkennzeichen"]),
    regionLabel: "Kanton",
    euText: "CH",
    emoji: "🇨🇭",
    euFarbe: "#d52b1e",
    euStern: false,
    chKreuz: true,
    nrMuster: "123456",
    flagge: { typ: "ch" },
    hatWappen: false,
  });
})();
