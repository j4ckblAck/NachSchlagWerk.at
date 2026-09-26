// data/countries/uk.js — Vereinigtes Koenigreich: 1. Buchstabe = Region,
// seit 2021 ohne EU-Sterne (vorne weiss, hinten gelb).
(function () {
  const KENNZEICHEN = [
    { code: "UK", bezirk: "Vereinigtes Königreich (1. Buchstabe zeigt die Zulassungsregion, Ziffern das Zulassungshalbjahr; bis 28.09.2021: GB)", bundesland: "Vereinigtes Königreich" },
  ];
  registerLand("Vereinigtes Königreich", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Vereinigtes Königreich"],
    regionen: ["Vereinigtes Königreich"],
    regionLabel: "Land",
    euText: "UK",
    emoji: "🇬🇧",
    euFarbe: "#00247d",
    euStern: false,
    nrMuster: "AB12 CDE",
    hatWappen: false,
  });
})();
