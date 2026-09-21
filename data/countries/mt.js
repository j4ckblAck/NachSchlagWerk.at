// data/countries/mt.js — Malta: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "M", bezirk: "Malta (kein Regionsbezug)", bundesland: "Malta" },
  ];
  registerLand("Malta", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Malta"],
    regionen: ["Malta"],
    regionLabel: "Land",
    euText: "M",
    emoji: "🇲🇹",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC 123",
    flagge: { typ: "v", farben: ["#fff", "#cf142b"] },
    hatWappen: false,
  });
})();
