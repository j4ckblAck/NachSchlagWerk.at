// data/countries/gr.js — Griechenland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "GR", bezirk: "Griechenland (1. Buchstabe zeigt die Region; nur griechische Buchstaben, die lateinisch aussehen)", bundesland: "Griechenland" },
  ];
  registerLand("Griechenland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Griechenland"],
    regionen: ["Griechenland"],
    regionLabel: "Land",
    euText: "GR",
    emoji: "🇬🇷",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC-1234",
    hatWappen: false,
  });
})();
