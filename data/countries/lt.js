// data/countries/lt.js — Litauen: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Litauen" },
  ];
  registerLand("Litauen", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Litauen"],
    regionen: ["Litauen"],
    regionLabel: "Land",
    euText: "LT",
    emoji: "🇱🇹",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    hatWappen: false,
  });
})();
