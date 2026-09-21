// data/countries/de.js — Deutschland: kuratierte Auswahl an Zulassungsbezirken.
(function () {
// ============================================================
// Deutschland: Kuerzel-System ist mit ueber 400 Zulassungsbezirken
// deutlich umfangreicher als Oesterreichs - hier daher bewusst nur
// eine kuratierte Auswahl (Landeshauptstaedte + bekannteste Grossstaedte
// je Bundesland), keine Vollstaendigkeit. Quelle: Wikipedia "Liste der
// Kfz-Kennzeichen in Deutschland" (Sep 2026 gegengeprueft).
// ============================================================
const DEUTSCHLAND_ORDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen", "Sonderkennzeichen"
];
const DEUTSCHLAND_KENNZEICHEN = [
  { code: "S",   bezirk: "Stuttgart",              bundesland: "Baden-Württemberg" },
  { code: "KA",  bezirk: "Karlsruhe",               bundesland: "Baden-Württemberg" },
  { code: "MA",  bezirk: "Mannheim",                bundesland: "Baden-Württemberg" },
  { code: "FR",  bezirk: "Freiburg im Breisgau",    bundesland: "Baden-Württemberg" },
  { code: "HD",  bezirk: "Heidelberg",              bundesland: "Baden-Württemberg" },
  { code: "UL",  bezirk: "Ulm",                     bundesland: "Baden-Württemberg" },
  { code: "M",   bezirk: "München",                 bundesland: "Bayern" },
  { code: "N",   bezirk: "Nürnberg",                bundesland: "Bayern" },
  { code: "A",   bezirk: "Augsburg",                bundesland: "Bayern" },
  { code: "R",   bezirk: "Regensburg",              bundesland: "Bayern" },
  { code: "WÜ",  bezirk: "Würzburg",                bundesland: "Bayern" },
  { code: "IN",  bezirk: "Ingolstadt",              bundesland: "Bayern" },
  { code: "B",   bezirk: "Berlin",                  bundesland: "Berlin" },
  { code: "P",   bezirk: "Potsdam",                 bundesland: "Brandenburg" },
  { code: "BB",  bezirk: "Brandenburg an der Havel", bundesland: "Brandenburg" },
  { code: "CB",  bezirk: "Cottbus",                 bundesland: "Brandenburg" },
  { code: "FF",  bezirk: "Frankfurt (Oder)",        bundesland: "Brandenburg" },
  { code: "HB",  bezirk: "Bremen",                  bundesland: "Bremen" },
  { code: "HH",  bezirk: "Hamburg",                 bundesland: "Hamburg" },
  { code: "F",   bezirk: "Frankfurt am Main",       bundesland: "Hessen" },
  { code: "WI",  bezirk: "Wiesbaden",               bundesland: "Hessen" },
  { code: "KS",  bezirk: "Kassel",                  bundesland: "Hessen" },
  { code: "DA",  bezirk: "Darmstadt",               bundesland: "Hessen" },
  { code: "OF",  bezirk: "Offenbach am Main",       bundesland: "Hessen" },
  { code: "SN",  bezirk: "Schwerin",                bundesland: "Mecklenburg-Vorpommern" },
  { code: "HRO", bezirk: "Rostock",                 bundesland: "Mecklenburg-Vorpommern" },
  { code: "HGW", bezirk: "Greifswald",              bundesland: "Mecklenburg-Vorpommern" },
  { code: "H",   bezirk: "Hannover",                bundesland: "Niedersachsen" },
  { code: "BS",  bezirk: "Braunschweig",            bundesland: "Niedersachsen" },
  { code: "OS",  bezirk: "Osnabrück",               bundesland: "Niedersachsen" },
  { code: "GÖ",  bezirk: "Göttingen",               bundesland: "Niedersachsen" },
  { code: "OL",  bezirk: "Oldenburg",               bundesland: "Niedersachsen" },
  { code: "D",   bezirk: "Düsseldorf",              bundesland: "Nordrhein-Westfalen" },
  { code: "K",   bezirk: "Köln",                    bundesland: "Nordrhein-Westfalen" },
  { code: "E",   bezirk: "Essen",                   bundesland: "Nordrhein-Westfalen" },
  { code: "DO",  bezirk: "Dortmund",                bundesland: "Nordrhein-Westfalen" },
  { code: "BN",  bezirk: "Bonn",                    bundesland: "Nordrhein-Westfalen" },
  { code: "MS",  bezirk: "Münster",                 bundesland: "Nordrhein-Westfalen" },
  { code: "AC",  bezirk: "Aachen",                  bundesland: "Nordrhein-Westfalen" },
  { code: "MZ",  bezirk: "Mainz",                   bundesland: "Rheinland-Pfalz" },
  { code: "KO",  bezirk: "Koblenz",                 bundesland: "Rheinland-Pfalz" },
  { code: "TR",  bezirk: "Trier",                   bundesland: "Rheinland-Pfalz" },
  { code: "LU",  bezirk: "Ludwigshafen am Rhein",   bundesland: "Rheinland-Pfalz" },
  { code: "SB",  bezirk: "Saarbrücken",             bundesland: "Saarland" },
  { code: "DD",  bezirk: "Dresden",                 bundesland: "Sachsen" },
  { code: "L",   bezirk: "Leipzig",                 bundesland: "Sachsen" },
  { code: "C",   bezirk: "Chemnitz",                bundesland: "Sachsen" },
  { code: "Z",   bezirk: "Zwickau",                 bundesland: "Sachsen" },
  { code: "MD",  bezirk: "Magdeburg",               bundesland: "Sachsen-Anhalt" },
  { code: "HAL", bezirk: "Halle (Saale)",           bundesland: "Sachsen-Anhalt" },
  { code: "DE",  bezirk: "Dessau-Roßlau",           bundesland: "Sachsen-Anhalt" },
  { code: "KI",  bezirk: "Kiel",                    bundesland: "Schleswig-Holstein" },
  { code: "FL",  bezirk: "Flensburg",               bundesland: "Schleswig-Holstein" },
  { code: "HL",  bezirk: "Lübeck",                  bundesland: "Schleswig-Holstein" },
  { code: "EF",  bezirk: "Erfurt",                  bundesland: "Thüringen" },
  { code: "J",   bezirk: "Jena",                    bundesland: "Thüringen" },
  { code: "G",   bezirk: "Gera",                    bundesland: "Thüringen" },
  // Sonderkennzeichen (Behoerden/Militaer) - werden seit 2007 nicht
  // mehr neu vergeben, sind aber weiterhin im Verkehr.
  { code: "Y",   bezirk: "Bundeswehr",                          bundesland: "Sonderkennzeichen" },
  { code: "X",   bezirk: "NATO-Hauptquartiere in Deutschland",  bundesland: "Sonderkennzeichen" },
  { code: "BD",  bezirk: "Bundesbehörden (Bundestag, Bundesregierung u.a.)", bundesland: "Sonderkennzeichen" },
];

  registerLand("Deutschland", {
    kennzeichen: DEUTSCHLAND_KENNZEICHEN,
    gruppen: DEUTSCHLAND_ORDER,
    regionen: DEUTSCHLAND_ORDER,
    regionLabel: "Bundesland",
    euText: "D",
    emoji: "🇩🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB 123",
    flagge: { typ: "de" },
    hatWappen: false,
  });
})();
