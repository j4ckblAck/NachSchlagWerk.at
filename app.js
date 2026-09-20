/* ============================================================
   Dienstgrade lernen
   Jede Verwendungsgruppe wird einzeln gelernt und einzeln
   abgefragt (Warteschlange: falsch beantwortete Dienstgrade
   kommen in der Runde nochmal dran, bis alle sitzen). Erst wenn
   eine Gruppe "gemeistert" ist, fliesst sie ins gemischte Quiz
   ein - dort mischen sich alle bereits gemeisterten Gruppen.
   ============================================================ */

const SPEICHER_QUIZ    = "dienstgrade-lernstand-v1";
const SPEICHER_GRUPPEN = "dienstgrade-gruppen-v1";
const SPEICHER_RUNDEN  = "dienstgrade-runden-v1";
const BILD_PFAD = "img/";
const BILD_PFAD_UNIFORM = "img_uniform/";
const LETZTE_MERKEN = 4;
const ANTWORT_ANZAHL = 6;
const AUTO_WEITER_MS = 850;

let quizStand = ladenJSON(SPEICHER_QUIZ, {});
let gruppenStand = ladenJSON(SPEICHER_GRUPPEN, {});   // { "E2a": {lernFertig, gemeistert} }
let letzteRunden = ladenJSON(SPEICHER_RUNDEN, {});    // { "gemischtMC": {richtig, gesamt}, ... }
let verfuegbareBilder = new Set();

/* ---------- Speicher-Helfer ---------- */

function ladenJSON(schluessel, standard) {
  try {
    const roh = localStorage.getItem(schluessel);
    return roh ? JSON.parse(roh) : standard;
  } catch (e) { return standard; }
}
function speichernJSON(schluessel, wert) {
  try { localStorage.setItem(schluessel, JSON.stringify(wert)); }
  catch (e) { /* z.B. privater Modus */ }
}
function speichernQuiz() { speichernJSON(SPEICHER_QUIZ, quizStand); }
function speichernGruppen() { speichernJSON(SPEICHER_GRUPPEN, gruppenStand); }
function speichernRunden() { speichernJSON(SPEICHER_RUNDEN, letzteRunden); }

function eintrag(id) {
  if (!quizStand[id]) quizStand[id] = { richtig: 0, falsch: 0, stufe: 0 };
  return quizStand[id];
}
function gruppenEintrag(g) {
  if (!gruppenStand[g]) gruppenStand[g] = { lernFertig: false, gemeistert: false };
  return gruppenStand[g];
}

/* ---------- Bilder pruefen ---------- */

function bilderPruefen() {
  return Promise.all(RANKS.map(r => new Promise(fertig => {
    const bild = new Image();
    bild.onload = () => { verfuegbareBilder.add(r.id); fertig(); };
    bild.onerror = () => fertig();
    bild.src = BILD_PFAD + r.id + ".png";
  })));
}

/* ---------- Bildschirme wechseln ---------- */

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

/* ---------- Startbildschirm: Gruppenkacheln ---------- */

function startbildschirmAktualisieren() {
  const liste = document.getElementById("gruppenListe");
  liste.innerHTML = "";

  GROUP_ORDER.forEach(g => {
    const stand = gruppenEintrag(g);
    const anzahl = RANKS.filter(r => r.gruppe === g).length;

    const status = stand.gemeistert ? "gemeistert" : stand.lernFertig ? "gelernt" : "offen";
    const statusText = { offen: "Noch nicht begonnen", gelernt: "Gelernt", gemeistert: "Gemeistert ✓" }[status];
    const statusKlasse = { offen: "status-offen", gelernt: "status-gelernt", gemeistert: "status-gemeistert" }[status];

    const karte = document.createElement("div");
    karte.className = "gruppen-karte";
    karte.innerHTML = `
      <div class="gruppen-kopf">
        <div>
          <div class="gruppen-name">${GROUP_INFO[g].titel}</div>
          <span class="gruppen-anzahl">${anzahl} Dienstgrade</span>
        </div>
        <span class="gruppen-status ${statusKlasse}">${statusText}</span>
      </div>
      <div class="gruppen-aktionen">
        <button class="lernenBtn">Lernen</button>
        <button class="quizBtn primaer" ${stand.lernFertig ? "" : "disabled"}>Quiz</button>
      </div>`;
    karte.querySelector(".lernenBtn").addEventListener("click", () => lernmodusStarten(g));
    karte.querySelector(".quizBtn").addEventListener("click", () => gruppenQuizStarten(g));
    liste.appendChild(karte);
  });

  document.getElementById("gemischtStatusMC").textContent = "Mischt alle 22 Dienstgrade";
  document.getElementById("gemischtStatusKarte").textContent = "Mischt alle 22 Dienstgrade";

  // Jede Kachel zeigt NUR ihre eigene letzte Runde, nicht synchron mit
  // den anderen Modi.
  function rundenAnzeige(modusKey, prozentId, balkenId) {
    const r = letzteRunden[modusKey];
    const p = document.getElementById(prozentId);
    const b = document.getElementById(balkenId);
    if (!r) { p.textContent = "–"; b.style.width = "0%"; return; }
    const proz = Math.round(r.richtig / r.gesamt * 100);
    p.textContent = proz + "%";
    b.style.width = proz + "%";
  }
  rundenAnzeige("gemischtMC", "gemischtProzentMC", "gemischtBalkenMC");
  rundenAnzeige("gemischtKarte", "gemischtProzentKarte", "gemischtBalkenKarte");
  rundenAnzeige("uniformMC", "uniformProzentMC", "uniformBalkenMC");
  rundenAnzeige("uniformKarte", "uniformProzentKarte", "uniformBalkenKarte");
}

/* ============================================================
   LERNMODUS (pro Gruppe: Intro -> Uebersicht -> Einzelkarten)
   ============================================================ */

let lernKarten = [];
let lernIndex = 0;
let lernGruppe = null;

function lernKartenAufbauen(gruppe) {
  const raenge = RANKS.filter(r => r.gruppe === gruppe);
  lernKarten = [
    { typ: "intro", gruppe },
    { typ: "ueberblick", gruppe, raenge },
    ...raenge.map(r => ({ typ: "rang", rang: r }))
  ];
}

function lernmodusStarten(gruppe) {
  lernGruppe = gruppe;
  lernKartenAufbauen(gruppe);
  lernIndex = 0;
  zeigeBildschirm("lernen");
  lernKarteZeichnen();
}

function lernKarteZeichnen() {
  const karte = lernKarten[lernIndex];
  const box = document.getElementById("lernKarte");
  document.getElementById("lernPos").textContent = lernIndex + 1;
  document.getElementById("lernGesamt").textContent = lernKarten.length;
  document.getElementById("lernBalken").style.width =
    ((lernIndex + 1) / lernKarten.length * 100) + "%";

  if (karte.typ === "intro") {
    const info = GROUP_INFO[karte.gruppe];
    box.className = "lernkarte intro-karte";
    box.innerHTML = "<h2>" + info.titel + "</h2>" + (info.text ? "<p>" + info.text + "</p>" : "");

  } else if (karte.typ === "ueberblick") {
    box.className = "lernkarte ueberblick-karte";
    const zeilen = karte.raenge.map((r, i) => {
      const hatBild = verfuegbareBilder.has(r.id);
      return '<div class="ueberblick-item"><span class="nr">' + (i + 1) + '.</span>' +
        (hatBild ? '<img src="' + BILD_PFAD + r.id + '.png" alt="">' : "") +
        '<span class="name">' + r.name + "</span></div>";
    }).join("");
    box.innerHTML = "<h2>Überblick – aufsteigende Reihenfolge</h2>" +
      '<div class="ueberblick-liste">' + zeilen + "</div>";

  } else {
    const r = karte.rang;
    const hatBild = verfuegbareBilder.has(r.id);
    box.className = "lernkarte";
    box.innerHTML =
      '<span class="gruppe-tag">' + r.gruppe + "</span>" +
      (hatBild ? '<img src="' + BILD_PFAD + r.id + '.png" alt="' + r.name + '">' : "") +
      "<h2>" + r.name + "</h2>" +
      (r.hinweis ? '<p class="rang-hinweis">' + r.hinweis + "</p>" : "");
  }

  document.getElementById("lernZurueck").disabled = (lernIndex === 0);
  document.getElementById("lernWeiter").textContent =
    (lernIndex === lernKarten.length - 1) ? "Quiz starten" : "Weiter";
}

function lernWeiter() {
  if (lernIndex < lernKarten.length - 1) {
    lernIndex++;
    lernKarteZeichnen();
  } else {
    gruppenEintrag(lernGruppe).lernFertig = true;
    speichernGruppen();
    startbildschirmAktualisieren();
    gruppenQuizStarten(lernGruppe);
  }
}

function lernZurueck() {
  if (lernIndex > 0) {
    lernIndex--;
    lernKarteZeichnen();
  }
}

/* ============================================================
   QUIZ - zwei Modi:
   "gruppe"   -> Warteschlange nur aus einer Gruppe, Ziel: alle
                 einmal richtig, danach "gemeistert"
   "gemischt" -> endlose Runde aus allen gemeisterten Gruppen,
                 gewichtet nach Fehlerquote
   ============================================================ */

let quizModus = null;      // "gruppe" | "gemischt"
let quizGruppe = null;
let warteschlange = [];
let letzte = [];
let aktuelleFrage = null;
let serie = 0;
let sperre = false;

function mischen(liste) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

function ablenkerWaehlen(ziel, anzahl) {
  const passt = r => r.id !== ziel.id;
  const nah = mischen(RANKS.filter(r => passt(r) && r.gruppe === ziel.gruppe));
  const fern = mischen(RANKS.filter(r => passt(r) && r.gruppe !== ziel.gruppe));
  return [...nah, ...fern].slice(0, anzahl);
}

/* ---- Gruppen-Quiz (Warteschlange bis gemeistert) ---- */

function gruppenQuizStarten(gruppe) {
  quizModus = "gruppe";
  quizGruppe = gruppe;
  warteschlange = mischen(RANKS.filter(r => r.gruppe === gruppe).map(r => r.id));
  lektionGesamt = warteschlange.length;
  letzte = [];
  document.getElementById("quizKontext").textContent = "Quiz – " + GROUP_INFO[gruppe].titel;
  document.getElementById("gruppeFertig").hidden = true;
  zeigeBildschirm("quiz");
  leisteAktualisieren();
  naechsteFrageGruppe();
}

function naechsteFrageGruppe() {
  if (warteschlange.length === 0) {
    gruppenEintrag(quizGruppe).gemeistert = true;
    speichernGruppen();
    zeigeAbschluss(GROUP_INFO[quizGruppe].titel + " gemeistert!");
    return;
  }
  sperre = false;
  let vornId = warteschlange.shift();
  // nicht zweimal hintereinander dieselbe Karte, falls noch andere da sind
  if (vornId === letzte[letzte.length - 1] && warteschlange.length > 0) {
    warteschlange.push(vornId);
    vornId = warteschlange.shift();
  }
  const ziel = RANKS.find(r => r.id === vornId);
  frageZeichnen(ziel, (istRichtig, id) => {
    if (!istRichtig) warteschlange.push(id);   // nochmal in dieser Runde
    letzte.push(id);
  }, naechsteFrageGruppe);
}

/* ---- Gemischtes Quiz - Lektion: jeder Dienstgrad der gemeisterten
   Gruppen muss einmal richtig beantwortet werden, Falsches kommt
   in derselben Lektion nochmal dran (wie bei den Gruppen-Lektionen). ---- */

function gemischtenPool() {
  return RANKS;
}

let lektionGesamt = 0;

function gemischtesQuizStarten(variante) {
  quizModus = variante === "karte" ? "gemischt-karte" : "gemischt-mc";
  serie = 0;
  letzte = [];
  rundeZaehler = 0;
  rundeRichtig = 0;
  warteschlange = mischen(gemischtenPool().map(r => r.id));
  lektionGesamt = warteschlange.length;
  document.getElementById("quizKontext").textContent = variante === "karte"
    ? "Gemischtes Quiz – ohne Auswahl, du kennst diese Ränge schon"
    : "Gemischtes Quiz – mit Auswahl";
  document.getElementById("gruppeFertig").hidden = true;
  document.getElementById("frageBild").style.visibility = "visible";
  zeigeBildschirm("quiz");
  leisteAktualisieren();
  naechsteFrageGemischt(variante);
}

function naechsteFrageGemischt(variante) {
  const modusKey = variante === "karte" ? "gemischtKarte" : "gemischtMC";
  if (warteschlange.length === 0) { rundeAbschliessen(modusKey); return; }
  sperre = false;
  let vornId = warteschlange.shift();
  if (vornId === letzte[letzte.length - 1] && warteschlange.length > 0) {
    warteschlange.push(vornId);
    vornId = warteschlange.shift();
  }
  const ziel = RANKS.find(r => r.id === vornId);
  const weiter = () => naechsteFrageGemischt(variante);
  const nachAntwort = (richtigOderGewusst, id) => {
    rundeZaehler++;
    if (richtigOderGewusst) { serie++; rundeRichtig++; } else { serie = 0; warteschlange.push(id); }
    letzte.push(id);
    if (letzte.length > LETZTE_MERKEN) letzte.shift();
  };

  if (variante === "karte") {
    frageZeichnenKarte(ziel, nachAntwort, weiter);
  } else {
    frageZeichnen(ziel, nachAntwort, weiter);
  }
}

/* ---- Auf der Uniform erkennen: gleiche Lektions-Logik, Pool = alle
   22 Dienstgrade, echtes Foto statt Abzeichen-Ausschnitt ---- */

function uniformStarten(variante) {
  quizModus = variante === "karte" ? "uniform-karte" : "uniform-mc";
  serie = 0;
  letzte = [];
  rundeZaehler = 0;
  rundeRichtig = 0;
  warteschlange = mischen(RANKS.map(r => r.id));
  lektionGesamt = warteschlange.length;
  document.getElementById("quizKontext").textContent = variante === "karte"
    ? "Auf der Uniform erkennen – ohne Auswahl"
    : "Auf der Uniform erkennen – mit Auswahl";
  document.getElementById("gruppeFertig").hidden = true;
  document.getElementById("frageBild").style.visibility = "visible";
  zeigeBildschirm("quiz");
  leisteAktualisieren();
  naechsteFrageUniform(variante);
}

function naechsteFrageUniform(variante) {
  const modusKey = variante === "karte" ? "uniformKarte" : "uniformMC";
  if (warteschlange.length === 0) { rundeAbschliessen(modusKey); return; }
  sperre = false;
  let vornId = warteschlange.shift();
  if (vornId === letzte[letzte.length - 1] && warteschlange.length > 0) {
    warteschlange.push(vornId);
    vornId = warteschlange.shift();
  }
  const ziel = RANKS.find(r => r.id === vornId);
  const weiter = () => naechsteFrageUniform(variante);

  const nachAntwort = (richtigOderGewusst, id) => {
    rundeZaehler++;
    if (richtigOderGewusst) { serie++; rundeRichtig++; } else { serie = 0; warteschlange.push(id); }
    letzte.push(id);
    if (letzte.length > LETZTE_MERKEN) letzte.shift();
  };

  if (variante === "karte") {
    frageZeichnenKarte(ziel, nachAntwort, weiter);
  } else {
    frageZeichnen(ziel, nachAntwort, weiter);
  }
}

let rundeZaehler = 0;
let rundeRichtig = 0;

function rundeAbschliessen(modusKey) {
  letzteRunden[modusKey] = { richtig: rundeRichtig, gesamt: rundeZaehler };
  speichernRunden();
  zeigeAbschluss("Runde beendet: " + rundeRichtig + " von " + rundeZaehler + " richtig.");
}

/* ---- gemeinsamer Abschluss-Hinweis ---- */

function zeigeAbschluss(text) {
  document.getElementById("frageBild").style.visibility = "hidden";
  document.getElementById("antworten").hidden = false;
  document.getElementById("antworten").innerHTML = "";
  document.getElementById("karteAntwort").hidden = true;
  document.getElementById("kartenName").hidden = true;
  document.getElementById("rueckmeldung").hidden = true;
  document.getElementById("weiterBtn").hidden = true;
  document.getElementById("abschlussText").textContent = text;
  document.getElementById("gruppeFertig").hidden = false;
}

/* ---- gemeinsame Frage-/Antwort-Darstellung ---- */

function bildQuelleFuer(ziel) {
  if (quizModus === "uniform-mc" || quizModus === "uniform-karte") {
    const foto = ["foto1", "foto2", "foto3"][Math.floor(Math.random() * 3)];
    return BILD_PFAD_UNIFORM + foto + "/" + ziel.id + ".jpg";
  }
  return BILD_PFAD + ziel.id + ".png";
}

function frageZeichnen(ziel, nachAntwort, weiterFn, explizitOptionen) {
  aktuelleFrage = { ziel, nachAntwort, weiterFn };
  if (explizitOptionen) {
    aktuelleFrage.optionen = mischen(explizitOptionen);
  } else {
    const ablenker = ablenkerWaehlen(ziel, ANTWORT_ANZAHL - 1);
    aktuelleFrage.optionen = mischen([ziel, ...ablenker]);
  }

  const bild = document.getElementById("frageBild");
  bild.style.visibility = "visible";
  bild.src = bildQuelleFuer(ziel);
  bild.classList.toggle("frage-bild-foto", quizModus === "uniform-mc" || quizModus === "uniform-karte");
  document.getElementById("rueckmeldung").hidden = true;
  document.getElementById("weiterBtn").hidden = true;
  document.getElementById("karteAntwort").hidden = true;
  document.getElementById("kartenName").hidden = true;

  const box = document.getElementById("antworten");
  box.hidden = false;
  box.innerHTML = "";
  box.className = "antworten text6";
  aktuelleFrage.optionen.forEach(o => {
    const b = document.createElement("button");
    b.className = "antwort";
    b.textContent = o.name;
    b.addEventListener("click", () => quizAntwort(o, b));
    box.appendChild(b);
  });
}

/* ---- Karteikarten-Darstellung: nur Bild, Antwort per Tipp aufdecken,
   Selbsteinschaetzung statt Auswahl (fuer bereits gemeisterte Raenge) ---- */

function frageZeichnenKarte(ziel, nachAntwort, weiterFn) {
  aktuelleFrage = { ziel, nachAntwort, weiterFn };
  sperre = false;

  const bild = document.getElementById("frageBild");
  bild.style.visibility = "visible";
  bild.src = bildQuelleFuer(ziel);
  bild.classList.toggle("frage-bild-foto", quizModus === "uniform-mc" || quizModus === "uniform-karte");
  document.getElementById("rueckmeldung").hidden = true;
  document.getElementById("weiterBtn").hidden = true;

  const antworten = document.getElementById("antworten");
  antworten.hidden = true;
  antworten.innerHTML = "";

  const name = document.getElementById("kartenName");
  name.hidden = true;
  name.classList.remove("sichtbar");

  document.getElementById("karteAntwort").hidden = false;
  document.getElementById("kartenBewertung").hidden = true;
  const aufdecken = document.getElementById("kartenAufdecken");
  aufdecken.hidden = false;
  aufdecken.onclick = () => {
    aufdecken.hidden = true;
    name.textContent = ziel.name;
    name.hidden = false;
    // zwei Frames warten, damit der Browser erst den unsichtbaren
    // Ausgangszustand zeichnet, bevor die Einblend-Animation startet
    requestAnimationFrame(() => requestAnimationFrame(() => {
      name.classList.add("sichtbar");
    }));
    document.getElementById("kartenBewertung").hidden = false;
  };
}

function karteBewerten(wusste) {
  if (sperre) return;
  sperre = true;

  const { ziel, nachAntwort, weiterFn } = aktuelleFrage;
  const e = eintrag(ziel.id);
  if (wusste) {
    e.richtig++; e.stufe = Math.min(5, e.stufe + 1);
  } else {
    e.falsch++; e.stufe = Math.max(0, e.stufe - 2);
  }
  speichernQuiz();
  nachAntwort(wusste, ziel.id);
  leisteAktualisieren();

  document.getElementById("karteAntwort").hidden = true;
  document.getElementById("kartenName").hidden = true;
  weiterFn();
}

function quizAntwort(gewaehlt, knopf) {
  if (sperre) return;
  sperre = true;

  const { ziel, nachAntwort, weiterFn } = aktuelleFrage;
  const istRichtig = gewaehlt.id === ziel.id;

  const e = eintrag(ziel.id);
  if (istRichtig) {
    e.richtig++; e.stufe = Math.min(5, e.stufe + 1);
  } else {
    e.falsch++; e.stufe = Math.max(0, e.stufe - 2);
  }
  speichernQuiz();
  nachAntwort(istRichtig, ziel.id);
  leisteAktualisieren();

  const knoepfe = [...document.querySelectorAll("#antworten .antwort")];
  knoepfe.forEach(k => k.disabled = true);

  if (istRichtig) {
    knopf.classList.add("richtig-blitz");
    setTimeout(weiterFn, AUTO_WEITER_MS);
    return;
  }

  knopf.classList.add("falsch");
  const idx = aktuelleFrage.optionen.findIndex(o => o.id === ziel.id);
  knoepfe[idx].classList.add("richtig");

  const rueck = document.getElementById("rueckmeldung");
  rueck.innerHTML = "Das war <b>" + ziel.name + "</b> – Verwendungsgruppe " + ziel.gruppe + ".";
  rueck.hidden = false;

  const weiter = document.getElementById("weiterBtn");
  weiter.hidden = false;
  weiter.onclick = weiterFn;
  weiter.focus();
}

/* ---------- Fussleiste + Lernstand-Panel ---------- */

function leisteAktualisieren() {
  let r = 0, f = 0;
  for (const id in quizStand) {
    r += quizStand[id].richtig;
    f += quizStand[id].falsch;
  }
  document.getElementById("serie").textContent =
    ["gemischt-mc", "gemischt-karte", "uniform-mc", "uniform-karte"].includes(quizModus) ? serie : "–";
  document.getElementById("quote").textContent =
    r + f === 0 ? "–" : Math.round(r / (r + f) * 100) + "%";

  // Waehrend einer Lektion bezieht sich "X von Y" auf DIESE Lektion
  // (wie viele Dienstgrade schon einmal richtig waren), nicht auf den
  // globalen Gesamtfortschritt - damit man weiss, wie lange man noch hat.
  const erledigt = Math.max(0, lektionGesamt - warteschlange.length);
  document.getElementById("gelernt").textContent = erledigt;
  document.getElementById("gesamt").textContent = lektionGesamt;
}

/* ============================================================
   Abkuerzungen & Bezeichnungen (reines Nachschlagewerk, kein Quiz)
   ============================================================ */

const ABK_FARBKLASSE = {
  "E2b / VB-S": "abk-kurz-e2b",
  "E2a": "abk-kurz-e2a",
  "E1": "abk-kurz-e1",
  "Sonstige": "abk-kurz-sonstige"
};

function abkZeichnen() {
  const box = document.getElementById("abkListe");
  box.innerHTML = "";
  GROUP_ORDER.forEach(g => {
    const kopf = document.createElement("p");
    kopf.className = "stat-gruppe";
    kopf.textContent = GROUP_INFO[g].titel;
    box.appendChild(kopf);
    RANKS.filter(r => r.gruppe === g).forEach(r => {
      const farbe = ABK_FARBKLASSE[r.gruppe] || "";
      const hatBild = verfuegbareBilder.has(r.id);
      const karte = document.createElement("div");
      karte.className = "abk-karte";
      karte.innerHTML =
        (hatBild ? '<img class="abk-karte-bild" src="' + BILD_PFAD + r.id + '.png" alt="">' : "") +
        '<div class="abk-karte-inhalt">' +
        '<div class="abk-tooltip-titel">' + r.name +
        ' <span class="abk-kurz ' + farbe + '">' + (r.abk || "-") + "</span></div>" +
        '<div class="abk-hinweis">' + (r.hinweis || "Keine weiteren Angaben.") + "</div>" +
        "</div>";
      box.appendChild(karte);
    });
  });
}

/* ============================================================
   Navigation oben (Zurueck / Hauptmenue) - passt sich der Tiefe an
   ============================================================ */

// wohin "Zurueck" von jedem Bildschirm aus fuehrt
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

/* ============================================================
   Verdrahtung
   ============================================================ */

document.getElementById("themaBtn").addEventListener("click", themaUmschalten);
document.getElementById("navHome").addEventListener("click", () => zeigeBildschirm("home"));

// Von der Startseite geht's direkt zur Dienstgrade-Uebersicht
// (Kurzbezeichnungen) - das Lernprogramm (Gruppen + Quizzes) ist von
// dort aus ueber den eigenen Button erreichbar.
document.getElementById("gehModulDienstgrade").addEventListener("click", () => {
  abkZeichnen();
  zeigeBildschirm("abk");
});

document.getElementById("gehLernprogramm").addEventListener("click", () => {
  zeigeBildschirm("modulStart");
  startbildschirmAktualisieren();
});

document.getElementById("gehGemischtMC").addEventListener("click", () => gemischtesQuizStarten("mc"));
document.getElementById("gehGemischtKarte").addEventListener("click", () => gemischtesQuizStarten("karte"));
document.getElementById("wusstJa").addEventListener("click", () => karteBewerten(true));
document.getElementById("wusstNicht").addEventListener("click", () => karteBewerten(false));
document.getElementById("gehUniformMC").addEventListener("click", () => uniformStarten("mc"));
document.getElementById("gehUniformKarte").addEventListener("click", () => uniformStarten("karte"));
document.getElementById("gruppeFertigOk").addEventListener("click", () => {
  zeigeBildschirm("modulStart");
  startbildschirmAktualisieren();
});

document.getElementById("lernWeiter").addEventListener("click", lernWeiter);
document.getElementById("lernZurueck").addEventListener("click", lernZurueck);

document.getElementById("resetLernenBtn").addEventListener("click", () => {
  if (!confirm("Lernfortschritt zurücksetzen? Alle Gruppen gelten dann wieder als nicht gelernt/gemeistert.")) return;
  gruppenStand = {};
  speichernGruppen();
  startbildschirmAktualisieren();
});

document.getElementById("resetQuizBtn").addEventListener("click", () => {
  if (!confirm("Wirklich den gesamten Quiz-Lernstand löschen?")) return;
  quizStand = {};
  letzteRunden = {};
  speichernQuiz();
  speichernRunden();
  leisteAktualisieren();
  startbildschirmAktualisieren();
});

/* ---------- Start ---------- */

bilderPruefen().then(() => {
  if (verfuegbareBilder.size < RANKS.length) {
    const fehlen = RANKS.filter(r => !verfuegbareBilder.has(r.id)).map(r => r.id + ".png");
    const box = document.getElementById("hinweis");
    box.innerHTML = "Es fehlen noch Abzeichen in <code>img/</code>: <code>" + fehlen.join("</code>, <code>") + "</code>";
    box.hidden = false;
  }
  startbildschirmAktualisieren();
});
themaLaden();
zeigeBildschirm("home");

// Service Worker fuer Offline-Nutzung und "Installieren"-Button im Browser
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ============================================================
   Modul: Kennzeichen-Abfrage - Laenderauswahl (Oesterreich + die
   acht Nachbarlaender) + Simulator, und die durchsuchbare Liste
   als eigener Unterbildschirm. Keine separate Bundesland-Auswahl
   mehr im Simulator - das Wappen ergibt sich direkt aus dem
   eingetippten Kuerzel.
   ============================================================ */

function kzAktuellesLand() {
  return LAENDER[document.getElementById("kzLand").value] || LAENDER["Österreich"];
}

function kzFinden(land, code) {
  const gesucht = code.trim().toUpperCase();
  return land.kennzeichen.find(k => k.code === gesucht);
}

// Wie am echten Kennzeichen: Symbol (Landeswappen bei Oesterreich,
// sonst ersatzweise die Landesflagge) und darunter ganz klein der
// Bezirks-/Ortsname. Ohne Treffer bleibt das Feld leer.
// Einzelne Sonderkennzeichen haben ihr EIGENES Symbol statt des
// normalen Landeswappens/-flagge (z.B. das slowenische Polizeiabzeichen)
// - hier als kleines Dispatch-Objekt, key passt zu "eigenesWappen" beim
// jeweiligen Kennzeichen-Eintrag.
const EIGENES_WAPPEN = {
  "si-polizei": function () {
    // Nachgebaut nach dem echten slowenischen Polizeiabzeichen: gold
    // umrandeter Schild mit blauem Innenrand, gelbes "POLICIJA"-Band
    // oben, goldener Triglav in der Mitte, slowenische Flagge darunter.
    return '<svg viewBox="0 0 34 40" class="kz-li-svg">' +
      '<path d="M4,13 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z" fill="#12225c" stroke="#f0c419" stroke-width="2.4"/>' +
      '<path d="M4,13 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z" fill="none" stroke="#0047ab" stroke-width="1.1"/>' +
      '<defs><clipPath id="si-pol-schild"><path d="M4,13 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"/></clipPath></defs>' +
      '<g clip-path="url(#si-pol-schild)">' +
      '<rect x="4" y="13" width="26" height="5.2" fill="#f0c419"/>' +
      '<text x="17" y="17" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.4" font-weight="700" letter-spacing="-0.3" fill="#12225c">POLICIJA</text>' +
      '<path d="M8,32 L12,22 L15,26 L17,20 L19,26 L22,22 L26,32 Z" fill="#f0c419"/>' +
      '<rect x="8" y="33" width="18" height="1.6" fill="#fff"/>' +
      '<rect x="8" y="34.6" width="18" height="1.6" fill="#005CE7"/>' +
      '<rect x="8" y="36.2" width="18" height="1.6" fill="#ED1C24"/>' +
      "</g></svg>";
  },
  "at-fw": function () {
    // Echtes oesterreichisches Feuerwehr-Emblem (Bilddatei).
    return '<img src="wappen/feuerwehr.png" alt="">';
  },
};

function kzWappenZeigen(land, treffer) {
  const bild = document.getElementById("kzWappenBild");
  const text = document.getElementById("kzWappenText");
  const box = document.getElementById("kzWappen");

  // Einzelne Kennzeichen zeigen ein eigenes Symbol statt des normalen
  // Landeswappens - z.B. das slowenische Polizeiabzeichen bei "P".
  if (treffer && treffer.eigenesWappen && EIGENES_WAPPEN[treffer.eigenesWappen]) {
    bild.innerHTML = EIGENES_WAPPEN[treffer.eigenesWappen]();
    text.textContent = treffer.wappenText || "";
    box.classList.remove("kz-schild-wappen-leer");
    return;
  }

  // Manche Kennzeichen haben trotz Land-Wappen keines (z.B. das
  // Schweizer Militaerkennzeichen "M" - kein Kanton, kein Kantonswappen).
  if (!treffer || treffer.keinWappen) {
    bild.innerHTML = "";
    text.textContent = "";
  } else if (land.hatWappen && WAPPEN_DATEI[treffer.bundesland]) {
    bild.innerHTML = '<img src="' + WAPPEN_DATEI[treffer.bundesland] + '" alt="">';
    // Das Wappen zeigt das BUNDESLAND, nicht den Bezirk - darum steht
    // auch hier (wie am echten Kennzeichen) der Bundesland-Name klein
    // darunter, nicht der Bezirksname. "Sonderkennzeichen" ist aber
    // kein Bundesland, sondern nur unsere interne Kategorie - keine
    // Bildunterschrift dafuer.
    text.textContent = treffer.bundesland === "Sonderkennzeichen" ? "" : treffer.bundesland;
  } else if (land.flagge) {
    // Die winzige Beschriftung unter dem Symbol gibt es nur bei
    // Oesterreich (dort steht wirklich ein Bundesland-Wappen) - bei
    // allen anderen Laendern bleibt es beim Symbol ohne Textzeile.
    bild.innerHTML = landFlaggeSvg(land.flagge, treffer);
    text.textContent = "";
  } else {
    bild.innerHTML = "";
    text.textContent = "";
  }

  // Ganz ohne Bild UND Text (z.B. Italien, das traditionell keine
  // Grafik an dieser Stelle hat) braucht die Box auch keinen Platz -
  // der wird sonst verschenkt, waehrend die Nummer daneben eng wird.
  box.classList.toggle("kz-schild-wappen-leer", !bild.innerHTML && !text.textContent);
}

// Landesflagge als einfache SVG-Streifen - fuer Laender ohne eigene
// Bundesland-/Regionsgrafik (alles ausser Oesterreich), damit sich
// das Schild trotzdem klar nach Land unterscheidet.
// Stark vereinfachte Landeswappen fuer die 9 bekanntesten deutschen
// Bundeslaender (Farbe + grobe Form, keine heraldische Feinzeichnung -
// bei der Groesse von ca. 12px waere das ohnehin nicht erkennbar).
// Fuer alle anderen Bundeslaender (zu komplexe/unsichere Wappen) bleibt
// es bei den blossen Bundesfarben, um kein falsches Wappen zu raten.
function deBundeslandSvg(bundesland) {
  const c = "15,28.5"; // Kreismitte
  switch (bundesland) {
    case "Bayern": // weiss-blaue Rauten
      return '<rect x="8" y="21" width="14" height="15" fill="#fff"/>' +
        '<path d="M11,22 L15,25.5 L11,29 L7,25.5 Z" fill="#1e3a8a"/>' +
        '<path d="M19,22 L23,25.5 L19,29 L15,25.5 Z" fill="#1e3a8a"/>' +
        '<path d="M11,29 L15,32.5 L11,36 L7,32.5 Z" fill="#1e3a8a"/>' +
        '<path d="M19,29 L23,32.5 L19,36 L15,32.5 Z" fill="#1e3a8a"/>';
    case "Berlin": // schwarzer Baer auf Weiss
      return '<rect x="8" y="21" width="14" height="15" fill="#fff"/>' +
        '<ellipse cx="15" cy="30" rx="4.6" ry="3.4" fill="#111"/>' +
        '<circle cx="15" cy="25.5" r="2.6" fill="#111"/>' +
        '<circle cx="13.2" cy="23.6" r=".9" fill="#111"/>' +
        '<circle cx="16.8" cy="23.6" r=".9" fill="#111"/>';
    case "Bremen": // silberner Schluessel auf Rot
      return '<rect x="8" y="21" width="14" height="15" fill="#c8102e"/>' +
        '<circle cx="15" cy="24.5" r="2.1" fill="none" stroke="#fff" stroke-width="1.5"/>' +
        '<rect x="14.2" y="26.2" width="1.6" height="8" fill="#fff"/>' +
        '<rect x="15.8" y="31" width="2" height="1.4" fill="#fff"/>' +
        '<rect x="15.8" y="33.2" width="2.6" height="1.4" fill="#fff"/>';
    case "Hamburg": // weisse Burg auf Rot
      return '<rect x="8" y="21" width="14" height="15" fill="#c8102e"/>' +
        '<rect x="10" y="28" width="10" height="7" fill="#fff"/>' +
        '<rect x="10.5" y="23.5" width="2.6" height="5.5" fill="#fff"/>' +
        '<rect x="13.7" y="22" width="2.6" height="7" fill="#fff"/>' +
        '<rect x="16.9" y="23.5" width="2.6" height="5.5" fill="#fff"/>';
    case "Niedersachsen": // weisses Sachsenross auf Rot
      return '<rect x="8" y="21" width="14" height="15" fill="#c8102e"/>' +
        '<path d="M10,33 C10,27 13,23 17,23 C20,23 22,25 21,27 C19,26 18,27 19,29 C17,29 15,30 15,33 C14,34 11,34 10,33 Z" fill="#fff"/>';
    case "Sachsen": // schwarz-goldene Balken + gruener Rautenkranz
      return '<rect x="8" y="21" width="14" height="15" fill="#f0c419"/>' +
        '<rect x="8" y="24" width="14" height="2.4" fill="#111"/>' +
        '<rect x="8" y="30.2" width="14" height="2.4" fill="#111"/>' +
        '<rect x="7" y="27.5" width="16" height="2" fill="#3f9e5c" transform="rotate(-18 15 28.5)"/>';
    case "Hessen": // rot-weiss gestreifter Loewe auf Blau
      return '<rect x="8" y="21" width="14" height="15" fill="#1450a4"/>' +
        '<path d="M15,22.5 C18,22.5 19.5,25 19,28 C18.7,30 17,33 15,35.5 C13,33 11.3,30 11,28 C10.5,25 12,22.5 15,22.5 Z" fill="#fff"/>' +
        '<rect x="10.6" y="24.3" width="8.8" height="1.7" fill="#c8102e"/>' +
        '<rect x="10.6" y="27.7" width="8.8" height="1.7" fill="#c8102e"/>' +
        '<rect x="10.6" y="31.1" width="8.8" height="1.7" fill="#c8102e"/>';
    case "Baden-Württemberg": // drei schwarze Loewen auf Gold
      return '<rect x="8" y="21" width="14" height="15" fill="#f0c419"/>' +
        '<ellipse cx="15" cy="24.6" rx="3.6" ry="1.6" fill="#111"/>' +
        '<ellipse cx="15" cy="28.5" rx="3.6" ry="1.6" fill="#111"/>' +
        '<ellipse cx="15" cy="32.4" rx="3.6" ry="1.6" fill="#111"/>';
    case "Brandenburg": // roter Adler auf Silber
      return '<rect x="8" y="21" width="14" height="15" fill="#f4f3ef"/>' +
        '<path d="M15,23 C13.5,25 9,25.5 9,27.5 C11,27 13,27.5 14,29 C11.5,29.5 10,31 10,33 C12.5,32 14,32.5 15,34 C16,32.5 17.5,32 20,33 C20,31 18.5,29.5 16,29 C17,27.5 19,27 21,27.5 C21,25.5 16.5,25 15,23 Z" fill="#c8102e"/>';
    default:
      return '<rect x="8" y="21" width="14" height="15" fill="#DD0000"/>' +
        '<rect x="8" y="26" width="14" height="5" fill="#111"/>' +
        '<rect x="8" y="31" width="14" height="5" fill="#FFCE00"/>';
  }
}

// Echte Bezirks-/Stadtwappen fuer Slowenien statt immer nur des
// Staatswappens - aber NUR fuer die Bezirke, deren Wappen wirklich
// gut belegt/bekannt ist (Ljubljana: Drache auf Burgturm; Celje: drei
// goldene Sterne der Grafen von Cilli auf Blau; Maribor: weisser Turm
// mit rotem Dach auf Blau). Fuer alle anderen (Kranj, Novo Mesto,
// Koper, Murska Sobota, Nova Gorica, Krsko, Postojna, Slovenj Gradec)
// gibt es KEIN gut genug belegtes Wappen zum Nachbauen - dort bleibt
// es beim allgemeinen Staatswappen als Rueckfallebene, statt etwas zu
// erraten (Koper's Wappen z.B. wurde probiert, war aber als
// vereinfachte Silhouette nicht erkennbar und wurde deshalb verworfen).
function siBezirkSvg(code) {
  const schild = '<path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"';
  if (code === "LJ") {
    return schild + ' fill="#e0607e" stroke="#1a1a1a" stroke-width="1"/>' +
      '<defs><clipPath id="si-lj"><path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"/></clipPath></defs>' +
      '<g clip-path="url(#si-lj)">' +
      '<rect x="12" y="25" width="10" height="10" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<rect x="12" y="21.5" width="2.6" height="3.5" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<rect x="15.7" y="21.5" width="2.6" height="3.5" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<rect x="19.4" y="21.5" width="2.6" height="3.5" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<rect x="15.6" y="30" width="2.8" height="5" fill="#5a1420"/>' +
      '<path d="M12,21 C10,20 9,18 10,16 C11,17 12,17.5 13,17.3 C12,16 12.5,14.5 14,14 C13.5,15.3 14,16 15,16.2 C16,15 17.5,15 18.5,16 C17.5,16 17,17 17.5,18 C19,17.5 20.5,18.5 21,20 C19,19 17,19.5 16,21 Z" fill="#2f9e5c" stroke="#175c33" stroke-width="0.35"/>' +
      '<path d="M17,17 C19,14.5 22,13.5 24,15 C22,15 20.5,16 20,17.5 C22,17 23.5,18 24,19.5 C21.5,19 19,19.5 18,21 Z" fill="#2f9e5c" stroke="#175c33" stroke-width="0.35"/>' +
      '<path d="M12,21 C9.5,19.5 8,17 8.5,14.5 C9.5,15.5 10.3,15.6 10.8,15 C10,13.5 10.3,12 11.5,11.2 C11.3,12.3 11.8,13 12.6,13 C13.4,11.6 15,11 16.2,11.8 C15.2,12 14.7,12.8 15,13.7 C16.2,13.3 17.3,14 17.6,15.2 C16.3,15 15.4,15.6 15.2,16.7 C14,17.8 13,19.3 13.2,21 Z" fill="#2f9e5c" stroke="#175c33" stroke-width="0.35"/>' +
      '<circle cx="9" cy="14.6" r="0.5" fill="#111"/>' +
      '<path d="M8.5,14.5 L6.8,13.9 L8,15.2 Z" fill="#c8102e"/>' +
      "</g>";
  }
  if (code === "CE") {
    const stern = (cx, cy, r1, r2) => {
      const pts = [];
      for (let i = 0; i < 12; i++) {
        const r = i % 2 === 0 ? r1 : r2;
        const a = (-90 + i * 30) * Math.PI / 180;
        pts.push((cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2));
      }
      return "M" + pts.join(" L") + " Z";
    };
    return schild + ' fill="#0046AD" stroke="#1a1a1a" stroke-width="1"/>' +
      '<path d="' + stern(17, 20, 5, 2.2) + '" fill="#f0c419" stroke="#8a6d10" stroke-width="0.3"/>' +
      '<path d="' + stern(11, 29, 4.2, 1.9) + '" fill="#f0c419" stroke="#8a6d10" stroke-width="0.3"/>' +
      '<path d="' + stern(23, 29, 4.2, 1.9) + '" fill="#f0c419" stroke="#8a6d10" stroke-width="0.3"/>';
  }
  if (code === "MB") {
    return schild + ' fill="#1450a4" stroke="#1a1a1a" stroke-width="1"/>' +
      '<defs><clipPath id="si-mb"><path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"/></clipPath></defs>' +
      '<g clip-path="url(#si-mb)">' +
      '<rect x="13" y="20" width="8" height="15" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<path d="M13,20 L17,14 L21,20 Z" fill="#c8102e" stroke="#1a1a1a" stroke-width="0.5"/>' +
      '<rect x="15.7" y="26" width="2.6" height="9" fill="#1450a4"/>' +
      '<rect x="15.2" y="21.5" width="1.4" height="1.6" fill="#1450a4"/>' +
      '<rect x="17.4" y="21.5" width="1.4" height="1.6" fill="#1450a4"/>' +
      "</g>";
  }
  return null;
}

function landFlaggeSvg(spec, treffer) {
  const w = 30, h = 20;
  if (spec.typ === "h") {
    const bh = h / spec.farben.length;
    const rechtecke = spec.farben.map((f, i) =>
      '<rect x="0" y="' + (i * bh).toFixed(2) + '" width="' + w + '" height="' + (bh + 0.5).toFixed(2) + '" fill="' + f + '"/>'
    ).join("");
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="kz-flagge-svg">' + rechtecke + "</svg>";
  }
  if (spec.typ === "v") {
    const bw = w / spec.farben.length;
    const rechtecke = spec.farben.map((f, i) =>
      '<rect x="' + (i * bw).toFixed(2) + '" y="0" width="' + (bw + 0.5).toFixed(2) + '" height="' + h + '" fill="' + f + '"/>'
    ).join("");
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="kz-flagge-svg">' + rechtecke + "</svg>";
  }
  if (spec.typ === "keil") {
    // Tschechien: weiss oben, rot unten, blauer Keil von links
    const [weiss, rot, blau] = spec.farben;
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="kz-flagge-svg">' +
      '<rect width="' + w + '" height="' + (h / 2) + '" fill="' + weiss + '"/>' +
      '<rect y="' + (h / 2) + '" width="' + w + '" height="' + (h / 2) + '" fill="' + rot + '"/>' +
      '<polygon points="0,0 0,' + h + ' ' + (w * 0.42).toFixed(1) + ',' + (h / 2) + '" fill="' + blau + '"/>' +
      "</svg>";
  }
  if (spec.typ === "ch") {
    // Schweiz: am echten (hinteren) Kontrollschild steht rechts das
    // Kantonswappen - stark vereinfacht (Farben/Grundform), keine
    // heraldische Feinzeichnung, dafuer fuer alle 26 Kantone.
    return chKantonSvg(treffer && treffer.bezirk);
  }
  if (spec.typ === "de") {
    // Deutschland: zwei Plaketten uebereinander statt Flagge - oben
    // die HU-Pruefplakette (Farbe wechselt im echten Betrieb alle paar
    // Jahre, hier neutral hellblau), unten die Zulassungsplakette mit
    // dem Landeswappen des jeweiligen Bundeslandes (stark vereinfacht,
    // fuer die 9 bekanntesten Laender; die uebrigen zeigen ersatzweise
    // die Bundesfarben statt eines geratenen Wappens).
    // Das viewBox ist bewusst eng um die zwei Kreise zugeschnitten (kaum
    // Rand, kleiner Abstand dazwischen) - der Container skaliert die
    // ganze Grafik ueber "object-fit: contain" auf eine feste Groesse,
    // jeder ungenutzte Rand im viewBox macht die Kreise am Ende also
    // kleiner, egal wie gross ihr Radius im Quellcode ist.
    return '<svg viewBox="0 0 26 46" class="kz-li-svg">' +
      '<circle cx="13" cy="9.5" r="9" fill="#bfe3f0" stroke="#1a1a1a" stroke-width="1"/>' +
      '<path d="M7.7,9.5 L11.7,13.5 L19,4.7" fill="none" stroke="#1a5f7a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<defs><clipPath id="de-bz-clip"><circle cx="13" cy="33" r="10.8"/></clipPath></defs>' +
      '<circle cx="13" cy="33" r="11.5" fill="#f4f3ef" stroke="#1a1a1a" stroke-width="1"/>' +
      '<g clip-path="url(#de-bz-clip)" transform="translate(-2,4.5)">' + deBundeslandSvg(treffer && treffer.bundesland) + "</g>" +
      '<circle cx="13" cy="33" r="11.5" fill="none" stroke="#1a1a1a" stroke-width=".6"/>' +
      "</svg>";
  }
  if (spec.typ === "hu") {
    // Ungarn: vereinfachtes Staatswappen - links die Arpaden-Streifen
    // (rot-silbern), rechts der Dreiberg mit Doppelkreuz, oben die
    // (schief bekroente) Stephanskrone.
    return '<svg viewBox="0 0 34 40" class="kz-li-svg">' +
      '<path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z" fill="#fff" stroke="#1a1a1a" stroke-width="1"/>' +
      '<defs><clipPath id="hu-schild"><path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"/></clipPath></defs>' +
      '<g clip-path="url(#hu-schild)">' +
      '<rect x="4" y="12" width="13" height="28" fill="#fff"/>' +
      '<rect x="4" y="12" width="13" height="4" fill="#CE2939"/>' +
      '<rect x="4" y="20" width="13" height="4" fill="#CE2939"/>' +
      '<rect x="4" y="28" width="13" height="4" fill="#CE2939"/>' +
      '<rect x="4" y="36" width="13" height="4" fill="#CE2939"/>' +
      '<rect x="17" y="12" width="13" height="28" fill="#CE2939"/>' +
      '<path d="M17,32 L20,26 L23,32 L26,26 L29,32 V40 H17 Z" fill="#477050"/>' +
      '<rect x="21.5" y="16" width="2" height="10" fill="#e8e8e8"/>' +
      '<rect x="19" y="19" width="7" height="2" fill="#e8e8e8"/>' +
      "</g>" +
      '<path d="M8,12 C8,7 12,4 17,4 C22,4 26,7 26,12 Z" fill="#f0c419" stroke="#3a2c08" stroke-width="1"/>' +
      '<circle cx="10" cy="8" r="1.6" fill="#c8102e"/>' +
      '<circle cx="24" cy="8" r="1.6" fill="#3f9e5c"/>' +
      '<line x1="17" y1="4" x2="19.5" y2="0.5" stroke="#f0c419" stroke-width="1.6" stroke-linecap="round"/>' +
      '<line x1="17.8" y1="1.2" x2="21.2" y2="1.2" stroke="#f0c419" stroke-width="1.6" stroke-linecap="round"/>' +
      "</svg>";
  }
  if (spec.typ === "si") {
    const bezirkWappen = siBezirkSvg(treffer && treffer.code);
    if (bezirkWappen) return '<svg viewBox="0 0 34 40" class="kz-li-svg">' + bezirkWappen + "</svg>";
    // Fallback (alle Bezirke ausser LJ/CE/MB - siehe siBezirkSvg): das
    // vereinfachte STAATSwappen - blauer Schild mit dem weissen Triglav
    // (Slowenijas hoechster Berg) in der Mitte, zwei wellenfoermigen
    // Linien darunter (Adria/Fluesse) und drei goldenen Sternen (aus dem
    // Wappen der Grafen von Cilli) oben rechts.
    return '<svg viewBox="0 0 34 40" class="kz-li-svg">' +
      '<path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z" fill="#0046AD" stroke="#1a1a1a" stroke-width="1"/>' +
      '<defs><clipPath id="si-schild"><path d="M4,12 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z"/></clipPath></defs>' +
      '<g clip-path="url(#si-schild)">' +
      '<path d="M8,27 L12,18 L15,22 L17,15 L19,22 L22,18 L26,27 Z" fill="#fff"/>' +
      '<path d="M6,30 C8,28.5 10,31.5 12,30 C14,28.5 16,31.5 18,30 C20,28.5 22,31.5 24,30 C26,28.5 28,31.5 30,30" fill="none" stroke="#fff" stroke-width="1.3"/>' +
      '<path d="M6,34 C8,32.5 10,35.5 12,34 C14,32.5 16,35.5 18,34 C20,32.5 22,35.5 24,34 C26,32.5 28,35.5 30,34" fill="none" stroke="#fff" stroke-width="1.3"/>' +
      '<circle cx="23.5" cy="13.5" r="1.4" fill="#f0c419"/>' +
      '<circle cx="27" cy="15.5" r="1.4" fill="#f0c419"/>' +
      '<circle cx="23.5" cy="17.7" r="1.4" fill="#f0c419"/>' +
      "</g>" +
      "</svg>";
  }
  if (spec.typ === "li") {
    // Liechtenstein: gekroentes Landeswappen (Gold ueber Rot), wie es
    // auch auf dem echten schwarzen Kontrollschild steht.
    return '<svg viewBox="0 0 30 34" class="kz-li-svg">' +
      '<defs><clipPath id="li-schild"><path d="M5,7 H25 V18 C25,25 15,30 15,30 C15,30 5,25 5,18 Z"/></clipPath></defs>' +
      '<g clip-path="url(#li-schild)">' +
      '<rect x="0" y="0" width="30" height="13" fill="#ffce00"/>' +
      '<rect x="0" y="13" width="30" height="21" fill="#cf142b"/>' +
      "</g>" +
      '<path d="M5,7 H25 V18 C25,25 15,30 15,30 C15,30 5,25 5,18 Z" fill="none" stroke="#1a1a1a" stroke-width="1"/>' +
      '<path d="M7,7 L8,1 L11,4.5 L13,-1 L15,3 L17,-1 L19,4.5 L22,1 L23,7 Z" fill="#f0c419" stroke="#3a2c08" stroke-width="1" stroke-linejoin="round"/>' +
      "</svg>";
  }
  return "";
}

// ---- EU-Sternenkreis (12 goldene Sterne im Kreis) fuer das blaue
// Eurofeld links am Schild - nur bei EU-Mitgliedern (land.euStern).
// Wird prozedural erzeugt statt als Bild, damit er in jeder Groesse
// scharf bleibt und sich leicht an die Feldfarbe anpassen laesst.
function eu5ZackenStern(cx, cy, r) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const winkel = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const x = (cx + radius * Math.cos(winkel)).toFixed(2);
    const y = (cy + radius * Math.sin(winkel)).toFixed(2);
    d += (i === 0 ? "M" : "L") + x + "," + y;
  }
  return '<path d="' + d + 'Z" fill="#f0c419"/>';
}
function euSterneSvg() {
  const cx = 15, cy = 15, ring = 10.5;
  let sterne = "";
  for (let i = 0; i < 12; i++) {
    const winkel = (Math.PI * 2 * i) / 12 - Math.PI / 2;
    sterne += eu5ZackenStern(cx + ring * Math.cos(winkel), cy + ring * Math.sin(winkel), 2.5);
  }
  return '<svg viewBox="0 0 30 30" class="kz-sterne-svg">' + sterne + "</svg>";
}

// Schweizer Kreuz statt EU-Sternenkreis - die Schweiz ist nicht in der
// EU, das rote Feld mit dem weissen Kreuz ist ihr eigenes Erkennungszeichen.
// Vollstaendiges rotes Wappenschild mit weissem Kreuz (nicht nur ein
// rotes Quadrat mit Kreuz) - genau wie es links am echten Schweizer
// Kontrollschild steht, ganz ohne zusaetzliches "CH" daneben.
// Gemeinsame Schild-Kontur (wie beim Schweizerkreuz) fuer alle
// Kantonswappen - "inhalt" sind die inneren Formen, die hineingeclippt
// werden. Stark vereinfacht: Grundfarbe(n) + hoechstens eine grobe
// Zusatzform, keine heraldische Feinzeichnung (bei ~14px Groesse
// ohnehin nicht erkennbar).
function chSchild(inhalt) {
  const pfad = "M5,4 Q17,1 29,4 C31,10 30,18 28,22 C25,28 20,31 17,33 C14,31 9,28 6,22 C4,18 3,10 5,4 Z";
  return '<svg viewBox="0 0 34 34" class="kz-li-svg">' +
    '<defs><clipPath id="ch-kt-clip"><path d="' + pfad + '"/></clipPath></defs>' +
    '<g clip-path="url(#ch-kt-clip)">' + inhalt + "</g>" +
    '<path d="' + pfad + '" fill="none" stroke="#1a1a1a" stroke-width="1"/>' +
    "</svg>";
}

// Alle 26 Kantonswappen, grob vereinfacht (Grundfarben + eine grobe
// Zusatzform). Bei Unklarheit lieber schlicht bicolor statt eine
// unsichere Feinzeichnung zu raten.
const CH_KANTON_SVG = {
  "Zürich": '<rect x="0" y="0" width="34" height="16" fill="#fff"/><rect x="0" y="16" width="34" height="18" fill="#1450a4"/>',
  "Bern": '<rect x="0" y="0" width="34" height="34" fill="#c8102e"/><ellipse cx="17" cy="21" rx="5" ry="4" fill="#111"/><circle cx="17" cy="14" r="3" fill="#111"/>',
  "Luzern": '<rect x="0" y="0" width="17" height="34" fill="#1450a4"/><rect x="17" y="0" width="17" height="34" fill="#fff"/>',
  "Uri": '<rect x="0" y="0" width="34" height="34" fill="#f0c419"/><ellipse cx="17" cy="19" rx="6.5" ry="5" fill="#111"/><path d="M11,15 L8,10 M23,15 L26,10" stroke="#111" stroke-width="2" fill="none"/>',
  "Schwyz": '<rect x="0" y="0" width="34" height="34" fill="#c8102e"/><rect x="6" y="5" width="7" height="2.4" fill="#fff"/><rect x="8.6" y="2.4" width="2.4" height="7" fill="#fff"/>',
  "Obwalden": '<rect x="0" y="0" width="34" height="17" fill="#fff"/><rect x="0" y="17" width="34" height="17" fill="#c8102e"/><rect x="15" y="8" width="4" height="18" fill="#111"/>',
  "Nidwalden": '<rect x="0" y="0" width="34" height="34" fill="#c8102e"/><path d="M12,10 L22,24 M22,10 L12,24" stroke="#f0c419" stroke-width="2.4"/>',
  "Glarus": '<rect x="0" y="0" width="34" height="34" fill="#c8102e"/><rect x="13" y="9" width="8" height="16" rx="2" fill="#222"/><circle cx="17" cy="7" r="3" fill="#e8c39e"/>',
  "Zug": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><rect x="0" y="13" width="34" height="8" fill="#1450a4"/>',
  "Freiburg": '<rect x="0" y="0" width="17" height="34" fill="#111"/><rect x="17" y="0" width="17" height="34" fill="#fff"/>',
  "Solothurn": '<rect x="0" y="0" width="34" height="17" fill="#c8102e"/><rect x="0" y="17" width="34" height="17" fill="#fff"/>',
  "Basel-Stadt": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><rect x="15.3" y="4" width="3.4" height="22" fill="#111"/><path d="M11,8 H23" stroke="#111" stroke-width="2.4"/>',
  "Basel-Landschaft": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><rect x="15.3" y="4" width="3.4" height="22" fill="#c8102e"/><path d="M11,8 H23" stroke="#c8102e" stroke-width="2.4"/>',
  "Schaffhausen": '<rect x="0" y="0" width="34" height="34" fill="#f0c419"/><ellipse cx="17" cy="21" rx="6" ry="5" fill="#111"/><path d="M12,16 C10,12 12,9 15,10" stroke="#111" stroke-width="2" fill="none"/>',
  "Appenzell Ausserrhoden": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><ellipse cx="17" cy="21" rx="5" ry="4" fill="#111"/><circle cx="17" cy="14" r="3" fill="#111"/>',
  "Appenzell Innerrhoden": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><ellipse cx="17" cy="21" rx="5" ry="4" fill="#111"/><circle cx="17" cy="14" r="3" fill="#111"/><circle cx="17" cy="21" r="1.4" fill="#f0c419"/>',
  "St. Gallen": '<rect x="0" y="0" width="34" height="34" fill="#3f9e5c"/><rect x="14.5" y="6" width="5" height="22" fill="#fff"/>',
  "Graubünden": '<rect x="0" y="0" width="11.3" height="34" fill="#fff"/><rect x="11.3" y="0" width="11.3" height="34" fill="#1450a4"/><rect x="22.6" y="0" width="11.4" height="34" fill="#f0c419"/>',
  "Aargau": '<rect x="0" y="0" width="34" height="34" fill="#1450a4"/><path d="M0,20 Q9,14 17,20 T34,20 V34 H0 Z" fill="#fff"/>',
  "Thurgau": '<rect x="0" y="0" width="34" height="34" fill="#3f9e5c"/><path d="M0,0 H34 V16 Z" fill="#f0c419"/>',
  "Tessin": '<rect x="0" y="0" width="17" height="34" fill="#c8102e"/><rect x="17" y="0" width="17" height="34" fill="#1450a4"/>',
  "Waadt": '<rect x="0" y="0" width="34" height="34" fill="#3f9e5c"/><rect x="0" y="14" width="34" height="6" fill="#fff"/>',
  "Wallis": '<rect x="0" y="0" width="17" height="34" fill="#fff"/><rect x="17" y="0" width="17" height="34" fill="#c8102e"/>',
  "Neuenburg": '<rect x="0" y="0" width="11.3" height="34" fill="#3f9e5c"/><rect x="11.3" y="0" width="11.3" height="34" fill="#fff"/><rect x="22.6" y="0" width="11.4" height="34" fill="#c8102e"/>',
  "Genf": '<rect x="0" y="0" width="17" height="34" fill="#f0c419"/><rect x="17" y="0" width="17" height="34" fill="#c8102e"/><ellipse cx="8.5" cy="17" rx="4" ry="3" fill="#111"/>',
  "Jura": '<rect x="0" y="0" width="34" height="34" fill="#fff"/><rect x="15.3" y="4" width="3.4" height="22" fill="#c8102e"/><path d="M11,8 H23" stroke="#c8102e" stroke-width="2.4"/>',
};
function chKantonSvg(kanton) {
  return chSchild(CH_KANTON_SVG[kanton] || '<rect width="34" height="34" fill="#d52b1e"/>');
}

function chKreuzSvg() {
  // Nachgebaut nach dem offiziellen Schweizer Wappen: runder Kopf,
  // spitz zulaufender Schild, kraeftiges breites Kreuz.
  return '<svg viewBox="0 0 34 34" class="kz-li-svg">' +
    '<path d="M5,4 Q17,1 29,4 C31,10 30,18 28,22 C25,28 20,31 17,33 C14,31 9,28 6,22 C4,18 3,10 5,4 Z" fill="#d52b1e" stroke="#1a1a1a" stroke-width="1"/>' +
    '<rect x="13.5" y="9" width="7" height="16" fill="#fff"/>' +
    '<rect x="9" y="13.5" width="16" height="7" fill="#fff"/>' +
    "</svg>";
}

// Das Schild passt sich pro Land an: EU-Laender bekommen den
// Sternenkreis, die Schweiz ihr Kreuz, Liechtenstein die traditionelle
// schwarze Tafel mit weisser Schrift - alles andere bleibt die helle
// "Euro-Tafel" wie bei Oesterreich.
// Setzt je nach Textlaenge eine von drei Groessenstufen (Klassen
// "-kurz"/"-mittel"/"-lang") statt einer einzigen festen Schriftgroesse -
// so passt es sowohl fuer "H" als auch fuer "12 3456" oder "AB 1234".
function schriftstufeSetzen(el, text, basisklasse, kurzMax, mittelMax) {
  el.classList.remove(basisklasse + "-kurz", basisklasse + "-mittel", basisklasse + "-lang");
  const len = text.length;
  if (len <= kurzMax) el.classList.add(basisklasse + "-kurz");
  else if (len <= mittelMax) el.classList.add(basisklasse + "-mittel");
  else el.classList.add(basisklasse + "-lang");
}

function kzSchildFarbeSetzen(land, einzelkennzeichen) {
  const buchstabe = document.getElementById("kzSchildA");
  let bandInhalt = "";
  // Nur bei Liechtenstein (schwarze Tafel) faellt der kleine Buchstabe
  // im Eurofeld weg, weil dort dasselbe Kuerzel schon riesig im
  // Eingabefeld steht (doppeltes "FL" saehe seltsam aus). Bei Ungarn
  // (blaues Feld, Sterne) bleibt es normal - "H" steht wie gewohnt
  // unter dem Sternenkreis, genau wie bei jedem anderen EU-Land.
  const buchstabeVerstecken = einzelkennzeichen && land.dunkel;
  if (land.euStern) {
    document.getElementById("kzSchildEu").style.background = land.euFarbe;
    buchstabe.textContent = buchstabeVerstecken ? "" : land.euText;
    bandInhalt = euSterneSvg();
  } else if (land.chKreuz) {
    // Am echten Schweizer Schild steht links NUR das rote Wappenschild
    // mit Kreuz, ohne farbiges Feld drumherum und ohne "CH"-Buchstaben.
    document.getElementById("kzSchildEu").style.background = "#fff";
    buchstabe.textContent = "";
    bandInhalt = chKreuzSvg();
  } else {
    document.getElementById("kzSchildEu").style.background = land.euFarbe;
    buchstabe.textContent = buchstabeVerstecken ? "" : land.euText;
  }
  schriftstufeSetzen(buchstabe, buchstabe.textContent, "kz-schild-a", 2, 2);
  document.getElementById("kzSterne").innerHTML = bandInhalt;

  // kz-schild-dunkel wird in kzTafelAktualisieren() gesetzt (haengt
  // nicht nur vom Land ab, sondern auch vom konkreten Treffer, z.B.
  // dem Schweizer Militaerkennzeichen).
  // rot-weiss-rote Randstreifen nur beim oesterreichischen Kennzeichen
  const istOesterreich = document.getElementById("kzLand").value === "Österreich";
  document.getElementById("kzSchild").classList.toggle("kz-schild-at", istOesterreich);
  // Bei der Schweiz steht das Kantonswappen am echten Schild GANZ
  // rechts, hinter der Nummer - nicht wie bei Oesterreich zwischen
  // Kuerzel und Nummer.
  document.getElementById("kzSchild").classList.toggle("kz-schild-wappen-hinten", !!land.chKreuz);
  // Mittiger Punkt zwischen Kuerzel und Nummer nur bei der Schweiz;
  // zweites blaues Feld ganz rechts nur bei Italien.
  document.getElementById("kzSchildPunkt").textContent = land.chKreuz ? "·" : "";
  document.getElementById("kzSchildEu2").classList.toggle("kz-schild-eu2-sichtbar", !!land.euBandRechts);
  const nr = land.nrMuster || "123 AB";
  const nrFeld = document.getElementById("kzSchildNr");
  nrFeld.value = nr;
  // Kuerzel-Feld und Nummer bekommen dieselbe Groessenstufe - nach der
  // Laenge des (pro Land fixen) Nummernmusters, nicht danach, wie viel
  // gerade eingetippt wurde. So bleiben beide immer gleich gross.
  const eingabeFeld = document.getElementById("kzEingabe");
  schriftstufeSetzen(nrFeld, nr, "kz-schild-txt", 4, 6);
  schriftstufeSetzen(eingabeFeld, nr, "kz-schild-txt", 4, 6);
}

function kzLandWechseln() {
  const land = kzAktuellesLand();
  // Laender mit nur einem einzigen Kennzeichen (Liechtenstein, Ungarn)
  // brauchen keine Eingabe - das eine Kuerzel steht fix und gross im
  // Feld, das Eurofeld daneben zeigt es dann nicht nochmal klein an.
  const einzelkennzeichen = land.kennzeichen.length === 1;
  kzSchildFarbeSetzen(land, einzelkennzeichen);
  const eingabeFeld = document.getElementById("kzEingabe");
  eingabeFeld.disabled = einzelkennzeichen;
  eingabeFeld.value = einzelkennzeichen ? land.kennzeichen[0].code : "";
  kzSimulatorAktualisieren();
}

// Kein Placeholder-Text mehr im Feld - stattdessen zeigt die Feldfarbe
// den Zustand: leer -> orange (bitte eingeben), unbekanntes Kuerzel ->
// rot, erkanntes Kuerzel -> normal.
function kzSimulatorAktualisieren() {
  const land = kzAktuellesLand();
  const eingabeFeld = document.getElementById("kzEingabe");
  const eingabe = eingabeFeld.value.toUpperCase();
  const ergebnis = document.getElementById("kzErgebnis");

  if (!eingabe) {
    eingabeFeld.classList.add("kz-schild-code-leer");
    eingabeFeld.classList.remove("kz-schild-code-unbekannt");
    kzTafelAktualisieren(land, null);
    kzKarteAktualisieren(land, null);
    kzWappenZeigen(land, null);
    ergebnis.innerHTML = 'Tipp ein Kürzel ein, z.B. „' + land.kennzeichen[0].code + '"';
    return;
  }
  eingabeFeld.classList.remove("kz-schild-code-leer");

  const treffer = kzFinden(land, eingabe);
  kzTafelAktualisieren(land, treffer);
  kzKarteAktualisieren(land, treffer);
  if (treffer) {
    eingabeFeld.classList.remove("kz-schild-code-unbekannt");
    kzWappenZeigen(land, treffer);
    const bundeslandText = land.hatWappen ? treffer.bundesland : document.getElementById("kzLand").value;
    ergebnis.innerHTML = "<b>" + eingabe + "</b> = " + treffer.bezirk + " (" + bundeslandText + ")";
  } else {
    eingabeFeld.classList.add("kz-schild-code-unbekannt");
    kzWappenZeigen(land, null);
    ergebnis.innerHTML = "<b>" + eingabe + "</b> ist in " + document.getElementById("kzLand").value + " kein bekanntes Kürzel.";
  }
}

// Manche einzelnen Kennzeichen weichen vom Land-Standard ab (z.B. das
// Schweizer Militaerkennzeichen "M": schwarze Tafel statt weiss, kein
// Wappen am Schluss) - deshalb hier pro Treffer statt nur pro Land.
// ---- Landkarte: zeigt (nur bei Oesterreich) den Bezirk (oder als
// Fallback das Bundesland) des gefundenen Kuerzels auf einer
// Umrisskarte eingefaerbt. Wird einmalig aus AT_STAAT_PFAD/
// AT_LAND_PFADE/AT_BEZIRK_PFADE aufgebaut, danach pro Treffer nur die
// passende Flaeche ein-/ausgefaerbt.
let kzKarteAufgebaut = false;
// Amtliche Kurzformen der Bundeslaender - fuer die kleine Zusatzangabe
// im Bezirks-Tooltip ("Amstetten (NÖ)").
// Amtliche Kurzform laut oesterreich.gv.at (Kennzeichen der
// Landesregierungsmitglieder: B, K, N, O, S, ST, T, V, W) - N/O hier
// als NÖ/OÖ geschrieben, wie ueblich.
const AT_BUNDESLAND_KUERZEL = {
  "Burgenland": "B", "Kärnten": "K", "Niederösterreich": "NÖ",
  "Oberösterreich": "OÖ", "Salzburg": "S", "Steiermark": "ST",
  "Tirol": "T", "Vorarlberg": "V", "Wien": "W"
};
function atBezirkBundesland(bezirkName) {
  const treffer = KENNZEICHEN.find(k => k.bezirk === bezirkName);
  return treffer ? treffer.bundesland : "";
}

// Die neun "Dreilaendereck"-Punkte rund um Oesterreich - dort, wo
// Oesterreichs eigene Staatsgrenze endet und in eine Grenze zwischen
// zwei ANDEREN Laendern uebergeht (z.B. Deutschland/Tschechien noerdlich
// von Oberoesterreich). Ausgehend von jedem dieser Punkte wird die
// weiterlaufende (nicht mehr oesterreichische) Grenze ein kurzes Stueck
// angedeutet, mit "ext" als Linien-Endpunkt (~80 Einheiten weiter
// aussen, Richtung vom Kartenmittelpunkt weg).
// Koordinaten diesmal nicht mehr nur aus der Form der Nachbar-Bezirke
// geschaetzt, sondern aus den echten Laengen-/Breitengraden der neun
// realen Dreilaendereck-Punkte berechnet: mit den 9 Landeshauptstaedten
// (deren echte Koordinaten UND ihre Bezirks-Position in dieser Karte
// bekannt sind) wurde eine affine Transformation (kleinste Quadrate)
// von Lon/Lat auf das Karten-Koordinatensystem ermittelt (Abweichung an
// den 9 Kalibrierpunkten meist unter 5, max. ~12 Karten-Einheiten) und
// darauf die realen Dreilaendereck-Koordinaten angewendet:
//  DE-AT-CZ: Plechy/Dreisesselberg (13.8667, 48.7667)
//  CZ-AT-SK: March bei Hohenau (16.96, 48.62)
//  SK-AT-HU: Donau bei Wolfsthal/Kittsee (17.09, 48.005)
//  HU-AT-SI: suedl. Burgenland (16.28, 46.87)
//  SI-AT-IT: Arnoldstein/Thoerl-Maglern (13.70, 46.50)
//  IT-AT-CH: Reschenpass-Gebiet (10.45, 46.85)
//  CH-AT-LI (Sued, Naafkopf): (9.55, 47.06)
//  LI-AT-CH (Nord, bei Feldkirch): (9.52, 47.24)
//  CH-AT-DE (Bodensee bei Gaissau): (9.60, 47.53)
// Trotzdem weiterhin eine Annaeherung (keine vermessungsgenauen Werte),
// aber deutlich praeziser als eine reine Formanalyse der Bezirke.
const AT_GRENZPUNKTE = [
  { name: "CH_DE", x: 35.4,  y: 302.6, ex: -44.5, ey: 305.6 },
  { name: "DE_CZ", x: 573.1, y: 62.5,  ex: 591.6, ey: -15.3 },
  { name: "CZ_SK", x: 962.5, y: 83.2,  ex: 1035.3, ey: 50.1 },
  { name: "SK_HU", x: 978.7, y: 197.7, ex: 1057.3, ey: 182.9 },
  { name: "HU_SI", x: 876.3, y: 411.4, ex: 951.6, ey: 438.2 },
  { name: "SI_IT", x: 551.3, y: 486.0, ex: 563.5, ey: 565.1 },
  { name: "IT_CH", x: 142.2, y: 427.7, ex: 67.4, ey: 456.0 },
  { name: "CH_LI", x: 29.0,  y: 390.4, ex: -49.2, ey: 407.3 },
  { name: "LI_CH", x: 25.2,  y: 356.9, ex: -53.9, ey: 368.5 },
];

// Die acht Nachbarland-Namen, platziert etwa in der Mitte des jeweiligen
// Grenzabschnitts (zwischen den zwei zugehoerigen Dreilaendereck-Punkten
// oben), leicht ausserhalb der AT-Kontur.
const AT_NACHBAR_LABEL = [
  { name: "Deutschland",   x: 405.5, y: 143.5, anchor: "end" },
  { name: "Tschechien",    x: 762.8, y: -10.3, anchor: "start" },
  { name: "Slowakei",      x: 1002.6, y: 130.8, anchor: "start" },
  { name: "Ungarn",        x: 954.8, y: 317.7, anchor: "start" },
  { name: "Slowenien",     x: 717.4, y: 523.6, anchor: "start" },
  { name: "Italien",       x: 395.1, y: 500.2, anchor: "end" },
  { name: "Schweiz",       x: 36.5,  y: 427.5, anchor: "end" },
  { name: "Liechtenstein", x: -17.0, y: 381.7, anchor: "end" },
];

// Leicht wackelige, handskizzenartige Linie statt einer geraden Linie -
// deutet die weiterlaufende Grenze zwischen den zwei Nachbarlaendern an.
function kzGrenzPfad(x1, y1, x2, y2, seed) {
  const segs = 4;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  const jitter = Math.min(10, len * 0.15);
  let d = "M" + x1 + "," + y1;
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    const bx = x1 + dx * t, by = y1 + dy * t;
    const sign = i % 2 === 0 ? 1 : -1;
    const mag = jitter * (0.55 + 0.45 * Math.abs(Math.sin(seed + i * 2.3)));
    d += " L" + (bx + px * mag * sign).toFixed(1) + "," + (by + py * mag * sign).toFixed(1);
  }
  d += " L" + x2 + "," + y2;
  return d;
}

function kzKarteAufbauen() {
  if (kzKarteAufgebaut) return;
  kzKarteAufgebaut = true;
  const aussen = '<path class="kz-karte-aussen" d="' + AT_STAAT_PFAD + '"/>';
  // Bundeslaender ALS Basisebene (auch als Fallback fuer Wien,
  // Sonderkennzeichen und die paar Bezirke, die in der Quelldatei
  // fehlen), Bezirke als feinere Ebene obendrauf.
  const laender = Object.keys(AT_LAND_PFADE).map(name =>
    '<path class="kz-karte-bundesland" data-bundesland="' + name + '" d="' + AT_LAND_PFADE[name] + '"><title>' + name + '</title></path>'
  ).join("");
  const bezirke = Object.keys(AT_BEZIRK_PFADE).map(name => {
    const kuerzel = AT_BUNDESLAND_KUERZEL[atBezirkBundesland(name)];
    const titel = kuerzel ? name + " (" + kuerzel + ")" : name;
    return '<path class="kz-karte-bezirk" data-bezirk="' + name + '" d="' + AT_BEZIRK_PFADE[name] + '"><title>' + titel + "</title></path>";
  }).join("");
  // Eigene Umriss-Ebene NUR fuer die Bundeslandgrenzen, ganz oben drauf
  // (ohne Fuellung) - so bleiben die Landesgrenzen kraeftig sichtbar,
  // auch wenn darunter einzelne Bezirke eingefaerbt sind.
  const grenzen = Object.keys(AT_LAND_PFADE).map(name =>
    '<path class="kz-karte-grenze" d="' + AT_LAND_PFADE[name] + '"/>'
  ).join("");
  // Pro Dreilaendereck ein eigener Gradient mit "userSpaceOnUse" und
  // den echten Linienkoordinaten (ein gemeinsamer Gradient waere bei
  // senkrechten/waagrechten Linien degeneriert, da deren Bounding-Box
  // keine Breite bzw. Hoehe hat).
  const gradients = AT_GRENZPUNKTE.map((p, i) =>
    '<linearGradient id="kzGrenzFade' + i + '" gradientUnits="userSpaceOnUse" x1="' + p.x + '" y1="' + p.y + '" x2="' + p.ex + '" y2="' + p.ey + '">' +
    '<stop offset="0%" stop-color="#445" stop-opacity=".85"/>' +
    '<stop offset="100%" stop-color="#445" stop-opacity="0"/>' +
    "</linearGradient>"
  ).join("");
  const grenzstriche = AT_GRENZPUNKTE.map((p, i) =>
    '<path class="kz-karte-grenzstrich" d="' + kzGrenzPfad(p.x, p.y, p.ex, p.ey, i) + '" stroke="url(#kzGrenzFade' + i + ')"/>'
  ).join("");
  const nachbarNamen = AT_NACHBAR_LABEL.map(n =>
    '<text class="kz-karte-nachbar-text" x="' + n.x + '" y="' + n.y + '" text-anchor="' + n.anchor + '">' + n.name + "</text>"
  ).join("");
  // Das viewBox ist bewusst deutlich groesser als die AT-Kontur (0 0 1000
  // 524), sonst schneidet das SVG die Grenzstriche und Laendernamen an
  // den Raendern ab - ein SVG-Wurzelelement clippt alles ausserhalb
  // seines eigenen viewBox-Bereichs.
  document.getElementById("kzKarte").innerHTML =
    '<svg viewBox="-260 -70 1410 650"><defs>' + gradients + "</defs>" +
    aussen + laender + bezirke + grenzen + grenzstriche + nachbarNamen + "</svg>";
}

function kzKarteAktualisieren(land, treffer) {
  const box = document.getElementById("kzKarteBox");
  // Die Karte gibt's nur bei Oesterreich, dafuer bleibt sie dort immer
  // sichtbar (auch ohne Treffer) statt erst bei einer Eingabe.
  if (!land.hatWappen) {
    box.hidden = true;
    return;
  }
  kzKarteAufbauen();
  box.hidden = false;

  const bezirk = treffer && AT_BEZIRK_PFADE[treffer.bezirk] ? treffer.bezirk : null;
  // Sonderkennzeichen gehoeren keinem einzelnen Bundesland - dafuer
  // dann gleich ganz Oesterreich markieren statt gar nichts.
  const geheimBund = treffer && treffer.bundesland === "Sonderkennzeichen";
  const bundesland = treffer && !geheimBund && AT_LAND_PFADE[treffer.bundesland] ? treffer.bundesland : null;

  // Die Bundesland-Ebene liegt UNTER der Bezirksebene und wird von
  // deren Flaechen optisch verdeckt - markiert man sie trotzdem (Wien,
  // Sonderkennzeichen, oder die paar in der Quelle fehlenden Bezirke),
  // scheint das Gold nur genau dort durch, wo kein Bezirk sie bedeckt.
  document.querySelectorAll("#kzKarte .kz-karte-bezirk").forEach(p => {
    p.classList.toggle("kz-karte-aktiv", p.dataset.bezirk === bezirk);
  });
  document.querySelectorAll("#kzKarte .kz-karte-bundesland").forEach(p => {
    const aktiv = geheimBund || (!bezirk && p.dataset.bundesland === bundesland);
    p.classList.toggle("kz-karte-aktiv", aktiv);
  });
}

function kzTafelAktualisieren(land, treffer) {
  const dunkel = !!(treffer && treffer.dunkel) || !!land.dunkel;
  document.getElementById("kzSchild").classList.toggle("kz-schild-dunkel", dunkel);
  // Ungarn-Taxi: gelbe Tafel statt weiss.
  document.getElementById("kzSchild").classList.toggle("kz-schild-gelb", !!(treffer && treffer.gelb));
  // Diplomaten-Kennzeichen (z.B. slowenisch CMD/CD/CC/M): Kuerzel in
  // gruener Schrift statt schwarz/weiss, dazu auch der Tafelrahmen gruen.
  const gruen = !!(treffer && treffer.gruen);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-gruen", gruen);
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-gruen", gruen);
  // Slowenische Polizei "P": blaue Schrift statt schwarz, dazu auch
  // der Tafelrahmen blau.
  const blau = !!(treffer && treffer.blau);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-blau", blau);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-blau", blau);
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-blau", blau);
  // Slowenisches Militaer "SV": keine EU-Sternenleiste, das ist ein
  // eigenes (nicht-ziviles) Kennzeichensystem ohne EU-Band.
  document.getElementById("kzSchildEu").classList.toggle("kz-schild-eu-leer", !!(treffer && treffer.keinEuBand));
  // Bei der Schweiz ist das Eurofeld links normalerweise weiss (dort
  // steht ja nur das rote Wappenschild drauf) - beim Militaerkennzeichen
  // ist aber die GANZE Tafel schwarz, also auch dieses Feld.
  if (land.chKreuz) {
    document.getElementById("kzSchildEu").style.background = (treffer && treffer.dunkel) ? "#111" : "#fff";
  }
  // Bei einzelnen Sonderkennzeichen (z.B. slowenisches Militaer "SV",
  // Diplomaten-Kennzeichen) steht laut Vorbild noch eine echte, zwei-
  // stellige Nummer daneben - NUR diese zwei Ziffern sind eintippbar,
  // der Rest ("-400" o.ae.) ist ein fixer, nicht editierbarer Textteil
  // direkt danach (eigenes Element "kzSchildNrSuffix").
  const nrFeld = document.getElementById("kzSchildNr");
  const nrSuffixFeld = document.getElementById("kzSchildNrSuffix");
  const editierbar = !!(treffer && treffer.nrEingebbar);
  nrFeld.readOnly = !editierbar;
  nrFeld.classList.toggle("kz-schild-nr-kurz", editierbar);
  if (editierbar) {
    if (!nrFeld.dataset.editStart) {
      nrFeld.value = "";
      nrFeld.maxLength = 2;
      nrFeld.dataset.editStart = "1";
    }
    nrSuffixFeld.textContent = treffer.nrSuffix || "";
    // Gleiche Groessenstufe UND Farbe wie das Eingabefeld, damit der
    // fixe Rest optisch gleich aussieht (className hier bewusst neu
    // gesetzt statt nur toggle, darum blau/gruen erst HIER wieder mit
    // dazunehmen statt vorher separat zu togglen).
    nrSuffixFeld.className = "kz-schild-nr-suffix " +
      Array.from(nrFeld.classList).filter(c => c.indexOf("kz-schild-txt-") === 0).join(" ") +
      (blau ? " kz-schild-code-blau" : "") + (gruen ? " kz-schild-code-gruen" : "");
    kzHerkunftAktualisieren();
  } else {
    nrFeld.removeAttribute("maxlength");
    nrFeld.classList.remove("kz-schild-code-leer");
    nrSuffixFeld.textContent = "";
    nrSuffixFeld.className = "kz-schild-nr-suffix";
    delete nrFeld.dataset.editStart;
    // Manche Sonderkennzeichen haben ein eigenes Nummernmuster statt
    // des allgemeinen Landesmusters (z.B. slowenische Polizei "P":
    // "12-123", rein numerisch, keine Buchstaben).
    const nr = (treffer && treffer.nrMuster) || land.nrMuster || "123 AB";
    nrFeld.value = nr;
    const eingabeFeld = document.getElementById("kzEingabe");
    schriftstufeSetzen(nrFeld, nr, "kz-schild-txt", 4, 6);
    schriftstufeSetzen(eingabeFeld, nr, "kz-schild-txt", 4, 6);
  }
}

// Bei "SV" (slowenisches Militaer) zeigen die ersten zwei eingetippten
// Ziffern der freien Nummer den Garnisonsstandort - wird bei jeder
// Eingabe im Nummernfeld direkt unter dem Kennzeichen angezeigt.
function kzHerkunftAktualisieren() {
  const nrFeld = document.getElementById("kzSchildNr");
  if (nrFeld.readOnly) return;
  // Nur die zwei Ziffern selbst sind eintippbar (der Rest ist der fixe
  // ".kz-schild-nr-suffix" daneben, siehe kzTafelAktualisieren).
  const ziffern = nrFeld.value.replace(/\D/g, "").slice(0, 2);
  if (nrFeld.value !== ziffern) nrFeld.value = ziffern;
  // Leer = orange, genau wie beim Kuerzel-Feld - zeigt an, dass hier
  // noch was eingetippt werden muss.
  nrFeld.classList.toggle("kz-schild-code-leer", ziffern.length === 0);
  // Eine "= Ort"-Auskunft gibt es nur, wenn wir eine echte Zuordnung
  // kennen (bisher nur SV/Garnisonsstandort) - bei den Diplomaten-
  // Kennzeichen ist die Laendernummer-Zuordnung nicht sicher belegt,
  // darum bleibt es dort nur beim Eintippen ohne Auskunft.
  const land = kzAktuellesLand();
  const eingabe = document.getElementById("kzEingabe").value.trim().toUpperCase();
  const treffer = kzFinden(land, eingabe);
  if (!treffer || !treffer.nrHerkunft) return;
  const ort = treffer.nrHerkunft[ziffern];
  const ergebnis = document.getElementById("kzErgebnis");
  ergebnis.innerHTML = ort
    ? "<b>" + ziffern + "</b> = " + ort + " (Garnisonsstandort)"
    : ziffern.length === 2
      ? "<b>" + ziffern + "</b> ist keine bekannte Garnisonsnummer."
      : "Tipp die zweistellige Nummer ein.";
}
document.getElementById("kzSchildNr").addEventListener("input", kzHerkunftAktualisieren);

// Kuerzel VOR dem Namen ("A – Österreich") - so sieht man sofort das
// echte Landeskuerzel, und im Dropdown selbst kann man per Tastatur
// direkt zum Kuerzel springen (Browser-Sprungsuche auf den Optionstext).
function kzLaenderDropdownsBefuellen() {
  const optionen = LAENDER_ORDER.map(l =>
    '<option value="' + l + '">' + LAENDER[l].emoji + " " + LAENDER[l].euText + " – " + l + "</option>"
  ).join("");
  document.getElementById("kzLand").innerHTML = optionen;
  document.getElementById("kzListeLand").innerHTML =
    '<option value="">Alle Länder</option>' + optionen;
}

// Die Regionen-Auswahl haengt vom gewaehlten Land ab: ohne Land ist
// sie leer und deaktiviert (statt einer Liste, die eh nichts filtert) -
// so ist auf den ersten Blick klar, dass zuerst ein Land noetig ist.
function kzListeRegionenBefuellen() {
  const landWahl = document.getElementById("kzListeLand").value;
  const sel = document.getElementById("kzListeBundesland");
  if (!landWahl) {
    sel.innerHTML = '<option value="">– zuerst Land wählen –</option>';
    sel.disabled = true;
    return;
  }
  const land = LAENDER[landWahl];
  sel.disabled = false;
  sel.innerHTML = '<option value="">Alle Regionen</option>' +
    land.regionen.map(r => '<option value="' + r + '">' + r + "</option>").join("");
}

function kennzeichenListeZeichnen() {
  const box = document.getElementById("kzListe");
  box.innerHTML = "";
  // Zwei getrennte Suchfelder: das kleine Kuerzel-Feld sucht NUR im
  // Code (z.B. "AM"), das grosse daneben in den ausgeschriebenen
  // Namen (Bezirk/Bundesland/Land) - klarer als eine Suche, die alles
  // gleichzeitig durchsucht.
  const kuerzel = (document.getElementById("kzSucheKuerzel").value || "").trim().toLowerCase();
  const name = (document.getElementById("kzSucheName").value || "").trim().toLowerCase();
  const landFilter = document.getElementById("kzListeLand").value;
  const regionFilter = document.getElementById("kzListeBundesland").value;

  const laenderZuZeigen = landFilter ? [landFilter] : LAENDER_ORDER;

  laenderZuZeigen.forEach(landName => {
    const land = LAENDER[landName];
    // Land-Ueberschrift nur EINMAL, vor der ersten nicht-leeren Gruppe
    // dieses Landes - so ist klar erkennbar, wo ein Land aufhoert und
    // das naechste beginnt, auch wenn ein Land mehrere Regionen hat.
    let landUeberschriftGesetzt = false;
    land.gruppen.forEach(gruppe => {
      const treffer = land.kennzeichen.filter(k =>
        k.bundesland === gruppe &&
        // Regionsfilter kann sich je nach Land auf bundesland (z.B.
        // "Niederösterreich") ODER direkt auf bezirk (z.B. bei der
        // Schweiz die Kantone) beziehen - beides pruefen.
        (regionFilter === "" || k.bundesland === regionFilter || k.bezirk === regionFilter) &&
        (kuerzel === "" || k.code.toLowerCase().includes(kuerzel)) &&
        (name === "" ||
          k.bezirk.toLowerCase().includes(name) ||
          k.bundesland.toLowerCase().includes(name) ||
          landName.toLowerCase().includes(name))
      );
      if (treffer.length === 0) return;

      if (!landUeberschriftGesetzt) {
        landUeberschriftGesetzt = true;
        const landKopf = document.createElement("p");
        landKopf.className = "stat-land";
        landKopf.textContent = LAENDER[landName].emoji + " " + landName;
        box.appendChild(landKopf);
      }

      const kopf = document.createElement("p");
      kopf.className = "stat-gruppe";
      kopf.textContent = land.gruppen.length > 1 ? gruppe : landName;
      box.appendChild(kopf);

      treffer.forEach(k => {
        const zeile = document.createElement("div");
        zeile.className = "kz-zeile";
        // Manche Eintraege (z.B. slowenisch "SV") haben einen laengeren
        // Beschreibungstext, der als eigene Zeile direkt darunter steht,
        // statt den kurzen "bezirk"-Text (fuer die Simulator-Ergebnis-
        // zeile) aufzublaehen.
        zeile.innerHTML =
          '<span class="kz-code-badge">' + k.code + "</span>" +
          '<span class="kz-bezirk">' + k.bezirk + "</span>" +
          (k.beschreibung ? '<span class="kz-beschreibung">' + k.beschreibung + "</span>" : "");
        box.appendChild(zeile);
      });
    });
  });

  if (box.innerHTML === "") {
    box.innerHTML = '<p class="kz-ergebnis">Keine Treffer.</p>';
  }
}

kzLaenderDropdownsBefuellen();

document.getElementById("gehModulKennzeichen").addEventListener("click", () => {
  zeigeBildschirm("kennzeichen");
  document.getElementById("kzLand").value = "Österreich";
  kzLandWechseln();
});

document.getElementById("kzLand").addEventListener("change", kzLandWechseln);
document.getElementById("kzEingabe").addEventListener("input", () => kzSimulatorAktualisieren());

document.getElementById("gehKennzeichenListe").addEventListener("click", () => {
  zeigeBildschirm("kennzeichenListe");
  document.getElementById("kzSucheKuerzel").value = "";
  document.getElementById("kzSucheName").value = "";
  document.getElementById("kzListeLand").value = "";
  kzListeRegionenBefuellen();
  kennzeichenListeZeichnen();
});
document.getElementById("kzSucheKuerzel").addEventListener("input", kennzeichenListeZeichnen);
document.getElementById("kzSucheName").addEventListener("input", kennzeichenListeZeichnen);
document.getElementById("kzListeLand").addEventListener("change", () => {
  kzListeRegionenBefuellen();
  kennzeichenListeZeichnen();
});
document.getElementById("kzListeBundesland").addEventListener("change", kennzeichenListeZeichnen);
