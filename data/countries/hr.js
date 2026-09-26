// data/countries/hr.js — Kroatien: alle Stadt-/Bezirkskuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const KROATIEN_ORDER = ["Kroatien", "Sonderkennzeichen"];

  const KROATIEN_KENNZEICHEN = [
    { code: "BJ", bezirk: "Bjelovar",          bundesland: "Kroatien" },
    { code: "BM", bezirk: "Beli Manastir",     bundesland: "Kroatien" },
    { code: "ČK", bezirk: "Čakovec",           bundesland: "Kroatien" },
    { code: "DA", bezirk: "Daruvar",           bundesland: "Kroatien" },
    { code: "DE", bezirk: "Delnice",           bundesland: "Kroatien" },
    { code: "DJ", bezirk: "Đakovo",            bundesland: "Kroatien" },
    { code: "DU", bezirk: "Dubrovnik",         bundesland: "Kroatien" },
    { code: "GS", bezirk: "Gospić",            bundesland: "Kroatien" },
    { code: "IM", bezirk: "Imotski",           bundesland: "Kroatien" },
    { code: "KA", bezirk: "Karlovac",          bundesland: "Kroatien" },
    { code: "KC", bezirk: "Koprivnica",        bundesland: "Kroatien" },
    { code: "KR", bezirk: "Krapina",           bundesland: "Kroatien" },
    { code: "KT", bezirk: "Kutina",            bundesland: "Kroatien" },
    { code: "KŽ", bezirk: "Križevci",          bundesland: "Kroatien" },
    { code: "MA", bezirk: "Makarska",          bundesland: "Kroatien" },
    { code: "NA", bezirk: "Našice",            bundesland: "Kroatien" },
    { code: "NG", bezirk: "Nova Gradiška",     bundesland: "Kroatien" },
    { code: "OG", bezirk: "Ogulin",            bundesland: "Kroatien" },
    { code: "OS", bezirk: "Osijek",            bundesland: "Kroatien" },
    { code: "PU", bezirk: "Pula", bundesland: "Kroatien" },
    { code: "PŽ", bezirk: "Požega",            bundesland: "Kroatien" },
    { code: "RI", bezirk: "Rijeka", bundesland: "Kroatien" },
    { code: "SB", bezirk: "Slavonski Brod",    bundesland: "Kroatien" },
    { code: "SK", bezirk: "Sisak",             bundesland: "Kroatien" },
    { code: "SL", bezirk: "Slatina",           bundesland: "Kroatien" },
    { code: "ST", bezirk: "Split",             bundesland: "Kroatien" },
    { code: "ŠI", bezirk: "Šibenik",           bundesland: "Kroatien" },
    { code: "VK", bezirk: "Vinkovci",          bundesland: "Kroatien" },
    { code: "VT", bezirk: "Virovitica",        bundesland: "Kroatien" },
    { code: "VU", bezirk: "Vukovar",           bundesland: "Kroatien" },
    { code: "VŽ", bezirk: "Varaždin",          bundesland: "Kroatien" },
    { code: "ZD", bezirk: "Zadar",             bundesland: "Kroatien" },
    { code: "ZG", bezirk: "Zagreb",            bundesland: "Kroatien" },
    { code: "ŽU", bezirk: "Županja",           bundesland: "Kroatien" },
    // Sonderkennzeichen (Quelle: Referenzrecherche, Sep 2026)
    { code: "HV", bezirk: "Hrvatska vojska (Militär)", bundesland: "Sonderkennzeichen" },
    { code: "RH", bezirk: "Export",    bundesland: "Sonderkennzeichen" },
  ];

  registerLand("Kroatien", {
    kennzeichen: KROATIEN_KENNZEICHEN,
    gruppen: KROATIEN_ORDER,
    regionen: KROATIEN_ORDER,
    regionLabel: "Stadtkürzel",
    euText: "HR",
    emoji: "🇭🇷",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "1234-AB",
    hatWappen: false,
  });
})();
