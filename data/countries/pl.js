// data/countries/pl.js — Polen: die 16 Woiwodschafts-Anfangsbuchstaben.
// Das polnische System hat darunter noch ~380 Kreis-Kuerzel (2.-3.
// Stelle) - das ist fuer eine App zum Nachschlagen nicht mehr sinnvoll
// abzufragen, deshalb bewusst nur diese Ebene (der 1. Buchstabe ist bei
// jedem echten polnischen Kennzeichen ablesbar und eindeutig).
// Quelle: Referenzrecherche Kfz-Kennzeichen Europa, Sep 2026.
(function () {
  const POLEN_ORDER = ["Polen"];

  const POLEN_KENNZEICHEN = [
    { code: "B", bezirk: "Podlachien (podlaskie)",              bundesland: "Polen" },
    { code: "C", bezirk: "Kujawien-Pommern (kujawsko-pomorskie)", bundesland: "Polen" },
    { code: "D", bezirk: "Niederschlesien (dolnośląskie)",       bundesland: "Polen" },
    { code: "E", bezirk: "Lodsch (łódzkie)",                     bundesland: "Polen" },
    { code: "F", bezirk: "Lebus (lubuskie)",                     bundesland: "Polen" },
    { code: "G", bezirk: "Pommern (pomorskie)",                  bundesland: "Polen" },
    { code: "K", bezirk: "Kleinpolen (małopolskie)",             bundesland: "Polen" },
    { code: "L", bezirk: "Lublin (lubelskie)",                   bundesland: "Polen" },
    { code: "N", bezirk: "Ermland-Masuren (warmińsko-mazurskie)", bundesland: "Polen" },
    { code: "O", bezirk: "Oppeln (opolskie)",                    bundesland: "Polen" },
    { code: "P", bezirk: "Großpolen (wielkopolskie)",            bundesland: "Polen" },
    { code: "R", bezirk: "Karpatenvorland (podkarpackie)",       bundesland: "Polen" },
    { code: "S", bezirk: "Schlesien (śląskie)",                  bundesland: "Polen" },
    { code: "T", bezirk: "Heiligkreuz (świętokrzyskie)",         bundesland: "Polen" },
    { code: "W", bezirk: "Masowien (mazowieckie, u. a. Warschau)", bundesland: "Polen" },
    { code: "Z", bezirk: "Westpommern (zachodniopomorskie)",     bundesland: "Polen" },
  ];

  registerLand("Polen", {
    kennzeichen: POLEN_KENNZEICHEN,
    gruppen: POLEN_ORDER,
    regionen: POLEN_ORDER,
    regionLabel: "Woiwodschaft",
    euText: "PL",
    emoji: "🇵🇱",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "WX 12345",
    hatWappen: false,
  });
})();
