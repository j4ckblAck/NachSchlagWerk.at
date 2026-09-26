// data/countries/cy.js — Zypern: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "CY", bezirk: "Zypern (kein Regionsbezug)", bundesland: "Zypern", codeVersteckt: true, nichtEingebbar: true },
    { code: "TX", bezirk: "Taxi (gelbe statt weiße Tafel)", gelb: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Zypern", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Zypern", "Sonderkennzeichen"],
    regionen: ["Zypern", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "CY",
    emoji: "🇨🇾",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    hatWappen: false,
  });
})();
