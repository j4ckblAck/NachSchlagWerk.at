// data/countries/al.js — Albanien: seit 2011 ohne Regionsbezug.
(function () {
  const KENNZEICHEN = [
    { code: "AL", bezirk: "Albanien (kein Regionsbezug seit 2011, Staatswappen im EU-Band)", bundesland: "Albanien", codeVersteckt: true, nichtEingebbar: true },
    { code: "MB", bezirk: "Polizei (Ministria e Brendshme)", blau: true, bundesland: "Sonderkennzeichen" },
    { code: "FA", bezirk: "Militär (grüne statt schwarze Schrift)", gruen: true, bundesland: "Sonderkennzeichen" },
    { code: "TX", bezirk: "Taxi (gelbe statt weiße Tafel)", gelb: true, bundesland: "Sonderkennzeichen" },
    { code: "H", bezirk: "Oldtimer (braune statt schwarze Schrift)", braun: true, bundesland: "Sonderkennzeichen" },
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
