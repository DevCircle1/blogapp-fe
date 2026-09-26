export default {
  slug: 'woerter-zaehlen-word-google-docs-pdf',
  title: 'Wörter zählen in Word, Google Docs und PDF – so geht’s',
  category: 'technology',
  theme: 'seo',
  tags: ['wörter zählen', 'wörter zählen word', 'wortanzahl google docs', 'wörter zählen pdf', 'wortzähler online', 'hausarbeit wortanzahl'],
  description: 'Wörter zählen in Word, Google Docs, LibreOffice, Pages und PDF: wo die Wortanzahl steht, was mitgezählt wird und warum Programme verschiedene Zahlen zeigen.',
  cover: {
    kicker: 'Wo die Wortanzahl steht und was mitzählt',
    visual: { type: 'checklist', items: ['Word: Statusleiste', 'Docs: Strg+Umschalt+C', 'LibreOffice: Statusleiste', 'Pages: Darstellung', 'PDF: Text kopieren'] },
  },
  infographic: {
    type: 'steps',
    title: 'Wortanzahl finden: Programm für Programm',
    subtitle: 'Die Zahl gilt für das ganze Dokument, außer Sie haben vorher Text markiert.',
    items: [
      ['Microsoft Word', 'Wortanzahl unten links in der Statusleiste anklicken. Oder: Überprüfen → Wörter zählen.'],
      ['Google Docs', 'Tools → Wortzahl oder Strg + Umschalt + C. Optional: „Wortzahl während der Eingabe anzeigen“.'],
      ['LibreOffice Writer', 'Die Zahl steht in der Statusleiste. Ein Klick darauf öffnet die Detailansicht mit Zeichen.'],
      ['Apple Pages', 'Darstellung → Wortanzahl einblenden. Die Zahl erscheint unten im Dokument.'],
      ['PDF', 'Text markieren, kopieren und in einen Wortzähler einfügen. Gescannte PDFs brauchen vorher eine Texterkennung.'],
    ],
    alt: 'Anleitung in fünf Schritten: Wörter zählen in Microsoft Word, Google Docs, LibreOffice Writer, Apple Pages und PDF-Dateien',
    caption: 'Für Abgaben zählt in der Regel die Zahl aus dem Programm, das Ihre Hochschule vorgibt.',
    footer: 'Ohne Programm: talkandtool.com/de/woerter-zaehlen',
  },
  html: `
<p>In Word steht die Wortanzahl unten in der Statusleiste, in Google Docs finden Sie sie unter Tools → Wortzahl oder mit Strg + Umschalt + C. Für PDF-Dateien kopieren Sie den Text in einen Online-Wortzähler. Hier zeigen wir die Wege für alle gängigen Programme und erklären, warum die Ergebnisse voneinander abweichen können.</p>

<h2>Wörter zählen: die Programme im Überblick</h2>

{{infographic}}

<h2>Microsoft Word</h2>
<p>Word zählt beim Schreiben mit: Die Wortanzahl steht unten links in der Statusleiste. Fehlt sie, klicken Sie mit der rechten Maustaste auf die Statusleiste und aktivieren „Wortanzahl“.</p>
<p>Ein Klick auf die Zahl, oder <strong>Überprüfen → Wörter zählen</strong>, öffnet das Fenster „Statistik“. Es zeigt Seiten, Wörter, Zeichen ohne und mit Leerzeichen, Absätze und Zeilen. Dort legen Sie auch fest, ob <strong>Textfelder, Fuß- und Endnoten</strong> mitgezählt werden. Das ist bei Hausarbeiten oft entscheidend.</p>
<p>Tipp für Abschlussarbeiten: Markieren Sie nur den Fließtext, von der Einleitung bis zum Fazit. Word zählt dann ausschließlich die Markierung, ohne Deckblatt, Verzeichnisse und Anhang.</p>

<h2>Google Docs</h2>
<p>Öffnen Sie <strong>Tools → Wortzahl</strong> oder drücken Sie <kbd>Strg</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd> (am Mac <kbd>⌘</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd>). Das Fenster zeigt Seiten, Wörter, Zeichen und Zeichen ohne Leerzeichen. Mit dem Häkchen „Wortzahl während der Eingabe anzeigen“ bleibt die Zahl dauerhaft unten links eingeblendet.</p>
<p>Auch hier gilt: Ist Text markiert, zählt Docs nur die Auswahl.</p>

<h2>LibreOffice Writer und Apple Pages</h2>
<p>In <strong>LibreOffice Writer</strong> steht die Wort- und Zeichenzahl unten in der Statusleiste. Ein Klick darauf öffnet ein Fenster mit den Werten für das gesamte Dokument und für die aktuelle Auswahl.</p>
<p>In <strong>Apple Pages</strong> wählen Sie <strong>Darstellung → Wortanzahl einblenden</strong>. Über den kleinen Pfeil neben der Zahl wechseln Sie zu Zeichen, Absätzen oder Seiten.</p>

<h2>Wörter in einer PDF zählen</h2>
<p>PDF-Reader zeigen in der Regel keine Wortanzahl. Der einfachste Weg:</p>
<ol>
<li>PDF öffnen, <kbd>Strg</kbd> + <kbd>A</kbd> drücken und den Text kopieren.</li>
<li>Den Text in den <a href="/de/woerter-zaehlen">Online-Wortzähler</a> einfügen. Er zeigt sofort Wörter, Zeichen mit und ohne Leerzeichen, Sätze und Lesezeit.</li>
<li>Kopierte PDFs enthalten oft harte Zeilenumbrüche und Trennstriche. Für ein sauberes Ergebnis erst <a href="/de/zeilenumbrueche-entfernen">Zeilenumbrüche entfernen</a>, dann zählen.</li>
</ol>
<p>Lässt sich im PDF kein Text markieren, ist es ein Scan, also ein Bild. Dann ist vorher eine Texterkennung (OCR) nötig, sonst gibt es nichts zu zählen.</p>

<h2>Warum Word und Google Docs unterschiedlich zählen</h2>
<p>Dieselbe Datei ergibt in zwei Programmen oft leicht unterschiedliche Zahlen. Die üblichen Ursachen:</p>
<ul>
<li><strong>Bindestriche:</strong> „E-Mail-Adresse“ zählt in Word als ein Wort. Andere Zähler trennen an Bindestrichen und kommen auf drei.</li>
<li><strong>Abkürzungen mit Leerzeichen:</strong> „z. B.“ sind zwei Wörter, „z.B.“ eins.</li>
<li><strong>Zahlen und Zeichen:</strong> „15 %“ oder „§ 3“ werden je nach Programm als ein oder zwei Wörter gezählt.</li>
<li><strong>Fußnoten, Textfelder, Kopfzeilen:</strong> je nach Einstellung dabei oder nicht.</li>
<li><strong>Schrägstriche und URLs:</strong> „und/oder“ oder eine Webadresse zählen mal als eins, mal als mehrere Wörter.</li>
</ul>
<p>Die Unterschiede liegen meist unter 1–2 %. Bei einer festen Obergrenze sollten Sie trotzdem das Programm verwenden, das Ihre Hochschule oder Ihr Auftraggeber nennt.</p>

<h2>Wörter oder Zeichen: was wird verlangt?</h2>
<p>Viele Vorgaben nennen Zeichen statt Wörter, oft inklusive Leerzeichen. Wie sich beides unterscheidet und welche Einheit wo üblich ist, etwa Normseite, Normzeile oder Meta Description, erklärt der Ratgeber <a href="/de/ratgeber/zeichen-zaehlen-mit-ohne-leerzeichen">Zeichen zählen mit oder ohne Leerzeichen</a>.</p>
<p>Als Faustregel für deutschen Text: 1.000 Wörter entsprechen etwa 6.500–7.000 Zeichen inklusive Leerzeichen.</p>

<h2>Für SEO-Texte: Wortanzahl ist nicht alles</h2>
<p>Wer für Google schreibt, zählt oft Wörter, weil es Vorgaben wie „mindestens 1.000 Wörter“ gibt. Google bewertet aber keine Wortanzahl, sondern ob die Seite die Suchanfrage gut beantwortet. Sinnvoller als die Länge ist ein Blick darauf, welche Begriffe wie oft vorkommen. Das zeigt der <a href="/de/keyword-dichte-pruefen">Keyword-Dichte-Check</a>, und der Ratgeber <a href="/de/ratgeber/keyworddichte-optimaler-wert">Keyworddichte: Welcher Wert ist optimal?</a> erklärt, wie Sie das Ergebnis lesen.</p>

<h2>Häufige Fragen</h2>
<h3>Wie viele Wörter hat eine Seite?</h3>
<p>Bei 12 pt Schrift, 1,5-zeiligem Abstand und normalen Rändern sind es etwa 300–350 Wörter pro Seite. Einzeilig sind es etwa 500.</p>
<h3>Zählt Word auch Überschriften mit?</h3>
<p>Ja. Überschriften gehören zum Text und werden gezählt. Wer sie ausschließen will, markiert nur die Absätze darunter.</p>
<h3>Kann ich Wörter zählen, ohne ein Programm zu installieren?</h3>
<p>Ja. Text in den <a href="/de/woerter-zaehlen">Wortzähler</a> einfügen, er läuft im Browser und speichert nichts.</p>
`,
};
