// data/countries/be.js — Belgien: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "B", bezirk: "Belgien (rote Schrift, kein Regionsbezug; Anhänger beginnen mit Q)", rot: true, bundesland: "Belgien" },
  ];
  registerLand("Belgien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Belgien"],
    regionen: ["Belgien"],
    regionLabel: "Land",
    euText: "B",
    emoji: "🇧🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1-ABC-234",
    hatWappen: false,
  });
})();
