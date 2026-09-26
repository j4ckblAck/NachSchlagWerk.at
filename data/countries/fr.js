// data/countries/fr.js — Frankreich: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Frankreich" },
  ];
  registerLand("Frankreich", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Frankreich"],
    regionen: ["Frankreich"],
    regionLabel: "Land",
    euText: "F",
    emoji: "🇫🇷",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB-123-CD",
    hatWappen: false,
  });
})();
