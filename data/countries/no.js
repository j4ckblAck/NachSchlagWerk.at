// data/countries/no.js — Norwegen: kein Regionsbezug, kein EU-Mitglied
// (Flagge statt Sternenkreis im blauen Band).
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "N", bezirk: "Norwegen (kein Regionsbezug; E-Autos u. a. mit Präfix EL, EK, EV)", bundesland: "Norwegen", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Corps Diplomatique (blaue statt weiße Tafel)", blauHg: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Norwegen", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Norwegen", "Sonderkennzeichen"],
    regionen: ["Norwegen", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "N",
    emoji: "🇳🇴",
    euFarbe: "#ba0c2f",
    euStern: false,
    nrMuster: "AB 12345",
    hatWappen: false,
  });
})();
