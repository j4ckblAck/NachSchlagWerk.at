// data/countries/it.js — Italien: kuratierte Auswahl an Provinzkuerzeln je Region.
(function () {
// ============================================================
// Italien: Provinzkuerzel sind seit 1999 offiziell optional (rechter
// blauer Streifen), aber jedem bekannt. Kuratierte Auswahl - eine
// Provinz je Region, keine Vollstaendigkeit (103 Provinzen gesamt).
// ============================================================
const ITALIEN_ORDER = [
  "Piemont", "Aostatal", "Lombardei", "Trentino-Südtirol", "Venetien",
  "Friaul-Julisch Venetien", "Ligurien", "Emilia-Romagna", "Toskana",
  "Umbrien", "Marken", "Latium", "Abruzzen", "Molise", "Kampanien",
  "Apulien", "Basilikata", "Kalabrien", "Sizilien", "Sardinien",
  "Sonderkennzeichen"
];
const ITALIEN_KENNZEICHEN = [
  { code: "TO", bezirk: "Torino (Turin)",                    bundesland: "Piemont" },
  { code: "AO", bezirk: "Aosta",                      bundesland: "Aostatal" },
  { code: "MI", bezirk: "Milano (Mailand)",                     bundesland: "Lombardei" },
  { code: "TN", bezirk: "Trient / Trento",            bundesland: "Trentino-Südtirol" },
  { code: "BZ", bezirk: "Bozen / Bolzano",            bundesland: "Trentino-Südtirol" },
  { code: "VE", bezirk: "Venedig / Venezia",          bundesland: "Venetien" },
  { code: "VR", bezirk: "Verona",                     bundesland: "Venetien" },
  { code: "TS", bezirk: "Triest / Trieste",           bundesland: "Friaul-Julisch Venetien" },
  { code: "GE", bezirk: "Genua / Genova",             bundesland: "Ligurien" },
  { code: "BO", bezirk: "Bologna",                    bundesland: "Emilia-Romagna" },
  { code: "FI", bezirk: "Florenz / Firenze",          bundesland: "Toskana" },
  { code: "SI", bezirk: "Siena",                      bundesland: "Toskana" },
  { code: "PI", bezirk: "Pisa",                       bundesland: "Toskana" },
  { code: "PG", bezirk: "Perugia",                    bundesland: "Umbrien" },
  { code: "AN", bezirk: "Ancona",                     bundesland: "Marken" },
  { code: "RM", bezirk: "Rom / Roma",                 bundesland: "Latium" },
  { code: "AQ", bezirk: "L'Aquila",                   bundesland: "Abruzzen" },
  { code: "CB", bezirk: "Campobasso",                 bundesland: "Molise" },
  { code: "NA", bezirk: "Neapel / Napoli",             bundesland: "Kampanien" },
  { code: "BA", bezirk: "Bari",                       bundesland: "Apulien" },
  { code: "PZ", bezirk: "Potenza",                    bundesland: "Basilikata" },
  { code: "RC", bezirk: "Reggio Calabria",             bundesland: "Kalabrien" },
  { code: "PA", bezirk: "Palermo",                    bundesland: "Sizilien" },
  { code: "CT", bezirk: "Catania",                    bundesland: "Sizilien" },
  { code: "CA", bezirk: "Cagliari",                   bundesland: "Sardinien" },
  // Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen (Italien)", Sep 2026).
  // "CC" steht bei italienischen Kennzeichen fuer die Carabinieri, NICHT
  // fuer Konsulate (anders als in anderen Laendern dieser App) - war
  // vorher falsch als "Corpo Consolare" eingetragen, jetzt korrigiert.
  { code: "CD",   bezirk: "Corpo Diplomatico (Diplomaten)",              bundesland: "Sonderkennzeichen" },
  { code: "UNP",  bezirk: "Vereinte Nationen (UN-Missionen)",            bundesland: "Sonderkennzeichen" },
  { code: "CC",   bezirk: "Carabinieri (Militärpolizei)",                bundesland: "Sonderkennzeichen" },
  { code: "EI",   bezirk: "Esercito Italiano (Heer)",                    bundesland: "Sonderkennzeichen" },
  { code: "MM",   bezirk: "Marina Militare (Marine)",                    bundesland: "Sonderkennzeichen" },
  { code: "AM",   bezirk: "Aeronautica Militare (Luftwaffe)",            bundesland: "Sonderkennzeichen" },
  { code: "GdiF", bezirk: "Guardia di Finanza (Finanzpolizei)",          bundesland: "Sonderkennzeichen" },
  { code: "CP",   bezirk: "Capitaneria di Porto (Küstenwache)",          bundesland: "Sonderkennzeichen" },
  { code: "VF",   bezirk: "Vigili del Fuoco (Feuerwehr)",                bundesland: "Sonderkennzeichen" },
  { code: "PC",   bezirk: "Protezione Civile (Zivilschutz)",             bundesland: "Sonderkennzeichen" },
  { code: "CRI",  bezirk: "Croce Rossa Italiana (Rotes Kreuz)",          bundesland: "Sonderkennzeichen" },
  { code: "SMOM", bezirk: "Sovrano Militare Ordine di Malta (Malteserorden)", bundesland: "Sonderkennzeichen" },
  { code: "EE",   bezirk: "Escursionisti Esteri (Besucher ohne Wohnsitz in Italien)", bundesland: "Sonderkennzeichen" },
];

  registerLand("Italien", {
    euBandRechts: true,
    kennzeichen: ITALIEN_KENNZEICHEN,
    gruppen: ITALIEN_ORDER,
    regionen: ITALIEN_ORDER,
    regionLabel: "Region",
    euText: "I",
    emoji: "🇮🇹",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "123 BB",
    hatWappen: false,
  });
})();
