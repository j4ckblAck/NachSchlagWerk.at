// data/countries/rks.js — Kosovo: 2 Ziffern = einer von 7 Bezirken.
// Quelle: Wikipedia "Vehicle registration plates of Kosovo" (abgerufen
// 2026). Seit Dez. 2010 blaues Feld mit "RKS" in Gold statt EU-Sternen,
// dahinter Kosovo-Wappen, dann 2-stelliger Bezirkscode + 3-stellige
// Zahl + 2 Buchstaben (z.B. "01 234-AB").
(function () {
  const KENNZEICHEN = [
    { code: "01", bezirk: "Prishtina",  bundesland: "Kosovo" },
    { code: "02", bezirk: "Mitrovica",  bundesland: "Kosovo" },
    { code: "03", bezirk: "Peja",       bundesland: "Kosovo" },
    { code: "04", bezirk: "Prizren",    bundesland: "Kosovo" },
    { code: "05", bezirk: "Ferizaj",    bundesland: "Kosovo" },
    { code: "06", bezirk: "Gjilan",     bundesland: "Kosovo" },
    { code: "07", bezirk: "Gjakova",    bundesland: "Kosovo" },
  ];
  registerLand("Kosovo", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Kosovo"],
    regionen: ["Kosovo"],
    regionLabel: "Bezirk",
    kuerzelTyp: "Bezirk",
    euText: "RKS",
    emoji: "🇽🇰",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "234-AB",
    hatWappen: false,
  });
})();
