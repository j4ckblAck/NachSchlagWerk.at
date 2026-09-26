// data/countries/by.js — Belarus: Flagge ohne blaues Band, letzte Ziffer
// zeigt die Region.
(function () {
  const KENNZEICHEN = [
    { code: "1", bezirk: "Breszkaja Woblasz",    bundesland: "Belarus" },
    { code: "2", bezirk: "Wizebskaja Woblasz",   bundesland: "Belarus" },
    { code: "3", bezirk: "Homelskaja Woblasz",   bundesland: "Belarus" },
    { code: "4", bezirk: "Hrodsenskaja Woblasz", bundesland: "Belarus" },
    { code: "5", bezirk: "Minskaja Woblasz",     bundesland: "Belarus" },
    { code: "6", bezirk: "Mahiljouskaja Woblasz", bundesland: "Belarus" },
    { code: "7", bezirk: "Stadt Minsk",          bundesland: "Belarus" },
  ];
  registerLand("Belarus", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Belarus"],
    regionen: ["Belarus"],
    regionLabel: "Land",
    euText: "BY",
    emoji: "🇧🇾",
    euFarbe: "#c8102e",
    euStern: false,
    nrMuster: "1234 AB-7",
    hatWappen: false,
  });
})();
