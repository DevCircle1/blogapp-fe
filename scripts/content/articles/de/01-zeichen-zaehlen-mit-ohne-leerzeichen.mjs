export default {
  slug: 'zeichen-zaehlen-mit-ohne-leerzeichen',
  title: 'Zeichen zählen mit oder ohne Leerzeichen: Was gilt wann?',
  category: 'technology',
  theme: 'seo',
  tags: ['zeichen zählen', 'zeichen zählen ohne leerzeichen', 'zeichenzähler online', 'normseite', 'normzeile', 'wörter zählen'],
  description: 'Zeichen mit oder ohne Leerzeichen zählen? Was Hausarbeit, Normseite, Übersetzung, SMS und Meta Description jeweils verlangen, mit Beispielen und Richtwerten.',
  cover: {
    kicker: 'Hausarbeit, Normseite, SEO und SMS im Überblick',
    visual: { type: 'formula', title: 'BEISPIELSATZ', lines: ['mit Leerzeichen:   54', 'ohne Leerzeichen:  48', 'Wörter:             7'] },
  },
  infographic: {
    type: 'table',
    title: 'Wo welche Zählweise gilt',
    subtitle: 'Übliche Vorgaben und Richtwerte. Bei Prüfungsarbeiten zählt immer die Vorgabe Ihrer Hochschule oder Ihres Instituts.',
    columns: ['Anwendung', 'Gezählt wird', 'Richtwert'],
    widths: [330, 380, 346],
    rows: [
      ['Normseite (Verlage, Lektorat)', 'Zeichen inkl. Leerzeichen', '1.800 Zeichen'],
      ['Normzeile (Übersetzungen)', 'Zeichen inkl. Leerzeichen', '55 Zeichen'],
      ['Haus- und Abschlussarbeit', 'laut Prüfungsordnung', 'meist inkl. Leerzeichen'],
      ['SEO-Title', 'Pixelbreite', 'ca. 50–60 Zeichen'],
      ['Meta Description', 'Pixelbreite', 'ca. 150–160 Zeichen'],
      ['Post auf X', 'Zeichen inkl. Leerzeichen', '280 Zeichen'],
      ['SMS', 'Zeichen inkl. Leerzeichen', '160, mit Emoji 70'],
    ],
    alt: 'Tabelle: Welche Zeichenzählung für Normseite, Normzeile, Hausarbeit, SEO-Title, Meta Description, X und SMS gilt',
    caption: 'Wenn nichts anderes angegeben ist, sind „Zeichen“ fast immer inklusive Leerzeichen gemeint.',
    footer: 'Selbst zählen: talkandtool.com/de/woerter-zaehlen',
  },
  html: `
<p>Zeichen mit Leerzeichen zählen jeden Buchstaben, jede Ziffer, jedes Satzzeichen und jedes Leerzeichen. Zeichen ohne Leerzeichen lassen nur die Leerzeichen weg. Wenn eine Vorgabe nur von „Zeichen“ spricht, sind in Deutschland fast immer Zeichen inklusive Leerzeichen gemeint. Hier sehen Sie, welche Zählweise wo gilt und wie Sie beide Werte schnell ermitteln.</p>

<h2>Der Unterschied an einem Beispiel</h2>
<p>Nehmen Sie den Satz: <em>„Die Hausarbeit darf höchstens 15.000 Zeichen umfassen.“</em></p>
<ul>
<li><strong>Zeichen mit Leerzeichen:</strong> 54</li>
<li><strong>Zeichen ohne Leerzeichen:</strong> 48</li>
<li><strong>Wörter:</strong> 7</li>
</ul>
<p>Der Unterschied entspricht genau der Zahl der Leerzeichen, hier 6. In normalem deutschem Fließtext macht das etwa 13–15 % der Zeichen aus. Ein Text mit 10.000 Zeichen inklusive Leerzeichen hat also grob 8.600 Zeichen ohne Leerzeichen. Bei einer Obergrenze kann diese Differenz über „bestanden“ oder „zu lang“ entscheiden.</p>
<p>Zählt ein Zeilenumbruch mit? Bei den meisten Programmen nicht als eigenes Zeichen. Bei Tabulatoren und doppelten Leerzeichen gehen die Zähler dagegen auseinander. Wer knapp an der Grenze liegt, sollte doppelte Leerzeichen vorher entfernen, etwa mit <a href="/de/suchen-und-ersetzen">Suchen und Ersetzen</a>.</p>

<h2>Wo welche Zählweise gilt</h2>

{{infographic}}

<h3>Hausarbeit, Bachelor- und Masterarbeit</h3>
<p>Maßgeblich ist allein die Prüfungsordnung oder die Vorgabe der Lehrperson. Viele Institute geben den Umfang in Zeichen inklusive Leerzeichen an, andere in Wörtern oder Seiten. Wichtig ist auch, was mitgezählt wird. Meist zählt nur der Fließtext, ohne Deckblatt, Verzeichnisse, Literaturverzeichnis und Anhang. Fußnoten werden je nach Fach mal mitgezählt, mal nicht. Im Zweifel fragen Sie nach und notieren sich die Antwort.</p>
<h3>Normseite und Normzeile</h3>
<p>Verlage, Lektorate und Übersetzungsbüros rechnen mit festen Einheiten, die immer <strong>inklusive Leerzeichen</strong> zählen:</p>
<ul>
<li><strong>Normseite:</strong> 1.800 Zeichen (30 Zeilen à 60 Anschläge). Ein Manuskript mit 270.000 Zeichen entspricht 150 Normseiten.</li>
<li><strong>Normzeile:</strong> 55 Zeichen. Nach dieser Einheit werden viele Übersetzungen abgerechnet, auch für Gerichte und Behörden.</li>
</ul>
<h3>SEO: Title und Meta Description</h3>
<p>Google schneidet Titel und Beschreibungen nach Pixelbreite ab, nicht nach Zeichenzahl. Als Faustregel gelten etwa 50–60 Zeichen für den Title und 150–160 Zeichen für die Meta Description. Breite Buchstaben wie W und M, viele Großbuchstaben und Umlaute brauchen mehr Platz. Prüfen Sie die tatsächliche Breite mit dem Tool <a href="/de/title-und-meta-description-pruefen">Title und Meta Description prüfen</a>.</p>
<h3>SMS und soziale Netzwerke</h3>
<p>Eine SMS fasst 160 Zeichen, solange nur Zeichen aus dem GSM-Standardzeichensatz vorkommen. Umlaute und ß gehören dazu. Ein einziges Emoji schaltet auf eine andere Kodierung um, dann passen nur noch 70 Zeichen in eine SMS. Auf X (früher Twitter) sind es 280 Zeichen inklusive Leerzeichen, wobei Links pauschal gezählt werden.</p>

<h2>So zählen Sie Zeichen am schnellsten</h2>
<ol>
<li><strong>Online:</strong> Text in den <a href="/de/woerter-zaehlen">Wörter- und Zeichenzähler</a> einfügen. Er zeigt Zeichen mit und ohne Leerzeichen, Wörter, Sätze, Absätze und die Lesezeit gleichzeitig. Die Zählung läuft im Browser, der Text wird nicht hochgeladen.</li>
<li><strong>In Word:</strong> Auf die Wortzahl unten in der Statusleiste klicken. Das Fenster „Statistik“ zeigt Zeichen mit und ohne Leerzeichen. Mit dem Häkchen bei Textfeldern, Fuß- und Endnoten legen Sie fest, ob diese mitgezählt werden.</li>
<li><strong>In Google Docs:</strong> Tools → Wortzahl, oder <kbd>Strg</kbd> + <kbd>Umschalt</kbd> + <kbd>C</kbd>. Dort stehen „Zeichen“ und „Zeichen ohne Leerzeichen“.</li>
</ol>
<p>Mehr zu den einzelnen Programmen, auch zu PDF-Dateien, lesen Sie im Ratgeber <a href="/de/ratgeber/woerter-zaehlen-word-google-docs-pdf">Wörter zählen in Word, Google Docs und PDF</a>.</p>

<h2>Warum Programme unterschiedliche Zahlen liefern</h2>
<p>Zwei Zähler ergeben selten exakt dieselbe Zahl. Typische Gründe:</p>
<ul>
<li><strong>Markierter Bereich:</strong> Word zählt nur die Markierung, wenn Text markiert ist.</li>
<li><strong>Fußnoten und Textfelder:</strong> je nach Einstellung mitgezählt oder nicht.</li>
<li><strong>Unsichtbare Zeichen:</strong> geschützte Leerzeichen, Tabulatoren oder Zeilenumbrüche aus kopierten PDFs. Die lassen sich mit <a href="/de/zeilenumbrueche-entfernen">Zeilenumbrüche entfernen</a> bereinigen.</li>
<li><strong>Silbentrennung:</strong> manuelle Trennstriche aus PDFs zählen als zusätzliche Zeichen.</li>
</ul>
<p>Für eine Abgabe gilt: Zählen Sie mit dem Programm, das Ihr Institut nennt, meist Word. Lassen Sie etwas Puffer zur Obergrenze.</p>

<h2>Faustregeln zum Umrechnen</h2>
<ul>
<li>Ein deutsches Wort hat im Schnitt etwa 6 Buchstaben, mit Leerzeichen also rund 7 Zeichen.</li>
<li>1.800 Zeichen (eine Normseite) entsprechen etwa 250–280 Wörtern.</li>
<li>10.000 Zeichen inklusive Leerzeichen sind ungefähr 1.400–1.500 Wörter.</li>
</ul>
<p>Das sind Näherungswerte. Fachtexte mit langen Komposita wie „Mehrwertsteuererhöhung“ haben weniger Wörter pro Zeichen. Für eine verbindliche Zahl immer den tatsächlichen Text zählen.</p>

<h2>Häufige Fragen</h2>
<h3>Zählen Satzzeichen als Zeichen?</h3>
<p>Ja. Punkte, Kommas, Anführungszeichen und Klammern zählen in beiden Varianten als Zeichen.</p>
<h3>Was bedeutet „Anschläge“?</h3>
<p>„Anschläge“ ist die ältere Bezeichnung aus der Schreibmaschinenzeit und meint Zeichen inklusive Leerzeichen.</p>
<h3>Zählen Umlaute als ein oder zwei Zeichen?</h3>
<p>Als ein Zeichen. Ä, ö, ü und ß zählen jeweils einfach, auch in SMS und in Word.</p>
`,
};
