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
  { code: "H",  bezirk: "Ungarn (kein Bezirkscode – einheitliches System seit 2022)", bundesland: "Ungarn", codeVersteckt: true, nichtEingebbar: true },
  { code: "TX", bezirk: "Taxi bzw. umweltschonendes Auto",              gelb: true, bundesland: "Ungarn" },
  { code: "EV", bezirk: "Elektro-/Plug-in-Hybridfahrzeug (auf Wunsch, seit Okt. 2015)", gruenHg: true, bundesland: "Ungarn" },
  // Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen (Ungarn)").
  { code: "RA", bezirk: "Ungarische Polizei (Rendőrség)", bundesland: "Ungarn" },
  { code: "NA", bezirk: "Nationale Steuer- und Zollbehörde (Nemzeti Adó- és Vámhivatal)", bundesland: "Ungarn" },
  { code: "HA", bezirk: "Ungarische Streitkräfte (Magyar Honvédség)", bundesland: "Ungarn" },
  { code: "MA", bezirk: "Nationaler Rettungsdienst (Országos Mentőszolgálat)", bundesland: "Ungarn" },
  { code: "BA", bezirk: "Strafvollzug (Büntetés-végrehajtás)",     bundesland: "Ungarn" },
  { code: "OT", bezirk: "Oldtimer (historisches Kraftfahrzeug)",   bundesland: "Ungarn" },
  { code: "SP", bezirk: "Motorsport-Fahrzeug",                     bundesland: "Ungarn" },
  {
    code: "CD", bezirk: "Corps Diplomatique",
    nrMuster: "123-345", blauHg: true,
    bundesland: "Ungarn",
  },
  {
    code: "CK", bezirk: "Corps Consulaire (Konsuln)",
    nrMuster: "12-34", rot: true,
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
    // Wappen, zwei weitere Buchstaben, dreistellige Zahl).
    nrMuster: "AA-123",
    hatWappen: false,
  });
})();
