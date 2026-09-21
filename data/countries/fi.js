// data/countries/fi.js — Finnland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "FIN", bezirk: "Finnland (kein Regionsbezug)", bundesland: "Finnland" },
  ];
  registerLand("Finnland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Finnland"],
    regionen: ["Finnland"],
    regionLabel: "Land",
    euText: "FIN",
    emoji: "🇫🇮",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC-123",
    flagge: { typ: "h", farben: ["#fff", "#003580"] },
    hatWappen: false,
  });
})();
