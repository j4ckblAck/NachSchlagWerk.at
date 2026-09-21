/* ============================================================
   Core: Bildschirm-Navigation und Theme-Umschaltung.
   Wird von beiden Modulen (Dienstgrade + Kennzeichen) genutzt -
   deshalb geladen, bevor js/dienstgrade.js und js/kennzeichen.js
   ihre eigene Verdrahtung anhaengen.
   ============================================================ */

function zeigeBildschirm(name) {
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
    modulStart: "Dienstgrade",
    lernen: "Dienstgrade",
    quiz: "Dienstgrade",
    abk: "Dienstgrade",
    kennzeichen: "KFZ-Kennzeichen",
    kennzeichenListe: "KFZ-Kennzeichen"
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
  home.hidden = inLektion && name !== "modulStart";
}

function zurueckNavigieren(ziel) {
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

