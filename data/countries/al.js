// data/countries/al.js — Albanien: seit 2011 ohne Regionsbezug.
// Quelle: Wikipedia "Kfz-Kennzeichen (Albanien)", Sep 2026 gegen die
// dortige Uebersichtstabelle geprueft. Bedeutungen bewusst kurz
// gehalten (wie bei den anderen Laendern) - die Optik (kein EU-
// Sternenring, Trennpunkt zwischen Kuerzel und Nummer, zweites blaues
// Feld rechts mit weissem Kreis) wird unten in registerLand gesetzt,
// KEIN eigenes Wappen/Flaggensymbol zwischen Kuerzel und Nummer (anders
// als z.B. Deutschland/Oesterreich) - das gibt es auf dem echten
// albanischen Kennzeichen dort nicht.
(function () {
  // "AB" ist das nichtssagende, rein fortlaufende ERSTE Buchstabenpaar
  // (wie bei jedem normalen Kuerzel: "AA", "AB", "AC", ...) - hier
  // stellvertretend als EIN echtes, eintippbares Kuerzel angelegt (kein
  // Platzhalter mehr). Das ZWEITE Buchstabenpaar bei Taxi/Technik/
  // Landwirtschaft (T/MT/R/RB) steht auf dem echten Kennzeichen dahinter
  // bzw. davor und aendert dort Farbe/Bedeutung - genau wie Sloweniens
  // Garnisonsnummer bei "SV" ueber Feld 3 eintippbar (nrEingebbar/
  // nrHerkunft in js/kennzeichen.js), nur mit BUCHSTABEN statt Ziffern
  // (nrArt: "buchstaben") UND mit einer eigenen Farbe/einem eigenen
  // Zahlenmuster pro Auswahl (nrHerkunft-Werte sind hier Objekte statt
  // nur Text, siehe kzHerkunftAktualisieren).
  const AB_ZUSATZKUERZEL = {
    "T": {
      bezeichnung: "Taxi", rot: true, gelb: true, nrMuster: "123 T",
    },
    "MT": {
      bezeichnung: "Technische Maschinen (Makinë Teknologjike)",
      gruenHg: true, weissText: true, rahmenWeiss: true, nrMuster: "MT 12",
    },
    "R": {
      bezeichnung: "Anhänger technischer Maschinen (Rimorkio Teknologjike)",
      gruenHg: true, weissText: true, rahmenWeiss: true, nrMuster: "R 123",
    },
    "RB": {
      bezeichnung: "Landwirtschaftliche Anhänger (Rimorkio Bujqësore)",
      gruenHg: true, weissText: true, rahmenWeiss: true, nrMuster: "RB 12",
    },
    // "Landwirtschaftliche Fahrzeuge" (Makinë Bujqësore) fehlt hier
    // bewusst: das echte Kuerzel ist ebenfalls "MB" - kollidiert mit
    // der bereits vergebenen Polizei "MB" unten (beides TOP-LEVEL-
    // Kuerzel, nicht Teil dieser Zusatzkuerzel-Liste). Eine zweite "MB"
    // waere hier nur toter, nie erreichbarer Code - darum weggelassen.
  };
  const KENNZEICHEN = [
    {
      code: "AB", bezirk: "(kein Regionsbezug, seit 2011)", bundesland: "Albanien",
      nrMuster: "123 FG",
      // "nrAuswahl" (NICHT "nrEingebbar"!) - Feld 3 ist hier keine freie
      // 2-Zeichen-Eingabe, die direkt als Tafel-Nummer erscheint (wie
      // bei Sloweniens "SV"), sondern eine Auswahl aus GENAU diesen 4
      // fertigen Optionen, die je eine EIGENE Farbe UND ein eigenes
      // Zahlenmuster mitbringen (siehe kzHerkunftAktualisieren).
      nrAuswahl: true, nrArt: "buchstaben",
      nrHerkunft: AB_ZUSATZKUERZEL, nrHerkunftLabel: "Sonderzeichen",
    },
    { code: "MB", bezirk: "Polizei (Ministria e Brendshme)", blau: true, nrMuster: "123 AB", bundesland: "Sonderkennzeichen" },
    {
      // Reales Format ist "MM 123 PU" - die festen Ziffern VOR dem
      // eintippbaren Buchstabenpaar (anders als bei Sloweniens "SV",
      // wo die eintippbaren Ziffern VOR dem festen Rest "-400" stehen).
      // "nrSuffixVorn" dreht dafuer nur die ANZEIGE-Reihenfolge um
      // (CSS "order", siehe .kz-schild-nr-suffix-vorn) - eintippbar
      // bleibt weiterhin dasselbe Feld.
      code: "MM", bezirk: "Militär (Ministria e Mbrojtjes)", gruen: true,
      nrEingebbar: true, nrArt: "buchstaben", nrSuffix: "123", nrSuffixVorn: true,
      nrHerkunft: {
        "FA": "Luftwaffe (Forca Ajrore)",
        "FD": "Marine (Forca Detare)",
        "FT": "Heer (Forca Tokësore)",
        "KM": "Unterstützungskommando (Komanda Mbështetëse)",
        "PU": "Militärpolizei (Policia Ushtarake)",
        "SP": "Generalstab (Shtabi i Përgjithshëm)",
      },
      nrHerkunftLabel: "Teilstreitkraft",
      bundesland: "Sonderkennzeichen",
    },
    { code: "CD", bezirk: "Diplomat (Corps Diplomatique)", gruen: true, nrMuster: "12 34 A", bundesland: "Sonderkennzeichen" },
    { code: "TR", bezirk: "Botschaftsangehörige (Truproje Diplomatike)", gruen: true, nrMuster: "12 34 A", bundesland: "Sonderkennzeichen" },
  ];
  registerLand("Albanien", {
    kennzeichen: KENNZEICHEN,
    gruppen: ["Albanien", "Sonderkennzeichen"],
    regionen: ["Albanien", "Sonderkennzeichen"],
    regionLabel: "Land",
    euText: "AL",
    emoji: "🇦🇱",
    euFarbe: "#003399",
    euStern: false,
    nrMuster: "123 FG",
    hatWappen: false,
    // "AB" (der erste, echte Eintrag oben) soll schon geladen sein,
    // sobald das Land ausgewaehlt ist - auch ohne dass extra etwas in
    // Feld 2 getippt wird (siehe kzLandWechseln).
    standardKuerzel: true,
    // Weisser Doppeladler auf dem normalen blauen Band statt des EU-
    // Sternenkranzes (Albanien ist nicht in der EU) - siehe alAdlerSvg()
    // in js/kennzeichen.js.
    adlerBand: true,
    // Kein "flagge" hier (anders als bei den meisten anderen Laendern) -
    // am echten albanischen Kennzeichen steht zwischen Kuerzel und
    // Nummer KEIN Wappen/Flaggensymbol, die Wappen-Box bleibt darum
    // leer/eingeklappt (siehe kzWappenZeigen: land.flagge nicht gesetzt).
    // Trennpunkt zwischen Kuerzel und Nummer (bisher nur bei der
    // Schweiz) - auf dem echten albanischen Kennzeichen steht dort
    // ebenfalls ein kleiner runder Punkt/Pruefsiegel.
    mittelpunkt: true,
    // Zweites blaues Feld ganz rechts MIT weissem Kreis darin (bisher
    // gab es nur die reine Italien-Variante ohne Kreis) - siehe
    // .kz-schild-eu2-kreis in style.css.
    euBandRechts: true,
    euBandRechtsKreis: true,
  });
})();
