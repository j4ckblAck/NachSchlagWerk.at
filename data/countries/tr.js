// data/countries/tr.js — Türkei: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "TR", bezirk: "Türkei (2 Ziffern am Anfang = Provinznummer (01–81, z. B. 34 İstanbul, 06 Ankara), blaues Band ohne Symbol)", bundesland: "Türkei" },
  ];
  registerLand("Türkei", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Türkei"],
    regionen: ["Türkei"],
    regionLabel: "Land",
    euText: "TR",
    emoji: "🇹🇷",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "34 ABC 123",
    flagge: { typ: "h", farben: ["#e30a17", "#e30a17"] },
    hatWappen: false,
  });
})();
