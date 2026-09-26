// data/countries/dk.js — Dänemark: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Dänemark" },
  ];
  registerLand("Dänemark", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Dänemark"],
    regionen: ["Dänemark"],
    regionLabel: "Land",
    euText: "DK",
    emoji: "🇩🇰",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB 12 345",
    hatWappen: false,
  });
})();
