// data/countries/is.js — Island: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "IS", bezirk: "Island (kein Regionsbezug, Flagge statt blauem EU-Band)", bundesland: "Island" },
  ];
  registerLand("Island", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Island"],
    regionen: ["Island"],
    regionLabel: "Land",
    euText: "IS",
    emoji: "🇮🇸",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "AB 123",
    flagge: { typ: "v", farben: ["#02529c", "#fff", "#dc1e35"] },
    hatWappen: false,
  });
})();
