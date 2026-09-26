export default {
  slug: 'calcular-fecha-probable-de-parto',
  title: 'Cómo calcular la fecha probable de parto (con ejemplos)',
  translationKey: 'due-date-from-last-period',
  category: 'health',
  theme: 'health',
  tags: ['fecha probable de parto', 'calcular fecha de parto', 'regla de naegele', 'semanas de embarazo', 'calculadora de embarazo', 'fum'],
  description: 'La fecha probable de parto es la fecha de tu última regla más 280 días. Te explicamos la regla de Naegele, cómo ajustarla a tu ciclo y cómo contar las semanas.',
  cover: {
    kicker: 'Última regla + 280 días',
    visual: { type: 'calendar', title: 'Diciembre 2026', offset: 1, days: 31, highlight: [15], range: [8, 22], weekdays: ['L', 'M', 'X', 'J', 'V', 'S', 'D'] },
  },
  infographic: {
    type: 'table',
    title: 'Cuatro formas de calcular la fecha de parto',
    subtitle: 'Ejemplo con una fecha de última menstruación (FUM) del 10 de marzo de 2026, salvo que se indique otra cosa.',
    columns: ['Método', 'Cálculo', 'Fecha probable'],
    widths: [330, 430, 296],
    rows: [
      ['Contar 280 días', 'FUM + 280 días', '15 de diciembre de 2026'],
      ['Regla de Naegele', '+7 días, −3 meses, +1 año', '17 de diciembre de 2026'],
      ['Ciclo de 35 días', 'FUM + 280 + (35 − 28) días', '22 de diciembre de 2026'],
      ['Fecha de concepción', 'Concepción + 266 días', 'Según la fecha'],
      ['Ecografía temprana', 'Medida del embrión', 'Puede corregir la FUM'],
    ],
    alt: 'Tabla que compara cuatro métodos para calcular la fecha probable de parto con una última regla del 10 de marzo de 2026',
    caption: 'La regla de Naegele y el recuento de días pueden diferir en uno o dos días por la distinta duración de los meses.',
    footer: 'Calcula la tuya: talkandtool.com/es/calculadora-fecha-de-parto',
  },
  html: `
<p>La fecha probable de parto (FPP) se calcula sumando 280 días, es decir, 40 semanas, al primer día de tu última menstruación (FUM). Si tu última regla empezó el 10 de marzo de 2026, la fecha probable de parto es el 15 de diciembre de 2026. Aquí tienes el cálculo, la regla rápida de Naegele, cómo ajustarla si tu ciclo no es de 28 días y cómo saber de cuántas semanas estás.</p>

<p><em>Esta guía explica cómo se estima la fecha de parto y no sustituye el control de tu matrona, ginecólogo o ginecóloga, que confirmará la fecha, normalmente con una ecografía.</em></p>

<h2>Por qué se cuenta desde la última regla</h2>
<p>El embarazo se cuenta desde el primer día de la última menstruación, no desde la concepción, porque casi nadie sabe el día exacto de la concepción, pero sí cuándo empezó su regla. En un ciclo de 28 días, la ovulación ocurre unas dos semanas después. Por eso, en la «semana 4» de embarazo el embrión tiene en realidad unas dos semanas.</p>

<h2>Método 1: sumar 280 días</h2>
<p>Parte del primer día de la última regla y suma 280 días. Desde el 10 de marzo de 2026: quedan 21 días de marzo, y de abril a noviembre se suman 244 días más, hasta llegar a 265 el 30 de noviembre. Con 15 días más llegamos al <strong>15 de diciembre de 2026</strong>. Es lo que hacen las calculadoras y las ruedas obstétricas.</p>

<h2>Método 2: la regla de Naegele</h2>
<p>Para calcularla de cabeza: al primer día de la última regla <strong>súmale 7 días, réstale 3 meses y súmale 1 año</strong>. Desde el 10 de marzo de 2026: +7 días = 17 de marzo; −3 meses = 17 de diciembre de 2025; +1 año = <strong>17 de diciembre de 2026</strong>.</p>
<p>Son dos días más que con el recuento exacto. Como los meses tienen distinta duración, la regla puede desviarse uno o dos días. Para una estimación rápida da igual. Para planificar, usa el recuento de días.</p>

{{infographic}}

<h2>Si tu ciclo no dura 28 días</h2>
<p>Las dos reglas suponen un ciclo de 28 días con ovulación hacia el día 14. Si tus ciclos son regularmente más largos o más cortos, la ovulación se desplaza, y la fecha también:</p>
<ul>
<li><strong>Ciclos más largos:</strong> suma los días de diferencia. Con ciclos de 35 días, suma 7: la fecha pasa al 22 de diciembre de 2026.</li>
<li><strong>Ciclos más cortos:</strong> resta la diferencia. Con ciclos de 25 días, resta 3.</li>
</ul>
<p>Si tus ciclos son irregulares, la fecha calculada por la regla es menos fiable, y la ecografía temprana pasa a ser la referencia principal.</p>

<h2>Si conoces la fecha de concepción</h2>
<ul>
<li><strong>Concepción conocida:</strong> fecha de concepción + 266 días (38 semanas).</li>
<li><strong>FIV con transferencia en día 5 (blastocisto):</strong> fecha de transferencia + 261 días.</li>
<li><strong>FIV con transferencia en día 3:</strong> fecha de transferencia + 263 días.</li>
</ul>
<p>La <a href="/es/calculadora-fecha-de-parto">calculadora de fecha probable de parto</a> admite tanto la última regla como la fecha de concepción, y muestra las semanas de gestación y los trimestres.</p>

<h2>¿De cuántas semanas estoy?</h2>
<p>Cuenta los días desde el primer día de la última regla hasta hoy y divide entre 7. El número entero son las semanas completas y el resto, los días. Del 10 de marzo al 27 de septiembre de 2026 hay 201 días: <strong>28 semanas y 5 días</strong>, que en los informes se escribe 28+5. Para contar los días entre dos fechas puedes usar <a href="/es/calcular-dias-entre-fechas">calcular días entre fechas</a>. Para sumar semanas a una fecha, <a href="/es/sumar-dias-a-una-fecha">sumar días a una fecha</a>.</p>

<h2>¿Qué precisión tiene la fecha probable de parto?</h2>
<p>Es una estimación del punto medio, no una fecha límite. Solo una minoría de los bebés, a menudo se cita un 4–5 %, nace exactamente ese día. La mayoría nace en las dos semanas anteriores o posteriores. Se considera embarazo a término a partir de la semana 37, y prolongado a partir de la 42.</p>
<p>La <strong>ecografía del primer trimestre</strong> mide la longitud cráneo-caudal del embrión y es muy precisa para datar el embarazo. Si la fecha de la ecografía difiere claramente de la calculada por la última regla, lo habitual es corregir la fecha según la ecografía. Las ecografías posteriores ya no la suelen cambiar.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿La fecha de parto se calcula desde la concepción o desde la regla?</h3>
<p>Desde el primer día de la última regla. Por eso el embarazo dura 40 semanas «de calendario», aunque el bebé se desarrolla durante unas 38.</p>
<h3>¿Qué es la FUM?</h3>
<p>La fecha de la última menstruación: el primer día de tu última regla antes del embarazo. Es el punto de partida de todos los cálculos.</p>
<h3>¿Puede cambiar la fecha probable de parto?</h3>
<p>Normalmente solo una vez, tras la ecografía del primer trimestre. Después se mantiene, aunque las ecografías posteriores indiquen que el bebé es más grande o más pequeño que la media.</p>
`,
};
