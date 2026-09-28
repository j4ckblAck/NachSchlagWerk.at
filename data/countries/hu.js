// data/countries/hu.js — Ungarn: seit 2022 ohne Bezirkscode.
// Aufbau/Kuerzel/Farben nach Wikipedia "Kfz-Kennzeichen (Ungarn)"
// (abgerufen 2026): normale Kennzeichen sind zweizeilig gedacht mit
// blauem EU-Balken, zwei Buchstaben, Wappen, zwei weiteren Buchstaben
// und dreistelliger Zahl (z.B. "AA-AA-123"). Taxi/LKW: schwarze
// Schrift auf GELBEM Grund. E-/Plug-in-Hybrid-Fahrzeuge (seit 2015):
// schwarze Schrift auf GRUENEM Grund. Diplomaten (seit Mai 2017):
// WEISSE Schrift auf BLAUEM Grund, Format "CD 123-345" (erster
// Zifferblock = Laendercode). Konsuln: ROTE Schrift auf weissem Grund.
(function () {
  // ============================================================
  // Ungarn: seit 1. Juli 2022 ein einheitliches System ohne
  // Bezirkscode - aus dem Kuerzel ist keine Region mehr ablesbar.
  // ============================================================
  const UNGARN_KENNZEICHEN = [
    // "AA" ist das nichtssagende, rein fortlaufende ERSTE Buchstaben-
    // paar - genau wie Albaniens "AB" hier als EIN echtes, eintippbares
    // Kuerzel angelegt (kein Platzhalter mehr) und per "standardKuerzel"
    // unten automatisch vorausgewaehlt, sobald Ungarn ausgewaehlt wird.
    { code: "AA", bezirk: "(kein Regionsbezug)", bundesland: "Ungarn" },
 { code: "TX", bezirk: "Taxi",              gelb: true, bundesland: "Ungarn" },
 { code: "EV", bezirk: "Elektro-/Plug-in-Hybridfahrzeug", gruenHg: true, bundesland: "Ungarn" },
 // Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen (Ungarn)").
 { code: "RA", bezirk: "Polizei (Rendőrség)", bundesland: "Ungarn" },
 { code: "NA", bezirk: "Steuer-/ Zollbehörde (Nemzeti Adó- és Vámhivatal)", bundesland: "Ungarn" },
 { code: "HA", bezirk: "Militär (Magyar Honvédség)", bundesland: "Ungarn" },
 { code: "MA", bezirk: "Rettung (Országos Mentőszolgálat)", bundesland: "Ungarn" },
 { code: "BA", bezirk: "Strafvollzug (Büntetés-végrehajtás)",     bundesland: "Ungarn" },
 { code: "OT", bezirk: "Oldtimer",   bundesland: "Ungarn" },
 { code: "SP", bezirk: "Motorsport-Fahrzeug",                     bundesland: "Ungarn" },
 {
   // Kein zweizeiliges Format mit Wappen wie die normalen Kennzeichen -
   // nur Zifferblock + Laendercode, darum "keinWappen".
   code: "CD", bezirk: "Diplomat (Corps Diplomatique)",
 nrMuster: "123-345", blauHg: true, keinWappen: true,
 bundesland: "Ungarn",
 },
 {
   code: "CK", bezirk: "Konsuln (Corps Consulaire)",
 nrMuster: "12-34", rot: true, keinWappen: true,
 bundesland: "Ungarn",
 },
  ];

  registerLand("Ungarn", {
    kennzeichen: UNGARN_KENNZEICHEN,
    gruppen: ["Ungarn"],
    regionen: ["Ungarn"],
    regionLabel: "Land",
    euText: "H",
    emoji: "🇭🇺",
    euFarbe: "#003399",
    euStern: true,
    // War vorher faelschlich "CH-123" (das ist die Schweiz) - echtes
    // ungarisches Format seit 2022 ist AA-AA-123 (zwei Buchstaben,
    // Wappen, zwei weitere Buchstaben, dreistellige Zahl). Das ZWEITE
    // Buchstabenpaar hier bewusst "BC" statt "AA" - sonst wiederholt
    // sich "AA" im Leerzustand-Beispiel unnoetig ("AA"+Wappen+"AA-123"
    // sah aus wie ein Kopierfehler statt zwei unabhaengiger Buchstaben-
    // paare).
    nrMuster: "BC-123",
    hatWappen: false,
    // "AA" (der erste, echte Eintrag oben) soll schon geladen sein,
    // sobald Ungarn ausgewaehlt ist - auch ohne dass extra etwas in
    // Feld 2 getippt wird (siehe kzLandWechseln).
    standardKuerzel: true,
    // Vereinfachtes ungarisches Staatswappen (siehe landFlaggeSvg,
    // spec.typ "hu").
    flagge: { typ: "hu" },
  });
})();
