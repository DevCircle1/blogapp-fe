export default {
  slug: 'convertir-mayusculas-a-minusculas-word-excel',
  title: 'Convertir mayúsculas a minúsculas en Word, Excel y Docs',
  translationKey: 'change-text-case',
  category: 'technology',
  theme: 'seo',
  tags: ['convertir mayusculas a minusculas', 'cambiar mayusculas a minusculas word', 'minusculas excel', 'google docs mayusculas', 'formato titulo', 'atajo de teclado'],
  description: 'Convertir mayúsculas a minúsculas (y al revés) en Word, Excel, Google Docs y en cualquier texto: atajos de teclado, fórmulas MINUSC y NOMPROPIO, y un conversor online.',
  cover: {
    kicker: 'MAYÚSCULAS → minúsculas en un clic',
    visual: {
      type: 'code',
      lines: ['Word:   Mayús + F3', ['Excel:  =MINUSC(A1)', 'accent'], 'Docs:   Formato → Texto', '        → Mayúsculas'],
    },
  },
  infographic: {
    type: 'table',
    title: 'Cambiar mayúsculas y minúsculas: resumen',
    subtitle: 'La forma más rápida en cada programa.',
    columns: ['Programa', 'Cómo', 'Opciones'],
    widths: [260, 420, 376],
    rows: [
      ['Word (Windows)', 'Seleccionar + Mayús + F3', 'minúsculas, MAYÚSCULAS, Tipo oración'],
      ['Word (Mac)', 'Seleccionar + Fn + Mayús + F3', 'igual que Windows'],
      ['Excel', '=MINUSC(), =MAYUSC(), =NOMPROPIO()', 'en una columna nueva'],
      ['Google Docs', 'Formato → Texto → Mayúsculas', 'minúsculas, MAYÚSCULAS, Tipo título'],
      ['Google Sheets', '=LOWER(), =UPPER(), =PROPER()', 'según idioma de la hoja'],
      ['Cualquier texto', 'Conversor online', 'todas, sin instalar nada'],
    ],
    alt: 'Tabla con la forma de convertir mayúsculas a minúsculas en Word, Excel, Google Docs, Google Sheets y con un conversor online',
    caption: 'En Excel la fórmula crea una copia: pega como valores si quieres sustituir el original.',
    footer: 'Convertir cualquier texto: talkandtool.com/es/convertir-mayusculas-minusculas',
  },
  html: `
<p>Para convertir un texto de mayúsculas a minúsculas no hace falta volver a escribirlo. En Word basta con seleccionarlo y pulsar <strong>Mayús + F3</strong>; en Excel, la fórmula <strong>=MINUSC(A1)</strong>; en Google Docs, <strong>Formato → Texto → Mayúsculas</strong>. Y para cualquier otro texto, un conversor online lo hace en un segundo. Aquí están todos los métodos paso a paso.</p>

{{infographic}}

<h2>En Microsoft Word</h2>
<ol>
<li>Selecciona el texto.</li>
<li>Pulsa <strong>Mayús + F3</strong> (en Mac, <strong>Fn + Mayús + F3</strong>).</li>
<li>Cada pulsación cambia entre <em>minúsculas</em>, <em>MAYÚSCULAS</em> y <em>Tipo oración</em> (primera letra de cada palabra en mayúscula).</li>
</ol>
<p>También puedes usar el botón <strong>Aa</strong> de la pestaña <strong>Inicio</strong>, que ofrece además «Tipo oración.» y «tIPO iNVERSO».</p>
<p>Si el texto se ve en mayúsculas pero no cambia, probablemente tiene el formato <strong>Versales</strong> o <strong>Todo mayúsculas</strong>: abre <strong>Fuente</strong> (Ctrl + D) y desmarca esa opción.</p>

<h2>En Excel</h2>
<p>Excel no cambia el texto de una celda en su sitio; se usa una fórmula en otra columna:</p>
<ul>
<li><code>=MINUSC(A1)</code>: todo en minúsculas.</li>
<li><code>=MAYUSC(A1)</code>: todo en mayúsculas.</li>
<li><code>=NOMPROPIO(A1)</code>: primera letra de cada palabra en mayúscula, útil para nombres.</li>
</ul>
<p>Arrastra la fórmula hacia abajo, copia la columna y pégala con <strong>Pegado especial → Valores</strong> sobre la original. Así sustituyes el texto y puedes borrar la columna auxiliar. Si tu Excel está en inglés, las funciones se llaman <code>LOWER</code>, <code>UPPER</code> y <code>PROPER</code>.</p>

<h2>En Google Docs y Google Sheets</h2>
<p>En <strong>Google Docs</strong>: selecciona el texto y ve a <strong>Formato → Texto → Mayúsculas</strong>, donde puedes elegir minúsculas, MAYÚSCULAS o Tipo título.</p>
<p>En <strong>Google Sheets</strong> se usan fórmulas como en Excel: <code>=MINUSC(A1)</code>, <code>=MAYUSC(A1)</code> y <code>=NOMPROPIO(A1)</code>, o sus nombres en inglés según el idioma de la hoja.</p>

<h2>En cualquier texto: conversor online</h2>
<p>Para textos de un correo, una web, un PDF o un chat, lo más rápido es el <a href="/es/convertir-mayusculas-minusculas">conversor de mayúsculas y minúsculas</a>: pegas el texto, eliges el formato y copias el resultado. Funciona en el navegador, sin instalar nada, y el texto no se envía a ningún servidor.</p>

<h2>En el móvil (Android y iPhone)</h2>
<p>Los teclados del móvil no tienen una opción para convertir un texto ya escrito. En Word y Google Docs para móvil puedes seleccionar el texto y buscar la opción de formato, pero es más cómodo copiar el texto, pegarlo en el conversor online desde el navegador del móvil y copiar el resultado. Para escribir en mayúsculas de forma continua, pulsa dos veces la tecla de mayúsculas del teclado.</p>

<h2>Errores frecuentes</h2>
<ul>
<li><strong>Siglas convertidas por error:</strong> al pasar todo a minúsculas, siglas como «ONU» o «DNI» también cambian. Revísalas al final.</li>
<li><strong>Nombres propios:</strong> después de convertir un párrafo a minúsculas hay que volver a poner en mayúscula los nombres de personas, ciudades y marcas.</li>
<li><strong>Tildes perdidas:</strong> si el texto original en mayúsculas no llevaba tildes, la conversión no las añade. Corrígelas a mano o con el corrector ortográfico.</li>
</ul>

<h2>¿Tipo oración o tipo título?</h2>
<ul>
<li><strong>Tipo oración:</strong> solo la primera letra de la frase en mayúscula. Es la norma en español para títulos, según la RAE.</li>
<li><strong>Tipo título:</strong> la primera letra de cada palabra en mayúscula. Es habitual en inglés («How To Count Words»), pero en español se considera incorrecto en títulos, salvo en nombres propios.</li>
</ul>
<p>Recuerda también que en español las mayúsculas llevan tilde: «ÁRBOL», no «ARBOL».</p>

<h2>Otras herramientas de texto útiles</h2>
<p>Si estás limpiando un texto, quizá también te sirva <a href="/es/contador-de-palabras">contar palabras y caracteres</a>, <a href="/es/comparar-textos">comparar dos versiones de un texto</a> o <a href="/es/invertir-texto">invertir un texto</a>.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuál es el atajo para cambiar a minúsculas en Word?</h3>
<p>Mayús + F3 en Windows y Fn + Mayús + F3 en Mac, con el texto seleccionado. Cada pulsación cambia el formato.</p>
<h3>¿Cómo paso a minúsculas una columna entera en Excel?</h3>
<p>Escribe <code>=MINUSC(A1)</code> en la primera celda de una columna vacía, arrástrala hasta el final y pega los resultados como valores sobre la columna original.</p>
<h3>¿Por qué el atajo de Word no hace nada?</h3>
<p>En muchos portátiles F3 tiene otra función y hay que pulsar también la tecla Fn. Si aun así no cambia, el texto tiene el formato «Todo mayúsculas»; desactívalo en el cuadro Fuente.</p>
`,
};
