// data/countries/cz.js — Tschechien: alle 14 Kraje.
(function () {
// ============================================================
// Tschechien: ein Buchstabe je Kraj (Region), seit 2001 aktiv.
// Vollstaendig - nur 14 Kraje. Quelle: Wikipedia "Kfz-Kennzeichen
// (Tschechien)" (Sep 2026 gegengeprueft).
// ============================================================
const TSCHECHIEN_ORDER = [
  "Praha", "Středočeský kraj", "Jihočeský kraj", "Plzeňský kraj",
  "Karlovarský kraj", "Ústecký kraj", "Liberecký kraj",
  "Královéhradecký kraj", "Pardubický kraj", "Kraj Vysočina",
  "Jihomoravský kraj", "Olomoucký kraj", "Zlínský kraj", "Moravskoslezský kraj",
  "Sonderkennzeichen"
];
const TSCHECHIEN_KENNZEICHEN = [
  { code: "A", bezirk: "Praha (Prag)",              bundesland: "Praha" },
  { code: "S", bezirk: "Praha-Umgebung",                  bundesland: "Středočeský kraj" },
  { code: "C", bezirk: "České Budějovice (Budweis)",                bundesland: "Jihočeský kraj" },
  { code: "P", bezirk: "Plzeň (Pilsen)",                           bundesland: "Plzeňský kraj" },
  { code: "K", bezirk: "Karlovy Vary (Karlsbad)",                    bundesland: "Karlovarský kraj" },
  { code: "U", bezirk: "Ústí nad Labem (Aussig)",                  bundesland: "Ústecký kraj" },
  { code: "L", bezirk: "Liberec (Reichenberg)",                         bundesland: "Liberecký kraj" },
  { code: "H", bezirk: "Hradec Králové (Königgrätz)",                  bundesland: "Královéhradecký kraj" },
  { code: "E", bezirk: "Pardubice (Pardubitz)",                       bundesland: "Pardubický kraj" },
  { code: "J", bezirk: "Jihlava (Iglau)",                         bundesland: "Kraj Vysočina" },
  { code: "B", bezirk: "Brno (Brünn)",                            bundesland: "Jihomoravský kraj" },
  { code: "M", bezirk: "Olomouc (Olmütz)",                         bundesland: "Olomoucký kraj" },
  { code: "Z", bezirk: "Zlín",                            bundesland: "Zlínský kraj" },
  { code: "T", bezirk: "Ostrava (Ostrau)",                         bundesland: "Moravskoslezský kraj" },
  // Sonderkennzeichen (Quelle: Vehicle registration plates of the
  // Czech Republic, Sep 2026)
  { code: "CD", bezirk: "Corps Diplomatique (Diplomaten)",          bundesland: "Sonderkennzeichen" },
  { code: "HC", bezirk: "Honorarkonsul",                            bundesland: "Sonderkennzeichen" },
  { code: "XX", bezirk: "Administratives Botschaftspersonal",       bundesland: "Sonderkennzeichen" },
  { code: "XC", bezirk: "Internationale Missionen",                 bundesland: "Sonderkennzeichen" },
  // Gewerbliche Fahrzeuge: gelbe statt weisser Tafel. Oldtimer: gruene
  // statt schwarzer Schrift, immer mit "V" davor (Quelle: Wikipedia
  // "Vehicle registration plates of the Czech Republic").
  { code: "V",  bezirk: "Oldtimer", gruen: true, bundesland: "Sonderkennzeichen" },
];

  registerLand("Tschechien", {
    kennzeichen: TSCHECHIEN_KENNZEICHEN,
    gruppen: TSCHECHIEN_ORDER,
    regionen: TSCHECHIEN_ORDER,
    regionLabel: "Kraj",
    euText: "CZ",
    emoji: "🇨🇿",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "12-345",
    hatWappen: false,
  });
})();
