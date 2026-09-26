// data/countries/si.js — Slowenien: vollstaendige Registrierungsbezirke + Sonderkennzeichen.
(function () {
// ============================================================
// Slowenien: zweistellige Bezirkskuerzel, seit 2004 zusaetzlich mit
// blauem EU-Streifen (12 Sterne + "SLO"). Es sind laut Wikipedia nur
// elf solche Registrierungsbezirke (aus Jugoslawien uebernommen, heute
// keine echten Verwaltungseinheiten mehr) - hier jetzt VOLLSTAENDIG,
// nicht nur eine Auswahl wie zuvor angenommen. "NG" war zuvor falsch
// eingetragen - das echte Kuerzel fuer Nova Gorica ist "GO".
// ============================================================
  const SLOWENIEN_KENNZEICHEN = [
 { code: "LJ", bezirk: "Laibach (Ljubljana)",              bundesland: "Slowenien" },
 { code: "MB", bezirk: "Marburg an der Drau (Maribor)",    bundesland: "Slowenien" },
 { code: "CE", bezirk: "Cilli (Celje)",                    bundesland: "Slowenien" },
 { code: "KR", bezirk: "Krainburg (Kranj)",                bundesland: "Slowenien" },
 { code: "NM", bezirk: "Rudolfswert (Novo Mesto)",         bundesland: "Slowenien" },
 { code: "KP", bezirk: "Gafers (Koper)",                   bundesland: "Slowenien" },
 { code: "MS", bezirk: "Olsnitz (Murska Sobota)",          bundesland: "Slowenien" },
 { code: "GO", bezirk: "Neu-Görz (Nova Gorica)",           bundesland: "Slowenien" },
 { code: "KK", bezirk: "Gurkfeld (Krško)",                 bundesland: "Slowenien" },
 { code: "PO", bezirk: "Adelsberg (Postojna)",             bundesland: "Slowenien" },
 { code: "SG", bezirk: "Windischgrätz (Slovenj Gradec)",   bundesland: "Slowenien" },
];
// Sonderkennzeichen (Quelle: Wikipedia "Kfz-Kennzeichen (Slowenien)", Sep 2026).
// Diplomaten-Kennzeichen (CMD/CD/CC/M) haben laut Vorbild gruene
// Buchstaben und eine zweistellige Laendernummer daneben; das
// Militaerkennzeichen "SV" hat eine schwarze Tafel und daneben eine
// echte (frei eintippbare) Nummer statt eines fixen Beispielmusters.
// Die zweistellige Nummer neben "SV" zeigt laut Wikipedia die Herkunft
// (Garnisonsstandort) - dieselben sieben Standorte wie ein Teil der
// zivilen Bezirkskuerzel oben, aber als eigenes Nummernsystem.
const SI_SV_HERKUNFT = {
  "01": "Ljubljana",
  "02": "Maribor",
  "03": "Novo Mesto",
  "04": "Murska Sobota",
  "05": "Kranj",
  "06": "Postojna",
  "07": "Koper",
};

const SI_SONDERKENNZEICHEN = [
  // Diplomaten-Kennzeichen (CMD/CD/CC/M): KEINE eintippbare Nummer -
  // welche Laendernummer zu welchem Land gehoert, ist nicht sicher
  // belegt, darum bleibt es beim normalen Beispielmuster (wie bei allen
  // anderen Laendern), ohne editierbares Nummernfeld.
  { code: "CMD", bezirk: "Botschafter",                             gruen: true, keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "CD",  bezirk: "Diplomaten",                              gruen: true, keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "CC",  bezirk: "Konsuln",                                 gruen: true, keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "M",   bezirk: "Botschaftsangestellte (ohne Diplomatenstatus)", gruen: true, keinWappen: true, bundesland: "Sonderkennzeichen" },
  { code: "P",   bezirk: "Polizei", nrMuster: "12-123",              blau: true, eigenesWappen: "si-polizei", bundesland: "Sonderkennzeichen" },
  // Die sieben Garnisonsnummern stehen als eigener Beschreibungstext
  // ("beschreibung") direkt beim Kuerzel "SV" (statt als eigene, separat
  // suchbare Eintraege) - erscheint in "Alle Kennzeichen durchsuchen"
  // direkt darunter, ohne den kurzen "bezirk"-Text (fuer die
  // Simulator-Ergebniszeile) aufzublaehen.
  {
    code: "SV",
    bezirk: "Militär (Slovenska Vojska)",
    beschreibung: "Herkunftsnummer davor: " +
      Object.keys(SI_SV_HERKUNFT).map(nr => nr + " " + SI_SV_HERKUNFT[nr]).join(", "),
    dunkel: true, keinEuBand: true, eigenesWappen: "si-wappen", nrEingebbar: true, nrSuffix: "-400", nrHerkunft: SI_SV_HERKUNFT,
    bundesland: "Sonderkennzeichen",
  },
];

  registerLand("Slowenien", {
    kennzeichen: SLOWENIEN_KENNZEICHEN.concat(SI_SONDERKENNZEICHEN),
    gruppen: ["Slowenien", "Sonderkennzeichen"],
    regionen: ["Slowenien", "Sonderkennzeichen"],
    regionLabel: "Bezirk",
    euText: "SLO",
    emoji: "🇸🇮",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "HG-123",
    hatWappen: false,
  });
})();
