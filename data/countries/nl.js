// data/countries/nl.js — Niederlande: kein Regionsbezug im Kuerzel.
// Quelle: Wikipedia "Vehicle registration plates of the Netherlands",
// europlates.eu, licenseplates.tv, rdw.nl (abgerufen 2026). Normale
// Kennzeichen durchgehend schwarze Schrift auf GELBEM Grund (wie
// Luxemburg) - darum "gelb: true" beim ganzen Land. Taxis haben
// stattdessen ein blaues Kennzeichen, Koenigshaus (AA) und Diplomaten
// (CD) bleiben gelb, bekommen aber einen blauen Zusatzbereich um das
// EU-Feld (hier vereinfacht ohne diesen Zusatzbereich dargestellt).
(function () {
  const KENNZEICHEN = [
    { code: "NL", bezirk: "Niederlande (kein Regionsbezug, laufende Serie z.B. ABC-12-D)", bundesland: "Niederlande", codeVersteckt: true, nichtEingebbar: true },
    { code: "AA", bezirk: "Königshaus (niederländische Königsfamilie)", bundesland: "Sonderkennzeichen" },
    { code: "CD", bezirk: "Corps Diplomatique", nrMuster: "1234", bundesland: "Sonderkennzeichen" },
    { code: "TX", bezirk: "Taxi (blaue Tafel statt gelb, seit Dez. 2000 Pflicht)", blauHg: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Niederlande", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Niederlande", "Sonderkennzeichen"],
    regionen: ["Niederlande", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "NL",
    emoji: "🇳🇱",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC-12-D",
    gelb: true,
    hatWappen: false,
  });
})();
