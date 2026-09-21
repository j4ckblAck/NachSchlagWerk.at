// data/countries/bg.js — Bulgarien: alle Provinzkuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const BULGARIEN_ORDER = [
    "Bulgarien",
    "Sonderkennzeichen",
  ];

  const BULGARIEN_KENNZEICHEN = [
    { code: "A",  bezirk: "Burgas",            bundesland: "Bulgarien" },
    { code: "B",  bezirk: "Varna",             bundesland: "Bulgarien" },
    { code: "BH", bezirk: "Vidin",             bundesland: "Bulgarien" },
    { code: "BP", bezirk: "Vratsa",            bundesland: "Bulgarien" },
    { code: "BT", bezirk: "Veliko Tarnovo",    bundesland: "Bulgarien" },
    { code: "E",  bezirk: "Blagoevgrad",       bundesland: "Bulgarien" },
    { code: "EB", bezirk: "Gabrovo",           bundesland: "Bulgarien" },
    { code: "EH", bezirk: "Pleven",            bundesland: "Bulgarien" },
    { code: "K",  bezirk: "Kardzhali",         bundesland: "Bulgarien" },
    { code: "KH", bezirk: "Kyustendil",        bundesland: "Bulgarien" },
    { code: "M",  bezirk: "Montana",           bundesland: "Bulgarien" },
    { code: "H",  bezirk: "Shumen",            bundesland: "Bulgarien" },
    { code: "OB", bezirk: "Lovech",            bundesland: "Bulgarien" },
    { code: "P",  bezirk: "Ruse",              bundesland: "Bulgarien" },
    { code: "PA", bezirk: "Pazardzhik",        bundesland: "Bulgarien" },
    { code: "PB", bezirk: "Plovdiv",           bundesland: "Bulgarien" },
    { code: "PK", bezirk: "Pernik",            bundesland: "Bulgarien" },
    { code: "PP", bezirk: "Razgrad",           bundesland: "Bulgarien" },
    { code: "C",  bezirk: "Sofia – Stadt",     bundesland: "Bulgarien" },
    { code: "CA", bezirk: "Sofia – Stadt",     bundesland: "Bulgarien" },
    { code: "CB", bezirk: "Sofia – Stadt",     bundesland: "Bulgarien" },
    { code: "CH", bezirk: "Sliven",            bundesland: "Bulgarien" },
    { code: "CM", bezirk: "Smolyan",           bundesland: "Bulgarien" },
    { code: "CO", bezirk: "Sofia – Provinz",   bundesland: "Bulgarien" },
    { code: "CC", bezirk: "Silistra",          bundesland: "Bulgarien" },
    { code: "CT", bezirk: "Stara Zagora",      bundesland: "Bulgarien" },
    { code: "T",  bezirk: "Targovishte",       bundesland: "Bulgarien" },
    { code: "TX", bezirk: "Dobrich",           bundesland: "Bulgarien" },
    { code: "Y",  bezirk: "Yambol",            bundesland: "Bulgarien" },
    { code: "X",  bezirk: "Haskovo",           bundesland: "Bulgarien" },

    // Sonderkennzeichen
    { code: "BA", bezirk: "Militär (6-stellig)", bundesland: "Sonderkennzeichen" },
 { code: "CP", bezirk: "Zivilschutz",          bundesland: "Sonderkennzeichen" },
  ];

  registerLand("Bulgarien", {
    kennzeichen: BULGARIEN_KENNZEICHEN,
    gruppen: BULGARIEN_ORDER,
    regionen: BULGARIEN_ORDER,
    regionLabel: "Provinz",
    euText: "BG",
    emoji: "🇧🇬",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1234 AB",
    hatWappen: false,
  });
})();
