// data/countries/md.js — Moldau: breites Band mit Landesflagge.
(function () {
  const KENNZEICHEN = [
    { code: "MD", bezirk: "Moldau (kein Regionsbezug)", bundesland: "Moldau", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Diplomaten (Corps Diplomatique)", bundesland: "Sonderkennzeichen" },
    { code: "G", bezirk: "Regierungsfahrzeuge", bundesland: "Sonderkennzeichen" },
    { code: "SP", bezirk: "Sicherheitsdienst (Servicii Pază)", bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Moldau", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Moldau", "Sonderkennzeichen"],
    regionen: ["Moldau", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "MD",
    emoji: "🇲🇩",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "ABC 123",
    hatWappen: false,
  });
})();
