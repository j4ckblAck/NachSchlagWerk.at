// data/countries/bih.js — Bosnien und Herzegowina: kein Regionsbezug.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Bosnien und Herzegowina" },
    { code: "OT", bezirk: "Oldtimer", bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Bosnien und Herzegowina", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Bosnien und Herzegowina", "Sonderkennzeichen"],
    regionen: ["Bosnien und Herzegowina", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "BIH",
    emoji: "🇧🇦",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "A12-B-345",
    hatWappen: false,
  });
})();
