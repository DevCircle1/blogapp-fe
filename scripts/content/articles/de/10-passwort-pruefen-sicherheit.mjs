export default {
  slug: 'passwort-pruefen-sicherheit',
  title: 'Passwort prüfen: Wie sicher ist Ihr Passwort wirklich?',
  category: 'technology',
  theme: 'dev',
  tags: ['passwort prüfen', 'passwortstärke prüfen', 'sicheres passwort', 'passwort länge', 'passwort knacken dauer', 'passphrase'],
  description: 'Länge schlägt Sonderzeichen: Warum 16 Kleinbuchstaben sicherer sind als 8 gemischte Zeichen, wie viele Kombinationen möglich sind, wie lange ein Angriff dauern kann und was Sie wirklich tun sollten.',
  cover: {
    kicker: 'Länge schlägt Komplexität',
    visual: { type: 'formula', title: 'KOMBINATIONEN', lines: ['26 ^ 8  =  2,1 × 10¹¹', '94 ^ 8  =  6,1 × 10¹⁵', '26 ^ 16  =  4,4 × 10²²', '7776 ^ 4  =  3,7 × 10¹⁵'] },
  },
  infographic: {
    type: 'table',
    title: 'Wie viele Kombinationen hat ein Passwort?',
    subtitle: 'Annahme: ein Angreifer probiert 10 Milliarden Passwörter pro Sekunde, etwa bei einem gestohlenen Hash.',
    columns: ['Passwort-Typ', 'Kombinationen', 'Dauer bei 10 Mrd./s'],
    widths: [440, 280, 336],
    rows: [
      ['8 Kleinbuchstaben', '2,1 × 10¹¹', 'etwa 21 Sekunden'],
      ['8 Zeichen, alle Tasten (94)', '6,1 × 10¹⁵', 'etwa 7 Tage'],
      ['4 zufällige Wörter (Diceware)', '3,7 × 10¹⁵', 'etwa 4 Tage'],
      ['16 Kleinbuchstaben', '4,4 × 10²²', 'etwa 138.000 Jahre'],
      ['6 zufällige Wörter (Diceware)', '2,2 × 10²³', 'etwa 700.000 Jahre'],
    ],
    alt: 'Tabelle mit der Zahl möglicher Kombinationen und der Angriffsdauer bei zehn Milliarden Versuchen pro Sekunde für fünf Passwort-Typen',
    caption: 'Jedes zusätzliche Zeichen multipliziert den Aufwand, die Wahl der Zeichen erhöht ihn nur wenig.',
    footer: 'Passwort-Stärke prüfen: talkandtool.com/de/passwortstaerke-pruefen',
  },
  html: `
<p>Ein Passwort ist sicher, wenn es lang, zufällig und nirgendwo sonst verwendet wird. Die Länge ist dabei wichtiger als Sonderzeichen: Ein zufälliges Passwort mit 16 Kleinbuchstaben ist rund 7 Millionen Mal schwerer zu erraten als eines mit 8 Zeichen aus allen Tastenarten. Entscheidend ist außerdem, dass es nicht aus einer Leak-Liste stammt.</p>

<h2>Warum Länge wichtiger ist als Komplexität</h2>
<p>Die Zahl der möglichen Passwörter ist <strong>Zeichenvorrat hoch Länge</strong>. Ein Passwort aus 8 Kleinbuchstaben hat 26⁸, also rund 209 Milliarden Möglichkeiten. Nimmt man Groß- und Kleinbuchstaben, Ziffern und Sonderzeichen hinzu (etwa 94 Tasten), sind es bei 8 Zeichen 94⁸, rund 6,1 Billiarden. Das ist 29.000-mal mehr. Verlängert man aber das reine Kleinbuchstaben-Passwort auf 16 Zeichen, erhält man 26¹⁶, rund 4,4 × 10²², und liegt weit über allem, was 8 Zeichen leisten. Jedes zusätzliche Zeichen vervielfacht den Aufwand, ein größerer Zeichenvorrat steigert ihn nur um einen kleinen Faktor.</p>

{{infographic}}

<h2>Was die Tabelle bedeutet, und was nicht</h2>
<p>Die Zeiten in der Tabelle gehen von einem schnellen <strong>Offline-Angriff</strong> aus: Jemand hat die gespeicherten Passwort-Hashes eines Dienstes erbeutet und probiert sie mit viel Rechenleistung durch, hier mit 10 Milliarden Versuchen pro Sekunde. Das ist eine Annahme, keine Messung, und sie hängt stark davon ab, wie der Dienst Passwörter speichert. Gut gesicherte Dienste verwenden langsame Verfahren, die diese Rate um viele Größenordnungen senken. Bei einem Login-Formular im Netz sind es dagegen nur wenige Versuche pro Sekunde, bevor die Sperre greift. Nehmen Sie die Zahlen als Vergleich zwischen den Passwort-Typen, nicht als Prognose für eine bestimmte Situation.</p>

<h2>Menschen sind schlechter im Zufall als Computer</h2>
<p>Die Berechnung gilt nur für <strong>zufällig</strong> gewählte Passwörter. Wählen Menschen selbst, entstehen Muster: ein Wort mit großem Anfangsbuchstaben, eine Ziffer, ein Ausrufezeichen am Ende, zum Beispiel „Sommer2026!“. Angreifer probieren zuerst Wörterbücher, Namen, Jahreszahlen und bekannte Abwandlungen wie „a“ zu „@“ und „s“ zu „$“. Ein solches Passwort fällt in Sekunden, obwohl es auf dem Papier „komplex“ aussieht. Der Fehler liegt nicht in der Länge, sondern darin, dass es nicht zufällig ist.</p>

<h2>Passphrase: lang und merkbar</h2>
<p>Eine Passphrase besteht aus mehreren zufällig gewählten Wörtern. Bei der Diceware-Methode wird jedes Wort aus einer Liste mit 7.776 Einträgen gewürfelt. Vier Wörter ergeben 7.776⁴, rund 3,7 Billiarden Möglichkeiten, sechs Wörter rund 2,2 × 10²³. Das merken Sie sich leichter als „x7#Qp!2L“ und es ist viel länger. Wichtig ist, dass die Wörter wirklich zufällig sind. Ein Zitat oder ein Liedtext ist keine Passphrase, weil er nicht zufällig ist.</p>

<h2>Was wirklich schützt</h2>
<ol>
<li><strong>Für jeden Dienst ein eigenes Passwort.</strong> Wiederverwendung ist das größte Risiko: Wird ein Dienst gehackt, probieren Angreifer die erbeuteten Zugangsdaten automatisch bei anderen aus.</li>
<li><strong>Einen Passwortmanager nutzen.</strong> Er erzeugt lange Zufallspasswörter und merkt sie sich. Sie müssen nur ein starkes Hauptpasswort behalten. Auch das Bundesamt für Sicherheit in der Informationstechnik (BSI) empfiehlt Passwortmanager.</li>
<li><strong>Zwei-Faktor-Authentisierung aktivieren</strong>, besonders für E-Mail, Banking und Cloud-Speicher. Selbst ein erbeutetes Passwort reicht dann nicht aus.</li>
<li><strong>Nicht regelmäßig ändern ohne Anlass.</strong> Aktuelle Richtlinien wie NIST SP 800-63B raten vom Zwangswechsel ab und empfehlen stattdessen, neue Passwörter gegen Listen bekannter Leaks zu prüfen. Ändern Sie ein Passwort, wenn es kompromittiert sein könnte.</li>
<li><strong>Passwörter nicht notieren, wo andere sie finden</strong>, und nicht per Chat oder E-Mail versenden.</li>
</ol>

<h2>So prüfen Sie ein Passwort</h2>
<p>Ein Passwort-Prüfer schätzt anhand von Länge, Zeichenvielfalt und typischen Mustern, wie schwer es zu erraten ist. Das ist nützlich, um schwache Muster zu erkennen, etwa Namen, Tastaturfolgen („qwertz“) oder Jahreszahlen. Der <a href="/de/passwortstaerke-pruefen">Passwort-Stärke-Prüfer</a> läuft komplett in Ihrem Browser, das Passwort wird nicht übertragen. Trotzdem gilt: Geben Sie nie Ihr echtes, aktuell genutztes Passwort in ein Online-Werkzeug ein, dessen Betreiber Sie nicht kennen. Testen Sie lieber ein Passwort derselben Bauart.</p>
<p>Beachten Sie auch, dass kein Prüfer weiß, ob ein Passwort schon in einem Datenleck veröffentlicht wurde. Ein Passwort, das in einer Leak-Liste steht, ist unsicher, auch wenn es lang und scheinbar zufällig wirkt.</p>

<h2>Beispiele für typische Fehler</h2>
<ul>
<li><strong>Name plus Zahl:</strong> „Lena1998“ steht in jedem Wörterbuch-Angriff.</li>
<li><strong>Tastaturmuster:</strong> „1qay2wsx“ wirkt zufällig, ist aber bekannt.</li>
<li><strong>Kleine Abwandlung:</strong> „Passw0rd!“ ist nicht stärker als „Passwort“.</li>
<li><strong>Dasselbe Passwort mit Zählern:</strong> „Shop1“, „Shop2“ für verschiedene Dienste.</li>
</ul>

<h2>Häufige Fragen</h2>
<h3>Wie lang sollte ein Passwort sein?</h3>
<p>Für Konten, die Sie sich merken müssen, sind 14 bis 16 Zeichen oder eine Passphrase aus mindestens vier zufälligen Wörtern ein guter Wert. Im Passwortmanager darf es länger sein.</p>
<h3>Sind Sonderzeichen Pflicht?</h3>
<p>Nein. Sie helfen nur wenig, wenn das Passwort kurz ist. Länge und Zufälligkeit zählen mehr. Manche Dienste verlangen sie trotzdem, dann halten Sie sich daran.</p>
<h3>Ist ein Passwort mit 12 Zeichen sicher genug?</h3>
<p>Wenn es zufällig erzeugt wurde, ja für die meisten Zwecke. Ein selbst ausgedachtes Passwort mit 12 Zeichen ist dagegen oft viel schwächer, als es aussieht.</p>
<h3>Wie lange dauert es, ein Passwort zu knacken?</h3>
<p>Das hängt von Passwort, Speicherverfahren und Angreifer ab. Die Tabelle oben zeigt Größenordnungen unter einer festen Annahme. Eine Garantie gibt es nicht.</p>
`,
};
