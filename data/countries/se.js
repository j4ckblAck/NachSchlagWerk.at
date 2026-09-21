// data/countries/se.js — Schweden: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "S", bezirk: "Schweden (kein Regionsbezug)", bundesland: "Schweden" },
  ];
  registerLand("Schweden", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Schweden"],
    regionen: ["Schweden"],
    regionLabel: "Land",
    euText: "S",
    emoji: "🇸🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    flagge: { typ: "h", farben: ["#006aa7", "#fecc02"] },
    hatWappen: false,
  });
})();
