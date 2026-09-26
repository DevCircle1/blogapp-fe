export default {
  slug: 'calcular-dias-habiles-entre-fechas',
  title: 'Cómo calcular días hábiles entre dos fechas (Excel y a mano)',
  category: 'math',
  theme: 'math',
  tags: ['dias habiles', 'calcular dias habiles', 'dias laborables entre dos fechas', 'dias.lab excel', 'plazos administrativos', 'contador de dias habiles'],
  description: 'Cómo contar días hábiles entre dos fechas a mano y con DIAS.LAB en Excel, cómo calcular un plazo en días hábiles y qué días son inhábiles en los trámites en España.',
  cover: {
    kicker: 'A mano, con Excel y con festivos',
    visual: { type: 'calendar', title: 'Octubre 2026', offset: 3, days: 31, highlight: [19], range: [5, 16], weekdays: ['L', 'M', 'X', 'J', 'V', 'S', 'D'] },
  },
  infographic: {
    type: 'steps',
    title: 'Un plazo de 10 días hábiles, paso a paso',
    subtitle: 'Notificación recibida el viernes 2 de octubre de 2026. Plazo: 10 días hábiles.',
    items: [
      ['Empieza a contar al día siguiente', 'El día de la notificación no cuenta. El primer día posible es el sábado 3 de octubre.'],
      ['Salta sábados y domingos', 'El 3 y el 4 no son hábiles. El día 1 del plazo es el lunes 5 de octubre.'],
      ['Salta los festivos', 'El lunes 12 de octubre (Fiesta Nacional) es inhábil en toda España.'],
      ['Cuenta 10 días hábiles', 'Del 5 al 9 (5 días), del 13 al 16 (4 días) y el lunes 19 (día 10).'],
      ['Resultado: lunes 19 de octubre', 'Sin el festivo del 12, el plazo habría terminado el viernes 16.'],
    ],
    alt: 'Cinco pasos para calcular un plazo de 10 días hábiles desde el 2 de octubre de 2026, saltando fines de semana y el festivo del 12 de octubre',
    caption: 'Revisa también los festivos autonómicos y locales del lugar donde se tramita.',
    footer: 'Cuenta días hábiles: talkandtool.com/es/calculadora-dias-habiles',
  },
  html: `
<p>Para calcular los días hábiles entre dos fechas, cuenta los días de lunes a viernes y resta los festivos. En Excel, la función <strong>DIAS.LAB</strong> lo hace por ti: =DIAS.LAB(inicio;fin;festivos). Octubre de 2026 tiene 22 días laborables de lunes a viernes. Quitando la Fiesta Nacional del 12 de octubre, quedan 21 hábiles. Aquí verás cómo contarlos a mano, en Excel y en un plazo real.</p>

<h2>Qué es un día hábil</h2>
<p>En general, un día hábil o laborable es cualquier día de lunes a viernes que no sea festivo. El detalle depende del contexto:</p>
<ul>
<li><strong>Trámites administrativos en España:</strong> según la Ley 39/2015, son inhábiles los sábados, los domingos y los festivos. Los sábados son inhábiles desde que entró en vigor esa ley.</li>
<li><strong>Plazos judiciales en España:</strong> además de fines de semana y festivos, agosto es inhábil para la mayoría de las actuaciones, salvo las urgentes.</li>
<li><strong>Contratos y envíos:</strong> se aplica lo que diga el contrato o las condiciones. Algunas empresas cuentan los sábados como laborables.</li>
<li><strong>Latinoamérica:</strong> cada país tiene sus festivos y reglas para plazos. En muchos, los sábados no son hábiles para trámites. Consulta la norma de tu país.</li>
</ul>

<h2>Contar días hábiles a mano</h2>
<ol>
<li>Cuenta los días naturales entre las dos fechas.</li>
<li>Resta los sábados y domingos. Cada semana completa tiene 5 días hábiles.</li>
<li>Resta los festivos que caigan de lunes a viernes: nacionales, autonómicos y locales.</li>
</ol>
<p>Ejemplo: del 1 al 31 de octubre de 2026. El mes empieza en jueves y tiene 22 días de lunes a viernes. El 12 de octubre, lunes, es festivo nacional: <strong>21 días hábiles</strong>. Si en tu comunidad hay otro festivo ese mes, resta uno más.</p>
<p>Para contar días naturales entre dos fechas, usa la herramienta <a href="/es/calcular-dias-entre-fechas">calcular días entre fechas</a>. Tiene la opción de contar solo días laborables.</p>

<h2>Calcular un plazo en días hábiles</h2>
<p>El caso más habitual no es contar los días entre dos fechas, sino saber <strong>cuándo vence un plazo</strong>: «tiene 10 días hábiles desde la notificación». La regla general es empezar a contar al día siguiente de la notificación y saltar todos los días inhábiles.</p>

{{infographic}}

<p>Si el último día del plazo es inhábil, el plazo se prorroga al primer día hábil siguiente. La <a href="/es/calculadora-dias-habiles">calculadora de días hábiles</a> cuenta los días laborables entre dos fechas o suma días laborables a una fecha, excluyendo sábados y domingos. Los festivos debes restarlos tú según tu calendario local.</p>

<h2>Días hábiles en Excel y Google Sheets</h2>
<p>Excel en español tiene funciones específicas. Los argumentos se separan con punto y coma:</p>
<ul>
<li><code>=DIAS.LAB(A1;B1)</code> cuenta los días de lunes a viernes entre dos fechas, <strong>incluidas ambas</strong>.</li>
<li><code>=DIAS.LAB(A1;B1;F1:F15)</code> hace lo mismo y además resta los festivos listados en F1:F15.</li>
<li><code>=DIA.LAB(A1;10;F1:F15)</code> devuelve la fecha que cae 10 días hábiles después de A1. Es la función ideal para plazos.</li>
<li><code>=DIAS.LAB.INTL(A1;B1;1;F1:F15)</code> permite elegir qué días son fin de semana, útil si trabajas de martes a sábado.</li>
</ul>
<p>En Google Sheets las mismas funciones se llaman <code>DIAS.LAB</code> y <code>DIA.LAB</code> con la configuración regional en español. En inglés son NETWORKDAYS y WORKDAY.</p>
<p>Ojo: DIAS.LAB cuenta también el día de inicio si es laborable. Para un plazo que empieza a contar al día siguiente, usa DIA.LAB o resta 1.</p>

<h2>Errores frecuentes</h2>
<ul>
<li><strong>Contar el día de la notificación.</strong> En los plazos administrativos se empieza al día siguiente.</li>
<li><strong>Olvidar los festivos autonómicos y locales.</strong> Cambian cada año y de una comunidad a otra.</li>
<li><strong>Tratar el sábado como hábil</strong> en trámites administrativos en España.</li>
<li><strong>Confundir días hábiles con naturales.</strong> «30 días» sin más suele significar naturales. Lee siempre la norma o el contrato.</li>
</ul>
<p>Si solo necesitas sumar días naturales a una fecha, por ejemplo un plazo de 30 días naturales, usa <a href="/es/sumar-dias-a-una-fecha">sumar días a una fecha</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿El sábado es día hábil?</h3>
<p>Para trámites administrativos en España, no. En el ámbito laboral y comercial depende del convenio o del contrato.</p>
<h3>¿Cuántos días hábiles tiene un año?</h3>
<p>Un año tiene unos 260–261 días de lunes a viernes. Restando los festivos nacionales, autonómicos y locales, en España quedan normalmente entre 245 y 250.</p>
<h3>¿Cómo cuento 20 días hábiles desde hoy?</h3>
<p>Empieza a contar mañana, salta fines de semana y festivos hasta llegar a 20. En Excel: =DIA.LAB(HOY();20;festivos).</p>
`,
};
