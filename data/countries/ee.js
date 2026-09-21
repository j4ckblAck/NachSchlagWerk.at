// data/countries/ee.js — Estland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "EST", bezirk: "Estland (kein Regionsbezug seit 2004)", bundesland: "Estland" },
  ];
  registerLand("Estland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Estland"],
    regionen: ["Estland"],
    regionLabel: "Land",
    euText: "EST",
    emoji: "🇪🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "123 ABC",
    flagge: { typ: "h", farben: ["#0072ce", "#000", "#fff"] },
    hatWappen: false,
  });
})();
