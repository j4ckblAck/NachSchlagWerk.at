// data/countries/al.js — Albanien: seit 2011 ohne Regionsbezug.
(function () {
  const KENNZEICHEN = [
    { code: "AL", bezirk: "Albanien (kein Regionsbezug seit 2011, Staatswappen im EU-Band)", bundesland: "Albanien" },
  ];
  registerLand("Albanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Albanien"],
    regionen: ["Albanien"],
    regionLabel: "Land",
    euText: "AL",
    emoji: "🇦🇱",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "AA 123 AA",
    hatWappen: false,
  });
})();
