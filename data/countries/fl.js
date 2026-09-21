// data/countries/fl.js — Liechtenstein: ein landesweites Kuerzel.
(function () {
// ============================================================
// Liechtenstein: nur ein einziges, landesweites Kuerzel (FL)
// ============================================================
const LIECHTENSTEIN_KENNZEICHEN = [
  { code: "FL", bezirk: "Liechtenstein (ganzes Land)", bundesland: "Liechtenstein" },
];

  registerLand("Liechtenstein", {
    kennzeichen: LIECHTENSTEIN_KENNZEICHEN,
    gruppen: ["Liechtenstein"],
    regionen: ["Liechtenstein"],
    regionLabel: "Land",
    euText: "FL",
    emoji: "🇱🇮",
    euFarbe: "#111111",
    euStern: false,
    dunkel: true,
    nrMuster: "1234",
    flagge: { typ: "li" },
    hatWappen: false,
  });
})();
