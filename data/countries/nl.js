// data/countries/nl.js — Niederlande: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "NL", bezirk: "Niederlande (gelbe Tafel vorne und hinten, kein Regionsbezug; Taxi hellblau, AA = Königshaus)", bundesland: "Niederlande" },
  ];
  registerLand("Niederlande", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Niederlande"],
    regionen: ["Niederlande"],
    regionLabel: "Land",
    euText: "NL",
    emoji: "🇳🇱",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC-12-D",
    flagge: { typ: "h", farben: ["#ae1c28", "#fff", "#21468b"] },
    hatWappen: false,
  });
})();
