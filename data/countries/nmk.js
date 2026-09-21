// data/countries/nmk.js — Nordmazedonien: Stadtkuerzel (Format 🟡, nicht mit
// Primaerquelle bestaetigt - vor Produktiveinsatz gegenpruefen).
(function () {
  const KENNZEICHEN = [
    { code: "SK", bezirk: "Skopje",  bundesland: "Nordmazedonien" },
  ];
  registerLand("Nordmazedonien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Nordmazedonien"],
    regionen: ["Nordmazedonien"],
    regionLabel: "Stadt",
    euText: "NMK",
    emoji: "🇲🇰",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "1234 AB",
    hatWappen: false,
  });
})();
