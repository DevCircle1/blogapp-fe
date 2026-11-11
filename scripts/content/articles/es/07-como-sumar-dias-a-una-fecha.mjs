export default {
  slug: 'como-sumar-dias-a-una-fecha',
  title: 'Cómo sumar días a una fecha: Excel, calculadora y ejemplos',
  category: 'math',
  theme: 'math',
  tags: ['sumar días a una fecha', 'sumar dias a fecha excel', 'calcular fecha más días', 'fecha más 30 días', 'sumar días hábiles', 'calcular plazo'],
  description: 'Cómo sumar días a una fecha con ejemplos: días naturales, días hábiles y semanas, las fórmulas de Excel (suma directa, DIA.LAB y FECHA.MES) y los errores más comunes al contar plazos.',
  cover: {
    kicker: 'Días naturales, días hábiles y plazos',
    visual: { type: 'calendar', title: 'Diciembre 2026', offset: 1, days: 31, highlight: [11], range: [1, 11] },
  },
  infographic: {
    type: 'table',
    title: 'Fecha más días: cuatro ejemplos',
    subtitle: 'Resultados para 2026 y 2027. Los días hábiles cuentan de lunes a viernes, sin festivos.',
    columns: ['Fecha inicial', 'Operación', 'Resultado', 'Día'],
    widths: [260, 330, 262, 204],
    rows: [
      ['11/11/2026', '+ 30 días naturales', '11/12/2026', 'viernes'],
      ['11/11/2026', '+ 90 días naturales', '09/02/2027', 'martes'],
      ['23/12/2026', '+ 14 días naturales', '06/01/2027', 'miércoles'],
      ['16/11/2026', '+ 10 días hábiles', '30/11/2026', 'lunes'],
    ],
    alt: 'Tabla con cuatro ejemplos de fecha más días: 30 días naturales, 90 días naturales, 14 días que cruzan el fin de año y 10 días hábiles',
    caption: 'Los días hábiles se saltan sábados y domingos; los naturales no.',
    footer: 'Calcúlelo al instante: talkandtool.com/es/sumar-dias-a-una-fecha',
  },
  html: `
<p>Para sumar días a una fecha, cuente hacia delante desde la fecha inicial sin incluir el propio día de partida. El 11/11/2026 más 30 días es el 11/12/2026. Si se trata de días hábiles, se saltan los sábados y domingos, y en los plazos legales o contractuales hay que comprobar además cómo se cuentan los festivos.</p>

{{infographic}}

<h2>Días naturales, días hábiles y semanas</h2>
<p>Antes de calcular, aclare a qué se refiere el plazo, porque el resultado cambia mucho:</p>
<ul>
<li><strong>Días naturales:</strong> cuentan todos los días del calendario, también fines de semana y festivos. «En 30 días» suele significar días naturales.</li>
<li><strong>Días hábiles:</strong> normalmente de lunes a viernes, sin festivos. Los plazos de entrega, de administración o de reclamación suelen darse así. Algunos contratos cuentan el sábado; compruebe lo que dice el suyo.</li>
<li><strong>Semanas:</strong> una semana son siempre siete días naturales. Tres semanas después de un miércoles es otro miércoles.</li>
</ul>

<h2>Ejemplos con días naturales</h2>
<p>Empiece en la fecha inicial y avance día a día, pasando al mes siguiente cuando se acaba el actual:</p>
<ul>
<li>11/11/2026 + 30 días = <strong>11/12/2026</strong> (viernes).</li>
<li>11/11/2026 + 90 días = <strong>09/02/2027</strong> (martes).</li>
<li>23/12/2026 + 14 días = <strong>06/01/2027</strong>. Aquí cambian el mes y el año, y el día de la semana se mantiene porque 14 es múltiplo de 7.</li>
</ul>
<p>Un truco para comprobar el resultado: si el número de días es múltiplo de 7, el día de la semana no cambia. Con 30 días avanza dos días de la semana, porque 30 = 4 × 7 + 2.</p>

<h2>Ejemplo con días hábiles</h2>
<p>Se quiere saber qué fecha es 10 días hábiles después del lunes 16/11/2026. Cuente solo de lunes a viernes: martes 17, miércoles 18, jueves 19, viernes 20 (4 días), lunes 23, martes 24, miércoles 25, jueves 26, viernes 27 (9 días) y lunes 30 de noviembre (10 días). El resultado es el <strong>lunes 30/11/2026</strong>. Si hay un festivo entre medias, el resultado se retrasa un día más. Los festivos varían según el país y la región, así que revíselos para su caso. La <a href="/es/calculadora-dias-habiles">calculadora de días hábiles</a> evita el recuento a mano.</p>

<h2>Cómo sumar días a una fecha en Excel</h2>
<p>Excel guarda las fechas como números de serie, por lo que puede sumar directamente:</p>
<ul>
<li><strong>Días naturales:</strong> <em>=A1+30</em> suma 30 días a la fecha de la celda A1. Dé a la celda del resultado formato de fecha.</li>
<li><strong>Hoy más días:</strong> <em>=HOY()+14</em>.</li>
<li><strong>Días hábiles:</strong> <em>=DIA.LAB(A1;10)</em> suma 10 días hábiles sin sábados ni domingos. Con <em>=DIA.LAB(A1;10;Festivos)</em> añade además un rango con los festivos.</li>
<li><strong>Meses:</strong> <em>=FECHA.MES(A1;1)</em> suma un mes y mantiene el mismo día cuando es posible.</li>
</ul>
<p>Si Excel muestra un número como 46002 en vez de una fecha, solo hay que cambiar el formato de la celda a «Fecha».</p>

<h2>Días frente a meses</h2>
<p>«Más 30 días» no es lo mismo que «más un mes», porque los meses tienen entre 28 y 31 días. Desde el 31 de enero, un mes después es el 28 de febrero (o el 29 en año bisiesto), mientras que 30 días después es el 2 de marzo. Cuando un contrato dice «un mes», sume meses; cuando dice «30 días», sume días.</p>

<h2>Cómo calcular la fecha con la calculadora</h2>
<ol>
<li>Introduzca la fecha inicial.</li>
<li>Escriba el número de días, semanas o meses y elija si se suman o se restan.</li>
<li>Lea la fecha resultante y su día de la semana.</li>
</ol>
<p>La herramienta de <a href="/es/sumar-dias-a-una-fecha">sumar días a una fecha</a> hace estos pasos en segundos, incluidos los cambios de año y los años bisiestos. Para saber cuántos días hay entre dos fechas, use la <a href="/es/calcular-dias-entre-fechas">calculadora de días entre fechas</a>.</p>

<h2>Errores frecuentes</h2>
<ul>
<li><strong>Contar el día de partida.</strong> Con «más 30 días», el día inicial es el día 0.</li>
<li><strong>Confundir días hábiles y naturales.</strong> Diez días hábiles son dos semanas completas.</li>
<li><strong>Olvidar los festivos.</strong> Retrasan el resultado y no son iguales en todas las regiones.</li>
<li><strong>Pasar por alto los años bisiestos.</strong> El 29 de febrero existe en 2028, no en 2027.</li>
<li><strong>Dejar la celda en formato número.</strong> Excel muestra entonces un número de serie.</li>
</ul>
<p>Los plazos legales y administrativos tienen sus propias reglas de cómputo. Para un plazo importante, consulte la norma aplicable o pregunte a un profesional.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué fecha es 30 días después del 11/11/2026?</h3>
<p>El 11/12/2026.</p>
<h3>¿Cuántos días hábiles tiene una semana?</h3>
<p>Cinco, de lunes a viernes. En algunos contextos se cuenta también el sábado.</p>
<h3>¿Cómo resto días a una fecha en Excel?</h3>
<p>Con una resta: <em>=A1-30</em>. Para días hábiles, use DIA.LAB con un número negativo, por ejemplo <em>=DIA.LAB(A1;-10)</em>.</p>
<h3>¿Cómo sumo meses y no días?</h3>
<p>Con FECHA.MES en Excel o con la opción de meses de la calculadora.</p>
`,
};
