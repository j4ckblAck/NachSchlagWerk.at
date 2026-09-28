// data/countries/gr.js — Griechenland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KENNZEICHEN = [
    { code: "---", bezirk: "noch nicht implementiert", bundesland: "Griechenland" },
  ];
  registerLand("Griechenland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Griechenland"],
    regionen: ["Griechenland"],
    regionLabel: "Land",
    euText: "GR",
    emoji: "🇬🇷",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "ABC-1234",
    hatWappen: false,
    // Neun blau-weisse Streifen (hier auf fuenf vereinfacht) statt des
    // Kreuzes oben links, das bei dieser Groesse ohnehin nicht erkennbar
    // waere.
    flagge: { typ: "h", farben: ["#0D5EAF", "#fff", "#0D5EAF", "#fff", "#0D5EAF"] },
  });
})();
