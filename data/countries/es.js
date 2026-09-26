// data/countries/es.js — Spanien: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "E", bezirk: "Spanien (kein Regionsbezug seit 2000, keine Vokale/kein Ñ/Q in der Serie)", bundesland: "Spanien", codeVersteckt: true, nichtEingebbar: true },
    { code: "CD", bezirk: "Diplomaten (weiße Schrift auf roter Tafel)", rotHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
    { code: "OI", bezirk: "Internationale Organisationen (weiße Schrift auf blauer Tafel)", blauHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
    { code: "TX", bezirk: "Taxi/Mietwagen mit Fahrer (weiße Schrift auf blauer Tafel, Rückseite)", blauHg: true, weissText: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Spanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Spanien", "Sonderkennzeichen"],
    regionen: ["Spanien", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "E",
    emoji: "🇪🇸",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1234 BCD",
    hatWappen: false,
  });
})();
