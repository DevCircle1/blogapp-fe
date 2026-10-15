export default {
  slug: 'kalorienbedarf-berechnen-formel',
  title: 'Kalorienbedarf berechnen: Grundumsatz und PAL-Wert erklärt',
  translationKey: 'calorie-needs',
  category: 'health',
  theme: 'health',
  tags: ['kalorienbedarf berechnen', 'grundumsatz berechnen', 'leistungsumsatz', 'pal wert', 'mifflin st jeor', 'kaloriendefizit'],
  description: 'Kalorienbedarf berechnen in drei Schritten: Grundumsatz nach Mifflin-St Jeor, PAL-Wert für Ihren Alltag und das passende Defizit zum Abnehmen. Mit Rechenbeispiel.',
  cover: {
    kicker: 'Grundumsatz × PAL-Wert = Gesamtbedarf',
    visual: {
      type: 'formula',
      title: 'Beispiel: Frau, 35 Jahre, 70 kg, 168 cm',
      lines: ['10×70 + 6,25×168', '− 5×35 − 161', '= 1.414 kcal', '× 1,55 = 2.192 kcal'],
    },
  },
  infographic: {
    type: 'table',
    title: 'PAL-Werte für typische Tagesabläufe',
    subtitle: 'Der PAL-Wert (Physical Activity Level) multipliziert den Grundumsatz zum Gesamtbedarf.',
    columns: ['Alltag', 'PAL', 'Beispiel'],
    widths: [440, 140, 476],
    rows: [
      ['Fast nur sitzend, kaum Bewegung', '1,2', 'Büro, Auto, wenig Sport'],
      ['Leicht aktiv', '1,375', 'Büro + 1–3× Sport pro Woche'],
      ['Mäßig aktiv', '1,55', '3–5× Sport pro Woche'],
      ['Sehr aktiv', '1,725', 'Täglich Sport oder Stehberuf'],
      ['Extrem aktiv', '1,9', 'Körperliche Arbeit + Training'],
    ],
    alt: 'Tabelle der PAL-Werte von 1,2 für sitzende Tätigkeit bis 1,9 für körperliche Arbeit mit Training',
    caption: 'Die meisten Menschen überschätzen ihre Aktivität. Im Zweifel den niedrigeren Wert wählen.',
    footer: 'Eigenen Bedarf berechnen: talkandtool.com/de/kalorienbedarf-rechner',
  },
  html: `
<p>Ihren Kalorienbedarf berechnen Sie in zwei Schritten: Zuerst den <strong>Grundumsatz</strong>, also was Ihr Körper in völliger Ruhe verbraucht, dann multiplizieren Sie ihn mit dem <strong>PAL-Wert</strong> für Ihre Alltagsaktivität. Das Ergebnis ist der Gesamtumsatz: die Kalorienmenge, bei der Ihr Gewicht stabil bleibt. Wer abnehmen will, zieht davon ein moderates Defizit ab.</p>
<p><em>Die Formeln liefern Schätzwerte für gesunde Erwachsene. Bei Schwangerschaft, Erkrankungen oder Essstörungen gehört die Planung in ärztliche Hände.</em></p>

<h2>Schritt 1: Grundumsatz berechnen</h2>
<p>Die heute am häufigsten empfohlene Formel ist die von <strong>Mifflin-St Jeor</strong> (1990). Sie gilt in Studien als genauer als die ältere Harris-Benedict-Formel:</p>
<ul>
<li><strong>Männer:</strong> 10 × Gewicht (kg) + 6,25 × Größe (cm) − 5 × Alter (Jahre) + 5</li>
<li><strong>Frauen:</strong> 10 × Gewicht (kg) + 6,25 × Größe (cm) − 5 × Alter (Jahre) − 161</li>
</ul>
<p><strong>Beispiel:</strong> Eine 35-jährige Frau, 70 kg, 168 cm: 700 + 1.050 − 175 − 161 = <strong>1.414 kcal</strong> Grundumsatz.</p>

<h2>Schritt 2: Mit dem PAL-Wert multiplizieren</h2>
<p>Der PAL-Wert beschreibt, wie aktiv Ihr Alltag insgesamt ist, nicht nur das Training. Die folgende Tabelle hilft bei der Einordnung:</p>

{{infographic}}

<p>Im Beispiel trainiert die Frau dreimal pro Woche und arbeitet im Büro. Mit PAL 1,55 ergibt sich: 1.414 × 1,55 = <strong>2.192 kcal</strong> pro Tag. Bei dieser Menge hält sie ihr Gewicht ungefähr.</p>

<h2>Schritt 3: Defizit oder Überschuss festlegen</h2>
<p>Ein Kilogramm Körperfett entspricht grob 7.000 kcal. Ein tägliches Defizit von 300 bis 500 kcal führt so zu etwa 0,3 bis 0,5 kg Gewichtsverlust pro Woche, ein Tempo, das sich meist durchhalten lässt, ohne dass Muskelmasse und Leistungsfähigkeit stark leiden.</p>
<ul>
<li><strong>Abnehmen:</strong> Gesamtbedarf − 300 bis 500 kcal (im Beispiel ca. 1.700–1.900 kcal)</li>
<li><strong>Gewicht halten:</strong> Gesamtbedarf</li>
<li><strong>Muskelaufbau:</strong> Gesamtbedarf + 200 bis 300 kcal</li>
</ul>
<p>Essen Sie dauerhaft nicht unter Ihrem Grundumsatz, ohne das ärztlich abzusprechen.</p>

<h2>Wie genau ist das Ergebnis?</h2>
<p>Formeln schätzen den Durchschnitt. Der tatsächliche Verbrauch einzelner Menschen kann um 10 % oder mehr abweichen. Behandeln Sie das Ergebnis deshalb als Startwert: Essen Sie zwei bis drei Wochen lang die berechnete Menge, wiegen Sie sich mehrmals pro Woche unter gleichen Bedingungen und passen Sie dann um 100 bis 200 kcal an. Ihr Körpergewicht ist das genaueste Messgerät.</p>

<h2>Was den Bedarf zusätzlich verändert</h2>
<p>Mehrere Faktoren verschieben den Bedarf, ohne dass die Formel sie kennt:</p>
<ul>
<li><strong>Muskelmasse:</strong> Bei gleichem Gewicht verbraucht ein muskulöser Mensch mehr als jemand mit hohem Körperfettanteil. Sportliche Menschen liegen deshalb oft über dem berechneten Wert.</li>
<li><strong>Abnehmen selbst:</strong> Mit jedem verlorenen Kilogramm sinkt auch der Bedarf. Rechnen Sie nach etwa fünf Kilogramm neu.</li>
<li><strong>Alter:</strong> Der Grundumsatz sinkt in der Formel um 5 kcal pro Lebensjahr, also um 50 kcal pro Jahrzehnt.</li>
<li><strong>Schritte im Alltag:</strong> Spaziergänge, Treppen und Hausarbeit machen oft mehr aus als zwei Trainingseinheiten pro Woche.</li>
</ul>

<h2>Grundumsatz, Leistungsumsatz, Gesamtumsatz: die Begriffe</h2>
<ul>
<li><strong>Grundumsatz:</strong> Energie für Atmung, Herzschlag, Organe und Körpertemperatur in Ruhe.</li>
<li><strong>Leistungsumsatz:</strong> zusätzliche Energie für Bewegung, Arbeit, Sport und Verdauung.</li>
<li><strong>Gesamtumsatz:</strong> Grundumsatz plus Leistungsumsatz; das, was der PAL-Wert berechnet.</li>
</ul>

<h2>Von den Kalorien zu den Makros</h2>
<p>Wenn der Kalorienbedarf steht, lohnt sich ein Blick auf die Verteilung. Eiweiß hilft beim Abnehmen besonders, weil es sättigt und Muskeln schützt; üblich sind 1,6 bis 2 g pro kg Körpergewicht. Der <a href="/de/makro-rechner">Makro-Rechner</a> teilt Ihre Kalorien in Eiweiß, Fett und Kohlenhydrate auf. Ob Ihr Zielgewicht realistisch ist, zeigen der <a href="/de/bmi-rechner">BMI-Rechner</a> und der <a href="/de/idealgewicht-rechner">Idealgewicht-Rechner</a>, und wie viel Sie trinken sollten, der <a href="/de/wasserbedarf-rechner">Wasserbedarf-Rechner</a>.</p>
<p>Am schnellsten geht es mit dem <a href="/de/kalorienbedarf-rechner">Kalorienbedarf-Rechner</a>: Werte eingeben, Aktivität wählen, Ergebnis für Abnehmen, Halten und Zunehmen ablesen.</p>

<h2>Häufige Fragen</h2>
<h3>Wie viele Kalorien brauche ich am Tag?</h3>
<p>Erwachsene Frauen liegen meist zwischen 1.800 und 2.400 kcal, Männer zwischen 2.200 und 3.000 kcal. Der persönliche Wert hängt von Gewicht, Größe, Alter und Aktivität ab und lässt sich mit der Formel oben berechnen.</p>
<h3>Soll ich Trainingskalorien zusätzlich essen?</h3>
<p>Nicht, wenn Ihr Training bereits im PAL-Wert steckt. Sonst zählen Sie es doppelt, und Fitnessuhren überschätzen den Verbrauch beim Sport ohnehin häufig.</p>
<h3>Warum nehme ich trotz Defizit nicht ab?</h3>
<p>Meist wird die Kalorienaufnahme unterschätzt oder die Aktivität überschätzt. Wassereinlagerungen können Fortschritte zudem zwei bis drei Wochen lang verdecken. Messen Sie über mehrere Wochen und passen Sie dann an.</p>
`,
};
