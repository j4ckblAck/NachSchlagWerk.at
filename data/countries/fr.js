// data/countries/fr.js — Frankreich: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "F", bezirk: "Frankreich (kein Regionsbezug)", bundesland: "Frankreich" },
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
    flagge: { typ: "v", farben: ["#0055a4", "#fff", "#ef4135"] },
    hatWappen: false,
  });
})();
