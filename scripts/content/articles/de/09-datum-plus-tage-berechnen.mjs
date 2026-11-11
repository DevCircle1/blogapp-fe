export default {
  slug: 'datum-plus-tage-berechnen',
  title: 'Datum plus Tage berechnen: Fristen, Werktage und Beispiele',
  category: 'math',
  theme: 'math',
  tags: ['datum plus tage', 'tage zu datum addieren', 'fristberechnung', 'werktage berechnen', 'datum berechnen excel', 'frist ende berechnen'],
  description: 'Datum plus Tage berechnen mit Beispielen: Kalendertage, Werktage und Wochen addieren, die Fristregeln nach BGB (§§ 187, 188, 193) und die passenden Excel-Formeln.',
  cover: {
    kicker: 'Kalendertage, Werktage und Fristende',
    visual: { type: 'calendar', title: 'Dezember 2026', offset: 1, days: 31, highlight: [15], range: [16, 31] },
  },
  infographic: {
    type: 'table',
    title: 'Datum plus Tage: vier Rechenbeispiele',
    subtitle: 'Ergebnisse für 2026/2027. Werktage zählen hier Montag bis Freitag, ohne Feiertage.',
    columns: ['Ausgangsdatum', 'Rechnung', 'Ergebnis', 'Wochentag'],
    widths: [260, 330, 262, 204],
    rows: [
      ['11.11.2026', '+ 30 Kalendertage', '11.12.2026', 'Freitag'],
      ['11.11.2026', '+ 90 Kalendertage', '09.02.2027', 'Dienstag'],
      ['23.12.2026', '+ 14 Kalendertage', '06.01.2027', 'Mittwoch'],
      ['16.11.2026', '+ 10 Werktage', '30.11.2026', 'Montag'],
    ],
    alt: 'Tabelle mit vier Beispielen für Datum plus Tage: 30 Kalendertage, 90 Kalendertage, 14 Kalendertage über den Jahreswechsel und 10 Werktage',
    caption: 'Werktage überspringen Samstag und Sonntag, Kalendertage nicht.',
    footer: 'Selbst rechnen: talkandtool.com/de/datum-plus-tage',
  },
  html: `
<p>Um ein Datum plus Tage zu berechnen, zählen Sie die Tage ab dem Ausgangsdatum weiter, wobei der Starttag selbst nicht mitgezählt wird. 11.11.2026 plus 30 Tage ergibt den 11.12.2026. Bei Werktagen überspringen Sie Samstag und Sonntag, bei gesetzlichen Fristen gelten zusätzliche Regeln, die weiter unten stehen.</p>

{{infographic}}

<h2>Kalendertage, Werktage oder Wochen?</h2>
<p>Bevor Sie rechnen, klären Sie, welche Art von Tagen gemeint ist, denn die Ergebnisse unterscheiden sich deutlich:</p>
<ul>
<li><strong>Kalendertage:</strong> jeder Tag zählt, auch Wochenenden und Feiertage. „Innerhalb von 14 Tagen“ meint im Zweifel Kalendertage.</li>
<li><strong>Werktage:</strong> in der Regel Montag bis Freitag ohne gesetzliche Feiertage. Lieferzeiten werden meist so angegeben. Manche Verträge zählen den Samstag mit, weil er rechtlich ein Werktag ist. Prüfen Sie, was vereinbart wurde.</li>
<li><strong>Wochen:</strong> eine Woche sind immer sieben Kalendertage. Drei Wochen nach einem Mittwoch ist wieder ein Mittwoch.</li>
</ul>

<h2>Beispiele für Kalendertage</h2>
<p>Zählen Sie vom Ausgangsdatum aus Tag für Tag nach vorn, und springen Sie beim Monatsende in den nächsten Monat:</p>
<ul>
<li>11.11.2026 + 30 Tage = <strong>11.12.2026</strong> (ein Freitag).</li>
<li>11.11.2026 + 90 Tage = <strong>09.02.2027</strong> (ein Dienstag).</li>
<li>23.12.2026 + 14 Tage = <strong>06.01.2027</strong>. Hier wechseln Monat und Jahr, und der Wochentag bleibt derselbe, weil 14 durch 7 teilbar ist.</li>
</ul>
<p>Eine praktische Kontrolle: Wenn die Tageszahl durch 7 teilbar ist, ändert sich der Wochentag nicht. Bei 30 Tagen verschiebt er sich um zwei Tage nach vorn, weil 30 = 4 × 7 + 2.</p>

<h2>Beispiel für Werktage</h2>
<p>Gesucht ist der Tag, der zehn Werktage nach Montag, dem 16.11.2026, liegt. Zählen Sie nur Montag bis Freitag: Di 17., Mi 18., Do 19., Fr 20. (4), dann Mo 23., Di 24., Mi 25., Do 26., Fr 27. (9), schließlich Mo 30.11. (10). Das Ergebnis ist <strong>Montag, der 30.11.2026</strong>. Fällt zwischen Start und Ziel ein gesetzlicher Feiertag, verschiebt sich das Ergebnis um einen weiteren Tag. Beachten Sie, dass es regionale Feiertage gibt, die nicht in jedem Bundesland gelten. Mit dem <a href="/de/arbeitstage-rechner">Arbeitstage-Rechner</a> sparen Sie sich das Abzählen.</p>

<h2>Fristberechnung nach BGB</h2>
<p>Für gesetzliche und viele vertragliche Fristen gelten die Auslegungsregeln des Bürgerlichen Gesetzbuchs. Die drei wichtigsten:</p>
<ol>
<li><strong>§ 187 Abs. 1 BGB:</strong> Ist der Beginn der Frist an ein Ereignis geknüpft, etwa an die Zustellung eines Schreibens, wird der Tag des Ereignisses nicht mitgerechnet. Die Frist beginnt am Folgetag.</li>
<li><strong>§ 188 Abs. 1 BGB:</strong> Eine nach Tagen bemessene Frist endet mit dem Ablauf des letzten Tages der Frist, also um 24 Uhr.</li>
<li><strong>§ 193 BGB:</strong> Fällt der letzte Tag auf einen Samstag, Sonntag oder gesetzlichen Feiertag, endet die Frist erst mit Ablauf des nächsten Werktags.</li>
</ol>
<p>Ein Beispiel: Ein Bescheid wird am 15.12.2026 zugestellt und es gilt eine Frist von 60 Tagen. Der Zustelltag zählt nicht mit, die Frist beginnt am 16.12. Der 60. Tag ist der 13.02.2027, ein Samstag. Nach § 193 BGB endet die Frist daher am <strong>Montag, dem 15.02.2027</strong>. Beachten Sie, dass diese Regeln eine Orientierung sind und keine Rechtsberatung ersetzen. Für Verwaltungsverfahren, Gerichtsfristen und Verträge gelten teils abweichende Bestimmungen. Prüfen Sie bei wichtigen Fristen den genauen Wortlaut oder fragen Sie eine fachkundige Stelle.</p>

<h2>Datum plus Tage in Excel</h2>
<p>Excel speichert Datumswerte als fortlaufende Zahlen, deshalb können Sie direkt addieren:</p>
<ul>
<li><strong>Kalendertage:</strong> <em>=A1+30</em> addiert 30 Tage zum Datum in Zelle A1. Formatieren Sie die Ergebniszelle als Datum.</li>
<li><strong>Heute plus Tage:</strong> <em>=HEUTE()+14</em>.</li>
<li><strong>Werktage:</strong> <em>=ARBEITSTAG(A1;10)</em> addiert zehn Werktage ohne Samstag und Sonntag. Mit <em>=ARBEITSTAG(A1;10;Feiertage)</em> übergeben Sie zusätzlich einen Zellbereich mit Feiertagen.</li>
<li><strong>Monate:</strong> <em>=EDATUM(A1;1)</em> addiert einen Monat und bleibt dabei möglichst am gleichen Tag.</li>
</ul>
<p>Zeigt Excel statt eines Datums eine Zahl wie 46002, ist nur das Zellenformat falsch. Stellen Sie es auf „Datum“ um.</p>

<h2>Den Zeitraum zwischen zwei Daten bestimmen</h2>
<p>Die Umkehrung, also wie viele Tage zwischen zwei Daten liegen, berechnen Sie mit dem <a href="/de/tage-zwischen-zwei-daten">Tage-Rechner</a>. Und wenn Sie einfach ein Datum um Tage, Wochen oder Monate verschieben möchten, erledigt das der <a href="/de/datum-plus-tage">Datums-Rechner</a> in Sekunden, auch über Jahresgrenzen und Schaltjahre hinweg.</p>

<h2>Typische Fehler</h2>
<ul>
<li><strong>Den Starttag mitzählen.</strong> Bei „plus 30 Tage“ ist der Starttag Tag 0.</li>
<li><strong>Werktage und Kalendertage verwechseln.</strong> Zehn Werktage sind zwei volle Wochen.</li>
<li><strong>Feiertage vergessen.</strong> Sie verschieben das Ergebnis, aber nicht in jedem Bundesland gleich.</li>
<li><strong>Schaltjahre übersehen.</strong> Der 29. Februar existiert 2028, nicht 2027.</li>
</ul>

<h2>Häufige Fragen</h2>
<h3>Was ist 30 Tage nach dem 11.11.2026?</h3>
<p>Der 11.12.2026.</p>
<h3>Zählt der Tag der Zustellung bei einer Frist mit?</h3>
<p>Bei Fristen nach BGB nicht. Die Frist beginnt am Tag nach dem maßgebenden Ereignis (§ 187 Abs. 1 BGB).</p>
<h3>Wie viele Werktage hat eine Woche?</h3>
<p>Fünf, wenn Sie Montag bis Freitag zählen. Rechtlich gilt auch der Samstag als Werktag, im Alltag wird er bei Lieferzeiten aber oft nicht mitgezählt.</p>
<h3>Wie addiere ich Monate statt Tage?</h3>
<p>Mit der Excel-Funktion EDATUM oder im Datums-Rechner. Monate haben unterschiedlich viele Tage, daher ist „plus 30 Tage“ nicht dasselbe wie „plus ein Monat“.</p>
`,
};
