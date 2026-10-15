export default {
  slug: 'keywords-mit-wenig-konkurrenz-finden',
  title: 'Keywords mit wenig Konkurrenz finden: 6 Methoden ohne teure Tools',
  translationKey: 'low-competition-keywords',
  category: 'seo',
  theme: 'seo',
  tags: ['keywords wenig konkurrenz', 'keyword recherche kostenlos', 'longtail keywords', 'keyword generator deutsch', 'search console', 'suchintention'],
  description: 'So finden Sie Keywords mit wenig Konkurrenz auf Deutsch: Longtail-Varianten, Search Console, Google-Vorschläge und ein schneller SERP-Check. Mit Beispielen und Checkliste.',
  cover: {
    kicker: 'Spezifische Suchanfragen schlagen große Begriffe',
    visual: {
      type: 'checklist',
      items: ['Longtail statt Kurzbegriff', 'Search Console auswerten', 'Google-Vorschläge nutzen', 'SERP prüfen', 'Suchintention klären'],
    },
  },
  infographic: {
    type: 'table',
    title: 'Vom Kurzbegriff zum Longtail-Keyword',
    subtitle: 'Je genauer die Suchanfrage, desto weniger etablierte Seiten konkurrieren um sie.',
    columns: ['Keyword', 'Wörter', 'Wettbewerb'],
    widths: [560, 200, 296],
    rows: [
      ['wörter zählen', '2', 'sehr hoch'],
      ['wörter zählen online', '3', 'hoch'],
      ['wörter zählen ohne leerzeichen', '4', 'mittel'],
      ['wörter zählen in pdf ohne adobe', '6', 'niedrig'],
      ['wie viele wörter hat eine din a4 seite', '8', 'niedrig'],
    ],
    alt: 'Tabelle: vom Kurzbegriff „wörter zählen“ bis zur Longtail-Frage „wie viele wörter hat eine din a4 seite“ mit sinkendem Wettbewerb',
    caption: 'Die Schätzung des Wettbewerbs beruht darauf, welche Art von Seiten auf Seite 1 steht.',
    footer: 'Ideen generieren: talkandtool.com/de/keywords-wenig-konkurrenz',
  },
  html: `
<p>Keywords mit wenig Konkurrenz sind Suchanfragen, für die Google auf Seite 1 keine übermächtigen Seiten zeigt: Foren, veraltete Artikel, Seiten, die die Frage nur nebenbei beantworten. Für neue oder kleine Websites sind sie der einzige realistische Weg zu den ersten Klicks. Hier sind sechs Methoden, sie ohne teure SEO-Software zu finden.</p>

<h2>Was „wenig Konkurrenz“ wirklich bedeutet</h2>
<p>Die Keyword-Schwierigkeit in SEO-Tools ist eine Schätzung, meist aus der Zahl der Backlinks der Top-10-Seiten. Entscheidend ist aber nicht die Zahl, sondern die Frage: <strong>Kann meine Seite die beste Antwort auf genau diese Suche sein?</strong> Bei „wörter zählen“ stehen seit Jahren dieselben großen Tools oben. Bei „wörter zählen in pdf ohne adobe“ steht dort oft ein Forenbeitrag. Den können Sie schlagen.</p>

{{infographic}}

<h2>1. Longtail-Varianten bilden</h2>
<p>Hängen Sie an Ihren Hauptbegriff an, was Suchende genauer wissen wollen: ein Programm (Word, Excel, Google Docs), eine Bedingung (ohne Leerzeichen, kostenlos, ohne Anmeldung), eine Zielgruppe (für Schüler, für Selbstständige) oder ein Format (Tabelle, Formel, Beispiel). Der <a href="/de/longtail-keyword-generator">Longtail-Keyword-Generator</a> kombiniert diese Muster automatisch zu einer Liste.</p>

<h2>2. Fragen statt Begriffe</h2>
<p>Fragen mit „wie“, „was“, „warum“ und „wie viele“ sind fast immer weniger umkämpft als der Begriff selbst und passen ideal zu einem Ratgeberartikel oder einem FAQ-Abschnitt. Ein Beispiel ist der Artikel <a href="/de/ratgeber/zeichen-zaehlen-mit-ohne-leerzeichen">Zeichen zählen mit und ohne Leerzeichen</a>, der eine konkrete Frage beantwortet statt den Kurzbegriff anzugreifen.</p>

<h2>3. Google-Autovervollständigung und „Ähnliche Fragen“</h2>
<p>Geben Sie Ihren Begriff in Google ein und notieren Sie die Vorschläge. Ergänzen Sie dann Buchstaben (a, b, c …) hinter dem Begriff, um weitere Varianten zu sehen. Die Box „Ähnliche Fragen“ zeigt, was Suchende als Nächstes wissen wollen. Beides beruht auf echten Suchen, nicht auf Schätzungen.</p>

<h2>4. Die eigene Search Console auswerten</h2>
<p>Wenn Ihre Website schon einige Wochen online ist, liegen die besten Keywords bereits in der Google Search Console. Öffnen Sie <strong>Leistung → Suchergebnisse</strong>, aktivieren Sie die durchschnittliche Position und sortieren Sie nach Impressionen. Suchanfragen auf Position 5 bis 20 sind Themen, bei denen Google Ihre Seite schon für relevant hält. Eine gezielte Überarbeitung bringt sie oft auf Seite 1.</p>
<p>Mit einem Regex-Filter auf <em>Suchanfrage</em> sehen Sie nur Fragen: <code>(?i)^(wie|was|warum|wann|wo|welche)\\b</code>. Mit <code>^(\\S+\\s+){3,}\\S+$</code> sehen Sie stattdessen alle Suchanfragen mit mindestens vier Wörtern, also Ihre Longtail-Keywords.</p>

<h2>5. Den SERP-Check machen</h2>
<p>Bevor Sie schreiben, googeln Sie das Keyword und schauen sich Seite 1 an. Gute Zeichen für wenig Konkurrenz:</p>
<ul>
<li>Forenbeiträge, Frage-Antwort-Seiten oder Social-Media-Posts in den Top 10</li>
<li>Artikel, die mehrere Jahre alt sind oder die Frage nur am Rande behandeln</li>
<li>Kleine Websites mit erkennbar wenig Autorität</li>
<li>Ergebnisse, die nicht genau zur Suche passen</li>
</ul>
<p>Schlechte Zeichen: ausschließlich große Marken, Wikipedia und Seiten, die exakt Ihr Keyword im Titel tragen.</p>

<h2>6. Die Suchintention prüfen</h2>
<p>Ein Keyword mit wenig Konkurrenz bringt nichts, wenn Ihre Seite die falsche Art Antwort liefert. Wer „prozentrechnung formel“ sucht, will eine Erklärung; wer „prozentrechner“ sucht, will rechnen. Der <a href="/de/suchintention-bestimmen">Suchintention-Check</a> ordnet Keywords nach informational, transaktional und navigational ein, und das <a href="/de/keyword-clustering">Keyword-Clustering</a> fasst Varianten zusammen, die auf dieselbe Seite gehören, damit Sie nicht mehrere Seiten gegeneinander antreten lassen.</p>

<h2>Checkliste: Lohnt sich das Keyword?</h2>
<ol>
<li>Es hat mindestens drei Wörter oder ist eine Frage.</li>
<li>Auf Seite 1 steht mindestens ein schwaches Ergebnis.</li>
<li>Die Suchintention passt zu der Seite, die Sie schreiben wollen.</li>
<li>Sie können eine bessere, konkretere Antwort geben als die vorhandenen Ergebnisse.</li>
<li>Es gibt verwandte Fragen, die Sie auf derselben Seite beantworten können.</li>
</ol>
<p>Den schnellsten Einstieg bietet der <a href="/de/keywords-wenig-konkurrenz">Keyword-Finder für wenig Konkurrenz</a>: Begriff eingeben, Longtail-Ideen erhalten, dann mit dem SERP-Check aussortieren.</p>

<h2>Häufige Fragen</h2>
<h3>Wie viel Suchvolumen sollte ein Keyword mit wenig Konkurrenz haben?</h3>
<p>Für eine neue Website lohnen sich auch Keywords mit 10 bis 50 Suchen im Monat. Eine Seite rankt meist für Dutzende verwandte Varianten, sodass sich kleine Volumen addieren.</p>
<h3>Brauche ich ein kostenpflichtiges SEO-Tool?</h3>
<p>Für den Anfang nicht. Autovervollständigung, „Ähnliche Fragen“, die eigene Search Console und ein ehrlicher Blick auf die Suchergebnisse reichen aus, um die ersten 20 Themen zu finden.</p>
<h3>Wie lange dauert es, bis ein solches Keyword rankt?</h3>
<p>Bei wenig Konkurrenz oft vier bis zwölf Wochen nach der Indexierung. Interne Links von thematisch passenden Seiten beschleunigen das.</p>
`,
};
