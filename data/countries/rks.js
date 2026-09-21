// data/countries/rks.js — Kosovo: 2 Ziffern = Bezirk (Format 🟡, nicht mit
// Primaerquelle bestaetigt - vor Produktiveinsatz gegenpruefen).
(function () {
  const KENNZEICHEN = [
    { code: "01", bezirk: "Bezirk 01 (Prishtina, Details nicht sicher belegt)", bundesland: "Kosovo" },
  ];
  registerLand("Kosovo", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Kosovo"],
    regionen: ["Kosovo"],
    regionLabel: "Bezirk",
    euText: "RKS",
    emoji: "🇽🇰",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "01-123-AB",
    hatWappen: false,
  });
})();
