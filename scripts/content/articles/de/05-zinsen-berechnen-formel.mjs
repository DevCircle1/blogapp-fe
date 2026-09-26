export default {
  slug: 'zinsen-berechnen-formel',
  title: 'Zinsen berechnen: Formeln für Zins, Tageszins und Zinseszins',
  category: 'finance',
  theme: 'finance',
  tags: ['zinsen berechnen', 'zinsberechnung formel', 'tageszinsen berechnen', 'zinseszins berechnen', 'zinsrechner', 'zinsformel'],
  description: 'Zinsen berechnen mit Beispielen: die Formel für einfache Zinsen, Tageszinsen nach der deutschen Zinsmethode, Zinseszins und was nach der Abgeltungsteuer bleibt.',
  cover: {
    kicker: 'Einfache Zinsen, Tageszinsen und Zinseszins',
    visual: { type: 'formula', title: 'ZINSESZINS', lines: ['Kn = K0 × (1 + p)^n', '10.000 € · 3 % · 5 J.', '= 11.592,74 €'] },
  },
  infographic: {
    type: 'table',
    title: 'Die vier Zinsformeln im Vergleich',
    subtitle: 'Beispiel: 10.000 € zu 3 % pro Jahr (Tageszinsen: 5.000 € zu 4 % für 90 Tage).',
    columns: ['Rechnung', 'Formel', 'Ergebnis'],
    widths: [290, 470, 296],
    rows: [
      ['Einfache Zinsen, 5 Jahre', 'Z = K × p × t ÷ 100', '1.500,00 € Zinsen'],
      ['Tageszinsen, 90 Tage', 'Z = K × p × T ÷ (100 × 360)', '50,00 € Zinsen'],
      ['Zinseszins, jährlich, 5 J.', 'Kn = K0 × (1 + p ÷ 100)^n', '1.592,74 € Zinsen'],
      ['Zinseszins, monatlich, 5 J.', 'Kn = K0 × (1 + p ÷ 1200)^(12n)', '1.616,17 € Zinsen'],
    ],
    alt: 'Tabelle mit den Formeln für einfache Zinsen, Tageszinsen und Zinseszins mit Rechenbeispielen in Euro',
    caption: 'Je öfter Zinsen gutgeschrieben werden, desto mehr Zinseszins entsteht.',
    footer: 'Direkt ausrechnen: talkandtool.com/de/zinsrechner',
  },
  html: `
<p>Zinsen berechnen Sie mit der Formel <strong>Zinsen = Kapital × Zinssatz × Laufzeit ÷ 100</strong>. 10.000 € zu 3 % bringen in einem Jahr 300 € Zinsen. Werden die Zinsen mitverzinst, entsteht Zinseszins, und nach fünf Jahren sind es 1.592,74 € statt 1.500 €. Hier finden Sie alle Formeln mit Beispielen: für Jahre, Monate, Tage und Zinseszins.</p>

<h2>Die Grundformel für einfache Zinsen</h2>
<p><strong>Z = K × p × t ÷ 100</strong></p>
<ul>
<li><strong>Z</strong> = Zinsen in Euro</li>
<li><strong>K</strong> = Kapital (Anlagebetrag oder Kreditsumme)</li>
<li><strong>p</strong> = Zinssatz pro Jahr in Prozent</li>
<li><strong>t</strong> = Laufzeit in Jahren</li>
</ul>
<p>Beispiel: 10.000 € zu 3 % für 5 Jahre: 10.000 × 3 × 5 ÷ 100 = <strong>1.500 €</strong>. Bei einfachen Zinsen bleibt das Kapital gleich, jedes Jahr kommen 300 € hinzu. Der <a href="/de/zinsrechner">Zinsrechner</a> liefert Zinsen und Endbetrag direkt aus Kapital, Zinssatz und Laufzeit.</p>

<h2>Monats- und Tageszinsen</h2>
<p>Für Laufzeiten unter einem Jahr teilen Sie die Jahresformel auf:</p>
<ul>
<li><strong>Monatszinsen:</strong> Z = K × p × m ÷ (100 × 12)</li>
<li><strong>Tageszinsen:</strong> Z = K × p × T ÷ (100 × 360)</li>
</ul>
<p>Beispiel: 5.000 € zu 4 % für 90 Tage: 5.000 × 4 × 90 ÷ 36.000 = <strong>50 €</strong>.</p>
<p>Warum 360 und nicht 365? Nach der <strong>deutschen kaufmännischen Zinsmethode (30/360)</strong> hat jeder Monat 30 Tage und das Jahr 360. Banken verwenden je nach Produkt auch andere Methoden, etwa taggenau/365 oder taggenau/360. Die Unterschiede sind bei kleinen Beträgen gering, bei großen Summen aber spürbar. Welche Methode gilt, steht im Vertrag. Die genaue Zahl der Tage zwischen zwei Daten liefert der Rechner <a href="/de/tage-zwischen-zwei-daten">Tage zwischen zwei Daten</a>.</p>

<h2>Zinseszins berechnen</h2>
<p>Werden die Zinsen nicht ausgezahlt, sondern dem Kapital zugeschlagen, verzinsen sie sich im nächsten Jahr mit. Die Formel lautet:</p>
<p><strong>Kn = K0 × (1 + p ÷ 100)^n</strong></p>
<p>Beispiel: 10.000 € zu 3 % für 5 Jahre: 10.000 × 1,03^5 = <strong>11.592,74 €</strong>. Die Zinsen betragen also 1.592,74 €, 92,74 € mehr als bei einfachen Zinsen. Nach 10 Jahren sind es 13.439,16 €.</p>
<p>Werden die Zinsen monatlich gutgeschrieben, rechnen Sie mit dem Monatszins und der Zahl der Monate: 10.000 × (1 + 0,03 ÷ 12)^60 = <strong>11.616,17 €</strong>.</p>

{{infographic}}

<p>Mit regelmäßigen Sparraten wird die Rechnung aufwendiger. Der <a href="/de/zinseszinsrechner">Zinseszinsrechner</a> berücksichtigt monatliche Einzahlungen und verschiedene Zinsperioden. Der <a href="/de/sparrechner">Sparrechner</a> zeigt, wie viel Sie monatlich für ein Sparziel zurücklegen müssen.</p>

<h2>Die 72er-Regel: Wann verdoppelt sich mein Geld?</h2>
<p>Teilen Sie 72 durch den Zinssatz, und Sie erhalten ungefähr die Jahre bis zur Verdopplung. Bei 3 % sind das 72 ÷ 3 = <strong>24 Jahre</strong>. Nachgerechnet: 1,03^24 ≈ 2,03. Die Faustregel funktioniert gut für Zinssätze zwischen etwa 2 und 10 %.</p>

<h2>Was nach Steuern und Inflation bleibt</h2>
<h3>Abgeltungsteuer</h3>
<p>Zinserträge sind in Deutschland steuerpflichtig. Es fallen 25 % Abgeltungsteuer an, plus 5,5 % Solidaritätszuschlag darauf, zusammen 26,375 %, gegebenenfalls zuzüglich Kirchensteuer. Steuerfrei bleiben Kapitalerträge bis zum <strong>Sparer-Pauschbetrag</strong> von 1.000 € pro Jahr, bei zusammenveranlagten Paaren 2.000 €. Dafür müssen Sie der Bank einen Freistellungsauftrag erteilen.</p>
<p>Beispiel: Fallen die 1.592,74 € Zinseszins in einem einzigen Jahr an, zum Beispiel bei einem Sparbrief mit Auszahlung am Ende, sind 592,74 € steuerpflichtig. Darauf entfallen etwa 156,34 € Steuern (ohne Kirchensteuer).</p>
<h3>Inflation</h3>
<p>3 % Zinsen bei 2 % Inflation bedeuten real nur etwa 1 % mehr Kaufkraft. Wie sich die Kaufkraft eines Betrags entwickelt, zeigt der <a href="/de/inflationsrechner">Inflationsrechner</a>.</p>

<h2>Zinsen für Kredite</h2>
<p>Bei Ratenkrediten sinkt die Restschuld mit jeder Rate, also sinken auch die Zinsen. Hier greift die einfache Formel nicht über die gesamte Laufzeit. Monatsrate, Gesamtzinsen und Tilgungsplan berechnet der <a href="/de/kreditrechner">Kreditrechner</a>. Achten Sie beim Vergleich auf den <strong>effektiven Jahreszins</strong>. Er enthält, anders als der Sollzins, auch Kosten wie Gebühren.</p>

<h2>Häufige Fragen</h2>
<h3>Wie berechne ich den Zinssatz aus Zinsen und Kapital?</h3>
<p>Formel umstellen: p = Z × 100 ÷ (K × t). Beispiel: 450 € Zinsen auf 10.000 € in 1,5 Jahren ergeben 450 × 100 ÷ 15.000 = 3 %.</p>
<h3>Was ist der Unterschied zwischen Zins und Zinssatz?</h3>
<p>Der Zinssatz ist der Prozentwert, zum Beispiel 3 %. Die Zinsen sind der Betrag in Euro, der sich daraus ergibt.</p>
<h3>Wie viel Zinsen bekomme ich für 10.000 € im Jahr?</h3>
<p>Das hängt vom Zinssatz ab: 10.000 € × Zinssatz ÷ 100. Bei 2,5 % sind es 250 € im Jahr, vor Steuern.</p>
`,
};
