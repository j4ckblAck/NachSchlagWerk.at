// data/countries/lu.js — Luxemburg: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "L", bezirk: "Luxemburg (gelbe Tafel vorne und hinten, kein Regionsbezug)", bundesland: "Luxemburg" },
  ];
  registerLand("Luxemburg", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Luxemburg"],
    regionen: ["Luxemburg"],
    regionLabel: "Land",
    euText: "L",
    emoji: "🇱🇺",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB 1234",
    flagge: { typ: "h", farben: ["#ed2939", "#fff", "#00a1de"] },
    hatWappen: false,
  });
})();
