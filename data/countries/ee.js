// data/countries/ee.js — Estland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "EST", bezirk: "Estland (kein Regionsbezug seit 2004)", bundesland: "Estland", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Diplomaten (blaue statt weiße Tafel)", blauHg: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Estland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Estland", "Sonderkennzeichen"],
    regionen: ["Estland", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "EST",
    emoji: "🇪🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "123 ABC",
    hatWappen: false,
  });
})();
