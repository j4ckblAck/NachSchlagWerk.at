// data/countries/fl.js — Liechtenstein: ein landesweites Kuerzel.
(function () {
// ============================================================
// Liechtenstein: nur ein einziges, landesweites Kuerzel - anders als
// z.B. Luxemburg/Frankreich steht dieses Kuerzel ("FL") tatsaechlich
// GROSS auf dem echten Kennzeichen selbst (siehe "FL 1234" auf dem
// schwarzen Schild) statt nur im Eurofeld daneben, darum hier code:
// "FL" (NICHT "---"/kzOhneKuerzel) - sonst bleibt das Eingabefeld auf
// der Tafel leer.
// ============================================================
const LIECHTENSTEIN_KENNZEICHEN = [
  { code: "FL", bezirk: "Liechtenstein (landesweit)", bundesland: "Liechtenstein" },
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
    // Gekroentes Landeswappen (siehe landFlaggeSvg, spec.typ "li") -
    // steht am echten Kennzeichen rechts neben der Nummer.
    flagge: { typ: "li" },
  });
})();
