// data/countries/is.js — Island: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "IS", bezirk: "Island (kein Regionsbezug, Flagge statt blauem EU-Band)", bundesland: "Island", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Diplomaten (weiße Schrift auf grüner Tafel)", nrMuster: "A12", gruenHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Island", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Island", "Sonderkennzeichen"],
    regionen: ["Island", "Sonderkennzeichen"],
    regionLabel: "Land",
    kuerzelTyp: "Land",
    euText: "IS",
    emoji: "🇮🇸",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "AB 123",
    blau: true,
    hatWappen: false,
  });
})();
