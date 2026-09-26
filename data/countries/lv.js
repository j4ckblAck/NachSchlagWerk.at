// data/countries/lv.js — Lettland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "LV", bezirk: "Lettland (kein Regionsbezug; E-Autos mit blauer Schrift)", bundesland: "Lettland", codeVersteckt: true, nichtEingebbar: true },
    { code: "TX", bezirk: "Taxi (gelbe statt weiße Tafel)", gelb: true, bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Lettland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Lettland", "Sonderkennzeichen"],
    regionen: ["Lettland", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "LV",
    emoji: "🇱🇻",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB-1234",
    hatWappen: false,
  });
})();
