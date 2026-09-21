// data/countries/hu.js — Ungarn: seit 2022 ohne Bezirkscode.
(function () {
// ============================================================
// Ungarn: seit 1. Juli 2022 ein einheitliches System ohne
// Bezirkscode - aus dem Kuerzel ist keine Region mehr ablesbar.
// ============================================================
const UNGARN_KENNZEICHEN = [
  { code: "H",  bezirk: "Ungarn (kein Bezirkscode – einheitliches System seit 2022)", bundesland: "Ungarn" },
  // Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen (Ungarn)")
  { code: "RA", bezirk: "Polizei (Rendőrség)",                     bundesland: "Ungarn" },
  { code: "HA", bezirk: "Honvédség (Streitkräfte)",                bundesland: "Ungarn" },
  { code: "MA", bezirk: "Rettungsdienst (Mentőszolgálat)",         bundesland: "Ungarn" },
  { code: "NA", bezirk: "Zoll- und Finanzverwaltung (Nemzeti Adó- és Vámhivatal)", bundesland: "Ungarn" },
  { code: "BA", bezirk: "Strafvollzug (Büntetés-végrehajtás)",     bundesland: "Ungarn" },
  { code: "CD", bezirk: "Corps Diplomatique",                      bundesland: "Ungarn" },
  { code: "TX", bezirk: "Taxi", gelb: true,   bundesland: "Ungarn" },
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
    nrMuster: "CH-123",
    flagge: { typ: "hu" },
    hatWappen: false,
  });
})();
