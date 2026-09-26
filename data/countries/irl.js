// data/countries/irl.js — Irland: kein Regionsbezug im Kuerzel.
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {

  const KENNZEICHEN = [
 { code: "C",  bezirk: "Cork (Corcaigh)",                         bundesland:"Irland"  },
 { code: "CE", bezirk: "Clare (An Clár)",                         bundesland: "Irland" },
 { code: "CN", bezirk: "Cavan (An Cabhán)",                       bundesland: "Irland" },
 { code: "CW", bezirk: "Carlow (Ceatharlach)",                    bundesland: "Irland" },
 { code: "D",  bezirk: "Dublin (Baile Átha Cliath)",              bundesland: "Irland" },
 { code: "DL", bezirk: "Donegal (Dún na nGall)",                  bundesland: "Irland" },
 { code: "G",  bezirk: "Galway (Gaillimh)",                       bundesland: "Irland" },
 { code: "KE", bezirk: "Kildare (Cill Dara)",                     bundesland: "Irland" },
 { code: "KK", bezirk: "Kilkenny (Cill Cheannaigh)",              bundesland: "Irland" },
 { code: "KY", bezirk: "Kerry (Ciarraí)",                         bundesland: "Irland" },
 { code: "L",  bezirk: "Limerick (Stadt) (Luimneach)",            bundesland: "Irland" },
 { code: "LD", bezirk: "Longford (An Longfort)",                  bundesland: "Irland" },
 { code: "LH", bezirk: "Louth (An Lú)",                           bundesland: "Irland" },
 { code: "LK", bezirk: "Limerick (Grafschaft) (Luimneach)",       bundesland: "Irland" },
 { code: "LM", bezirk: "Leitrim (Liatroim)",                      bundesland: "Irland" },
 { code: "LS", bezirk: "Laois (Laois)",                           bundesland: "Irland" },
 { code: "MH", bezirk: "Meath (An Mhí)",                          bundesland: "Irland" },
 { code: "MN", bezirk: "Monaghan (Muineachán)",                   bundesland: "Irland" },
 { code: "MO", bezirk: "Mayo (Maigh Eo)",                         bundesland: "Irland" },
 { code: "OY", bezirk: "Offaly (Uíbh Fhailí)",                    bundesland: "Irland" },
 { code: "RN", bezirk: "Roscommon (Ros Comáin)",                  bundesland: "Irland" },
 { code: "SO", bezirk: "Sligo (Sligeach)",                        bundesland: "Irland" },
 { code: "TN", bezirk: "Tipperary Nord (Tiobraid Árann Thuaidh)", bundesland: "Irland" },
 { code: "TS", bezirk: "Tipperary Süd (Tiobraid Árann Theas)",    bundesland: "Irland" },
 { code: "W",  bezirk: "Waterford (Stadt) (Port Láirge)",         bundesland: "Irland" },
 { code: "WD", bezirk: "Waterford (Grafschaft) (Port Láirge)",    bundesland: "Irland" },
 { code: "WH", bezirk: "Westmeath (An Iarmhí)",                   bundesland: "Irland" },
 { code: "WW", bezirk: "Wicklow (Cill Mhantáin)",                 bundesland: "Irland" },
 { code: "WX", bezirk: "Wexford (Loch Garman)",                   bundesland: "Irland" },
  ];


  registerLand("Irland", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Irland"],
    regionen: ["Irland"],
    regionLabel: "Land",
    euText: "IRL",
    emoji: "🇮🇪",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "242-D-12345",
    hatWappen: false,
  });
})();
