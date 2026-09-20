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
let letzteRunden = ladenJSON(SPEICHER_RUNDEN, {});    // { "schwierig": {richtig, gesamt}, ... }
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
  ["home", "modulStart", "lernen", "quiz", "abk"].forEach(s => {
    document.getElementById(s).hidden = (s !== name);
  });
  document.getElementById("karteAntwort").hidden = true;
  document.getElementById("leiste").hidden = (name !== "quiz");
  document.body.classList.toggle("fest", name === "quiz");
  navAktualisieren(name);
  const titel = {
    home: "Polizei Lernapp",
    modulStart: "Dienstgrade",
    lernen: "Lernen",
    quiz: "Quiz",
    abk: "Abkürzungen"
  };
  document.getElementById("kopfTitel").textContent = titel[name] || "Polizei Lernapp";
}

/* ---------- Startbildschirm: Gruppenkacheln ---------- */

function startbildschirmAktualisieren() {
  const liste = document.getElementById("gruppenListe");
  liste.innerHTML = "";

  let gemeisterteAnzahl = 0;

  GROUP_ORDER.forEach(g => {
    const stand = gruppenEintrag(g);
    if (stand.gemeistert) gemeisterteAnzahl++;
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

  // "Weiteres Training" bewusst zurueckhaltend: erst zeigen, wenn es
  // ueberhaupt etwas zu trainieren gibt - sonst erschlaegt es Neulinge.
  const weiteresBox = document.getElementById("weiteresTraining");
  weiteresBox.hidden = (gemeisterteAnzahl === 0 && Object.keys(quizStand).length === 0);

  document.getElementById("gemischtStatusMC").textContent = "Mischt alle 22 Dienstgrade";
  document.getElementById("gemischtStatusKarte").textContent = "Mischt alle 22 Dienstgrade";

  // ---- Gemeinsamer Fortschritts-Prozentsatz (Anteil sicher sitzender
  // Dienstgrade von allen 22) - direkt auf jeder Kachel sichtbar, statt
  // nur im separaten Lernstand-Fenster. ----
  let sitztSicher = 0;
  RANKS.forEach(r => { if (quizStand[r.id] && quizStand[r.id].stufe >= 4) sitztSicher++; });
  const prozentSchwierig = Math.round(sitztSicher / RANKS.length * 100);

  // Jede Kachel zeigt NUR ihre eigene letzte Runde, nicht synchron mit
  // den anderen Modi. "Schwierige Raenge" zeigt stattdessen den
  // Gesamtfortschritt (dafuer gibt es hier keine "Runde").
  function rundenAnzeige(modusKey, prozentId, balkenId) {
    const r = letzteRunden[modusKey];
    const p = document.getElementById(prozentId);
    const b = document.getElementById(balkenId);
    if (!r) { p.textContent = "–"; b.style.width = "0%"; return; }
    const proz = Math.round(r.richtig / r.gesamt * 100);
    p.textContent = proz + "%";
    b.style.width = proz + "%";
  }
  document.getElementById("schwierigProzent").textContent = prozentSchwierig + "%";
  document.getElementById("schwierigBalken").style.width = prozentSchwierig + "%";
  rundenAnzeige("gemischtMC", "gemischtProzentMC", "gemischtBalkenMC");
  rundenAnzeige("gemischtKarte", "gemischtProzentKarte", "gemischtBalkenKarte");
  rundenAnzeige("uniformMC", "uniformProzentMC", "uniformBalkenMC");
  rundenAnzeige("uniformKarte", "uniformProzentKarte", "uniformBalkenKarte");

  // ---- Schwierige Raenge ----
  const schwierigBtn = document.getElementById("gehSchwierig");
  const schwierigStatus = document.getElementById("schwierigStatus");
  const schwierigPool = schwierigeRaengeErmitteln();
  if (schwierigPool.length === 0) {
    schwierigBtn.disabled = true;
    const geuebt = Object.keys(quizStand).length > 0;
    schwierigStatus.textContent = geuebt
      ? "Gerade nichts Wackliges – alles im grünen Bereich"
      : "Noch keine Übungsdaten vorhanden";
  } else {
    schwierigBtn.disabled = false;
    schwierigStatus.textContent = schwierigPool.length + " Dienstgrad(e) sitzen noch nicht sicher";
  }
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

/* ---- Schwierige Raenge (endlos, nur schwache Dienstgrade) ---- */

function schwierigeRaengeErmitteln() {
  return RANKS.filter(r => {
    const e = quizStand[r.id];
    return e && (e.richtig + e.falsch) > 0 && e.stufe <= 2;
  });
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

function schwierigStarten() {
  quizModus = "schwierig";
  serie = 0;
  letzte = [];
  rundeZaehler = 0;
  rundeRichtig = 0;
  warteschlange = mischen(schwierigeRaengeErmitteln().map(r => r.id));
  lektionGesamt = warteschlange.length;
  document.getElementById("quizKontext").textContent = "Schwierige Ränge";
  document.getElementById("gruppeFertig").hidden = true;
  document.getElementById("frageBild").style.visibility = "visible";
  zeigeBildschirm("quiz");
  leisteAktualisieren();
  naechsteFrageSchwierig();
}

function naechsteFrageSchwierig() {
  if (warteschlange.length === 0) {
    if (rundeZaehler === 0) {
      zeigeAbschluss("Stark! Gerade ist nichts mehr auffällig schwierig.");
    } else {
      rundeAbschliessen("schwierig");
    }
    return;
  }
  sperre = false;
  let vornId = warteschlange.shift();
  if (vornId === letzte[letzte.length - 1] && warteschlange.length > 0) {
    warteschlange.push(vornId);
    vornId = warteschlange.shift();
  }
  const ziel = RANKS.find(r => r.id === vornId);

  frageZeichnen(ziel, (istRichtig, id) => {
    rundeZaehler++;
    if (istRichtig) { serie++; rundeRichtig++; } else { serie = 0; warteschlange.push(id); }
    letzte.push(id);
    if (letzte.length > LETZTE_MERKEN) letzte.shift();
  }, naechsteFrageSchwierig);
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
    ["gemischt-mc", "gemischt-karte", "schwierig", "uniform-mc", "uniform-karte"].includes(quizModus) ? serie : "–";
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
  modulStart: "home",
  abk: "modulStart",
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
  const inLektion = (name === "lernen" || name === "quiz" || name === "abk");
  if (inLektion) {
    zurueck.innerHTML = ICON_ZURUECK + " Zurück";
    zurueck.classList.add("nav-text");
  } else {
    zurueck.innerHTML = ICON_ZURUECK;
    zurueck.classList.remove("nav-text");
  }

  thema.hidden = inLektion;
  home.hidden = inLektion;
}

function zurueckNavigieren(ziel) {
  zeigeBildschirm(ziel);
  if (ziel === "modulStart") startbildschirmAktualisieren();
}

/* ============================================================
   Hell/Dunkel-Umschaltung
   ============================================================ */

function themaLaden() {
  const gespeichert = localStorage.getItem("dienstgrade-thema");
  if (gespeichert === "hell") document.documentElement.setAttribute("data-theme", "hell");
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

document.getElementById("gehAbkuerzungen").addEventListener("click", () => {
  abkZeichnen();
  zeigeBildschirm("abk");
});

document.getElementById("gehModulDienstgrade").addEventListener("click", () => {
  zeigeBildschirm("modulStart");
  startbildschirmAktualisieren();
});

document.getElementById("gehGemischtMC").addEventListener("click", () => gemischtesQuizStarten("mc"));
document.getElementById("gehGemischtKarte").addEventListener("click", () => gemischtesQuizStarten("karte"));
document.getElementById("wusstJa").addEventListener("click", () => karteBewerten(true));
document.getElementById("wusstNicht").addEventListener("click", () => karteBewerten(false));
document.getElementById("gehSchwierig").addEventListener("click", schwierigStarten);
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
