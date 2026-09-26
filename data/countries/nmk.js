// data/countries/nmk.js — Nordmazedonien: Stadtkuerzel (Format 🟡, nicht mit
// Primaerquelle bestaetigt - vor Produktiveinsatz gegenpruefen).
(function () {
  const KENNZEICHEN = [
    { code: "SK", bezirk: "Skopje",  bundesland: "Nordmazedonien" },
    { code: "CD", bezirk: "Diplomaten (Corps Diplomatique)", dunkel: true, bundesland: "Sonderkennzeichen" },
    { code: "CC", bezirk: "Konsuln (Corps Consulaire)", dunkel: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Nordmazedonien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Nordmazedonien", "Sonderkennzeichen"],
    regionen: ["Nordmazedonien", "Sonderkennzeichen"],
    regionLabel: "Stadt",
    euText: "NMK",
    emoji: "🇲🇰",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "1234 AB",
    hatWappen: false,
  });
})();
