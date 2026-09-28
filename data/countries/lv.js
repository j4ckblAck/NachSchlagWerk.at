// data/countries/lv.js — Lettland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Lettland" },
    { code: "TX", bezirk: "Taxi", gelb: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Lettland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Lettland", "Sonderkennzeichen"],
    regionen: ["Lettland", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "LV",
    emoji: "🇱🇻",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB-1234",
    hatWappen: false,
    // Echtes Verhaeltnis ist 2:1:2 (dunkelrot/weiss/dunkelrot) - hier
    // ueber fuenf Baender angenaehert.
    flagge: { typ: "h", farben: ["#9E3039", "#9E3039", "#fff", "#9E3039", "#9E3039"] },
  });
})();
