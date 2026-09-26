// data/countries/al.js — Albanien: seit 2011 ohne Regionsbezug.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug, seit 2011)", bundesland: "Albanien"},
    { code: "MB", bezirk: "Polizei (Ministria e Brendshme)", blau: true, bundesland: "Sonderkennzeichen" },
    { code: "FA", bezirk: "Militär", gruen: true, bundesland: "Sonderkennzeichen" },
    { code: "TX", bezirk: "Taxi", gelb: true, bundesland: "Sonderkennzeichen" },
    { code: "H", bezirk: "Oldtimer", braun: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Albanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Albanien", "Sonderkennzeichen"],
    regionen: ["Albanien", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "AL",
    emoji: "🇦🇱",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "AA 123 AA",
    hatWappen: false,
  });
})();
