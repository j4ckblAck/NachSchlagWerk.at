// data/countries/es.js — Spanien: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Spanien" },
    { code: "CD", bezirk: "Diplomaten", rotHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
    { code: "OI", bezirk: "Internationale Organisationen", blauHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
    { code: "TX", bezirk: "Taxi / Mietwagen", blauHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Spanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Spanien", "Sonderkennzeichen"],
    regionen: ["Spanien", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "E",
    emoji: "🇪🇸",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1234 BCD",
    hatWappen: false,
  });
})();
