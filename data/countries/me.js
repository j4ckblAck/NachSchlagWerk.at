// data/countries/me.js — Montenegro: alle Gemeindekuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const MONTENEGRO_ORDER = ["Montenegro", "Sonderkennzeichen"];

  const MONTENEGRO_KENNZEICHEN = [
    { code: "AN", bezirk: "Andrijevica",   bundesland: "Montenegro" },
    { code: "BD", bezirk: "Budva",         bundesland: "Montenegro" },
    { code: "BP", bezirk: "Bijelo Polje",  bundesland: "Montenegro" },
    { code: "BR", bezirk: "Bar",           bundesland: "Montenegro" },
    { code: "CT", bezirk: "Cetinje",       bundesland: "Montenegro" },
    { code: "DG", bezirk: "Danilovgrad",   bundesland: "Montenegro" },
    { code: "GS", bezirk: "Gusinje",       bundesland: "Montenegro" },
    { code: "HN", bezirk: "Herceg Novi",   bundesland: "Montenegro" },
    { code: "KL", bezirk: "Kolašin",       bundesland: "Montenegro" },
    { code: "KO", bezirk: "Kotor",         bundesland: "Montenegro" },
    { code: "MK", bezirk: "Mojkovac",      bundesland: "Montenegro" },
    { code: "NK", bezirk: "Nikšić",        bundesland: "Montenegro" },
    { code: "PG", bezirk: "Podgorica",     bundesland: "Montenegro" },
    { code: "PL", bezirk: "Plav",          bundesland: "Montenegro" },
    { code: "PT", bezirk: "Petnjica",      bundesland: "Montenegro" },
    { code: "PŽ", bezirk: "Plužine",       bundesland: "Montenegro" },
    { code: "PV", bezirk: "Pljevlja",      bundesland: "Montenegro" },
    { code: "RO", bezirk: "Rožaje",        bundesland: "Montenegro" },
    { code: "ŠN", bezirk: "Šavnik",        bundesland: "Montenegro" },
    { code: "TV", bezirk: "Tivat",         bundesland: "Montenegro" },
    { code: "TZ", bezirk: "Tuzi",          bundesland: "Montenegro" },
    { code: "UL", bezirk: "Ulcinj",        bundesland: "Montenegro" },
    { code: "ZT", bezirk: "Zeta",          bundesland: "Montenegro" },
    { code: "ŽB", bezirk: "Žabljak",       bundesland: "Montenegro" },
    // Sonderkennzeichen (Quelle: Referenzrecherche, Sep 2026)
    { code: "P", bezirk: "Polizei",        blau: true, bundesland: "Sonderkennzeichen" },
    { code: "V", bezirk: "Militär",        gruen: true, bundesland: "Sonderkennzeichen" },
    { code: "CD", bezirk: "Diplomaten (gelbe Schrift, kein Gemeinde-/Wappenfeld)", gelbText: true, bundesland: "Sonderkennzeichen" },
  ];

  registerLand("Montenegro", {
    kennzeichen: MONTENEGRO_KENNZEICHEN,
    gruppen: MONTENEGRO_ORDER,
    regionen: MONTENEGRO_ORDER,
    regionLabel: "Gemeinde",
    euText: "MNE",
    emoji: "🇲🇪",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "AB 123",
    hatWappen: false,
  });
})();
