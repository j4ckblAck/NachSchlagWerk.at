/* ============================================================
   Core: Bildschirm-Navigation und Theme-Umschaltung.
   Wird von beiden Modulen (Dienstgrade + Kennzeichen) genutzt -
   deshalb geladen, bevor js/dienstgrade.js und js/kennzeichen.js
   ihre eigene Verdrahtung anhaengen.
   ============================================================ */

/* ---------- Browser-Verlauf ----------
   Jeder Bildschirmwechsel wird im Verlauf eingetragen (#abk, #quiz ...),
   damit die Zurueck-Taste / Wischgeste des Handys und die Browser-
   Zurueck-Taste einen Bildschirm zurueck gehen statt die Seite zu
   verlassen. Erst im Hauptmenue verlaesst "Zurueck" die Seite. */

const START_HASH = location.hash.slice(1);
const LEKTION = ["lernen", "quiz"];
let aktuellerBildschirm = null;
let popIgnorieren = false;

function verlaufEintragen(name) {
  const st = history.state;
  if (aktuellerBildschirm === null || !st) {
    history.replaceState({ s: name, tiefe: 0 }, "", location.pathname + location.search);
    return;
  }
  // Zur Startseite (Haus-Symbol): im Verlauf ganz zurueck springen
  if (name === "home") {
    if (st.tiefe > 0) { popIgnorieren = true; history.go(-st.tiefe); }
    return;
  }
  // Ein Schritt zurueck (z.B. "Fertig" nach dem Quiz): Verlauf mitziehen
  if (ZURUECK_ZIEL[aktuellerBildschirm] === name && st.tiefe > 0) {
    popIgnorieren = true;
    history.back();
    return;
  }
  // Lernen -> Quiz derselben Gruppe ersetzt den Eintrag, damit
  // Zurueck danach direkt zum Lernprogramm fuehrt
  if (LEKTION.includes(name) && LEKTION.includes(aktuellerBildschirm)) {
    history.replaceState({ s: name, tiefe: st.tiefe }, "", "#" + name);
    return;
  }
  history.pushState({ s: name, tiefe: st.tiefe + 1 }, "", "#" + name);
}

function quizLaeuft() {
  return aktuellerBildschirm === "quiz" && document.getElementById("gruppeFertig").hidden;
}
function quizAbbrechenBestaetigt() {
  return !quizLaeuft() || confirm("Quiz abbrechen? Der Fortschritt dieser Runde geht verloren.");
}

// Bildschirm anzeigen und dabei die Inhalte auffrischen, die sich
// inzwischen geaendert haben koennen
function bildschirmBetreten(name) {
  zeigeBildschirm(name, true);
  if (name === "modulStart") startbildschirmAktualisieren();
  if (name === "abk") abkZeichnen();
}

window.addEventListener("popstate", (e) => {
  if (popIgnorieren) { popIgnorieren = false; return; }
  const st = e.state || { s: "home", tiefe: 0 };
  if (!quizAbbrechenBestaetigt()) {
    // abgebrochen: wieder auf den Quiz-Eintrag vorgehen
    history.pushState({ s: "quiz", tiefe: st.tiefe + 1 }, "", "#quiz");
    return;
  }
  let ziel = st.s;
  // Eine Lektion laesst sich nicht wiederherstellen (Vorwaerts-Taste) -
  // stattdessen zum Lernprogramm
  if (LEKTION.includes(ziel)) {
    ziel = "modulStart";
    history.replaceState({ s: ziel, tiefe: st.tiefe }, "", "#" + ziel);
  }
  bildschirmBetreten(ziel);
});

// Direktlink (z.B. .../#abk) nach dem Laden oeffnen
document.addEventListener("DOMContentLoaded", () => {
  const knopf = { abk: "gehModulDienstgrade", kennzeichen: "gehModulKennzeichen" }[START_HASH];
  if (knopf) document.getElementById(knopf).click();
});

function zeigeBildschirm(name, ausVerlauf) {
  if (!ausVerlauf && name !== aktuellerBildschirm) verlaufEintragen(name);
  aktuellerBildschirm = name;
  ["home", "modulStart", "lernen", "quiz", "abk", "kennzeichen", "kennzeichenListe"].forEach(s => {
    document.getElementById(s).hidden = (s !== name);
  });
  document.getElementById("karteAntwort").hidden = true;
  document.getElementById("leiste").hidden = (name !== "quiz");
  document.body.classList.toggle("fest", name === "quiz");
  navAktualisieren(name);
  // Ueberall innerhalb einer Hauptkategorie steht oben immer nur deren
  // Name - nicht der Name des jeweiligen Unterbildschirms. Nur am
  // Hauptmenue selbst steht etwas anderes.
  const titel = {
    home: "Hauptmenü",
    modulStart: "Uniform - Unterscheidungszeichen",
    lernen: "Uniform - Unterscheidungszeichen",
    quiz: "Uniform - Unterscheidungszeichen",
    abk: "Uniform - Unterscheidungszeichen",
    kennzeichen: "Kfz-Kennzeichen",
    kennzeichenListe: "Kfz-Kennzeichen"
  };
  document.getElementById("kopfTitel").textContent = titel[name] || "Nachschlagewerk";
}


const ZURUECK_ZIEL = {
  modulStart: "abk",
  abk: "home",
  kennzeichen: "home",
  kennzeichenListe: "kennzeichen",
  lernen: "modulStart",
  quiz: "modulStart"
};

const ICON_ZURUECK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

function navAktualisieren(name) {
  const zurueck = document.getElementById("navZurueck");
  const home = document.getElementById("navHome");
  const thema = document.getElementById("themaBtn");
  const ziel = ZURUECK_ZIEL[name];

  // Wenn Zurueck ohnehin nur zur Startseite fuehren wuerde, brauchts das
  // Pfeil-Symbol nicht extra - dafuer gibt's ja schon das Haus-Symbol.
  zurueck.hidden = !ziel || ziel === "home";
  zurueck.onclick = ziel ? () => zurueckNavigieren(ziel) : null;

  // In der Lektion (Lernen/Quiz) reicht "Zurück" (mit Symbol) allein -
  // Theme und Hauptmenue sind dort ausgeblendet, um abzulenken.
  const inLektion = (name === "lernen" || name === "quiz" || name === "modulStart" || name === "kennzeichenListe");
  if (inLektion) {
    zurueck.innerHTML = ICON_ZURUECK + " Zurück";
    zurueck.classList.add("nav-text");
  } else {
    zurueck.innerHTML = ICON_ZURUECK;
    zurueck.classList.remove("nav-text");
  }

  thema.hidden = inLektion;
  // Im Lernprogramm (Gruppenuebersicht) bleibt das Haus-Symbol sichtbar,
  // damit man von dort direkt zur Startseite springen kann.
  // Im Hauptmenue selbst braucht es kein Haus-Symbol
  home.hidden = name === "home" || (inLektion && name !== "modulStart");
  if (typeof installKnopfAktualisieren === "function") installKnopfAktualisieren(name);
}

function zurueckNavigieren(ziel) {
  if (!quizAbbrechenBestaetigt()) return;
  zeigeBildschirm(ziel);
  if (ziel === "modulStart") startbildschirmAktualisieren();
}

/* ============================================================
   Hell/Dunkel-Umschaltung
   ============================================================ */

function themaLaden() {
  // Ohne gespeicherte Wahl ist Hell der Standard - nur ein explizit
  // gespeichertes "dunkel" schaltet auf das dunkle Theme.
  const gespeichert = localStorage.getItem("dienstgrade-thema");
  if (gespeichert !== "dunkel") document.documentElement.setAttribute("data-theme", "hell");
}
function themaUmschalten() {
  const aktuellHell = document.documentElement.getAttribute("data-theme") === "hell";
  if (aktuellHell) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("dienstgrade-thema", "dunkel");
  } else {
    document.documentElement.setAttribute("data-theme", "hell");
    localStorage.setItem("dienstgrade-thema", "hell");
  }
}

