// data/countries/pt.js — Portugal: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Portugal" },
  ];
  registerLand("Portugal", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Portugal"],
    regionen: ["Portugal"],
    regionLabel: "Land",
    euText: "P",
    emoji: "🇵🇹",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AA-00-AA",
    hatWappen: false,
    // Echtes Verhaeltnis ist 2:3 Gruen:Rot - hier ueber fuenf Baender
    // angenaehert, Staatswappen auf der Grenze weggelassen.
    flagge: { typ: "v", farben: ["#046A38", "#046A38", "#DA291C", "#DA291C", "#DA291C"] },
  });
})();
