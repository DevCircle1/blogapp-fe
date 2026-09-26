export default {
  slug: 'keyworddichte-optimaler-wert',
  title: 'Keyworddichte: Welcher Wert ist optimal? (und wie Sie sie prüfen)',
  translationKey: 'keyword-density',
  category: 'seo',
  theme: 'seo',
  tags: ['keyworddichte', 'keyworddichte prüfen', 'keyword density', 'keyworddichte ermitteln', 'keyword stuffing', 'seo texte schreiben'],
  description: 'Es gibt keine optimale Keyworddichte für Google. Hier sind die Formel, übliche Werte, die Tücken deutscher Komposita und wie Sie Keyword-Stuffing schnell erkennen.',
  cover: {
    kicker: 'Formel, typische Werte und ein Mythos',
    visual: { type: 'formula', title: 'KEYWORDDICHTE', lines: ['Anzahl ÷ Wörter × 100', '12 ÷ 1.500 × 100', '= 0,8 %'] },
  },
  infographic: {
    type: 'table',
    title: 'Ergebnis einer Keyworddichte-Prüfung lesen',
    subtitle: 'Typische Werte für das Hauptkeyword in natürlich geschriebenen Texten. Ein Anhaltspunkt, kein Zielwert: Google nennt keine ideale Dichte.',
    columns: ['Keyworddichte', 'Was sie meist bedeutet', 'Was zu tun ist'],
    widths: [260, 420, 376],
    rows: [
      ['0 %', 'Keyword kommt wörtlich nie vor', 'In Title, H1 und Einleitung ergänzen'],
      ['unter 0,5 %', 'Normal bei langen Texten', 'Nichts, wenn das Thema klar ist'],
      ['0,5–2 %', 'Typisch für fokussierte Seiten', 'Nichts, für Leser schreiben'],
      ['2–3 %', 'Wirkt langsam repetitiv', 'Einige Nennungen variieren'],
      ['über 3 %', 'Liest sich wie Keyword-Stuffing', 'Natürlicher umformulieren'],
    ],
    alt: 'Tabelle mit Keyworddichte-Bereichen von 0 % bis über 3 %, ihrer Bedeutung und der empfohlenen Maßnahme',
    caption: 'Bei kurzen Texten schwankt der Wert stark: Eine Nennung mehr in 200 Wörtern bringt 0,5 Prozentpunkte.',
    footer: 'Text prüfen: talkandtool.com/de/keyword-dichte-pruefen',
  },
  html: `
<p>Eine optimale Keyworddichte für Google gibt es nicht. Google hat nie einen Zielwert genannt und belohnt keinen bestimmten Prozentsatz. Natürlich geschriebene Texte landen beim Hauptkeyword meist zwischen 0,5 und 2 %. Nützlich ist die Kennzahl trotzdem: Sie zeigt schnell, ob ein wichtiger Begriff fehlt oder ob ein Text so oft wiederholt, dass er nach Keyword-Stuffing klingt.</p>

<h2>So wird die Keyworddichte berechnet</h2>
<p><strong>Keyworddichte = (Anzahl des Keywords ÷ Gesamtzahl der Wörter) × 100</strong></p>
<p>Beispiel: Ein Text mit 1.500 Wörtern enthält das Keyword „Zinsrechner“ 12-mal. 12 ÷ 1.500 × 100 = <strong>0,8 %</strong>.</p>
<p>Bei Keywords aus mehreren Wörtern rechnen Tools unterschiedlich. Manche zählen „Wörter zählen online“ als eine Nennung (12 ÷ 1.500 = 0,8 %). Andere multiplizieren mit der Zahl der Wörter im Keyword, also 12 × 3 ÷ 1.500 = 2,4 %. Beides ist üblich. Vergleichen Sie Werte deshalb nur aus demselben Tool.</p>

<h2>Welcher Wert ist gut?</h2>

{{infographic}}

<p>Verstehen Sie die Bereiche als Rauchmelder, nicht als Ziel. Ein Text mit 0,3 % kann auf Platz 1 stehen, weil er das Thema gründlich und mit vielen Synonymen abdeckt. Entscheidend ist, ob der Text natürlich klingt und die Suchanfrage beantwortet.</p>

<h2>Die deutsche Besonderheit: Komposita und Schreibvarianten</h2>
<p>Im Deutschen ist die Keyworddichte besonders unzuverlässig, weil derselbe Begriff in vielen Formen vorkommt:</p>
<ul>
<li><strong>Zusammen, getrennt oder mit Bindestrich:</strong> „Keyworddichte“, „Keyword-Dichte“ und „Keyword Dichte“ zählen für ein Tool als drei verschiedene Begriffe.</li>
<li><strong>Komposita:</strong> „Wortzähler“ enthält „Wort“, wird aber nicht als „Wörter zählen“ erkannt.</li>
<li><strong>Beugung:</strong> „Rechner“, „Rechners“ und „Rechnern“ zählen einzeln.</li>
<li><strong>Umlaute:</strong> Suchende tippen auch „woerter zaehlen“ oder „worter zahlen“. Google versteht diese Varianten, die Dichteprüfung nicht.</li>
</ul>
<p>Deshalb liegt die gemessene Dichte deutscher Texte oft niedriger, als sie sich beim Lesen anfühlt. Das ist kein Problem. Google versteht Varianten, Beugungen und Synonyme. Es ist also nicht nötig, für jede Schreibweise eine Nennung einzubauen.</p>

<h2>Warum die Dichte kaum noch zählt und was stattdessen wichtig ist</h2>
<p>Frühe Suchmaschinen haben Seiten vor allem nach Worthäufigkeit bewertet. Heute erkennt Google Bedeutung, Zusammenhänge und Synonyme. Wichtiger als die Häufigkeit sind:</p>
<ul>
<li><strong>Platzierung:</strong> das Keyword oder eine nahe Variante im Title, in der H1, im ersten Absatz und in mindestens einer Zwischenüberschrift. Den Title prüfen Sie mit <a href="/de/title-und-meta-description-pruefen">Title und Meta Description prüfen</a>.</li>
<li><strong>Themenabdeckung:</strong> Ein Text über Zinsen, der nie „Zinssatz“, „Laufzeit“ oder „Zinseszins“ erwähnt, wirkt dünn, egal wie hoch die Dichte ist.</li>
<li><strong>Suchintention:</strong> Wer „Zinsrechner“ sucht, will rechnen, nicht lesen. Kein Keyword gleicht das falsche Format aus.</li>
</ul>

<h2>Keyword-Stuffing erkennen</h2>
<p>Keyword-Stuffing verstößt gegen die Spam-Richtlinien von Google. Typische Anzeichen:</p>
<ul>
<li>Dieselbe Formulierung in fast jedem Satz: „Unser Wörter zählen Tool hilft beim Wörter zählen online, denn Wörter zählen …“</li>
<li>Listen von Städten oder Keyword-Varianten ohne Nutzen für Leser.</li>
<li>Versteckter Text, etwa weiße Schrift auf weißem Grund.</li>
<li>Titles, die nur aus Keyword-Varianten mit Kommas bestehen.</li>
</ul>
<p>Liegt das Hauptkeyword deutlich über 3 %, lesen Sie den Text laut vor. Stuffing hört man schneller, als man es zählt.</p>

<h2>Keyworddichte prüfen: so geht's</h2>
<ol>
<li><strong>Nur den Haupttext kopieren,</strong> ohne Menü, Footer und Sidebar, sonst verfälschen diese die Zahlen.</li>
<li><strong>In den <a href="/de/keyword-dichte-pruefen">Keyword-Dichte-Check</a> einfügen.</strong> Er zeigt die häufigsten Wörter sowie Zwei- und Dreiwortgruppen mit Anzahl und Dichte.</li>
<li><strong>Die Top-Begriffe ansehen:</strong> Ihr Thema sollte weit oben stehen. Stehen dort vor allem Füllwörter wie „einfach“ oder „kostenlos“, ist der Text unschärfer als gedacht.</li>
<li><strong>Wortgruppen prüfen:</strong> Zweier- und Dreiergruppen zeigen Wiederholungen, die einzelne Wörter verbergen.</li>
</ol>
<p>Die Gesamtlänge und Zeichenzahl sehen Sie im <a href="/de/woerter-zaehlen">Wortzähler</a>. Wie Sie Wörter direkt in Word oder Google Docs zählen, steht in <a href="/de/ratgeber/woerter-zaehlen-word-google-docs-pdf">Wörter zählen in Word, Google Docs und PDF</a>.</p>

<h2>Häufige Fragen</h2>
<h3>Ist 1 % Keyworddichte gut?</h3>
<p>Das ist ein normaler, natürlicher Wert für eine fokussierte Seite, aber kein Ziel. Seiten ranken auch deutlich darüber oder darunter.</p>
<h3>Beeinflusst die Keyworddichte das Ranking?</h3>
<p>Nicht als eigener Rankingfaktor. Fehlt der Begriff ganz, kann das Thema unklar bleiben. Extreme Wiederholung kann als Keyword-Stuffing gewertet werden.</p>
<h3>Zählen Füllwörter zur Gesamtzahl?</h3>
<p>Bei den meisten Tools ja. Wörter wie „der“, „und“ oder „ist“ gehören zur Gesamtzahl. Deshalb weichen Werte verschiedener Tools voneinander ab.</p>
`,
};
