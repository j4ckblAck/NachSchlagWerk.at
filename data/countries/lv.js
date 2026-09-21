// data/countries/lv.js — Lettland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "LV", bezirk: "Lettland (kein Regionsbezug; E-Autos mit blauer Schrift)", bundesland: "Lettland" },
  ];
  registerLand("Lettland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Lettland"],
    regionen: ["Lettland"],
    regionLabel: "Land",
    euText: "LV",
    emoji: "🇱🇻",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB-1234",
    flagge: { typ: "h", farben: ["#9e3039", "#fff", "#9e3039"] },
    hatWappen: false,
  });
})();
