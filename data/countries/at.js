// data/countries/at.js — Oesterreich: Bezirkskuerzel, Sonderkennzeichen,
// Bundeslaender, Wappen-Dateipfade. Benoetigt _at-karte.js (siehe dort)
// fuer AT_STAAT_PFAD/AT_LAND_PFADE/AT_BEZIRK_PFADE.
(function () {
// ============================================================
// Kfz-Kennzeichen: Bezirkskuerzel nach Bundesland
// Quelle: oesterreich.gv.at (zusammengestellt/gegengeprueft Sep 2026)
// ============================================================

const KENNZEICHEN_ORDER = [
  "Burgenland", "Wien", "Niederösterreich", "Oberösterreich",
  "Steiermark", "Kärnten", "Salzburg", "Tirol", "Vorarlberg",
  "Sonderkennzeichen"
];

const KENNZEICHEN = [
  // Burgenland
  { code: "E",  bezirk: "Eisenstadt – Stadt",     bundesland: "Burgenland" },
  { code: "EU", bezirk: "Eisenstadt-Umgebung",    bundesland: "Burgenland" },
  { code: "GS", bezirk: "Güssing",                bundesland: "Burgenland" },
  { code: "JE", bezirk: "Jennersdorf",            bundesland: "Burgenland" },
  { code: "MA", bezirk: "Mattersburg",            bundesland: "Burgenland" },
  { code: "ND", bezirk: "Neusiedl am See",        bundesland: "Burgenland" },
  { code: "OP", bezirk: "Oberpullendorf",         bundesland: "Burgenland" },
  { code: "OW", bezirk: "Oberwart",               bundesland: "Burgenland" },

  // Wien
  { code: "W",  bezirk: "Wien",                   bundesland: "Wien" },

  // Niederösterreich
  { code: "AM", bezirk: "Amstetten",              bundesland: "Niederösterreich" },
  { code: "BL", bezirk: "Bruck an der Leitha",    bundesland: "Niederösterreich" },
  { code: "BN", bezirk: "Baden",                  bundesland: "Niederösterreich" },
  { code: "GD", bezirk: "Gmünd",                  bundesland: "Niederösterreich" },
  { code: "GF", bezirk: "Gänserndorf",            bundesland: "Niederösterreich" },
  { code: "HL", bezirk: "Hollabrunn",             bundesland: "Niederösterreich" },
  { code: "HO", bezirk: "Horn",                   bundesland: "Niederösterreich" },
  { code: "KG", bezirk: "Klosterneuburg",         bundesland: "Niederösterreich" },
  { code: "KO", bezirk: "Korneuburg",             bundesland: "Niederösterreich" },
  { code: "KR", bezirk: "Krems-Land",             bundesland: "Niederösterreich" },
  { code: "KS", bezirk: "Krems an der Donau – Stadt", bundesland: "Niederösterreich" },
  { code: "LF", bezirk: "Lilienfeld",             bundesland: "Niederösterreich" },
  { code: "MD", bezirk: "Mödling",                bundesland: "Niederösterreich" },
  { code: "ME", bezirk: "Melk",                   bundesland: "Niederösterreich" },
  { code: "MI", bezirk: "Mistelbach",             bundesland: "Niederösterreich" },
  { code: "NK", bezirk: "Neunkirchen",            bundesland: "Niederösterreich" },
  { code: "P",  bezirk: "St. Pölten – Stadt",     bundesland: "Niederösterreich" },
  { code: "PL", bezirk: "St. Pölten-Land",        bundesland: "Niederösterreich" },
  { code: "SB", bezirk: "Scheibbs",               bundesland: "Niederösterreich" },
  { code: "SW", bezirk: "Schwechat",              bundesland: "Niederösterreich" },
  { code: "TU", bezirk: "Tulln",                  bundesland: "Niederösterreich" },
  { code: "WB", bezirk: "Wiener Neustadt-Land",   bundesland: "Niederösterreich" },
  { code: "WN", bezirk: "Wiener Neustadt – Stadt", bundesland: "Niederösterreich" },
  { code: "WT", bezirk: "Waidhofen an der Thaya", bundesland: "Niederösterreich" },
  { code: "WY", bezirk: "Waidhofen an der Ybbs",  bundesland: "Niederösterreich" },
  { code: "ZT", bezirk: "Zwettl",                 bundesland: "Niederösterreich" },

  // Oberösterreich
  { code: "BR", bezirk: "Braunau am Inn",         bundesland: "Oberösterreich" },
  { code: "EF", bezirk: "Eferding",               bundesland: "Oberösterreich" },
  { code: "FR", bezirk: "Freistadt",              bundesland: "Oberösterreich" },
  { code: "GM", bezirk: "Gmunden",                bundesland: "Oberösterreich" },
  { code: "GR", bezirk: "Grieskirchen",           bundesland: "Oberösterreich" },
  { code: "KI", bezirk: "Kirchdorf an der Krems", bundesland: "Oberösterreich" },
  { code: "L",  bezirk: "Linz – Stadt",           bundesland: "Oberösterreich" },
  { code: "LL", bezirk: "Linz-Land",              bundesland: "Oberösterreich" },
  { code: "PE", bezirk: "Perg",                   bundesland: "Oberösterreich" },
  { code: "RI", bezirk: "Ried im Innkreis",       bundesland: "Oberösterreich" },
  { code: "RO", bezirk: "Rohrbach",               bundesland: "Oberösterreich" },
  { code: "SD", bezirk: "Schärding",              bundesland: "Oberösterreich" },
  { code: "SE", bezirk: "Steyr-Land",             bundesland: "Oberösterreich" },
  { code: "SR", bezirk: "Steyr – Stadt",          bundesland: "Oberösterreich" },
  { code: "UU", bezirk: "Urfahr-Umgebung",        bundesland: "Oberösterreich" },
  { code: "VB", bezirk: "Vöcklabruck",            bundesland: "Oberösterreich" },
  { code: "WE", bezirk: "Wels – Stadt",           bundesland: "Oberösterreich" },
  { code: "WL", bezirk: "Wels-Land",              bundesland: "Oberösterreich" },

  // Steiermark
  { code: "BA", bezirk: "Bad Aussee / Ausseerland", bundesland: "Steiermark" },
  { code: "BM", bezirk: "Bruck-Mürzzuschlag",     bundesland: "Steiermark" },
  { code: "DL", bezirk: "Deutschlandsberg",       bundesland: "Steiermark" },
  { code: "G",  bezirk: "Graz",                   bundesland: "Steiermark" },
  { code: "GB", bezirk: "Gröbming",               bundesland: "Steiermark" },
  { code: "GU", bezirk: "Graz-Umgebung",          bundesland: "Steiermark" },
  { code: "HF", bezirk: "Hartberg-Fürstenfeld",   bundesland: "Steiermark" },
  { code: "LB", bezirk: "Leibnitz",               bundesland: "Steiermark" },
  { code: "LE", bezirk: "Leoben – Stadt",         bundesland: "Steiermark" },
  { code: "LI", bezirk: "Liezen",                 bundesland: "Steiermark" },
  { code: "LN", bezirk: "Leoben",                 bundesland: "Steiermark" },
  { code: "MT", bezirk: "Murtal",                 bundesland: "Steiermark" },
  { code: "MU", bezirk: "Murau",                  bundesland: "Steiermark" },
  { code: "SO", bezirk: "Südoststeiermark",       bundesland: "Steiermark" },
  { code: "VO", bezirk: "Voitsberg",              bundesland: "Steiermark" },
  { code: "WZ", bezirk: "Weiz",                   bundesland: "Steiermark" },

  // Kärnten
  { code: "FE", bezirk: "Feldkirchen",            bundesland: "Kärnten" },
  { code: "HE", bezirk: "Hermagor",               bundesland: "Kärnten" },
  { code: "K",  bezirk: "Klagenfurt – Stadt",     bundesland: "Kärnten" },
  { code: "KL", bezirk: "Klagenfurt-Land",        bundesland: "Kärnten" },
  { code: "SP", bezirk: "Spittal an der Drau",    bundesland: "Kärnten" },
  { code: "SV", bezirk: "St. Veit an der Glan",   bundesland: "Kärnten" },
  { code: "VI", bezirk: "Villach – Stadt",        bundesland: "Kärnten" },
  { code: "VK", bezirk: "Völkermarkt",            bundesland: "Kärnten" },
  { code: "VL", bezirk: "Villach-Land",           bundesland: "Kärnten" },
  { code: "WO", bezirk: "Wolfsberg",              bundesland: "Kärnten" },

  // Salzburg
  { code: "HA", bezirk: "Hallein",                bundesland: "Salzburg" },
  { code: "JO", bezirk: "St. Johann im Pongau",   bundesland: "Salzburg" },
  { code: "S",  bezirk: "Salzburg – Stadt",       bundesland: "Salzburg" },
  { code: "SL", bezirk: "Salzburg-Umgebung",      bundesland: "Salzburg" },
  { code: "TA", bezirk: "Tamsweg",                bundesland: "Salzburg" },
  { code: "ZE", bezirk: "Zell am See",            bundesland: "Salzburg" },

  // Tirol
  { code: "I",  bezirk: "Innsbruck – Stadt",      bundesland: "Tirol" },
  { code: "IL", bezirk: "Innsbruck-Land",         bundesland: "Tirol" },
  { code: "IM", bezirk: "Imst",                   bundesland: "Tirol" },
  { code: "KB", bezirk: "Kitzbühel",              bundesland: "Tirol" },
  { code: "KU", bezirk: "Kufstein",               bundesland: "Tirol" },
  { code: "LA", bezirk: "Landeck",                bundesland: "Tirol" },
  { code: "LZ", bezirk: "Lienz",                  bundesland: "Tirol" },
  { code: "RE", bezirk: "Reutte",                 bundesland: "Tirol" },
  { code: "SZ", bezirk: "Schwaz",                 bundesland: "Tirol" },

  // Vorarlberg
  { code: "B",  bezirk: "Bregenz",                bundesland: "Vorarlberg" },
  { code: "BZ", bezirk: "Bludenz",                bundesland: "Vorarlberg" },
  { code: "DO", bezirk: "Dornbirn",               bundesland: "Vorarlberg" },
  { code: "FK", bezirk: "Feldkirch",              bundesland: "Vorarlberg" },
];

// Liste der Bundesland-Namen fuer Dropdown/Autovervollstaendigung
const BUNDESLAND_LISTE = [
  "Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich",
  "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien",
  "Sonderkennzeichen"
];

// Echte Landeswappen (aus dem vom Nutzer gesendeten Bild ausgeschnitten).
// Niederösterreich traegt auf dem echten Kennzeichen zusaetzlich die
// goldene Mauerkrone ueber dem Schild - als einziges Bundesland.
const WAPPEN_DATEI = {
  "Burgenland": "wappen/burgenland.png",
  "Kärnten": "wappen/kaernten.png",
  "Niederösterreich": "wappen/niederoesterreich.png",
  "Oberösterreich": "wappen/oberoesterreich.png",
  "Salzburg": "wappen/salzburg.png",
  "Steiermark": "wappen/steiermark.png",
  "Tirol": "wappen/tirol.png",
  "Vorarlberg": "wappen/vorarlberg.png",
  "Wien": "wappen/wien.png",
  "Sonderkennzeichen": "wappen/bund.png",
};

// ============================================================
// Sonderkennzeichen: eigene Kategorie statt Bezirk - zeigt den
// Bundesadler (Bundeswappen der Republik) statt eines Landeswappens.
// Quelle: oesterreich.gv.at, "Sonderkennzeichen auf oesterreichischen
// Kraftfahrzeugen" (Sep 2026 gegengeprueft).
// ============================================================
// Nummernformat pro Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen
// (Österreich)", Sep 2026): die meisten Bundesbehoerden-Kennzeichen (A,
// BH, BP, JW, FV, BD, PT) haben NUR Ziffern (bis zu 5) hinter dem
// Kuerzel - NUR bei FW (Feuerwehr) steht am Ende der Nummer zusaetzlich
// ein Bezirks-Vormerkbuchstabe. Die Diplomaten-Kennzeichen (CD/CC/WD/WK)
// haben einen Bindestrich vor der (bis zu 5-stelligen) Nummer.
const SONDERKENNZEICHEN = [
  { code: "A",  bezirk: "Höchste Repräsentanten (Bundespräsident, Regierung, Höchstgerichte)", nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "BH", bezirk: "Bundesheer",                                      nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "BP", bezirk: "Bundespolizei",                                   nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "FW", bezirk: "Feuerwehr (freiwillig und berufs, seit 2019/2020 einheitlich)", nrMuster: "231 VO", eigenesWappen: "at-fw", wappenText: "Feuerwehr", bundesland: "Sonderkennzeichen" },
  { code: "JW", bezirk: "Justizwache",                                    nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "FV", bezirk: "Finanzverwaltung",                               nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "BD", bezirk: "Post-/Bahnbus (ÖBB, Post)",                      nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "PT", bezirk: "Post",                                          nrMuster: "12345", bundesland: "Sonderkennzeichen" },
  { code: "CD", bezirk: "Corps Diplomatique (internationale Organisationen)", nrMuster: "-12345", keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "CC", bezirk: "Corps Consulaire (Berufskonsuln)",                nrMuster: "-12345", keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "WD", bezirk: "Diplomaten Wien (Muster: Bundesland-Buchstabe + D)",  nrMuster: "-12345", keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "WK", bezirk: "Konsulat Wien (Muster: Bundesland-Buchstabe + K)",    nrMuster: "-12345", keinWappen: true, bundesland: "Sonderkennzeichen" },
];

  registerLand("Österreich", {
    kennzeichen: KENNZEICHEN.concat(SONDERKENNZEICHEN),
    gruppen: KENNZEICHEN_ORDER,
    regionen: BUNDESLAND_LISTE,
    regionLabel: "Bundesland",
    euText: "A",
    emoji: "🇦🇹",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "123 AB",
    hatWappen: true,
  });
  // WAPPEN_DATEI bleibt global (nicht in der IIFE gefangen), weil
  // js/kennzeichen.js direkt darauf zugreift (siehe kzWappenZeigen).
  window.WAPPEN_DATEI = WAPPEN_DATEI;
  // KENNZEICHEN bleibt zusaetzlich global (nicht nur in LAENDER), weil
  // js/kennzeichen.js dafuer direkt darauf zugreift: atBezirkBundesland()
  // braucht die Bezirksliste fuer den Bundesland-Kuerzel-Tooltip auf der
  // Landkarte (z.B. "Amstetten (NÖ)").
  window.KENNZEICHEN = KENNZEICHEN;
})();
