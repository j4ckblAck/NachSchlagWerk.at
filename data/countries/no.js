// data/countries/no.js — Norwegen: kein Regionsbezug, kein EU-Mitglied
// (Flagge statt Sternenkreis im blauen Band).
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "N", bezirk: "Norwegen (kein Regionsbezug; E-Autos u. a. mit Präfix EL, EK, EV)", bundesland: "Norwegen" },
  ];
  registerLand("Norwegen", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Norwegen"],
    regionen: ["Norwegen"],
    regionLabel: "Land",
    euText: "N",
    emoji: "🇳🇴",
    euFarbe: "#ba0c2f",
    euStern: false,
    nrMuster: "AB 12345",
    flagge: { typ: "v", farben: ["#ba0c2f", "#fff", "#00205b"] },
    hatWappen: false,
  });
})();
