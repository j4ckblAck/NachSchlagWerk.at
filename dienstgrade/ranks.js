// Alle Dienstgrade. "id" = Dateiname der PNG in img/ (ohne .png)
// "abk" = offizielle Kurzbezeichnung (Quelle: Wikipedia "Dienstgrade der
// oesterreichischen Sicherheitsexekutive" + Uniform-Unterscheidungszeichen-Tafel BMI).
// Neue Dienstgrade einfach hier ergaenzen - der Rest passt sich an.

const RANKS = [
  // Verwendungsgruppe E2b / VB-S
  // Offizielle Bezeichnung laut aktueller BMI-Tafel (2025): die Abzeichen
  // stehen jeweils fuer mehrere Titel gleichzeitig.
  { id: "vbs",                  name: "Aspirant",              gruppe: "E2b / VB-S", abk: "Asp" },
  { id: "vbs-fgb",              name: "Inspektor GFB",         gruppe: "E2b / VB-S", abk: "Insp GFB" },
  { id: "inspektor",            name: "Inspektor",             gruppe: "E2b / VB-S", abk: "Insp",
    hinweis: "Ernennung rund 3 Monate nach abgelegter Grundausbildungspruefung." },
  { id: "revierinspektor",      name: "Revierinspektor",       gruppe: "E2b / VB-S", abk: "RevInsp",
    hinweis: "Ab zumindest 6 Jahren im Exekutivdienst." },
  { id: "gruppeninspektor-e2b", name: "Gruppeninspektor E2b",  gruppe: "E2b / VB-S", abk: "GrInsp",
    hinweis: "Ab zumindest 10 Jahren im Exekutivdienst, hoechster Dienstgrad der Verwendungsgruppe E2b." },

  // Verwendungsgruppe E2a - dienstfuehrende Beamte
  { id: "gruppeninspektor-e2a", name: "Gruppeninspektor E2a",  gruppe: "E2a", abk: "GrInsp",
    hinweis: "Funktionsgruppe 1 - erste Stufe der dienstfuehrenden Beamten." },
  { id: "bezirksinspektor",     name: "Bezirksinspektor",      gruppe: "E2a", abk: "BezInsp",
    hinweis: "Funktionsgruppe 2 und 3." },
  { id: "abteilungsinspektor",  name: "Abteilungsinspektor",   gruppe: "E2a", abk: "AbtInsp",
    hinweis: "Funktionsgruppe 4 - ab hier ist das Korpsabzeichen golden statt silbern." },
  { id: "kontrollinspektor",    name: "Kontrollinspektor",     gruppe: "E2a", abk: "KontrInsp",
    hinweis: "Funktionsgruppe 5." },
  { id: "chefinspektor",        name: "Chefinspektor",         gruppe: "E2a", abk: "ChefInsp",
    hinweis: "Funktionsgruppe 6." },
  { id: "chefinspektor-fgr7",   name: "Chefinspektor FGr 7",   gruppe: "E2a", abk: "ChefInsp",
    hinweis: "Gleicher Titel wie Chefinspektor, aber Funktionsgruppe 7 - am goldenen statt roten Rand erkennbar." },

  // Verwendungsgruppe E1 - leitende Beamte
  { id: "leutnant",             name: "Leutnant",              gruppe: "E1", abk: "Lt",
    hinweis: "Grundlaufbahn (GL) der leitenden Beamten." },
  { id: "oberleutnant",         name: "Oberleutnant",          gruppe: "E1", abk: "Oblt",
    hinweis: "Funktionsgruppe 1 und 2." },
  { id: "hauptmann",            name: "Hauptmann",             gruppe: "E1", abk: "Hptm",
    hinweis: "Funktionsgruppe 3." },
  { id: "major",                name: "Major",                 gruppe: "E1", abk: "Mjr",
    hinweis: "Funktionsgruppe 4." },
  { id: "oberstleutnant",       name: "Oberstleutnant",        gruppe: "E1", abk: "Obstlt",
    hinweis: "Funktionsgruppe 5 und 6." },
  { id: "oberst",               name: "Oberst",                gruppe: "E1", abk: "Obst",
    hinweis: "Funktionsgruppe 7 und 8." },
  { id: "brigadier",            name: "Brigadier",             gruppe: "E1", abk: "Bgdr",
    hinweis: "Funktionsgruppe 9." },
  { id: "generalmajor",         name: "Generalmajor",          gruppe: "E1", abk: "GenMjr",
    hinweis: "Funktionsgruppe 10 und 11." },
  { id: "general",              name: "General",               gruppe: "E1", abk: "Gl",
    hinweis: "Funktionsgruppe 12 - hoechster Dienstgrad im Exekutivdienst." },

  // Sonstige - eigene Lernkategorie fuer Abzeichen ausserhalb der drei
  // klassischen Verwendungsgruppen (hier: Polizeimusik)
  { id: "gastmusiker",          name: "Gastmusiker",           gruppe: "Sonstige", abk: "-",
    hinweis: "Entspricht optisch dem Inspektor, aber ohne Korpsabzeichen - eine Lyra ersetzt den Stern." },
  { id: "kapellmeister",        name: "Kapellmeister",         gruppe: "Sonstige", abk: "-",
    hinweis: "Entspricht optisch dem Chefinspektor, auch hier ersetzt eine Lyra die Sterne." },
];

// Reihenfolge, in der Gruppen ueberall angezeigt werden.
const GROUP_ORDER = ["E2b / VB-S", "E2a", "E1", "Sonstige"];

// Kurzerklaerung, die im Lernmodus als erste Karte jeder Gruppe erscheint.
const GROUP_INFO = {
  "E2b / VB-S": {
    titel: "Verwendungsgruppe E2b, VB/S",
    text: "Eingeteilte Beamte, von Vertragsbediensteten (VB/S) bis zum Gruppeninspektor E2b. Hier beginnt die Polizeikarriere."
  },
  "E2a": {
    titel: "Verwendungsgruppe E2a",
    text: "Dienstführende Beamte, vom Gruppeninspektor E2a bis zum Chefinspektor."
  },
  "E1": {
    titel: "Verwendungsgruppe E1",
    text: "Leitende Beamte, von Leutnant bis General."
  },
  "Sonstige": {
    titel: "Sonstige Dienstgrade",
    text: ""
  }
};

// Bekannte optisch aehnliche Paare - als Starthilfe fuer das
// Verwechslungs-Duell, solange noch keine eigenen Fehler getrackt wurden.
const FALLBACK_PAARE = [
  ["inspektor", "vbs-fgb"],
  ["major", "oberstleutnant"],
  ["generalmajor", "general"],
  ["gruppeninspektor-e2a", "bezirksinspektor"],
  ["chefinspektor", "chefinspektor-fgr7"],
  ["oberleutnant", "hauptmann"],
  ["revierinspektor", "gruppeninspektor-e2b"],
  ["oberst", "brigadier"],
];
