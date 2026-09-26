// data/countries/ro.js — Rumaenien: alle Kreiskuerzel (Judete) + Bukarest.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const RUMAENIEN_ORDER = [
    "Rumänien",
    "Sonderkennzeichen",
  ];

  const RUMAENIEN_KENNZEICHEN = [
    { code: "B",  bezirk: "Stadt Bukarest",        bundesland: "Rumänien" },
    { code: "AB", bezirk: "Alba",                  bundesland: "Rumänien" },
    { code: "AG", bezirk: "Argeș",                 bundesland: "Rumänien" },
    { code: "AR", bezirk: "Arad",                  bundesland: "Rumänien" },
    { code: "BC", bezirk: "Bacău",                 bundesland: "Rumänien" },
    { code: "BH", bezirk: "Bihor",                 bundesland: "Rumänien" },
    { code: "BN", bezirk: "Bistrița-Năsăud",       bundesland: "Rumänien" },
    { code: "BR", bezirk: "Brăila",                bundesland: "Rumänien" },
    { code: "BT", bezirk: "Botoșani",              bundesland: "Rumänien" },
    { code: "BV", bezirk: "Brașov",                bundesland: "Rumänien" },
    { code: "BZ", bezirk: "Buzău",                 bundesland: "Rumänien" },
    { code: "CJ", bezirk: "Cluj",                  bundesland: "Rumänien" },
    { code: "CL", bezirk: "Călărași",              bundesland: "Rumänien" },
    { code: "CS", bezirk: "Caraș-Severin",         bundesland: "Rumänien" },
    { code: "CT", bezirk: "Constanța",             bundesland: "Rumänien" },
    { code: "CV", bezirk: "Covasna",               bundesland: "Rumänien" },
    { code: "DB", bezirk: "Dâmbovița",             bundesland: "Rumänien" },
    { code: "DJ", bezirk: "Dolj",                  bundesland: "Rumänien" },
    { code: "GJ", bezirk: "Gorj",                  bundesland: "Rumänien" },
    { code: "GL", bezirk: "Galați",                bundesland: "Rumänien" },
    { code: "GR", bezirk: "Giurgiu",               bundesland: "Rumänien" },
    { code: "HD", bezirk: "Hunedoara",             bundesland: "Rumänien" },
    { code: "HR", bezirk: "Harghita",              bundesland: "Rumänien" },
    { code: "IF", bezirk: "Ilfov",                 bundesland: "Rumänien" },
    { code: "IL", bezirk: "Ialomița",              bundesland: "Rumänien" },
    { code: "IS", bezirk: "Iași",                  bundesland: "Rumänien" },
    { code: "MH", bezirk: "Mehedinți",             bundesland: "Rumänien" },
    { code: "MM", bezirk: "Maramureș",             bundesland: "Rumänien" },
    { code: "MS", bezirk: "Mureș",                 bundesland: "Rumänien" },
    { code: "NT", bezirk: "Neamț",                 bundesland: "Rumänien" },
    { code: "OT", bezirk: "Olt",                   bundesland: "Rumänien" },
    { code: "PH", bezirk: "Prahova",               bundesland: "Rumänien" },
    { code: "SB", bezirk: "Sibiu",                 bundesland: "Rumänien" },
    { code: "SJ", bezirk: "Sălaj",                 bundesland: "Rumänien" },
    { code: "SM", bezirk: "Satu Mare",             bundesland: "Rumänien" },
    { code: "SV", bezirk: "Suceava",               bundesland: "Rumänien" },
    { code: "TL", bezirk: "Tulcea",                bundesland: "Rumänien" },
    { code: "TM", bezirk: "Timiș",                 bundesland: "Rumänien" },
    { code: "TR", bezirk: "Teleorman",             bundesland: "Rumänien" },
    { code: "VL", bezirk: "Vâlcea",                bundesland: "Rumänien" },
    { code: "VN", bezirk: "Vrancea",               bundesland: "Rumänien" },
    { code: "VS", bezirk: "Vaslui",                bundesland: "Rumänien" },

    // Sonderkennzeichen
    {
      code: "MAI",
      bezirk: "Innenministerium (Polizei, Gendarmerie, Feuerwehr)",
 bundesland: "Sonderkennzeichen",
    },
    {
      code: "A",
      bezirk: "Militär",
      bundesland: "Sonderkennzeichen",
    },
  ];


  registerLand("Rumänien", {
    kennzeichen: RUMAENIEN_KENNZEICHEN,
    gruppen: RUMAENIEN_ORDER,
    regionen: RUMAENIEN_ORDER,
    regionLabel: "Kreis (Județ)",
    euText: "RO",
    emoji: "🇷🇴",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "12 ABC",
    hatWappen: false,
  });
})();
