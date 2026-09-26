// data/countries/no.js — Norwegen: kein Regionsbezug, kein EU-Mitglied
// (Flagge statt Sternenkreis im blauen Band).
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "(kein Regionsbezug)", bundesland: "Norwegen" },
    { code: "CD", bezirk: "Diplomat (Corps Diplomatique)", blauHg: true, bundesland: "Sonderkennzeichen" },
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
