// data/countries/lu.js — Luxemburg: kein Regionsbezug im Kuerzel.
// Quelle: Wikipedia "Vehicle registration plates of Luxembourg",
// europlate.org/Luxembourg, matriculasdelmundo.com/en/luxembourg.html
// (abgerufen 2026). Seit 1. Juli 2003 durchgehend schwarze Schrift auf
// GELBEM Grund (nicht nur Sonderfaelle wie z.B. bei Ungarns Taxi) -
// darum "gelb: true" hier beim ganzen Land statt bei einzelnen
// Eintraegen (siehe kzTafelAktualisieren). Reservierte Kuerzel: AA
// (amtliche Fahrzeuge), CD (Diplomaten), ZZ (eingeschraenkte Nutzung).
(function () {
  const KENNZEICHEN = [
    { code: "L",  bezirk: "Luxemburg (kein Regionsbezug, laufende Serie AB 1234)", bundesland: "Luxemburg", codeVersteckt: true, nichtEingebbar: true },
    { code: "AA", bezirk: "Amtliche Fahrzeuge",         nrMuster: "1234", bundesland: "Luxemburg" },
    { code: "CD", bezirk: "Corps Diplomatique",         nrMuster: "1234", bundesland: "Luxemburg" },
    { code: "ZZ", bezirk: "Fahrzeuge mit eingeschränkter Nutzung", nrMuster: "1234", bundesland: "Luxemburg" },
  ];
  registerLand("Luxemburg", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Luxemburg"],
    regionen: ["Luxemburg"],
    regionLabel: "Land",
    euText: "L",
    emoji: "🇱🇺",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "AB 1234",
    gelb: true,
    // Keine Flagge mehr als Wappen-Ersatz in der Mitte - am echten
    // Kennzeichen steht dort gar nichts (nur EU-Band, Kuerzel, Nummer).
    hatWappen: false,
  });
})();
