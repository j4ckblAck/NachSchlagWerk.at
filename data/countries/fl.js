// data/countries/fl.js — Liechtenstein: ein landesweites Kuerzel.
(function () {
// ============================================================
// Liechtenstein: nur ein einziges, landesweites Kuerzel (FL)
// ============================================================
const LIECHTENSTEIN_KENNZEICHEN = [
  { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Liechtenstein" },
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
    hatWappen: false,
  });
})();
