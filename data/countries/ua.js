// data/countries/ua.js — Ukraine: Praefix = Region (kein EU-Land, Flagge
// statt EU-Sternenkreis im blauen Band).
(function () {
  const KENNZEICHEN = [
    { code: "AA", bezirk: "Ukraine (2 Buchstaben = Zulassungsregion, z. B. AA für Kyiv-Region)", bundesland: "Ukraine" },
  ];
  registerLand("Ukraine", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Ukraine"],
    regionen: ["Ukraine"],
    regionLabel: "Land",
    euText: "UA",
    emoji: "🇺🇦",
    euFarbe: "#0057b7",
    euStern: false,
    nrMuster: "AA 1234 BB",
    flagge: { typ: "h", farben: ["#0057b7", "#ffd700"] },
    hatWappen: false,
  });
})();
