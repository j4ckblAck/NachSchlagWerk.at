// data/countries/se.js — Schweden: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "S", bezirk: "Schweden (kein Regionsbezug)", bundesland: "Schweden", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Corps Diplomatique (blaue statt weiße Tafel)", blauHg: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Schweden", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Schweden", "Sonderkennzeichen"],
    regionen: ["Schweden", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "S",
    emoji: "🇸🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    hatWappen: false,
  });
})();
