// data/countries/ee.js — Estland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Estland" },
    { code: "CD", bezirk: "Diplomaten", blauHg: true, bundesland: "Sonderkennzeichen" },
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
