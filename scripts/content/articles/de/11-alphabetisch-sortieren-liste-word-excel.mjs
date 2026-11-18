export default {
  slug: 'alphabetisch-sortieren-liste-word-excel',
  title: 'Alphabetisch sortieren: Liste in Word, Excel und online',
  category: 'technology',
  theme: 'dev',
  tags: ['alphabetisch sortieren', 'liste alphabetisch sortieren', 'alphabetisch ordnen', 'nach alphabet sortieren', 'sortieren word', 'sortieren excel'],
  description: 'Listen alphabetisch sortieren in Word, Excel, Google Tabellen und online: Schritt für Schritt, mit Umlauten nach DIN 5007, Zahlen, Duplikaten und typischen Fehlern.',
  cover: {
    kicker: 'A bis Z in Word, Excel und online',
    visual: { type: 'formula', title: 'LISTE SORTIEREN', lines: ['Zebra · Äpfel · Birne', '↓  A bis Z', 'Äpfel · Birne · Zebra'] },
  },
  infographic: {
    type: 'table',
    title: 'Alphabetisch sortieren: Wege im Vergleich',
    subtitle: 'Alle Wege sortieren nach A bis Z. Sie unterscheiden sich in Umlauten, Zahlen und Aufwand.',
    columns: ['Programm', 'Weg', 'Gut für', 'Hinweis'],
    widths: [220, 360, 260, 216],
    rows: [
      ['Online-Tool', 'Text einfügen, A–Z wählen', 'Schnelle Listen', 'Ohne Anmeldung'],
      ['Word', 'Markieren, Start > Sortieren', 'Absätze, Aufzählungen', 'Tabellen anders'],
      ['Excel', 'Daten > Sortieren A bis Z', 'Tabellen mit Spalten', 'Alle Spalten markieren'],
      ['Google Tabellen', 'Daten > Bereich sortieren', 'Gemeinsame Listen', 'Kopfzeile fixieren'],
    ],
    alt: 'Tabelle zum alphabetischen Sortieren in vier Programmen: Online-Tool, Word, Excel und Google Tabellen, mit Einsatzbereich und Hinweis',
    caption: 'Bei Tabellen immer alle zusammengehörigen Spalten mitmarkieren.',
    footer: 'Sofort sortieren: talkandtool.com/de/alphabetisch-sortieren',
  },
  html: `
<p>Um eine Liste alphabetisch zu sortieren, fügen Sie die Einträge in ein Sortierwerkzeug ein und wählen A bis Z, oder Sie nutzen die Sortierfunktion von Word, Excel oder Google Tabellen. Jeder Eintrag muss in einer eigenen Zeile stehen. Der <a href="/de/alphabetisch-sortieren">Online-Sortierer</a> erledigt das in einem Schritt, ohne Anmeldung, direkt im Browser.</p>

{{infographic}}

<h2>Online sortieren: der schnellste Weg</h2>
<ol>
<li>Die Liste kopieren, ein Eintrag pro Zeile.</li>
<li>In den <a href="/de/alphabetisch-sortieren">Alphabet-Sortierer</a> einfügen.</li>
<li>„Alphabetisch“ und „Aufsteigend“ für A bis Z wählen, „Absteigend“ für Z bis A. Für Einträge mit Zahlen gibt es „Natürlich / numerisch“. Groß- und Kleinschreibung wird standardmäßig ignoriert, Leerzeilen entfernt der Sortierer automatisch.</li>
<li>Das Ergebnis kopieren und wieder einfügen.</li>
</ol>
<p>Das Werkzeug eignet sich für Namenslisten, Literaturverzeichnisse, Stichwortlisten, Einkaufslisten oder Schlagwörter. Ist die Liste durch Zeilenumbrüche mitten in Einträgen zerstückelt, bereinigen Sie sie vorher mit <a href="/de/zeilenumbrueche-entfernen">Zeilenumbrüche entfernen</a>.</p>

<h2>In Word alphabetisch sortieren</h2>
<ol>
<li>Die Absätze oder die Aufzählung markieren, die sortiert werden sollen.</li>
<li>Auf der Registerkarte <strong>Start</strong> in der Gruppe Absatz auf das Symbol <strong>Sortieren</strong> (A über Z mit Pfeil) klicken.</li>
<li>Im Dialog „Sortieren nach: Absätze“ und „Typ: Text“ wählen, dann <strong>Aufsteigend</strong> für A bis Z oder <strong>Absteigend</strong> für Z bis A.</li>
<li>Mit OK bestätigen.</li>
</ol>
<p>Word sortiert Absatz für Absatz. Ein Eintrag, der aus zwei Absätzen besteht, wird daher getrennt. Verwenden Sie in dem Fall einen Zeilenumbruch mit Umschalt + Eingabe statt eines neuen Absatzes. Bei Tabellen markieren Sie die Spalte und wählen im Dialog die passende Spalte aus.</p>

<h2>In Excel alphabetisch sortieren</h2>
<ol>
<li>Eine Zelle in der Spalte anklicken, die sortiert werden soll.</li>
<li>Auf <strong>Daten</strong> gehen und <strong>A bis Z</strong> (aufsteigend) oder <strong>Z bis A</strong> (absteigend) wählen.</li>
<li>Wenn Excel nachfragt, den Bereich erweitern, damit die übrigen Spalten mitwandern.</li>
</ol>
<p>Der häufigste Fehler: Wird nur eine Spalte markiert und sortiert, passen Namen und Zahlen danach nicht mehr zusammen. Markieren Sie deshalb den gesamten Datenbereich, oder klicken Sie nur in eine Zelle und lassen Excel den Bereich erkennen. Über <strong>Daten > Sortieren</strong> sortieren Sie nach mehreren Spalten, etwa erst nach Nachname, dann nach Vorname.</p>

<h2>In Google Tabellen sortieren</h2>
<p>Den Bereich markieren, dann <strong>Daten > Bereich sortieren</strong> öffnen. Setzen Sie ein Häkchen bei „Daten haben Kopfzeile“, wenn die erste Zeile eine Überschrift ist, und wählen Sie A bis Z. Mit <strong>Daten > Blatt nach Spalte sortieren</strong> sortieren Sie das ganze Blatt, die Kopfzeile bleibt dabei nur erhalten, wenn sie zuvor fixiert wurde.</p>

<h2>Umlaute und ß richtig einsortieren</h2>
<p>Im Deutschen gibt es zwei Regeln. Nach <strong>DIN 5007-1</strong>, der üblichen Wörterbuchsortierung, werden ä, ö und ü wie a, o und u behandelt, und ß wie ss. Nach <strong>DIN 5007-2</strong>, der Variante für Telefonbücher und Namenslisten, zählen ä, ö und ü wie ae, oe und ue.</p>
<p>Der Unterschied zeigt sich bei Namen. Die Liste „Mohr, Möller, Moeller“ ergibt nach DIN 5007-1 die Reihenfolge Moeller, Mohr, Möller, weil Möller wie „Moller“ einsortiert wird. Nach DIN 5007-2 steht Möller wie Moeller an derselben Stelle, vor Mohr. Die meisten Programme verwenden bei deutscher Spracheinstellung die erste Regel. Stimmt die Reihenfolge nicht, prüfen Sie die Spracheinstellung des Dokuments oder der Tabelle.</p>

<h2>Groß- und Kleinschreibung</h2>
<p>Je nach Einstellung stehen Wörter mit Großbuchstaben vor denen in Kleinbuchstaben, etwa „Zebra“ vor „apfel“. Das ist selten gewollt. Der Online-Sortierer ignoriert die Schreibweise, solange „Groß-/Kleinschreibung beachten“ ausgeschaltet ist. In anderen Programmen wählen Sie die entsprechende Option oder vereinheitlichen die Liste zuerst mit dem Werkzeug <a href="/de/gross-kleinschreibung-umwandeln">Groß- und Kleinschreibung umwandeln</a>.</p>

<h2>Zahlen in der Liste</h2>
<p>Bei einer reinen Textsortierung kommt „10“ vor „2“, weil Zeichen für Zeichen verglichen wird und „1“ vor „2“ steht. Aus 1, 2, 10, 20 wird so 1, 10, 2, 20. In Excel sortieren Sie Zahlen, die als Zahl formatiert sind, richtig. Stehen sie als Text da, wandeln Sie sie zuerst um, oder ergänzen Sie führende Nullen: 01, 02, 10, 20. Bei Einträgen wie „Kapitel 2“ und „Kapitel 10“ hilft die Einstellung „Natürlich / numerisch“ im Online-Sortierer, die Zahlen als Zahlen liest.</p>

<h2>Doppelte Einträge und Leerzeilen entfernen</h2>
<p>Nach dem Sortieren stehen identische Einträge direkt untereinander, was sie leicht erkennbar macht. Mit <a href="/de/doppelte-zeilen-entfernen">Doppelte Zeilen entfernen</a> löschen Sie sie automatisch. In Excel gelingt das über <strong>Daten > Duplikate entfernen</strong>. Leere Zeilen stehen beim Sortieren am Anfang oder am Ende der Liste und lassen sich dort in einem Zug löschen.</p>

<h2>Sortierte Liste nachbearbeiten</h2>
<ul>
<li>Namen mit Titel („Dr.“, „Prof.“) vorher entfernen, sonst sortiert das Programm nach dem Titel. Mit <a href="/de/suchen-und-ersetzen">Suchen und Ersetzen</a> geht das für die ganze Liste auf einmal.</li>
<li>Für Nachname vor Vorname die Einträge als „Müller, Anna“ schreiben.</li>
<li>Die Zahl der Einträge zählt der <a href="/de/woerter-zaehlen">Wörterzähler</a>, wie im Ratgeber <a href="/de/ratgeber/woerter-zaehlen-word-google-docs-pdf">Wörter zählen in Word, Google Docs und PDF</a> beschrieben.</li>
</ul>

<h2>Häufig gestellte Fragen</h2>
<h3>Wie sortiere ich eine Liste alphabetisch?</h3>
<p>Jeden Eintrag in eine eigene Zeile setzen und in einem Sortierwerkzeug oder in Word, Excel oder Google Tabellen A bis Z wählen.</p>
<h3>Wie sortiere ich in Word von A bis Z?</h3>
<p>Absätze markieren, auf Start klicken, das Symbol Sortieren wählen, „Absätze“ und „Text“ einstellen und Aufsteigend bestätigen.</p>
<h3>Warum steht „Ärger“ bei A und nicht bei Ae?</h3>
<p>Nach DIN 5007-1 wird ä wie a einsortiert. Die Variante mit ae gilt nur für Telefonbücher und ähnliche Namenslisten.</p>
<h3>Wie sortiere ich von Z bis A?</h3>
<p>Dieselben Schritte, aber Absteigend oder Z bis A auswählen.</p>
<h3>Werden meine Daten beim Online-Sortieren gespeichert?</h3>
<p>Nein. Der Sortierer arbeitet im Browser, der Text wird nicht an einen Server gesendet.</p>
`,
};
