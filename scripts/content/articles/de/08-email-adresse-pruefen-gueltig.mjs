export default {
  slug: 'email-adresse-pruefen-gueltig',
  title: 'E-Mail-Adresse prüfen: gültig, ungültig oder Wegwerf-Adresse?',
  category: 'technology',
  theme: 'dev',
  tags: ['email adresse prüfen', 'e-mail-adresse überprüfen', 'email validierung', 'gültige email adresse', 'email adresse testen', 'wegwerf email erkennen'],
  description: 'So prüfen Sie, ob eine E-Mail-Adresse gültig ist: Aufbau und Regeln, die vier Prüfstufen von der Syntax bis zum Postfach, typische Tippfehler und warum das Double-Opt-in unverzichtbar bleibt.',
  cover: {
    kicker: 'Syntax, Domain, Postfach: vier Prüfstufen',
    visual: { type: 'checklist', items: ['Genau ein @-Zeichen', 'Domain mit Punkt', 'Keine Leerzeichen', 'Domain empfängt Mails', 'Kein Tippfehler'] },
  },
  infographic: {
    type: 'table',
    title: 'Die vier Stufen der E-Mail-Prüfung',
    subtitle: 'Jede Stufe findet Fehler, die die vorherige übersieht. Sicher ist nur die letzte.',
    columns: ['Stufe', 'Was geprüft wird', 'Findet', 'Findet nicht'],
    widths: [210, 290, 280, 276],
    rows: [
      ['1. Syntax', 'Aufbau name@domain.tld', 'Leerzeichen, fehlendes @', 'Tippfehler in Domains'],
      ['2. Domain', 'Mailserver (MX) vorhanden?', 'Erfundene Domains', 'Echte, falsche Domains'],
      ['3. Auffälligkeiten', 'Tippfehler, Wegwerf-Dienste', 'gmial.com, Einmal-Adressen', 'Fremde, echte Adressen'],
      ['4. Bestätigung', 'Link in einer Mail klicken', 'Alles, auch fremde Adressen', 'Nichts, kostet nur Zeit'],
    ],
    alt: 'Tabelle mit den vier Stufen der E-Mail-Prüfung: Syntax, Domain, Auffälligkeiten und Bestätigung per Link, jeweils mit dem, was sie findet und nicht findet',
    caption: 'Eine formal gültige Adresse ist noch lange keine erreichbare Adresse.',
    footer: 'Direkt prüfen: talkandtool.com/de/email-adressen-pruefen',
  },
  html: `
<p>Eine E-Mail-Adresse ist formal gültig, wenn sie genau ein @-Zeichen enthält, links davon einen erlaubten lokalen Teil und rechts eine Domain mit mindestens einem Punkt. Ob die Adresse auch erreichbar ist, zeigt aber erst eine Bestätigungs-Mail. Dazwischen liegen vier Prüfstufen, und jede findet andere Fehler.</p>

<h2>Wie eine E-Mail-Adresse aufgebaut ist</h2>
<p>Eine Adresse besteht aus drei Teilen: <strong>lokaler Teil</strong> (vor dem @), das <strong>@-Zeichen</strong> und die <strong>Domain</strong> (dahinter). In <em>anna.mueller@beispiel.de</em> ist „anna.mueller“ der lokale Teil und „beispiel.de“ die Domain mit der Endung „.de“.</p>
<p>Diese Regeln gelten in der Praxis:</p>
<ul>
<li>Genau ein @-Zeichen, nie zwei.</li>
<li>Keine Leerzeichen, keine Kommas, keine Klammern.</li>
<li>Der lokale Teil darf höchstens 64 Zeichen lang sein, die gesamte Adresse höchstens 254.</li>
<li>Erlaubt sind Buchstaben, Ziffern und Zeichen wie Punkt, Bindestrich, Unterstrich und Plus. Ein Punkt darf nicht am Anfang oder Ende stehen und nicht doppelt vorkommen.</li>
<li>Die Domain enthält mindestens einen Punkt und eine Endung, zum Beispiel „.de“ oder „.com“.</li>
<li>Umlaute im lokalen Teil sind technisch möglich, werden aber von vielen Systemen nicht akzeptiert. Nutzen Sie lieber „mueller“ statt „müller“.</li>
</ul>

{{infographic}}

<h2>Stufe 1: Die Syntax prüfen</h2>
<p>Die einfachste Prüfung stellt fest, ob die Adresse dem Muster entspricht. Sie fängt Leerzeichen am Ende, ein vergessenes @ oder eine Eingabe wie „anna@beispiel“ ab. Der <a href="/de/email-adressen-pruefen">E-Mail-Adressen-Prüfer</a> macht genau das im Browser, ohne dass die Adresse irgendwohin gesendet wird. Wer eine Adresse regelmäßig per Hand kontrolliert, kommt damit schon weit. Für ein Formular reicht die Syntax-Prüfung allein jedoch nicht aus, weil sie keine Aussage über das Postfach macht.</p>

<h2>Stufe 2: Existiert die Domain?</h2>
<p>Eine Domain kann nur Post empfangen, wenn sie einen Mailserver hat. Dafür gibt es im Domain Name System einen eigenen Eintrag, den MX-Eintrag. Fehlt er und fehlt auch ein einfacher Adress-Eintrag, kann an diese Domain nichts zugestellt werden. „anna@gibt-es-nicht-123.de“ besteht die Syntax-Prüfung, aber nicht die Domain-Prüfung. Diese Abfrage braucht einen Server, sie lässt sich nicht allein in einer Webseite ausführen.</p>

<h2>Stufe 3: Tippfehler und Wegwerf-Adressen</h2>
<p>Häufiger als erfundene Domains sind Vertipper bei echten Anbietern. Typische Fälle:</p>
<ul>
<li><strong>gmial.com</strong>, <strong>gmal.com</strong> oder <strong>gmail.de</strong> statt gmail.com</li>
<li><strong>gmx.con</strong> oder <strong>gmx.det</strong> statt gmx.de</li>
<li><strong>web.dee</strong> oder <strong>t-onlin.de</strong> statt web.de und t-online.de</li>
<li><strong>hotmal.com</strong> statt hotmail.com</li>
</ul>
<p>Viele Formulare vergleichen deshalb die Domain mit einer Liste bekannter Anbieter und fragen nach: „Meinten Sie gmail.com?“ Das fängt einen großen Teil der Fehleingaben ab. Dazu kommen <strong>Wegwerf-Adressen</strong>, die für wenige Minuten oder Stunden existieren und danach verschwinden. Sie sind syntaktisch korrekt und für kurze Zeit sogar erreichbar. Wer E-Mail-Marketing betreibt, sollte sie ausschließen, weil sich dahinter keine Kunden verbergen, die man später erreichen kann.</p>

<h2>Stufe 4: Das Postfach bestätigen</h2>
<p>Ob hinter einer Adresse wirklich eine Person steht, die Post lesen will, erfahren Sie nur, wenn sie eine Nachricht erhält und darauf reagiert. Deshalb gilt das <strong>Double-Opt-in</strong> in Deutschland als Standardverfahren für Newsletter: Die Anmeldung löst eine Mail mit einem Bestätigungslink aus, erst danach ist die Adresse aktiv. Das verhindert, dass jemand fremde Adressen einträgt, und liefert zugleich einen Nachweis über die Einwilligung. Nur diese Stufe schützt vor Adressen, die richtig geschrieben, aber nicht die eigenen sind.</p>
<p>Versuche, ein Postfach ohne Bestätigung abzufragen, zum Beispiel durch Verbindungsaufbau zum Mailserver, sind unzuverlässig. Viele Anbieter beantworten solche Anfragen absichtlich nicht eindeutig, damit niemand gültige Adressen sammeln kann. Verlassen Sie sich nicht darauf.</p>

<h2>Wann welche Prüfung sinnvoll ist</h2>
<ul>
<li><strong>Kontaktformular:</strong> Syntax-Prüfung plus Tippfehler-Hinweis. Das Postfach muss nicht bestätigt werden, solange Sie nur antworten.</li>
<li><strong>Newsletter und Marketing:</strong> alle vier Stufen, vor allem das Double-Opt-in.</li>
<li><strong>Konto-Registrierung:</strong> Bestätigungs-Mail, denn Sie benötigen sie für die Passwort-Wiederherstellung.</li>
<li><strong>Bestehende Adressliste bereinigen:</strong> Syntax und Domain prüfen, Tippfehler korrigieren, dann Bounces auswerten. Wiederholt abgewiesene Adressen gehören aus der Liste.</li>
</ul>

<h2>Wie Sie eine einzelne Adresse schnell prüfen</h2>
<ol>
<li>Sehen Sie nach Leerzeichen am Anfang und Ende, besonders nach dem Einfügen aus einer Tabelle.</li>
<li>Zählen Sie die @-Zeichen. Es muss genau eines sein.</li>
<li>Lesen Sie die Domain laut: gmail.com, gmx.de, web.de, t-online.de, outlook.de.</li>
<li>Geben Sie die Adresse in den <a href="/de/email-adressen-pruefen">Prüfer</a> ein und achten Sie auf die Meldung.</li>
<li>Wenn es wichtig ist, schicken Sie eine Test-Mail oder einen Bestätigungslink.</li>
</ol>

<h2>Häufige Fragen</h2>
<h3>Kann eine gültige Adresse trotzdem nicht funktionieren?</h3>
<p>Ja. Eine Adresse kann formal korrekt sein und dennoch nirgends hinführen, etwa wenn das Postfach gelöscht wurde, voll ist oder nie existiert hat.</p>
<h3>Darf eine E-Mail-Adresse Großbuchstaben enthalten?</h3>
<p>Ja, in der Praxis spielt die Schreibweise des lokalen Teils fast nie eine Rolle, und die Domain ist ohnehin nicht groß- und kleinschreibungsabhängig. Üblich ist durchgängig Kleinschreibung.</p>
<h3>Wie viele Zeichen darf eine E-Mail-Adresse haben?</h3>
<p>Insgesamt höchstens 254 Zeichen, davon höchstens 64 vor dem @-Zeichen.</p>
<h3>Werden die geprüften Adressen gespeichert?</h3>
<p>Beim Prüfer auf dieser Seite nicht. Die Prüfung läuft lokal in Ihrem Browser, die Adresse wird nicht übertragen.</p>
`,
};
