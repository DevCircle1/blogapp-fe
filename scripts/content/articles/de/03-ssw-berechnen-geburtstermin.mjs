export default {
  slug: 'ssw-berechnen-geburtstermin',
  title: 'SSW berechnen: In welcher Schwangerschaftswoche bin ich?',
  translationKey: 'due-date-from-last-period',
  category: 'health',
  theme: 'health',
  tags: ['ssw berechnen', 'schwangerschaftswoche berechnen', 'geburtstermin berechnen', 'ssw rechner', 'naegele-regel', 'errechneter termin'],
  description: 'SSW berechnen: So bestimmen Sie Schwangerschaftswoche und Geburtstermin aus der letzten Periode, was „12+3“ bedeutet und wie die Naegele-Regel funktioniert.',
  cover: {
    kicker: 'Letzte Periode + 280 Tage = Geburtstermin',
    visual: { type: 'calendar', title: 'Dezember 2026', offset: 1, days: 31, highlight: [15], range: [8, 22], weekdays: ['M', 'D', 'M', 'D', 'F', 'S', 'S'] },
  },
  infographic: {
    type: 'table',
    title: 'Wichtige Termine im Beispiel',
    subtitle: 'Erster Tag der letzten Periode: 10.03.2026, Zyklus 28 Tage. Die Schreibweise 12+6 bedeutet 12 volle Wochen und 6 Tage.',
    columns: ['Zeitpunkt', 'SSW', 'Datum'],
    widths: [440, 280, 336],
    rows: [
      ['Erster Tag der letzten Periode', '0+0', '10.03.2026'],
      ['Ungefähre Befruchtung', '2+0', 'um den 24.03.2026'],
      ['Ende des ersten Trimesters', '12+6', '08.06.2026'],
      ['Beginn des Mutterschutzes', '34+0', '03.11.2026'],
      ['Errechneter Geburtstermin (ET)', '40+0', '15.12.2026'],
      ['Übertragung', 'ab 42+0', 'ab 29.12.2026'],
    ],
    alt: 'Tabelle mit Schwangerschaftswochen und Datumsangaben von der letzten Periode bis zum errechneten Geburtstermin am 15.12.2026',
    caption: 'Der Mutterschutz beginnt sechs Wochen vor dem errechneten Termin.',
    footer: 'Eigene Daten berechnen: talkandtool.com/de/geburtstermin-rechner',
  },
  html: `
<p>Um die Schwangerschaftswoche (SSW) zu berechnen, zählen Sie die Tage seit dem ersten Tag Ihrer letzten Periode und teilen durch 7. Der errechnete Geburtstermin liegt 280 Tage, also 40 Wochen, nach diesem Tag. Hier sehen Sie die Rechnung Schritt für Schritt, was Angaben wie „12+3“ bedeuten und wie genau der Termin ist.</p>

<p><em>Dieser Ratgeber erklärt, wie Termine berechnet werden. Er ersetzt keine ärztliche Beratung. Ihre Frauenärztin, Ihr Frauenarzt oder Ihre Hebamme bestätigt die Daten, meist per Ultraschall.</em></p>

<h2>Warum die Zählung vor der Befruchtung beginnt</h2>
<p>Die Schwangerschaft wird ab dem ersten Tag der letzten Regelblutung gezählt, nicht ab der Befruchtung. Den Tag der Befruchtung kennen die wenigsten. Den Beginn der letzten Periode dagegen schon. Bei einem 28-Tage-Zyklus findet der Eisprung etwa zwei Wochen danach statt. Wer in der „4. SSW“ ist, trägt also einen Embryo, der etwa zwei Wochen alt ist.</p>

<h2>Was „SSW 12+3“ bedeutet</h2>
<p>In Mutterpass und Befunden steht die Schwangerschaftswoche meist als <strong>vollendete Wochen + Tage</strong>. „12+3“ heißt: 12 volle Wochen und 3 Tage sind vergangen. Sie befinden sich damit in der <strong>13. SSW</strong>.</p>
<p>Diese Verschiebung um eins sorgt oft für Verwirrung. „In der 13. SSW“ und „12+3“ meinen denselben Zeitpunkt.</p>

<h2>SSW berechnen: Schritt für Schritt</h2>
<ol>
<li>Nehmen Sie den <strong>ersten Tag</strong> der letzten Periode, zum Beispiel den 10.03.2026.</li>
<li>Zählen Sie die Tage bis heute. Vom 10.03. bis zum 27.09.2026 sind es 201 Tage.</li>
<li>Teilen Sie durch 7: 201 ÷ 7 = 28 volle Wochen, Rest 5 Tage.</li>
<li>Ergebnis: <strong>SSW 28+5</strong>, also die 29. Schwangerschaftswoche.</li>
</ol>
<p>Das Zählen der Tage übernimmt der Rechner <a href="/de/tage-zwischen-zwei-daten">Tage zwischen zwei Daten</a>. Schneller geht es mit dem <a href="/de/geburtstermin-rechner">Geburtstermin- und SSW-Rechner</a>. Er zeigt aktuelle SSW, errechneten Termin, Zeugungszeitraum und Trimester auf einen Blick.</p>

<h2>Den Geburtstermin berechnen: die Naegele-Regel</h2>
<p>Der errechnete Termin (ET) liegt <strong>280 Tage nach dem ersten Tag der letzten Periode</strong>. Vom 10.03.2026 aus gezählt ist das der <strong>15.12.2026</strong>.</p>
<p>Zum Kopfrechnen gibt es die <strong>Naegele-Regel</strong>: erster Tag der letzten Periode <strong>+ 7 Tage − 3 Monate + 1 Jahr</strong>. Aus dem 10.03.2026 wird so der 17.12.2026. Die Faustregel kann um ein, zwei Tage vom exakten Ergebnis abweichen, weil Monate unterschiedlich lang sind. Für Termine gilt die gezählte Variante.</p>
<h3>Die erweiterte Naegele-Regel für längere oder kürzere Zyklen</h3>
<p>Die Grundregel geht von einem 28-Tage-Zyklus aus. Ist Ihr Zyklus regelmäßig länger oder kürzer, verschiebt sich der Eisprung, und damit auch der Termin:</p>
<p><strong>ET = erster Tag der letzten Periode + 280 Tage + (Zykluslänge − 28 Tage)</strong></p>
<p>Bei einem 35-Tage-Zyklus kommen 7 Tage hinzu: aus dem 15.12. wird der 22.12.2026. Bei einem 25-Tage-Zyklus werden 3 Tage abgezogen.</p>

{{infographic}}

<h2>Wie genau ist der errechnete Termin?</h2>
<p>Der ET ist ein Mittelwert, kein Stichtag. Nur ein kleiner Teil der Kinder, häufig werden etwa 4 % genannt, kommt genau an diesem Tag zur Welt. Die meisten werden in den zwei Wochen davor oder danach geboren. Als reif gilt ein Kind ab 37+0. Ab 42+0 spricht man von Übertragung.</p>
<p>Genauer als die Rechnung ist oft der frühe Ultraschall. Im ersten Trimester wird die Scheitel-Steiß-Länge des Embryos gemessen. Weicht das Ergebnis deutlich vom rechnerisch ermittelten Termin ab, wird der ET häufig angepasst und dann im Mutterpass eingetragen. Spätere Ultraschalluntersuchungen verschieben den Termin normalerweise nicht mehr.</p>

<h2>Wichtige Fristen, die vom ET abhängen</h2>
<ul>
<li><strong>Mutterschutz:</strong> beginnt sechs Wochen vor dem errechneten Termin und endet in der Regel acht Wochen nach der Geburt, bei Früh- und Mehrlingsgeburten zwölf Wochen. Im Beispiel beginnt er am 03.11.2026.</li>
<li><strong>Mitteilung an den Arbeitgeber:</strong> Arbeitgeber brauchen den voraussichtlichen Termin, meist mit ärztlicher Bescheinigung.</li>
<li><strong>Elternzeit:</strong> muss spätestens sieben Wochen vor Beginn schriftlich angemeldet werden.</li>
</ul>
<p>Einzelne Daten, etwa „ET minus sechs Wochen“, rechnen Sie mit <a href="/de/datum-plus-tage">Datum plus Tage</a> aus.</p>

<h2>Häufige Fragen</h2>
<h3>Wird die Schwangerschaft ab der Befruchtung oder ab der Periode gezählt?</h3>
<p>Ab dem ersten Tag der letzten Periode. Deshalb dauert eine Schwangerschaft rechnerisch 40 Wochen, obwohl sich das Kind nur etwa 38 Wochen entwickelt.</p>
<h3>Ich weiß den Tag der Befruchtung. Wie rechne ich dann?</h3>
<p>Zum Tag der Befruchtung 266 Tage (38 Wochen) addieren. Der <a href="/de/geburtstermin-rechner">Geburtstermin-Rechner</a> akzeptiert auch das Zeugungsdatum.</p>
<h3>In welcher SSW endet das erste Trimester?</h3>
<p>Meist wird das Ende der 13. SSW genannt, also 12+6. Die Abgrenzungen unterscheiden sich je nach Quelle um bis zu eine Woche.</p>
`,
};
