/* ============================================================
   App installieren ("Zum Startbildschirm hinzufuegen")
   - Nur ueber den Download-Button oben im Hauptmenue (keine
     automatische Abfrage beim Oeffnen)
   - Chrome/Edge/Android: echter Installations-Dialog des Browsers
     (Ereignis "beforeinstallprompt")
   - iPhone/iPad (Safari): kein Installations-Dialog moeglich, darum
     eine kurze Anleitung ueber "Teilen -> Zum Home-Bildschirm"
   ============================================================ */

let installEreignis = null;

function appIstInstalliert() {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}
function istIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
function istHandy() {
  return window.matchMedia("(pointer: coarse)").matches;
}
// Button oben ist im Hauptmenue immer da (auch wenn schon installiert -
// dann sagt der Dialog das einfach), auf allen anderen Seiten nicht
function installKnopfAktualisieren(name) {
  const knopf = document.getElementById("installBtn");
  const bildschirm = name || (typeof aktuellerBildschirm !== "undefined" ? aktuellerBildschirm : "home");
  knopf.hidden = bildschirm !== "home";
}

function installDialogZeigen() {
  const dialog = document.getElementById("installDialog");
  const titel = document.getElementById("installTitel");
  const text = document.getElementById("installText");
  const anleitung = document.getElementById("installAnleitung");
  const jaBtn = document.getElementById("installJa");
  const neinBtn = document.getElementById("installNein");
  const handy = istHandy();

  titel.textContent = "NachSchlagWerk installieren?";
  anleitung.hidden = true;
  jaBtn.hidden = true;
  neinBtn.textContent = "Verstanden";

  if (appIstInstalliert()) {
    titel.textContent = "Bereits installiert";
    text.textContent = "Du verwendest NachSchlagWerk schon als installierte App.";
  } else if (installEreignis) {
    // Browser bietet die Installation direkt an (Chrome, Edge, Android)
    text.textContent = handy
      ? "Als App auf dem Startbildschirm installieren – startet schneller, im Vollbild und funktioniert auch offline."
      : "Als App auf diesem Computer installieren – mit eigener Verknüpfung, eigenem Fenster und auch offline nutzbar.";
    jaBtn.hidden = false;
    neinBtn.textContent = "Später";
  } else if (istIOS()) {
    text.textContent = "Als App auf dem Home-Bildschirm ablegen – startet im Vollbild und funktioniert auch offline.";
    anleitung.innerHTML =
      '<li>Unten auf <b>Teilen</b> tippen ' + TEILEN_ICON + "</li>" +
      "<li><b>Zum Home-Bildschirm</b> wählen</li>" +
      "<li>Mit <b>Hinzufügen</b> bestätigen</li>";
    anleitung.hidden = false;
  } else {
    // Kein direkter Dialog verfuegbar (z.B. schon im Browser installiert,
    // Firefox, oder der Browser hat noch nicht freigegeben) - Anleitung
    text.textContent = handy
      ? "Du kannst NachSchlagWerk über das Browsermenü auf den Startbildschirm legen:"
      : "Du kannst NachSchlagWerk über das Browsermenü als App installieren:";
    anleitung.innerHTML = handy
      ? "<li>Oben rechts das Menü <b>⋮</b> öffnen</li>" +
        "<li><b>Zum Startbildschirm hinzufügen</b> bzw. <b>App installieren</b> wählen</li>"
      : "<li>In der Adressleiste auf das Symbol <b>Installieren</b> klicken, oder</li>" +
        "<li>im Browsermenü <b>⋮</b> → <b>Speichern und teilen</b> → <b>App installieren</b> wählen</li>" +
        "<li>Firefox: Seite als Lesezeichen oder Verknüpfung speichern</li>";
    anleitung.hidden = false;
  }
  dialog.hidden = false;
}

const TEILEN_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/></svg>';

function installDialogSchliessen() {
  document.getElementById("installDialog").hidden = true;
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();          // eigenen Dialog statt Browser-Leiste zeigen
  installEreignis = e;
  installKnopfAktualisieren();
});

window.addEventListener("appinstalled", () => {
  installEreignis = null;
  installDialogSchliessen();
  installKnopfAktualisieren();
});

// Oeffnet das Installationsfenster des Browsers (nur nach einem Klick erlaubt)
async function browserInstallationStarten() {
  if (!installEreignis) return;
  const ereignis = installEreignis;
  installEreignis = null;      // Ereignis ist nur einmal verwendbar
  window.nswInstallEreignis = null;
  ereignis.prompt();
  try { await ereignis.userChoice; } catch (e) {}
  installKnopfAktualisieren();
}

document.getElementById("installJa").addEventListener("click", () => {
  installDialogSchliessen();
  browserInstallationStarten();
});
document.getElementById("installNein").addEventListener("click", installDialogSchliessen);
document.getElementById("installDialog").addEventListener("click", (e) => {
  if (e.target.id === "installDialog") installDialogSchliessen();
});
// Download-Button: bietet der Browser die Installation an (Chrome, Edge,
// Android), sofort dessen Installationsfenster oeffnen - sonst den
// eigenen Dialog (bereits installiert / Anleitung fuer iPhone & Co.)
document.getElementById("installBtn").addEventListener("click", () => {
  if (installEreignis && !appIstInstalliert()) {
      browserInstallationStarten();
  } else {
    installDialogZeigen();
  }
});

// Falls der Browser sein Angebot schon VOR dem Laden dieser Datei
// geschickt hat (im <head> von index.html abgefangen)
if (window.nswInstallEreignis) installEreignis = window.nswInstallEreignis;

installKnopfAktualisieren();
