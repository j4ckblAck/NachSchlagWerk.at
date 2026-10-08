/* ============================================================
   Modul: Kennzeichen-Abfrage - Laenderauswahl (Oesterreich + die
   acht Nachbarlaender) + Simulator, und die durchsuchbare Liste
   als eigener Unterbildschirm. Keine separate Bundesland-Auswahl
   mehr im Simulator - das Wappen ergibt sich direkt aus dem
   eingetippten Kuerzel.

   Laenderauswahl im Simulator laeuft NICHT mehr ueber ein <select>,
   sondern ueber Feld 1 der drei getrennten Eingabefelder (Land /
   Bezirks-Kuerzel / Zusatznummer) unterhalb der Tafel - das aktuell
   GUELTIGE Land steht in kzAktuellesLandName (nur eindeutige Treffer
   auf land.euText setzen das um, siehe kzFeld1Input).
   ============================================================ */

let kzAktuellesLandName = "Österreich";

// Misst die tatsaechliche Breite eines Textes in genau der Schriftart,
// die gerade auf "el" angewendet ist (liest font-weight/-size/-family
// per getComputedStyle aus) - zuverlaessiger als eine Breite ueber die
// "ch"-Einheit zu schaetzen, die nur von der Breite der Ziffer "0"
// ausgeht und bei breiten Grossbuchstaben (z.B. "W", "M") je nach
// Geraet/Schriftart spuerbar daneben liegen kann.
let kzMessCanvas = null;
function kzTextPixelbreite(el, text) {
  if (!kzMessCanvas) kzMessCanvas = document.createElement("canvas");
  const ctx = kzMessCanvas.getContext("2d");
  const stil = getComputedStyle(el);
  ctx.font = stil.fontStyle + " " + stil.fontWeight + " " + stil.fontSize + " " + stil.fontFamily;
  return ctx.measureText(text).width;
}

// Setzt die Breite eines Feldes auf genau die gemessene Textbreite PLUS
// dessen eigenes Innenpolster (padding) und Rahmen - bei box-sizing:
// border-box (siehe globale Regel) zaehlt "width" naemlich INKLUSIVE
// Padding/Rahmen, nicht nur der Inhalt. Wurde das Padding hier nicht
// mitgerechnet, blieb fuer den Text selbst zu wenig Platz und genau
// das letzte Zeichen (bei .kz-schild-nr mit 12px Padding besonders
// deutlich) wurde am Rand abgeschnitten - unabhaengig von Geraet/
// Schriftart, ein reiner Rechenfehler.
function kzFeldBreiteSetzen(el, text) {
  const textPx = kzTextPixelbreite(el, text);
  const stil = getComputedStyle(el);
  const zusatz = parseFloat(stil.paddingLeft) + parseFloat(stil.paddingRight) +
    parseFloat(stil.borderLeftWidth) + parseFloat(stil.borderRightWidth);
  el.style.width = Math.ceil(textPx + zusatz) + 3 + "px";
}

// Letzte Sicherheitsstufe gegen abgeschnittenen/ueberlappenden Text:
// prueft per scrollWidth/clientWidth (echte Browser-Layout-Werte, nicht
// geschaetzt), ob Kuerzel+Wappen+Nummer zusammen ueberhaupt in die
// verfuegbare Breite passen - falls nicht (z.B. auf einem Geraet mit
// einer breiteren Schriftart als hier zum Entwickeln verfuegbar),
// wird die Schrift von Kuerzel UND Nummer gemeinsam um genau so viel
// verkleinert, wie noetig ist, und die Breiten neu vermessen.
function kzSchildEinpassen() {
  const mitte = document.getElementById("kzSchildMitte");
  const code = document.getElementById("kzEingabe");
  const nr = document.getElementById("kzSchildNr");
  const suffix = document.getElementById("kzSchildNrSuffix");
  const codeVersteckt = code.classList.contains("kz-schild-code-versteckt");
  // Vorherige Verkleinerung zuerst zuruecksetzen - sonst wuerde sich
  // eine einmal geschrumpfte Schrift nie wieder erholen, auch wenn
  // spaeter wieder genug Platz da ist (z.B. nach einem Laenderwechsel).
  code.style.fontSize = "";
  nr.style.fontSize = "";
  suffix.style.fontSize = "";
  if (!codeVersteckt) code.style.width = "";
  nr.style.width = "";
  kzBreitenMessen();
  // Schrittweise (statt mit einer errechneten Zielgroesse) verkleinern,
  // bis es passt - robuster gegen Rundungs-/Puffer-Effekte als ein
  // einzelner berechneter Sprung, der bei diesem Layout empirisch
  // konsequent zu wenig verkleinert hat.
  for (let versuch = 0; versuch < 8 && mitte.scrollWidth > mitte.clientWidth + 1; versuch++) {
    [code, nr, suffix].forEach(el => {
      const aktuellePx = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = (aktuellePx * 0.94) + "px";
    });
    kzBreitenMessen();
  }

  function kzBreitenMessen() {
    // Verstecktes Kuerzel-Feld (Breite 0, siehe kz-schild-code-versteckt)
    // NICHT neu vermessen - sonst wuerde diese Funktion die Breite
    // gleich wieder auf die Textbreite zurueckstellen und es doch
    // sichtbar machen.
    if (!codeVersteckt) kzFeldBreiteSetzen(code, code.value || code.placeholder || "0");
    kzFeldBreiteSetzen(nr, nr.value);
  }
}

function kzAktuellesLand() {
  return LAENDER[kzAktuellesLandName] || LAENDER["Österreich"];
}

// Ein Eintrag mit Kuerzel "---" markiert Laender/Kategorien GANZ OHNE
// Regionsbezug (siehe data/countries/*.js, z.B. Luxemburg, Frankreich,
// Island) - das ist kein wirklich eintippbares Unterscheidungskuerzel
// (man wuerde nie ein Auto mit "---" als Kuerzel sehen), sondern nur
// der Normalzustand, wenn NICHTS eingegeben ist. Reicht als alleiniges
// Signal in der Laenderdatei - hier zentral erkannt, statt bei jedem
// betroffenen Land zusaetzlich "nichtEingebbar"/"codeVersteckt" von
// Hand setzen zu muessen (das wurde bisher nur bei Island gemacht und
// war dort fehleranfaellig). Ein explizit gesetztes "nichtEingebbar"
// (z.B. bei einem anderen Platzhalter-Kuerzel) wird weiterhin respektiert.
function kzOhneKuerzel(k) {
  return !!k && (k.code === "---" || !!k.nichtEingebbar);
}

function kzFinden(land, code) {
  const gesucht = code.trim().toUpperCase();
  // "---" (bzw. "nichtEingebbar", siehe kzOhneKuerzel) markiert das
  // reine Landes-Basiskuerzel bei Laendern ohne echte Einteilung - das
  // ist kein wirklich eintippbares Unterscheidungskuerzel, sondern nur
  // der Normalzustand, wenn NICHTS eingegeben ist (siehe
  // kzSimulatorAktualisieren). Darum hier von der Fund-Suche
  // ausgenommen, auch wenn der Eintrag fuer die Standardanzeige
  // (Platzhalter, Grundmuster) weiter existiert.
  return land.kennzeichen.find(k => k.code === gesucht && !kzOhneKuerzel(k));
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
    return '<img src="wappen/feuerwehr.png" alt="" onerror="this.style.display=\'none\'">';
  },
  "si-wappen": function () {
    // Vereinfachtes slowenisches Staatswappen (Triglav, Wellenlinien,
    // drei Sterne) - fuer das Militaerkennzeichen "SV", das laut Nutzer
    // hier ein Wappen zeigen soll (statt komplett leer zu bleiben).
    return '<svg viewBox="0 0 34 40" class="kz-li-svg">' +
      '<path d="M4,4 H30 V26 C30,34 17,40 17,40 C17,40 4,34 4,26 Z" fill="#005CE7" stroke="#f4f3ef" stroke-width="1.4"/>' +
      '<path d="M9,26 L17,14 L25,26 Z" fill="#f4f3ef"/>' +
      '<path d="M6,29 Q10,26 14,29 T22,29 T28,29" fill="none" stroke="#f4f3ef" stroke-width="1.6"/>' +
      '<path d="M6,32.5 Q10,29.5 14,32.5 T22,32.5 T28,32.5" fill="none" stroke="#f4f3ef" stroke-width="1.6"/>' +
      '<g fill="#f4f3ef">' +
      '<circle cx="17" cy="9" r="1.5"/><circle cx="12.5" cy="12.5" r="1.5"/><circle cx="21.5" cy="12.5" r="1.5"/>' +
      "</g></svg>";
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
    // Auch hier (wie im "sonst nichts trifft zu"-Zweig unten) den Zustand
    // von einem VORHERIGEN Land explizit zuruecksetzen - sonst bliebe
    // z.B. beim Wechsel von Deutschland zu Sloweniens "P" (Polizei) die
    // volle Kreis-Groesse faelschlich stehen.
    box.classList.remove("kz-schild-wappen-vollhoehe");
    return;
  }

  // "vollhoehe" (siehe .kz-schild-wappen-vollhoehe) gilt NUR fuer das
  // deutsche Doppelkreis-Design (TUEV-/Kreiswappen-Plakette, spec.typ
  // "de") - das ist deutlich hoeher als breit und soll die volle
  // Kennzeichen-Hoehe ausnutzen. Normale Flaggen-Rechtecke ("h"/"v"/
  // "keil") oder Wappenschilde (ch/hu/si/li) bleiben bei der normalen,
  // kleineren Wappen-Box. Schon HIER auf Basis des Landes vorbelegen
  // (nicht erst beim konkreten Treffer), sonst wuerde die Box beim
  // allerersten gueltigen Kuerzel ploetzlich groesser/kleiner springen.
  let vollhoehe = !!(land.flagge && land.flagge.typ === "de");
  // Manche Kennzeichen haben trotz Land-Wappen keines (z.B. das
  // Schweizer Militaerkennzeichen "M" - kein Kanton, kein Kantonswappen).
  if (!treffer || treffer.keinWappen) {
    bild.innerHTML = "";
    text.textContent = "";
    // Nur bei einem KONKRET erkannten "kein Wappen"-Treffer zuruecknehmen -
    // waehrend des Tippens (treffer noch null) bleibt die Land-Vorgabe
    // von oben bestehen (siehe Kommentar dort).
    if (treffer && treffer.keinWappen) vollhoehe = false;
  } else if (land.hatWappen && WAPPEN_DATEI[treffer.bundesland]) {
    bild.innerHTML = '<img src="' + WAPPEN_DATEI[treffer.bundesland] + '" alt="" onerror="this.style.display=\'none\'">';
    // Das Wappen zeigt das BUNDESLAND, nicht den Bezirk - darum steht
    // auch hier (wie am echten Kennzeichen) der Bundesland-Name klein
    // darunter, nicht der Bezirksname. "Sonderkennzeichen" ist aber
    // kein Bundesland, sondern nur unsere interne Kategorie - keine
    // Bildunterschrift dafuer.
    text.textContent = treffer.bundesland === "Sonderkennzeichen" ? "" : treffer.bundesland;
  } else if (land.flagge) {
    // Die winzige Beschriftung unter dem Symbol gibt es nur bei
    // Oesterreich (dort steht wirklich ein Bundesland-Wappen) - bei
    // allen anderen Laendern bleibt es beim Symbol ohne Textzeile
    // ("vollhoehe" ist hier schon von oben gesetzt).
    bild.innerHTML = landFlaggeSvg(land.flagge, treffer);
    text.textContent = "";
  } else {
    bild.innerHTML = "";
    text.textContent = "";
  }
  box.classList.toggle("kz-schild-wappen-vollhoehe", vollhoehe);

  // Die Box klappt nur ein, wenn dieses LAND grundsaetzlich nie etwas
  // an dieser Stelle zeigt (z.B. Italien - traditionell keine Grafik
  // dort) ODER wenn der ERKANNTE Treffer selbst explizit keins hat
  // (z.B. Schweizer Militaer "M" - kein Kantonswappen) - waehrend des
  // Tippens (treffer noch null) bleibt der Platz aber IMMER reserviert,
  // sonst poppt die Box genau in dem Moment auf, in dem ein Kuerzel
  // komplett erkannt wird, und der ganze mittlere Block (Kuerzel+
  // Wappen+Nummer) verschiebt sich sichtbar ("huepft").
  const keinWappenFuerTreffer = !!(treffer && treffer.keinWappen);
  const koennteEtwasZeigen = !keinWappenFuerTreffer && (land.hatWappen || land.flagge ||
    (treffer && treffer.eigenesWappen));
  box.classList.toggle("kz-schild-wappen-leer", !koennteEtwasZeigen);
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

// Vereinfachter WEISSER albanischer Doppeladler (steht am echten
// Kennzeichen auf dem normalen blauen Band, genau wie sonst der
// Sternenkranz oder das "H" bei anderen Laendern). Ausserhalb dieser
// App per Screenshot-Test verifiziert (gross UND in der tatsaechlichen
// Icon-Groesse) - liest sich klar als gespreizter Doppeladler: pro
// Fluegel fuenf gefaecherte, gedrehte Federn (statt weniger Dreiecke),
// ein durchgehender schildartiger Koerper OHNE separate Hals-Naht (die
// vorher wie ein Gesicht zwischen den Koepfen aussah), und deutlichere
// hakenfoermige Schnaebel. Weiterhin keine heraldische Feinzeichnung
// (bei Icon-Groesse ohnehin nicht sichtbar).
function alAdlerSvg() {
  return '<svg viewBox="0 0 40 28" class="kz-sterne-svg">' +
    '<g fill="#fff">' +
    // Rechter Fluegel: fuenf gefaecherte Federn (gedrehte Ellipsen)
    '<ellipse cx="29.8" cy="8.5" rx="11" ry="2.1" transform="rotate(-38 29.8 8.5)"/>' +
    '<ellipse cx="31.2" cy="11.6" rx="11.5" ry="2.1" transform="rotate(-16 31.2 11.6)"/>' +
    '<ellipse cx="31.5" cy="14.8" rx="11.5" ry="2.0" transform="rotate(4 31.5 14.8)"/>' +
    '<ellipse cx="30.5" cy="17.9" rx="11" ry="2.0" transform="rotate(24 30.5 17.9)"/>' +
    '<ellipse cx="28.4" cy="20.6" rx="9.5" ry="1.9" transform="rotate(46 28.4 20.6)"/>' +
    // Linker Fluegel (gespiegelt)
    '<ellipse cx="10.2" cy="8.5" rx="11" ry="2.1" transform="rotate(38 10.2 8.5)"/>' +
    '<ellipse cx="8.8" cy="11.6" rx="11.5" ry="2.1" transform="rotate(16 8.8 11.6)"/>' +
    '<ellipse cx="8.5" cy="14.8" rx="11.5" ry="2.0" transform="rotate(-4 8.5 14.8)"/>' +
    '<ellipse cx="9.5" cy="17.9" rx="11" ry="2.0" transform="rotate(-24 9.5 17.9)"/>' +
    '<ellipse cx="11.6" cy="20.6" rx="9.5" ry="1.9" transform="rotate(-46 11.6 20.6)"/>' +
    // Koerper/Hals/Schwanz als EIN Schild (kein separater Hals mehr)
    '<path d="M13,10 C13,7.5 15,6.7 17,8 L20,10.3 L23,8 C25,6.7 27,7.5 27,10 C27.6,13 26,17 25,20 C24,23 22,25.3 20,27 C18,25.3 16,23 15,20 C14,17 12.4,13 13,10 Z"/>' +
    // Koepfe
    '<circle cx="15.3" cy="5" r="2.8"/>' +
    '<circle cx="24.7" cy="5" r="2.8"/>' +
    // Hakenfoermige Schnaebel
    '<path d="M13.0,3.6 L8.2,2.6 L9.6,5.2 L13.4,5.6 Z"/>' +
    '<path d="M27.0,3.6 L31.8,2.6 L30.4,5.2 L26.6,5.6 Z"/>' +
    "</g></svg>";
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
  } else if (land.adlerBand) {
    // Albanien: normales blaues Band wie bei jedem anderen Land (kein
    // eigenes Wappenschild wie bei der Schweiz), aber statt des EU-
    // Sternenkranzes (nicht EU-Mitglied) der weisse Doppeladler - "AL"
    // bleibt wie gewohnt darunter stehen.
    document.getElementById("kzSchildEu").style.background = land.euFarbe;
    buchstabe.textContent = buchstabeVerstecken ? "" : land.euText;
    bandInhalt = alAdlerSvg();
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
  const istOesterreich = kzAktuellesLandName === "Österreich";
  document.getElementById("kzSchild").classList.toggle("kz-schild-at", istOesterreich);
  // Bei der Schweiz steht das Kantonswappen am echten Schild GANZ
  // rechts, hinter der Nummer - nicht wie bei Oesterreich zwischen
  // Kuerzel und Nummer.
  document.getElementById("kzSchild").classList.toggle("kz-schild-wappen-hinten", !!land.chKreuz);
  // Mittiger Punkt zwischen Kuerzel und Nummer - bei der Schweiz
  // ("chKreuz") UND bei Albanien/Italien ("mittelpunkt") dasselbe
  // einfache Textzeichen "·"; zweites blaues Feld ganz rechts bei
  // Italien (mit orangem Kreis oben, kz-schild-eu2-orange) bzw.
  // Albanien (mit weissem Ring unten, kz-schild-eu2-kreis).
  document.getElementById("kzSchildPunkt").textContent = (land.chKreuz || land.mittelpunkt) ? "·" : "";
  document.getElementById("kzSchildEu2").classList.toggle("kz-schild-eu2-sichtbar", !!land.euBandRechts);
  document.getElementById("kzSchildEu2").classList.toggle("kz-schild-eu2-kreis", !!land.euBandRechtsKreis);
  document.getElementById("kzSchildEu2").classList.toggle("kz-schild-eu2-orange", !!land.euBandRechtsOrange);
  const nr = land.nrMuster || "123 AB";
  const nrFeld = document.getElementById("kzSchildNr");
  nrFeld.value = nr;
  // Kuerzel-Feld und Nummer bekommen dieselbe Groessenstufe - nach der
  // Laenge des (pro Land fixen) Nummernmusters. Das Kuerzel-Feld selbst
  // ist NICHT mehr auf das laengste Kuerzel dieses Landes fest breit
  // (das zwang z.B. Deutschland insgesamt auf eine kleinere Schrift,
  // nur wegen der paar 3-stelligen Kuerzel wie "HRO") - stattdessen
  // passt sich seine Breite in kzTafelAktualisieren laufend der
  // tatsaechlich eingegebenen Zeichenzahl an, siehe dort.
  const eingabeFeld = document.getElementById("kzEingabe");
  schriftstufeSetzen(nrFeld, nr, "kz-schild-txt", 4, 6);
  schriftstufeSetzen(eingabeFeld, nr, "kz-schild-txt", 4, 6);
}

// Setzt die Breite des Kuerzel-Eingabefelds passend zum LAENGSTEN
// Kuerzel des aktuell gewaehlten Landes (statt einer festen Breite fuer
// alle Laender) - so ruecken Wappen und Nummer bei Laendern mit kurzen
// Kuerzeln (z.B. Oesterreich: max. 2 Zeichen) sichtbar naeher an das
// Kuerzel heran, statt durch ungenutzten Leerraum zu weit rechts zu
// wirken. "ch" skaliert automatisch mit der aktuellen Schriftgroessen-
// Stufe (schriftstufeSetzen) mit, ohne dass hier Pixel berechnet werden
// muessen. maxLength wird ebenfalls angepasst, damit auch die (seltenen)
// 4-stelligen Sonderkennzeichen wie das italienische "SMOM" ueberhaupt
// eintippbar sind, ohne bei kurzen Laendern unnoetig viel zuzulassen.
function kzEingabeGroesseSetzen(land, eingabeFeld) {
  const laengstesKuerzel = land.kennzeichen.reduce(
    (max, k) => Math.max(max, k.code.length), 1
  );
  eingabeFeld.maxLength = laengstesKuerzel;
  // Die BREITE selbst wird NICHT mehr hier fix aufs laengste Kuerzel
  // dieses Landes gesetzt - das zwang z.B. Deutschland (Kuerzel bis zu
  // 3 Zeichen wie "HRO") insgesamt auf eine kleinere Schrift, obwohl
  // die meisten Kuerzel dort nur 1-2 Zeichen lang sind. Stattdessen
  // passt kzTafelAktualisieren die Breite bei jeder Eingabe an die
  // AKTUELL eingegebene Zeichenzahl an (siehe dort) - so bleibt die
  // normale, groessere Schrift moeglich, und nur wirklich lange
  // Kuerzel wie "HRO" bekommen dafuer selbst etwas mehr Breite.
  eingabeFeld.style.width = (Math.max(eingabeFeld.value.length, 1) + 0.3) + "ch";
}

function kzLandWechseln() {
  const land = kzAktuellesLand();
  document.getElementById("kzFeld2Vorschlaege").hidden = true;
  // Laender mit nur einem einzigen Kennzeichen (Liechtenstein, Ungarn)
  // brauchen keine Eingabe - das eine Kuerzel steht fix und gross im
  // Feld, das Eurofeld daneben zeigt es dann nicht nochmal klein an.
  const einzelkennzeichen = land.kennzeichen.length === 1;
  kzSchildFarbeSetzen(land, einzelkennzeichen);
  const eingabeFeld = document.getElementById("kzEingabe");
  kzEingabeGroesseSetzen(land, eingabeFeld);
  eingabeFeld.disabled = einzelkennzeichen;
  // "---" (siehe kzOhneKuerzel) heisst: dieses Land hat kein ECHTES,
  // bedeutungstragendes Kuerzel - weder als Wert noch als Platzhalter-
  // Beispiel soll dann buchstaeblich "---" erscheinen (z.B. Luxemburg/
  // Frankreich: auf der Tafel steht dort wirklich gar nichts).
  const erstesKennzeichen = land.kennzeichen[0];
  const ersteOhneKuerzel = kzOhneKuerzel(erstesKennzeichen);
  eingabeFeld.value = einzelkennzeichen && !ersteOhneKuerzel ? erstesKennzeichen.code : "";
  eingabeFeld.placeholder = ersteOhneKuerzel ? "" : erstesKennzeichen.code;

  // Feld 2 (Bezirks-Kuerzel): bei Einzelkennzeichen-Laendern gibt es
  // nichts einzutippen, das eine Kuerzel steht schon in der Tafel -
  // Feld 2 bleibt dann komplett ausgeblendet (nicht nur grau/gesperrt).
  // Zeichenart (nur Buchstaben ODER nur Ziffern, siehe kzFeld2Input)
  // merken wir uns am Feld selbst.
  const feld2 = document.getElementById("kzFeld2");
  feld2.value = "";
  feld2.disabled = einzelkennzeichen;
  feld2.maxLength = land.kennzeichen.reduce((max, k) => Math.max(max, k.code.length), 1);
  feld2.dataset.nurZiffern = land.kennzeichen.every(k => /^[0-9]+$/.test(k.code)) ? "1" : "";
  feld2.placeholder = "";

  // Feld 3 (Zusatznummer) schaltet erst frei, sobald Feld 2 einen
  // Treffer mit nrEingebbar/nrAuswahl liefert (siehe kzFeld2Input) -
  // beim Landwechsel also erstmal immer ausgeblendet.
  const feld3 = document.getElementById("kzFeld3");
  feld3.value = "";
  feld3.disabled = true;

  // "standardKuerzel": das erste Kuerzel (z.B. Albaniens "AB", Ungarns
  // "AA") soll schon automatisch geladen sein, sobald das Land
  // ausgewaehlt ist - auch wenn es noch mehrere ANDERE echte Kuerzel
  // gibt (z.B. Albaniens "MB"/"MM"), also NICHT einzelkennzeichen ist.
  // Feld 2 wird dafuer einfach vorausgefuellt und danach der GANZ
  // NORMALE kzFeld2Input-Ablauf angestossen - Tafel, Ergebnistabelle
  // und Farben laufen dann exakt wie bei jedem echt eingetippten
  // Kuerzel, keine Sonderbehandlung noetig.
  if (land.standardKuerzel && !einzelkennzeichen && !ersteOhneKuerzel) {
    feld2.value = erstesKennzeichen.code;
    kzFeld2Input();
    // kzFeld2Input() zeigt normalerweise (wie bei echtem Tippen) auch
    // die Vorschlagsliste an - hier aber nur eine automatische
    // Vorbefuellung, keine echte Nutzereingabe, darum die Liste gleich
    // wieder verstecken statt sie ungefragt aufpoppen zu lassen.
    document.getElementById("kzFeld2Vorschlaege").hidden = true;
    return;
  }

  kzSimulatorAktualisieren();
  kzFokusAktualisieren();
}

// Waehlt ein Land per Namen aus (Klick auf einen Vorschlag oder
// eindeutiger Treffer beim Tippen in Feld 1, siehe kzFeld1Input) und
// stoesst den kompletten Landwechsel an.
function kzLandSetzen(name) {
  if (!LAENDER[name]) return;
  kzAktuellesLandName = name;
  // Feld 1 IMMER auf das echte Kuerzel setzen - beim Tippen (exakter
  // Treffer in kzFeld1Input) steht da ohnehin schon genau dieser Text,
  // das Ueberschreiben ist also ein No-Op und stoert das Zusammensetzen
  // von z.B. "SLO" nicht (die alte Sorge, die dieser Kommentar frueher
  // hier hatte). Beim KLICK auf einen Vorschlag dagegen war das Feld
  // vorher oft leer/unpassend (z.B. noch gar nichts getippt) - ohne
  // dieses Setzen blieb es dann faelschlich leer statt das gewaehlte
  // Kuerzel zu zeigen.
  document.getElementById("kzFeld1").value = LAENDER[name].euText;
  document.getElementById("kzFeld1").classList.remove("kz-eingabe-feld-fehler");
  kzFeld1VorschlaegeVerstecken();
  kzLandWechseln();
}

function kzFeld1VorschlaegeVerstecken() {
  const box = document.getElementById("kzFeld1Vorschlaege");
  box.hidden = true;
  box.innerHTML = "";
}

// Zeigt (beim Tippen ODER beim blossen Fokussieren) alle Laender, deren
// echtes Kuerzel (land.euText) mit "roh" beginnt - bei leerem "roh" also
// ALLE Laender, wie beim Fokussieren von Feld 2/3.
function kzFeld1VorschlaegeAnzeigen(roh) {
  const kandidaten = LAENDER_ORDER
    .filter(name => LAENDER[name].euText.startsWith(roh))
    .sort((a, b) => LAENDER[a].euText.length - LAENDER[b].euText.length);
  const box = document.getElementById("kzFeld1Vorschlaege");
  if (!kandidaten.length) {
    kzFeld1VorschlaegeVerstecken();
    return;
  }
  box.innerHTML = kandidaten.map(name =>
    '<div class="kz-feld1-vorschlag" data-land="' + name + '"><b>' + LAENDER[name].euText + "</b>" + name + "</div>"
  ).join("");
  box.hidden = false;
}

// Bei genau einem vollstaendigen Treffer beim TIPPEN wird das Land
// direkt uebernommen (siehe kzLandSetzen), sonst bleibt das zuletzt
// gueltige Land aktiv (Feld 2/3 zeigen aber per Fehlerrand an, dass
// gerade kein Land feststeht).
function kzFeld1Input() {
  const feld1 = document.getElementById("kzFeld1");
  const roh = feld1.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "");
  if (feld1.value !== roh) feld1.value = roh;
  kzFokusAktualisieren();

  if (!roh) {
    // Leer heisst nicht mehr "keine Vorschlaege" - stattdessen wie beim
    // Fokussieren ALLE Laender zeigen (siehe kzFeld1VorschlaegeAnzeigen).
    feld1.classList.remove("kz-eingabe-feld-fehler");
    kzFeld1VorschlaegeAnzeigen(roh);
    return;
  }

  const exakt = LAENDER_ORDER.find(name => LAENDER[name].euText === roh);
  if (exakt) {
    kzLandSetzen(exakt);
    return;
  }

  // Kein eindeutiger Treffer (noch) - Land bleibt wie es war, aber rot
  // umrandet als Hinweis, dass das noch kein gueltiges Kuerzel ist.
  feld1.classList.add("kz-eingabe-feld-fehler");
  kzFeld1VorschlaegeAnzeigen(roh);
}
document.getElementById("kzFeld1").addEventListener("focus", function () {
  const roh = document.getElementById("kzFeld1").value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "");
  kzFeld1VorschlaegeAnzeigen(roh);
});

document.getElementById("kzFeld1Vorschlaege").addEventListener("click", function (e) {
  const zeile = e.target.closest(".kz-feld1-vorschlag");
  if (zeile) kzLandSetzen(zeile.dataset.land);
});
// Ausserhalb hingetippt/-geklickt -> alle drei Vorschlagslisten weg
// (aber die Felder selbst bleiben stehen, wie sie sind - kein
// automatisches Zuruecksetzen).
document.addEventListener("click", function (e) {
  const feld2Box = document.getElementById("kzFeld2Vorschlaege");
  const feld3Box = document.getElementById("kzFeld3Vorschlaege");
  if (e.target.closest("#kzFeld1Wrap")) {
    feld2Box.hidden = true;
    feld3Box.hidden = true;
  } else if (e.target.closest("#kzFeld2Wrap")) {
    kzFeld1VorschlaegeVerstecken();
    feld3Box.hidden = true;
  } else if (e.target.closest("#kzFeld3Wrap")) {
    kzFeld1VorschlaegeVerstecken();
    feld2Box.hidden = true;
  } else {
    kzFeld1VorschlaegeVerstecken();
    feld2Box.hidden = true;
    feld3Box.hidden = true;
  }
});

// Feld 2 (Bezirks-/Unterscheidungskuerzel) spiegelt seinen Wert direkt
// in die (nicht mehr editierbare) Tafel-Anzeige kzEingabe und stoesst
// darueber dieselbe Treffersuche/Kartenaktualisierung an wie frueher
// die Direkteingabe im Schild.
function kzFeld2Input() {
  const feld2 = document.getElementById("kzFeld2");
  const nurZiffern = feld2.dataset.nurZiffern === "1";
  const roh = feld2.value.toUpperCase().replace(nurZiffern ? /[^0-9]/g : /[^A-ZÄÖÜ]/g, "");
  if (feld2.value !== roh) feld2.value = roh;

  document.getElementById("kzEingabe").value = roh;
  kzSimulatorAktualisieren();
  kzFeld2VorschlaegeAnzeigen();

  const land = kzAktuellesLand();
  const treffer = roh ? kzFinden(land, roh) : null;
  const feld3 = document.getElementById("kzFeld3");
  // "nrAuswahl" (z.B. Albaniens "AB" -> T/MT/R/RB) schaltet Feld 3
  // genauso frei wie "nrEingebbar" (z.B. Sloweniens "SV") - der
  // Unterschied liegt nur darin, WIE Feld 3 die Tafel beeinflusst
  // (siehe kzTafelAktualisieren/kzHerkunftAktualisieren).
  const brauchtFeld3 = !!(treffer && (treffer.nrEingebbar || treffer.nrAuswahl));
  feld3.disabled = !brauchtFeld3;
  if (!brauchtFeld3) {
    feld3.value = "";
    document.getElementById("kzFeld3Vorschlaege").hidden = true;
  } else {
    // Bildschirmtastatur auf Handys passend umschalten - Ziffernblock
    // fuer Zahlen (z.B. slowenische Garnisonsnummer), normale Tastatur
    // fuer Buchstaben (z.B. albanische Teilstreitkraft bei "MM").
    feld3.inputMode = kzNrBuchstaben(treffer) ? "text" : "numeric";
    feld3.focus();
  }
}

// Fuer JEDES Land (nicht mehr nur fuer solche ohne echten Regionsbezug
// wie Luxemburg/Ungarn) beim Fokussieren/Tippen in Feld 2 eine
// Vorschlagsliste wie bei Feld 1 - zeigt bei leerem Feld alle, sonst nur
// die zum Getippten passenden Kuerzel. Nur wenn es ueberhaupt mehrere
// Kuerzel gibt (sonst steht das eine schon fest, siehe einzelkennzeichen
// in kzLandWechseln).
function kzFeld2VorschlaegeAnzeigen() {
  const box = document.getElementById("kzFeld2Vorschlaege");
  const feld2 = document.getElementById("kzFeld2");
  const land = kzAktuellesLand();
  if (land.kennzeichen.length < 2) {
    box.hidden = true;
    return;
  }
  const roh = feld2.value.toUpperCase();
  const kandidaten = land.kennzeichen.filter(k => !kzOhneKuerzel(k) && k.code.startsWith(roh));
  if (!kandidaten.length) {
    box.hidden = true;
    return;
  }
  box.innerHTML = kandidaten.map(k =>
    '<div class="kz-feld1-vorschlag" data-code="' + k.code + '"><b>' + k.code + "</b>" + k.bezirk + "</div>"
  ).join("");
  box.hidden = false;
}
document.getElementById("kzFeld2").addEventListener("focus", kzFeld2VorschlaegeAnzeigen);
document.getElementById("kzFeld2Vorschlaege").addEventListener("click", function (e) {
  const zeile = e.target.closest(".kz-feld1-vorschlag");
  if (!zeile) return;
  const feld2 = document.getElementById("kzFeld2");
  feld2.value = zeile.dataset.code;
  document.getElementById("kzFeld2Vorschlaege").hidden = true;
  kzFeld2Input();
});

// Ob bei einem Treffer die freie Zusatznummer aus BUCHSTABEN statt
// Ziffern besteht (bisher nur albanisches Militaer "MM" - die
// Teilstreitkraft FA/FD/FT/KM/PU/SP - alle anderen nrEingebbar-Faelle,
// z.B. slowenisches "SV", bleiben rein numerisch).
function kzNrBuchstaben(treffer) {
  return !!(treffer && treffer.nrArt === "buchstaben");
}

// Wie viele Zeichen der Zusatznummer eintippbar sind - Standard 2 (z.B.
// "SV"-Garnisonsnummer), per "nrLaenge" pro Kuerzel anpassbar (z.B. 1
// bei "BP": Ziffer der Landespolizeidirektion).
function kzNrLaenge(treffer) {
  return (treffer && treffer.nrLaenge) || 2;
}

// Feld 3 (Zusatznummer/-kuerzel, z.B. Garnisonsstandort bei "SV" oder
// Teilstreitkraft bei "MM") spiegelt seinen Wert in kzSchildNr -
// kzHerkunftAktualisieren (unveraendert) uebernimmt von dort die
// Auswertung/Anzeige wie zuvor.
function kzFeld3Input() {
  const feld3 = document.getElementById("kzFeld3");
  const land = kzAktuellesLand();
  const feld2 = document.getElementById("kzFeld2");
  const treffer = kzFinden(land, feld2.value);
  const wert = (kzNrBuchstaben(treffer)
    ? feld3.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "")
    : feld3.value.replace(/\D/g, "")
  ).slice(0, kzNrLaenge(treffer));
  if (feld3.value !== wert) feld3.value = wert;
  document.getElementById("kzSchildNr").value = wert;
  kzHerkunftAktualisieren();
  kzFeld3VorschlaegeAnzeigen();
}

// Bei Kuerzeln mit einer bekannten Nummern-/Buchstaben-Herkunftstabelle
// (bisher slowenisches Militaer "SV" und albanisches Militaer "MM",
// siehe nrHerkunft in data/countries/si.js bzw. al.js) zeigt Feld 3
// beim Fokussieren/Tippen dieselbe Art Vorschlagsliste wie Feld 1/2 -
// bei leerem Feld alle Herkunftswerte, sonst nur die zum bisher
// Eingetippten passenden.
function kzFeld3VorschlaegeAnzeigen() {
  const box = document.getElementById("kzFeld3Vorschlaege");
  const feld3 = document.getElementById("kzFeld3");
  const land = kzAktuellesLand();
  const feld2 = document.getElementById("kzFeld2");
  const treffer = kzFinden(land, feld2.value);
  if (!treffer || !treffer.nrHerkunft) {
    box.hidden = true;
    return;
  }
  const roh = kzNrBuchstaben(treffer) ? feld3.value.toUpperCase() : feld3.value.replace(/\D/g, "");
  const kandidaten = Object.keys(treffer.nrHerkunft).filter(nr => nr.startsWith(roh));
  if (!kandidaten.length) {
    box.hidden = true;
    return;
  }
  box.innerHTML = kandidaten.map(nr => {
    // "nrAuswahl"-Eintraege (z.B. Albaniens "AB") haben hier ein ganzes
    // Objekt {bezeichnung, ...} statt nur Text (siehe kzHerkunftAktualisieren).
    const wert = treffer.nrHerkunft[nr];
    const text = (wert && typeof wert === "object") ? wert.bezeichnung : wert;
    return '<div class="kz-feld1-vorschlag" data-nr="' + nr + '"><b>' + nr + "</b>" + text + "</div>";
  }).join("");
  box.hidden = false;
}
document.getElementById("kzFeld3").addEventListener("focus", kzFeld3VorschlaegeAnzeigen);
document.getElementById("kzFeld3Vorschlaege").addEventListener("click", function (e) {
  const zeile = e.target.closest(".kz-feld1-vorschlag");
  if (!zeile) return;
  const feld3 = document.getElementById("kzFeld3");
  feld3.value = zeile.dataset.nr;
  document.getElementById("kzFeld3Vorschlaege").hidden = true;
  kzFeld3Input();
});

// Orange-Markierung auf der Tafel folgt dem FOKUS: das Segment, das
// gerade zum fokussierten Feld gehoert, wird orange hervorgehoben -
// aber NUR solange dieses Feld noch leer ist. Sobald man ein Zeichen
// eintippt, verschwindet die Markierung wieder (auch wenn man dort
// weitertippt) - so zeigt die Tafel immer genau, wo man gerade dran
// ist, ohne bei einem angefangenen Kuerzel staendig orange zu bleiben.
function kzFokusAktualisieren() {
  const aktiv = document.activeElement;
  const feld1 = document.getElementById("kzFeld1");
  const feld2 = document.getElementById("kzFeld2");
  const feld3 = document.getElementById("kzFeld3");
  document.getElementById("kzSchildEu").classList.toggle(
    "kz-schild-eu-fokus", aktiv === feld1 && !feld1.value
  );
  document.getElementById("kzEingabe").classList.toggle(
    "kz-schild-code-leer", aktiv === feld2 && !feld2.value && !feld2.disabled
  );
  document.getElementById("kzSchildNr").classList.toggle(
    "kz-schild-code-leer", aktiv === feld3 && !feld3.value && !feld3.disabled
  );
}

// Kein Placeholder-Text mehr im Feld - stattdessen zeigt die Feldfarbe
// den Zustand: leer -> orange (bitte eingeben), unbekanntes Kuerzel ->
// rot, erkanntes Kuerzel -> normal.
function kzSimulatorAktualisieren() {
  const land = kzAktuellesLand();
  const eingabeFeld = document.getElementById("kzEingabe");
  const eingabe = eingabeFeld.value.toUpperCase();
  // Garnisonsstandort-Zusatzinfo (siehe kzHerkunftAktualisieren) betraf
  // immer nur den VORHERIGEN Zustand von Feld 2/3 - bei jeder neuen
  // Kuerzel-Eingabe erstmal weg, damit nichts Veraltetes stehen bleibt.
  document.getElementById("kzGarnisonInfo").hidden = true;
  const ergebnis = document.getElementById("kzErgebnis");

  if (!eingabe) {
    eingabeFeld.classList.remove("kz-schild-code-unbekannt");
    const erstesKennzeichen = land.kennzeichen[0];
    // Graues Platzhalter-Beispiel (z.B. Albaniens "AB") DIREKT auf der
    // Tafel zeigen - NICHT ueber das "placeholder"-Attribut (kzEingabe
    // ist "readonly", und Browser zeigen bei readonly-Feldern KEINEN
    // Placeholder an, siehe kz-schild-code-platzhalter in style.css),
    // sondern als echter (grau eingefaerbter) Wert. Nur relevant, wenn
    // das Land wirklich ein sichtbares, aber bedeutungsloses Basis-
    // Kuerzel hat (platzhalterText) - sonst (Luxemburg, Frankreich, ...)
    // bleibt das Feld wie gehabt komplett leer.
    // WICHTIG: das muss VOR kzTafelAktualisieren() passieren - die
    // pruefte bisher den ALTEN (noch leeren) Wert und blendete das Feld
    // deswegen faelschlich komplett aus ("kz-schild-code-versteckt",
    // width:0) - "AB" stand zwar technisch im DOM, war aber unsichtbar.
    const platzhalterText = kzOhneKuerzel(erstesKennzeichen) ? (erstesKennzeichen.platzhalterText || "") : "";
    eingabeFeld.value = platzhalterText;
    eingabeFeld.classList.toggle("kz-schild-code-platzhalter", !!platzhalterText);
    kzTafelAktualisieren(land, null);
    kzSchildEinpassen();
    // Das Land steht schon fest (Feld 1) - das zeigen wir SOFORT in der
    // Tabelle ("Land: [L] Luxemburg"), auch wenn das Bezirks-/
    // Unterscheidungskuerzel (Feld 2) noch gar nicht eingetippt ist,
    // statt komplett leer zu bleiben, bis das erste Kuerzel feststeht.
    const tabelle = document.getElementById("kzErgebnisTabelle");
    const zeilen = [kzLandZeile(land)];
    // Hat das Land einen "---"-Basiseintrag (kein Regionsbezug), den
    // wie einen echten Treffer behandeln und mit anzeigen ("Kürzel:
    // [---] kein Regionsbezug ..."), statt nur die Land-Zeile allein zu
    // zeigen - genau wie bei einem wirklich eingetippten Kuerzel.
    if (kzOhneKuerzel(erstesKennzeichen)) {
      zeilen.push(["Kürzel",
        '<span class="kz-ergebnis-orange">[' + erstesKennzeichen.code + "] " + erstesKennzeichen.bezirk + "</span>"]);
      const einstufig = erstesKennzeichen.bundesland === kzAktuellesLandName;
      zeilen.push(["Einteilung", land.kuerzelTyp || (einstufig ? land.regionLabel : "Bezirke")]);
    }
    const html = kzZeilenZuHtml(zeilen);
    tabelle.dataset.basis = html;
    tabelle.innerHTML = html;
    tabelle.hidden = false;
    ergebnis.hidden = false;
    // Als Beispiel im Hinweistext nie ein Platzhalter-Basiskuerzel wie
    // "---" oder "NL" nennen - das faende man ja gerade nicht, wenn man
    // es eintippt. Stattdessen das erste WIRKLICH eintippbare Kuerzel
    // suchen, sonst (Sonderfall: gar keins vorhanden) den Landesnamen.
    const beispielKuerzel = land.kennzeichen.find(k => !kzOhneKuerzel(k));
    ergebnis.innerHTML = beispielKuerzel
      ? 'Tipp ein Kürzel ein, z.B. „' + beispielKuerzel.code + '"'
      : "Für " + kzAktuellesLandName + " gibt es kein eintippbares Kürzel.";
    // "erstesKennzeichen" statt "null" uebergeben, wenn es der "---"-
    // Basiseintrag ist - damit zeigt z.B. Ungarns Wappen (land.flagge)
    // schon im Leerzustand, genau wie auf dem echten Kennzeichen (das
    // Wappen gehoert dort zu JEDEM normalen Kennzeichen, nicht nur zu
    // Sonderkuerzeln). Fuer Laender ohne eigenes Wappen (kein
    // land.flagge/hatWappen) macht das keinen sichtbaren Unterschied.
    kzKarteUndWappenSicherAktualisieren(land, kzOhneKuerzel(erstesKennzeichen) ? erstesKennzeichen : null);
    kzFokusAktualisieren();
    return;
  }

  // Graue Platzhalter-Faerbung (siehe oben im "!eingabe"-Zweig) nur im
  // WIRKLICH leeren Zustand - sobald etwas Echtes getippt ist, wieder
  // normal (schwarz/farbig) darstellen.
  eingabeFeld.classList.remove("kz-schild-code-platzhalter");
  const treffer = kzFinden(land, eingabe);
  kzTafelAktualisieren(land, treffer);
  // Das Ergebnis (Text + Grundfarben der Tafel) steht ab hier fest und
  // wird IMMER angezeigt - unabhaengig davon, ob Landkarte oder Wappen
  // gleich danach sauber laden. So bleibt die Kuerzel-Suche auch dann
  // benutzbar, wenn z.B. eine Bilddatei oder die Kartendaten am Server
  // mal fehlen sollten (siehe kzKarteUndWappenSicherAktualisieren).
  if (treffer) {
    eingabeFeld.classList.remove("kz-schild-code-unbekannt");
    kzErgebnisAnzeigen(land, treffer, eingabe);
  } else {
    eingabeFeld.classList.add("kz-schild-code-unbekannt");
    ergebnis.hidden = false;
    document.getElementById("kzErgebnisTabelle").hidden = true;
    ergebnis.innerHTML = "<b>" + eingabe + "</b> ist in " + kzAktuellesLandName + " kein bekanntes Kürzel.";
  }
  kzKarteUndWappenSicherAktualisieren(land, treffer);
  kzFokusAktualisieren();
}

// Ob ein Treffer ein Sonderkuerzel ist (Institution wie Polizei/
// Diplomaten - immer explizit mit bundesland:"Sonderkennzeichen"
// markiert) oder ein echtes Bezirks-/Regionskuerzel. Bewusst NICHT
// mehr ueber "bundesland === Landesname" erkannt - das gab bei
// einstufigen Laendern wie Kroatien (jede Stadt hat bundesland:
// "Kroatien", weil es keine weitere Ebene gibt) faelschlich JEDES
// Kuerzel als Sonderzeichen aus.
function kzIstSonderkuerzel(treffer) {
  return treffer.bundesland === "Sonderkennzeichen";
}

// Baut aus [Label, Wert]-Paaren die HTML-Zeilen fuer die Ergebnis-
// Tabelle - gemeinsam genutzt von kzErgebnisAnzeigen (erste Zeilengruppe)
// und kzHerkunftAktualisieren (angehaengte zweite Zeilengruppe, "zweit"
// setzt dafuer eine eigene Abstands-/Trennlinien-Klasse).
function kzZeilenZuHtml(zeilen, zweit) {
  // Abstand vor einer zweiten Zeilengruppe nur bei deren ERSTER Zeile und
  // bei Label UND Wert - sonst rutscht das Label tiefer als der Wert
  return zeilen.map(([label, wert], i) => {
    const abstand = zweit && i === 0 ? " kz-ergebnis-zweit" : "";
    return '<span class="kz-ergebnis-label' + abstand + '">' + label + ':</span>' +
      '<span class="kz-ergebnis-wert' + abstand + '">' + wert + "</span>";
  }).join("");
}

// Die "Land"-Zeile ([Kuerzel] Landesname, immer blau) - wird sowohl
// gebraucht, sobald ein vollstaendiger Kuerzel-Treffer feststeht
// (kzErgebnisAnzeigen), als auch VORHER schon, sobald nur das Land
// (Feld 1) feststeht, aber noch kein Bezirks-Kuerzel eingetippt ist
// (siehe kzSimulatorAktualisieren) - so steht "Land: [L] Luxemburg"
// sofort da, statt erst nach der ersten Kuerzel-Eingabe.
function kzLandZeile(land) {
  return ["Land", '<span class="kz-ergebnis-blau">[' + land.euText + "] " + kzAktuellesLandName + "</span>"];
}

// Baut die "Label: Wert"-Tabelle unter der Tafel auf, sobald ein
// Kuerzel erkannt wurde. Fester Aufbau (siehe Vorgabe):
//   Land: [Kuerzel] Landesname            <- immer blau
//   Kürzel: [Kuerzel] Bedeutung           <- immer orange, wie bei Land
//   Einteilung: Bezirke/Kantone/... bzw. "Sonderzeichen"
//   <Region-Label>: <Bundesland/Kanton/...>  ODER  Zugehörigkeit: Staat
function kzErgebnisAnzeigen(land, treffer, eingabe) {
  const sonder = kzIstSonderkuerzel(treffer);
  // "Einstufig" = Land ohne weitere Verwaltungsebene ueber dem Kuerzel
  // selbst (z.B. Kroatien: jede Stadt IST schon die oberste Ebene) -
  // erkennbar daran, dass bundesland hier zufaellig dem Landesnamen
  // entspricht. Dann gibt es keine gesonderte "Region"-Zeile, das
  // regionLabel des Landes beschreibt stattdessen direkt die Einteilung.
  const einstufig = !sonder && treffer.bundesland === kzAktuellesLandName;
  const zeilen = [];
  zeilen.push(kzLandZeile(land));
  zeilen.push(["Kürzel",
    '<span class="kz-ergebnis-orange">[' + eingabe + "] " + treffer.bezirk + "</span>"]);
  zeilen.push(["Einteilung", sonder ? "Sonderzeichen" : (land.kuerzelTyp || (einstufig ? land.regionLabel : "Bezirke"))]);
  if (sonder) {
    zeilen.push(["Zugehörigkeit", "Staat"]);
  } else if (!einstufig) {
    zeilen.push([land.regionLabel || "Region", treffer.bundesland]);
  }

  document.getElementById("kzErgebnis").hidden = true;
  const tabelle = document.getElementById("kzErgebnisTabelle");
  tabelle.hidden = false;
  const html = kzZeilenZuHtml(zeilen);
  // Basis-Zeilen separat merken, damit kzHerkunftAktualisieren (z.B.
  // slowenische Garnisonsnummer bei "SV") eine zweite Zeilengruppe
  // ANHAENGEN kann, ohne diese hier neu bauen zu muessen.
  tabelle.dataset.basis = html;
  tabelle.innerHTML = html;
}

// Landkarte und Wappen-Bild sind "Nice-to-have" obendrauf - falls die
// Kartendaten (data/countries/at-karte.js) oder eine Wappen-Bilddatei
// aus irgendeinem Grund mal nicht laden (z.B. bei einem unvollstaendigen
// Upload auf den Server), soll das NICHT die ganze Kuerzel-Suche
// lahmlegen. Darum hier klar abgetrennt und mit try/catch abgesichert.
function kzKarteUndWappenSicherAktualisieren(land, treffer) {
  try {
    kzKarteAktualisieren(land, treffer);
  } catch (e) {
    console.warn("Landkarte konnte nicht aktualisiert werden (Kartendaten fehlen/fehlerhaft?):", e);
    const box = document.getElementById("kzKarteBox");
    if (box) box.hidden = true;
  }
  try {
    kzWappenZeigen(land, treffer);
  } catch (e) {
    console.warn("Wappen konnte nicht angezeigt werden:", e);
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

// Diese drei Deko-Extras gehoeren inhaltlich zur Kartendatei
// (data/countries/at-karte.js), stehen aber hier, weil sie schon vor
// der grossen Umstellung auf generische Landkarten (LANDKARTEN, siehe
// data/registry.js) hier lebten. at-karte.js laedt VOR dieser Datei,
// kann sie also nicht selbst mit registrieren - darum ergaenzen wir
// sie hier nachtraeglich am schon registrierten Eintrag.
if (typeof LANDKARTEN !== "undefined" && LANDKARTEN["Österreich"]) {
  LANDKARTEN["Österreich"].bezirkKuerzel = AT_BUNDESLAND_KUERZEL;
  LANDKARTEN["Österreich"].grenzpunkte = AT_GRENZPUNKTE;
  LANDKARTEN["Österreich"].nachbarLabel = AT_NACHBAR_LABEL;
}

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

// Generisch fuer JEDES Land mit einer Kartendatei (siehe registerKarte
// in data/registry.js) - nicht mehr AT-spezifisch. Ein neues Land
// braucht dafuer NUR seine eigene "<land>-karte.js" (viewBox,
// staatPfad, regionPfade - Rest optional) plus in seiner data/countries/
// <land>.js bei registerLand: hatKarte: true. Kein Anfassen dieser
// Datei mehr noetig.
let kzKarteGebautFuer = null;
function kzKarteAufbauen(landName, karte) {
  if (kzKarteGebautFuer === landName) return;
  kzKarteGebautFuer = landName;
  kzKarteAuswahlLoeschen();
  const aussen = '<path class="kz-karte-aussen" d="' + karte.staatPfad + '"/>';
  // Regionen (Bundeslaender) ALS Basisebene (auch als Fallback fuer
  // Regionen ohne eigene Bezirke, z.B. Wien, Sonderkennzeichen, oder
  // Laender ohne Bezirksebene ueberhaupt), Bezirke (falls vorhanden)
  // als feinere Ebene obendrauf.
  const regionen = Object.keys(karte.regionPfade).map(name =>
    '<path class="kz-karte-bundesland" data-bundesland="' + name + '" d="' + karte.regionPfade[name] + '"><title>' + name + '</title></path>'
  ).join("");
  let bezirke = "";
  if (karte.bezirkPfade) {
    bezirke = Object.keys(karte.bezirkPfade).map(name => {
      const kuerzel = karte.bezirkKuerzel && karte.bezirkKuerzel[atBezirkBundesland(name)];
      const titel = kuerzel ? name + " (" + kuerzel + ")" : name;
      const bl = typeof atBezirkBundesland === "function" ? atBezirkBundesland(name) : "";
      return '<path class="kz-karte-bezirk" data-bezirk="' + name + '" data-bundesland="' + bl + '" d="' + karte.bezirkPfade[name] + '"><title>' + titel + "</title></path>";
    }).join("");
  }
  // Eigene Umriss-Ebene NUR fuer die Regionsgrenzen, ganz oben drauf
  // (ohne Fuellung) - so bleiben die Grenzen kraeftig sichtbar, auch
  // wenn darunter einzelne Bezirke eingefaerbt sind.
  const grenzen = Object.keys(karte.regionPfade).map(name =>
    '<path class="kz-karte-grenze" d="' + karte.regionPfade[name] + '"/>'
  ).join("");
  // Die Dreilaendereck-Grenzstriche/Nachbarland-Beschriftung sind ein
  // optionales Deko-Extra (bisher nur fuer Oesterreich ausgearbeitet -
  // siehe LANDKARTEN["Österreich"] weiter oben in dieser Datei).
  let gradients = "", grenzstriche = "", nachbarNamen = "";
  if (karte.grenzpunkte) {
    // Pro Dreilaendereck ein eigener Gradient mit "userSpaceOnUse" und
    // den echten Linienkoordinaten (ein gemeinsamer Gradient waere bei
    // senkrechten/waagrechten Linien degeneriert, da deren Bounding-Box
    // keine Breite bzw. Hoehe hat).
    gradients = karte.grenzpunkte.map((p, i) =>
      '<linearGradient id="kzGrenzFade' + i + '" gradientUnits="userSpaceOnUse" x1="' + p.x + '" y1="' + p.y + '" x2="' + p.ex + '" y2="' + p.ey + '">' +
      '<stop offset="0%" stop-color="#445" stop-opacity=".85"/>' +
      '<stop offset="100%" stop-color="#445" stop-opacity="0"/>' +
      "</linearGradient>"
    ).join("");
    grenzstriche = karte.grenzpunkte.map((p, i) =>
      '<path class="kz-karte-grenzstrich" d="' + kzGrenzPfad(p.x, p.y, p.ex, p.ey, i) + '" stroke="url(#kzGrenzFade' + i + ')"/>'
    ).join("");
  }
  if (karte.nachbarLabel) {
    nachbarNamen = karte.nachbarLabel.map(n =>
      '<text class="kz-karte-nachbar-text" x="' + n.x + '" y="' + n.y + '" text-anchor="' + n.anchor + '">' + n.name + "</text>"
    ).join("");
  }
  // viewBox kommt aus der Kartendatei - bewusst etwas groesser als die
  // reine Kontur, sonst schneidet das SVG Grenzstriche/Laendernamen an
  // den Raendern ab (ein SVG-Wurzelelement clippt alles ausserhalb
  // seines eigenen viewBox-Bereichs).
  document.getElementById("kzKarte").innerHTML =
    '<svg viewBox="' + karte.viewBox + '"><defs>' + gradients + "</defs>" +
    aussen + regionen + bezirke + grenzen + grenzstriche + nachbarNamen + "</svg>";
}

function kzKarteAktualisieren(land, treffer, bundeslandAuswahl) {
  const box = document.getElementById("kzKarteBox");
  // Die Karte gibt's nur, wenn das Land das in registerLand explizit
  // anfordert (hatKarte: true) - unabhaengig vom Bundesland-Wappen-Bild.
  if (!land.hatKarte) {
    box.hidden = true;
    return;
  }
  // Ohne geladene/registrierte Kartendaten (z.B. weil die "<land>-
  // karte.js" mal nicht laedt) gibt's nichts zu zeichnen - Box lieber
  // sauber verstecken statt mit einem Fehler abzubrechen.
  const landName = kzAktuellesLandName;
  const karte = typeof LANDKARTEN !== "undefined" ? LANDKARTEN[landName] : null;
  if (!karte || !karte.staatPfad || !karte.regionPfade) {
    box.hidden = true;
    return;
  }
  kzKarteAufbauen(landName, karte);
  box.hidden = false;
  const titel = document.getElementById("kzKarteTitel");
  if (titel) titel.textContent = "Lage in " + landName;

  const bezirk = karte.bezirkPfade && treffer && karte.bezirkPfade[treffer.bezirk] ? treffer.bezirk : null;
  // Sonderkennzeichen gehoeren keiner einzelnen Region - dafuer dann
  // gleich das ganze Land markieren statt gar nichts.
  const geheimBund = treffer && treffer.bundesland === "Sonderkennzeichen";
  const bundesland = treffer && !geheimBund && karte.regionPfade[treffer.bundesland] ? treffer.bundesland : null;

  // Die Regions-Ebene liegt UNTER der Bezirksebene und wird von deren
  // Flaechen optisch verdeckt - markiert man sie trotzdem (z.B. Wien,
  // Sonderkennzeichen, oder Bezirke, die in der Quelle fehlen), scheint
  // die Farbe nur genau dort durch, wo kein Bezirk sie bedeckt.
  // Sonderkennzeichen: ohne Auswahl das ganze Land (auch die Bezirks-
  // flaechen, sonst schimmert nur Wien durch); mit gewaehlter Zusatzziffer
  // (z.B. "BP" 1 = LPD Burgenland) das ganze jeweilige Bundesland.
  const ganzesBundesland = geheimBund && bundeslandAuswahl ? bundeslandAuswahl : null;
  const ganzesLand = geheimBund && !ganzesBundesland;
  document.querySelectorAll("#kzKarte .kz-karte-bezirk").forEach(p => {
    const aktiv = ganzesLand || (ganzesBundesland ? p.dataset.bundesland === ganzesBundesland : p.dataset.bezirk === bezirk);
    p.classList.toggle("kz-karte-aktiv", aktiv);
  });
  document.querySelectorAll("#kzKarte .kz-karte-bundesland").forEach(p => {
    const aktiv = ganzesLand || (ganzesBundesland ? p.dataset.bundesland === ganzesBundesland
      : (!bezirk && p.dataset.bundesland === bundesland));
    p.classList.toggle("kz-karte-aktiv", aktiv);
  });
}

// ---- Antippen/Anklicken einer Flaeche auf der Karte: markiert sie in
// einer eigenen Farbe (siehe .kz-karte-gewaehlt in style.css) und zeigt
// ihren Namen als Text an - das ersetzt fuer Touch-Geraete das native
// Hover-Tooltip (<title>), das bei einem Fingertipp nicht erscheint.
// Einmalig delegiert auf #document, weil #kzKarte sein innerHTML bei
// jedem Laenderwechsel komplett neu aufbaut (siehe kzKarteAufbauen) -
// so muss hier bei einem Rebuild nichts neu verdrahtet werden. Bleibt
// so lange bestehen, bis man daneben (ausserhalb der Karte) tippt/
// klickt ("Fokus verlieren") oder dieselbe Flaeche nochmal antippt.
document.addEventListener("click", function (e) {
  const karteEl = document.getElementById("kzKarte");
  if (!karteEl) return;
  const flaeche = e.target.closest(".kz-karte-bezirk, .kz-karte-bundesland");
  if (flaeche && karteEl.contains(flaeche)) {
    kzKarteFlaecheAntippen(flaeche);
  } else if (!karteEl.contains(e.target)) {
    kzKarteAuswahlLoeschen();
  }
});

function kzKarteFlaecheAntippen(flaeche) {
  const karteEl = document.getElementById("kzKarte");
  const warSchonGewaehlt = flaeche.classList.contains("kz-karte-gewaehlt");
  karteEl.querySelectorAll(".kz-karte-gewaehlt").forEach(p => p.classList.remove("kz-karte-gewaehlt"));
  if (warSchonGewaehlt) {
    kzKarteAuswahlLoeschen();
    return;
  }
  flaeche.classList.add("kz-karte-gewaehlt");
  const label = document.getElementById("kzKarteAuswahl");
  if (label) {
    label.textContent = flaeche.dataset.bezirk || flaeche.dataset.bundesland || "";
    label.hidden = !label.textContent;
  }
}

function kzKarteAuswahlLoeschen() {
  const karteEl = document.getElementById("kzKarte");
  if (karteEl) {
    karteEl.querySelectorAll(".kz-karte-gewaehlt").forEach(p => p.classList.remove("kz-karte-gewaehlt"));
  }
  const label = document.getElementById("kzKarteAuswahl");
  if (label) {
    label.hidden = true;
    label.textContent = "";
  }
}

function kzTafelAktualisieren(land, treffer) {
  // Manche Kuerzel stehen auf dem ECHTEN Kennzeichen nicht selbst vorne
  // (z.B. Albaniens Taxi "T" - das steht dort als Suffix HINTER der
  // Nummer, "AB 123 T"; das getippte "T" bleibt aber die Suche/Anzeige
  // in Feld 2 und der Ergebnistabelle). "plattenPraefix" zeigt dann
  // stattdessen ein unbedeutendes Platzhalter-Kuerzel (z.B. "AB") auf
  // der Tafel selbst - das "T" kommt ueber treffer.nrMuster als
  // Suffix hinter die Zahl. Passiert bewusst VOR der Breitenmessung
  // gleich hier, damit die Feldbreite zur tatsaechlich gezeigten
  // Zeichenzahl passt.
  if (treffer && treffer.plattenPraefix) {
    document.getElementById("kzEingabe").value = treffer.plattenPraefix;
  }
  // Italien: unter dem orangen Kreis im rechten blauen Feld steht am
  // echten Kennzeichen (optional, siehe Kommentar in it.js) das
  // Provinzkuerzel - hier das jeweils erkannte Kuerzel selbst (z.B.
  // "RM" fuer Rom), leer wenn (noch) nichts Bekanntes eingetippt ist.
  if (land.euBandRechtsOrange) {
    document.getElementById("kzSchildEu2Text").textContent = treffer ? treffer.code : "";
  }
  // Breite des Kuerzel-Feldes an die AKTUELL eingegebene Zeichenzahl
  // anpassen (nicht mehr fix aufs laengste Kuerzel des Landes) - siehe
  // Kommentar bei kzEingabeGroesseSetzen.
  const eingabeFeldBreite = document.getElementById("kzEingabe");
  eingabeFeldBreite.style.width = (Math.max(eingabeFeldBreite.value.length, 1) + 0.3) + "ch";
  const dunkel = !!(treffer && treffer.dunkel) || !!land.dunkel;
  document.getElementById("kzSchild").classList.toggle("kz-schild-dunkel", dunkel);
  // Ungarn-Taxi: gelbe Tafel statt weiss.
  // Ungarn-Taxi/Luxemburg: gelbe Tafel - bei Luxemburg gilt das (anders
  // als bei Ungarns Taxi) fuers GANZE Land, darum zusaetzlich der
  // Land-weite Schalter "land.gelb" (wie bei "land.dunkel" oben).
  document.getElementById("kzSchild").classList.toggle("kz-schild-gelb", !!(treffer && treffer.gelb) || !!land.gelb);
  // Ungarn Diplomaten (CD)/E-Fahrzeuge (EV): eigene Volltontafel-Farben
  // (blau bzw. gruen) analog zur gelben Taxi-Tafel oben.
  document.getElementById("kzSchild").classList.toggle("kz-schild-blau-hg", !!(treffer && treffer.blauHg));
  document.getElementById("kzSchild").classList.toggle("kz-schild-gruen-hg", !!(treffer && treffer.gruenHg));
  document.getElementById("kzSchild").classList.toggle("kz-schild-rot-hg", !!(treffer && treffer.rotHg));
  // Diplomaten-Kennzeichen (z.B. slowenisch CMD/CD/CC/M, albanisch MM/
  // CD/TR): Kuerzel UND Nummer in gruener Schrift statt schwarz/weiss,
  // dazu auch der Tafelrahmen gruen. (Frueher fehlte hier das Faerben
  // von kzSchildNr - anders als bei blau/rot/braun/etc. unten - wodurch
  // nur das Kuerzel gruen war, die Nummer daneben aber schwarz blieb.)
  const gruen = !!(treffer && treffer.gruen);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-gruen", gruen);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-gruen", gruen);
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-gruen", gruen);
  // Albaniens landwirtschaftliche/technische Sonderkennzeichen (weisse
  // Schrift auf gruenem Grund, z.B. "RB"/"MT"/"R"): weisser statt
  // schwarzer Rahmen.
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-weiss", !!(treffer && treffer.rahmenWeiss));
  // Slowenische Polizei "P": blaue Schrift statt schwarz, dazu auch
  // der Tafelrahmen blau.
  // Island: die Standardschrift ist LANDESWEIT blau (nicht nur bei
  // einem einzelnen Sonderkuerzel) - aber NUR im leeren Standardzustand
  // (kein Treffer), sonst wuerde es z.B. beim gruenen Diplomaten-
  // Kuerzel "CD" mit dessen eigener weisser Schrift kollidieren.
  const blau = treffer ? !!treffer.blau : !!land.blau;
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-blau", blau);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-blau", blau);
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-blau", blau);
  // Ungarische Konsuln "CK": rote Schrift auf weissem Grund.
  const rot = !!(treffer && treffer.rot);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-rot", rot);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-rot", rot);
  document.getElementById("kzSchild").classList.toggle("kz-schild-rahmen-rot", rot);
  // Albanische Oldtimer: braune statt schwarze Schrift.
  const braun = !!(treffer && treffer.braun);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-braun", braun);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-braun", braun);
  // Montenegro Diplomaten: gelbe statt schwarze Schrift auf Weiss.
  const gelbText = !!(treffer && treffer.gelbText);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-gelbtext", gelbText);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-gelbtext", gelbText);
  // Island Diplomaten: weisse statt schwarze Schrift (auf gruenem Grund).
  const weiss = !!(treffer && treffer.weissText);
  document.getElementById("kzEingabe").classList.toggle("kz-schild-code-weiss", weiss);
  document.getElementById("kzSchildNr").classList.toggle("kz-schild-code-weiss", weiss);
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
  // Reihenfolge normalerweise "eintippbarer Teil" + fixer Rest (z.B.
  // slowenisch "00-400") - bei Albaniens "MM" ist es umgekehrt, die
  // festen Ziffern stehen VOR dem eintippbaren Buchstabenpaar ("123PU"
  // statt "PU123") - siehe nrSuffixVorn in al.js und
  // .kz-schild-nr-suffix-vorn in style.css.
  document.getElementById("kzSchild").classList.toggle(
    "kz-schild-nr-suffix-vorn", !!(treffer && treffer.nrSuffixVorn));
  if (editierbar) {
    // Alte, von einem anderen Land/Treffer uebernommene Breite (z.B.
    // "6.3ch" von einer normalen Nummer) muss weg - sonst gewinnt sie
    // gegen die feste "1.35em" aus .kz-schild-nr-kurz (Inline-Style
    // schlaegt CSS-Klasse) und die zweistellige editierbare Nummer
    // wird viel zu breit dargestellt.
    nrFeld.style.width = "";
    // Einstellige Zusatznummer (z.B. "BP"): schmaleres Feld, das ohne
    // Luecke direkt an den fixen Rest der Nummer anschliesst
    nrFeld.classList.toggle("kz-schild-nr-einstellig", kzNrLaenge(treffer) === 1);
    if (!nrFeld.dataset.editStart) {
      nrFeld.value = "";
      nrFeld.maxLength = kzNrLaenge(treffer);
      nrFeld.placeholder = (kzNrBuchstaben(treffer) ? "A" : "0").repeat(kzNrLaenge(treffer));
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
    nrFeld.classList.remove("kz-schild-nr-einstellig");
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
    // Schriftgroesse zusaetzlich an die AKTUELL eingegebene Zeichenzahl
    // gekoppelt (nicht nur an die Nummer) - so bleiben kurze Kuerzel
    // (die grosse Mehrheit, auch bei Deutschland) in normaler, grosser
    // Schrift wie bei allen anderen Laendern, und nur die paar
    // wirklich langen Kuerzel (z.B. deutsches "HRO", 3 Zeichen)
    // wechseln automatisch auf die naechstkleinere Stufe, in der sie
    // dann sauber Platz haben (siehe kzEingabeGroesseSetzen fuer die
    // dazu passende, ebenfalls laengenabhaengige Breite).
    const aktuelleLaenge = Math.max(eingabeFeld.value.length, 1);
    const groessenBasis = nr.length >= aktuelleLaenge + 4 ? nr : "X".repeat(aktuelleLaenge + 4);
    schriftstufeSetzen(nrFeld, groessenBasis, "kz-schild-txt", 4, 6);
    schriftstufeSetzen(eingabeFeld, groessenBasis, "kz-schild-txt", 4, 6);
    // Erst JETZT, wo die Schriftgroesse beider Felder feststeht, ihre
    // Breiten per ECHTER Pixel-Messung setzen (statt nur geschaetzter
    // "ch"-Breite) - auf manchen Geraeten/Schriftarten sind Gross-
    // buchstaben wie "W" spuerbar breiter als die Ziffer "0" (die "ch"
    // definiert), wodurch Text sonst je nach Geraet ans Nachbarfeld
    // stossen konnte.
    kzFeldBreiteSetzen(nrFeld, nr);
    // Jetzt, wo die Schriftgroesse feststeht, die Breite des Kuerzel-
    // Feldes noch per ECHTER Pixel-Messung (statt nur geschaetzter
    // "ch"-Breite) nachschaerfen - auf manchen Geraeten/Schriftarten
    // sind Grossbuchstaben wie "W" spuerbar breiter als die Ziffer "0"
    // (die "ch" definiert), wodurch der Text sonst je nach Gerät noch
    // ans Wappen daneben stossen konnte. kzTextPixelbreite misst mit
    // genau der Schriftart, die hier gerade tatsaechlich angewendet ist.
    const codeText = eingabeFeld.value || eingabeFeld.placeholder || "0";
    kzFeldBreiteSetzen(eingabeFeld, codeText);
  }
  // Manche Laender haben gar kein sichtbares Kuerzel auf der Tafel
  // selbst (z.B. Luxemburgs allgemeines "L" - das steht nur im blauen
  // EU-Band, auf der gelben Flaeche erscheint direkt die Seriennummer
  // ohne zusaetzlichen Buchstaben davor, markiert in der Laenderdatei
  // mit "---", siehe kzOhneKuerzel) oder explizit "codeVersteckt" beim
  // jeweiligen Eintrag. Nur im WIRKLICH leeren Zustand (noch gar nichts
  // eingetippt) gilt dafuer der erste Eintrag des Landes als Vorschau -
  // bei einem unbekannten (falsch getippten) Kuerzel bleibt das
  // Eingegebene sichtbar, sonst wuerde es scheinbar spurlos verschwinden.
  const codeVersteckt = treffer
    ? !!treffer.codeVersteckt
    : (!document.getElementById("kzEingabe").value &&
       (kzOhneKuerzel(land.kennzeichen[0]) || !!land.kennzeichen[0].codeVersteckt));
  const eingabeFeldEl = document.getElementById("kzEingabe");
  eingabeFeldEl.classList.toggle("kz-schild-code-versteckt", codeVersteckt);
  if (codeVersteckt) {
    eingabeFeldEl.style.width = "0";
  }
  kzSchildEinpassen();
}

// Bei Kuerzeln mit einer freien Zusatznummer/-kuerzel (bisher "SV"
// slowenisches Militaer, Ziffern -> Garnisonsstandort; "MM" albanisches
// Militaer, Buchstaben -> Teilstreitkraft) zeigen die ersten zwei
// eingetippten Zeichen die jeweilige Bedeutung - wird bei jeder Eingabe
// im Nummernfeld direkt unter dem Kennzeichen angezeigt.
function kzHerkunftAktualisieren() {
  const nrFeld = document.getElementById("kzSchildNr");
  // Treffer ZUERST bestimmen, bevor gefiltert wird - ob Ziffern oder
  // Buchstaben eintippbar sind (kzNrBuchstaben), haengt vom jeweiligen
  // Kuerzel ab (siehe nrArt in den Laenderdaten).
  const land = kzAktuellesLand();
  const eingabe = document.getElementById("kzEingabe").value.trim().toUpperCase();
  const treffer = kzFinden(land, eingabe);
  // Fruehausstieg NICHT mehr an "nrFeld.readOnly" (das ist bei
  // "nrAuswahl"-Kuerzeln wie Albaniens "AB" absichtlich IMMER readonly,
  // siehe kzTafelAktualisieren) - sondern direkt daran, ob dieser
  // Treffer ueberhaupt eine Zusatzeingabe kennt.
  if (!treffer || !(treffer.nrEingebbar || treffer.nrAuswahl)) return;
  const feld3 = document.getElementById("kzFeld3");
  // Bei "nrEingebbar" (z.B. Slowenien "SV") ist nrFeld selbst das
  // editierbare Feld und der Wert kommt von dort; bei "nrAuswahl" (z.B.
  // Albanien "AB") bleibt nrFeld readonly, der getippte/ausgewaehlte
  // Wert kommt stattdessen direkt von Feld 3.
  const quelle = treffer.nrEingebbar ? nrFeld : feld3;
  // Nur die zwei Zeichen selbst sind eintippbar (der Rest ist der fixe
  // ".kz-schild-nr-suffix" daneben, siehe kzTafelAktualisieren).
  const wert = (kzNrBuchstaben(treffer)
    ? quelle.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "")
    : quelle.value.replace(/\D/g, "")
  ).slice(0, kzNrLaenge(treffer));
  if (quelle.value !== wert) quelle.value = wert;
  if (treffer.nrEingebbar && nrFeld.value !== wert) nrFeld.value = wert;
  // Orange bei leer kommt jetzt vom Fokus (siehe kzFokusAktualisieren),
  // nicht mehr pauschal von "ist leer" - hier nur noch aufrufen, damit
  // sie nach jeder Eingabe aktuell bleibt.
  kzFokusAktualisieren();
  // Eine Auskunft gibt es nur, wenn wir eine echte Zuordnung kennen
  // (bisher SV/Garnisonsstandort und MM/Teilstreitkraft) - bei den
  // Diplomaten-Kennzeichen ist z.B. die Laendernummer-Zuordnung nicht
  // sicher belegt, darum bleibt es dort nur beim Eintippen ohne Auskunft.
  if (!treffer || !treffer.nrHerkunft) return;
  const bedeutung = treffer.nrHerkunft[wert];
  // Bei "nrAuswahl" (z.B. Albaniens "AB") ist ein Treffer in nrHerkunft
  // ein ganzes OBJEKT ({bezeichnung, Farbflaggen, nrMuster}) statt nur
  // Text (wie bei Sloweniens "SV") - so eine Auswahl aendert nicht nur
  // den Infotext, sondern die GANZE Tafel (Farbe, Zahlenmuster), wie
  // ein eigener kleiner Treffer, der das Basis-Kuerzel ueberlagert.
  const istAuswahl = !!treffer.nrAuswahl;
  const bedeutungObjekt = bedeutung && typeof bedeutung === "object";
  const bedeutungText = bedeutungObjekt ? bedeutung.bezeichnung : bedeutung;
  // Als ZWEITE Zeilengruppe an die bestehende Tabelle anhaengen (siehe
  // kzErgebnisAnzeigen), statt eine eigene, separat "hingeschmissene"
  // Zeile darunter zu zeigen - Kürzel/Bedeutung/Land bleiben so oben
  // stehen, die Zusatz-Auskunft wirkt wie ein zusammengehoeriger
  // zweiter Abschnitt derselben Tabelle.
  const tabelle = document.getElementById("kzErgebnisTabelle");
  const info = document.getElementById("kzGarnisonInfo");
  info.hidden = true;
  // Zusatzziffer steht fuer ein Bundesland (z.B. "BP"): Karte markiert
  // dieses Bundesland und "Zugehörigkeit" nennt die zustaendige LPD
  const gewaehltesBundesland = treffer.nrHerkunftIstBundesland && bedeutungText ? bedeutungText : null;
  if (treffer.nrHerkunftIstBundesland) {
    try { kzKarteAktualisieren(land, treffer, gewaehltesBundesland); } catch (e) {}
  }
  const basis = gewaehltesBundesland
    ? (tabelle.dataset.basis || "").replace('<span class="kz-ergebnis-wert">Staat</span>',
        '<span class="kz-ergebnis-wert">Staat · LPD ' + gewaehltesBundesland + "</span>")
    : (tabelle.dataset.basis || "");
  if (!wert) {
    tabelle.innerHTML = tabelle.dataset.basis || "";
    // Zusatzkuerzel geleert - Tafel zurueck auf das Basis-Kuerzel selbst
    // (z.B. Albaniens "AB" ohne Sonderfarbe), statt an der zuletzt
    // gewaehlten Zusatz-Optik (z.B. "MT", gruen) haengen zu bleiben.
    if (istAuswahl) kzTafelAktualisieren(land, treffer);
    return;
  }
  // "nrEingebbar"/"nrAuswahl" hier bewusst NICHT mituebernommen - sonst
  // wuerde kzTafelAktualisieren beim erneuten Aufruf wieder in den
  // editierbaren Zweig laufen (der am Ende SELBST kzHerkunftAktualisieren
  // aufruft) und in einer Rekursion enden.
  if (istAuswahl) {
    kzTafelAktualisieren(land, bedeutungObjekt
      ? Object.assign({}, bedeutung, { nrEingebbar: false, nrAuswahl: false })
      : treffer);
  }
  // Wie bei "Land" und "Kürzel" oben: Nummer/Kuerzel und Bedeutung
  // zusammen in einer Zeile ("Zusatzkürzel: [01] Ljubljana" bzw.
  // "[MT] Technische Maschinen (...)") statt getrennter Zeilen. Die
  // zweite Zeile heisst bewusst "Art" statt nochmal "Einteilung" - sonst
  // stuenden zwei "Einteilung:"-Zeilen mit unterschiedlichem Wert
  // untereinander (die erste von kzErgebnisAnzeigen, z.B.
  // "Sonderzeichen"). Label ist pro Land ueber nrHerkunftLabel anpassbar
  // (Standard: "Garnisonsstandort", bei Albanien "Sonderzeichen").
  const artLabel = treffer.nrHerkunftLabel || "Garnisonsstandort";
  const zusatzZeilen = wert.length < kzNrLaenge(treffer)
    ? [["Zusatzkürzel", '<span class="kz-ergebnis-orange">' + wert + "</span>"]]
    : bedeutungText
      ? [
          ["Zusatzkürzel", '<span class="kz-ergebnis-orange">[' + wert + "] " + bedeutungText + "</span>"],
          ["Art", artLabel],
        ]
      : [
          ["Zusatzkürzel", '<span class="kz-ergebnis-orange">[' + wert + "] keine bekannte Zuordnung</span>"],
        ];
  tabelle.innerHTML = basis + kzZeilenZuHtml(zusatzZeilen, true);
}
document.getElementById("kzSchildNr").addEventListener("input", kzHerkunftAktualisieren);

// Kuerzel VOR dem Namen ("A – Österreich") - so sieht man sofort das
// echte Landeskuerzel, und im Dropdown selbst kann man per Tastatur
// direkt zum Kuerzel springen (Browser-Sprungsuche auf den Optionstext).
// Oesterreich bleibt als Heimatland ganz oben fix, der Rest wird
// alphabetisch (nach Landesnamen, mit korrekter Umlaut-Sortierung)
// einsortiert - bei mittlerweile über 40 Ländern sonst schwer zu
// finden in der bisherigen (Registrierungs-)Reihenfolge.
function laenderFuerDropdown() {
  const rest = LAENDER_ORDER.filter(l => l !== "Österreich")
    .sort((a, b) => a.localeCompare(b, "de"));
  return LAENDER_ORDER.includes("Österreich") ? ["Österreich"].concat(rest) : rest;
}

function kzLaenderDropdownsBefuellen() {
  const optionen = laenderFuerDropdown().map(l =>
    '<option value="' + l + '">' + LAENDER[l].euText + " – " + l + " " + LAENDER[l].emoji + "</option>"
  ).join("");
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
        !kzOhneKuerzel(k) &&
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
  kzAktuellesLandName = "Österreich";
  const feld1 = document.getElementById("kzFeld1");
  feld1.value = "";
  feld1.placeholder = LAENDER["Österreich"].euText;
  feld1.classList.remove("kz-eingabe-feld-fehler");
  kzLandWechseln();
});

document.getElementById("kzFeld1").addEventListener("input", kzFeld1Input);
document.getElementById("kzFeld2").addEventListener("input", kzFeld2Input);
document.getElementById("kzFeld3").addEventListener("input", kzFeld3Input);
["kzFeld1", "kzFeld2", "kzFeld3"].forEach(id => {
  const feld = document.getElementById(id);
  feld.addEventListener("focus", kzFokusAktualisieren);
  feld.addEventListener("blur", kzFokusAktualisieren);
});

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
