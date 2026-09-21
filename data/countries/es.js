// data/countries/es.js — Spanien: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "E", bezirk: "Spanien (kein Regionsbezug seit 2000, keine Vokale/kein Ñ/Q in der Serie)", bundesland: "Spanien" },
  ];
  registerLand("Spanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Spanien"],
    regionen: ["Spanien"],
    regionLabel: "Land",
    euText: "E",
    emoji: "🇪🇸",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1234 BCD",
    flagge: { typ: "h", farben: ["#aa151b", "#f1bf00", "#aa151b"] },
    hatWappen: false,
  });
})();
