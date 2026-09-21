// data/countries/cy.js — Zypern: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "CY", bezirk: "Zypern (kein Regionsbezug; Taxi gelb)", bundesland: "Zypern" },
  ];
  registerLand("Zypern", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Zypern"],
    regionen: ["Zypern"],
    regionLabel: "Land",
    euText: "CY",
    emoji: "🇨🇾",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    flagge: { typ: "h", farben: ["#fff", "#fff"] },
    hatWappen: false,
  });
})();
