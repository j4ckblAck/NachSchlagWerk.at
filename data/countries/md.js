// data/countries/md.js — Moldau: breites Band mit Landesflagge.
(function () {
  const KENNZEICHEN = [
    { code: "MD", bezirk: "Moldau (kein Regionsbezug)", bundesland: "Moldau" },
  ];
  registerLand("Moldau", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Moldau"],
    regionen: ["Moldau"],
    regionLabel: "Land",
    euText: "MD",
    emoji: "🇲🇩",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "ABC 123",
    flagge: { typ: "v", farben: ["#003da5", "#ffd200", "#cc092f"] },
    hatWappen: false,
  });
})();
