// data/countries/sk.js — Slowakei: Bezirkskuerzel (bis 2023) + Sonderkennzeichen.
(function () {
// ============================================================
// Slowakei: zweistellige Bezirkskuerzel, seit der Reform vom
// 1.1.2023 werden keine neuen Bezirkskuerzel mehr vergeben - auf
// Altfahrzeugen aber weiterhin im Straßenbild zu sehen. Kuratierte
// Auswahl, keine Vollstaendigkeit (79 Bezirke insgesamt).
// ============================================================
const SLOWAKEI_KENNZEICHEN = [
  { code: "BA", bezirk: "Bratislava (Pressburg)",       bundesland: "Slowakei" },
  { code: "KE", bezirk: "Košice (Kaschau)",           bundesland: "Slowakei" },
  { code: "BB", bezirk: "Banská Bystrica (Neusohl)",  bundesland: "Slowakei" },
  { code: "NR", bezirk: "Nitra (Neutra)",            bundesland: "Slowakei" },
  { code: "TT", bezirk: "Trnava (Tyrnau)",           bundesland: "Slowakei" },
  { code: "TN", bezirk: "Trenčín (Trentschin)",          bundesland: "Slowakei" },
  { code: "ZA", bezirk: "Žilina (Sillein)",           bundesland: "Slowakei" },
  { code: "PO", bezirk: "Prešov (Eperies)",           bundesland: "Slowakei" },
  { code: "PP", bezirk: "Poprad (Deutschendorf)",           bundesland: "Slowakei" },
  { code: "DS", bezirk: "Dunajská Streda (Niedermarkt)",  bundesland: "Slowakei" },
  { code: "KN", bezirk: "Komárno (Komorn)",          bundesland: "Slowakei" },
  { code: "HN", bezirk: "Humenné (Homenau)",          bundesland: "Slowakei" },
  { code: "BJ", bezirk: "Bardejov (Bartfeld)",         bundesland: "Slowakei" },
  { code: "CA", bezirk: "Čadca",            bundesland: "Slowakei" },
  { code: "DK", bezirk: "Dolný Kubín",      bundesland: "Slowakei" },
  { code: "GA", bezirk: "Galanta",          bundesland: "Slowakei" },
];
// Sonderkennzeichen (Quelle: Kfz-Kennzeichen (Slowakei), Sep 2026)
const SK_SONDERKENNZEICHEN = [
  { code: "EE", bezirk: "Diplomaten",                    bundesland: "Sonderkennzeichen" },
  { code: "ZZ", bezirk: "Honorarkonsuln", blauHg: true, gelbText: true, bundesland: "Sonderkennzeichen" },
  { code: "P",  bezirk: "Polizei/Parlament",             bundesland: "Sonderkennzeichen" },
];

  registerLand("Slowakei", {
    kennzeichen: SLOWAKEI_KENNZEICHEN.concat(SK_SONDERKENNZEICHEN),
    gruppen: ["Slowakei", "Sonderkennzeichen"],
    regionen: ["Slowakei", "Sonderkennzeichen"],
    regionLabel: "Bezirk (bis 2023)",
    euText: "SK",
    emoji: "🇸🇰",
    euFarbe: "#003399",
    euStern: true,
    nrMuster: "123 AB",
    hatWappen: false,
  });
})();
