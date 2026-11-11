export default {
  slug: 'como-agrupar-palabras-clave-clustering',
  title: 'Cómo agrupar palabras clave: guía de clustering SEO',
  category: 'seo',
  theme: 'seo',
  tags: ['agrupar palabras clave', 'clustering de palabras clave', 'keyword clustering', 'agrupar keywords', 'canibalización seo', 'intención de búsqueda'],
  description: 'Aprenda a agrupar palabras clave por intención de búsqueda: cuándo dos keywords van en la misma página, el método de las URL compartidas en Google, un ejemplo paso a paso y cómo evitar la canibalización.',
  cover: {
    kicker: 'Una intención, una página',
    visual: { type: 'checklist', items: ['Reunir las palabras clave', 'Mirar el top 10 de Google', 'Contar URL compartidas', 'Una página por grupo', 'Elegir la keyword principal'] },
  },
  infographic: {
    type: 'steps',
    title: 'Agrupar palabras clave en cinco pasos',
    subtitle: 'Funciona con una lista de 20 palabras o de 2.000.',
    items: [
      ['Reúna la lista', 'Exporte las consultas de Search Console y añada ideas de herramientas de palabras clave. Quite duplicados y variantes con errores.'],
      ['Compare los resultados de Google', 'Para cada palabra, anote las URL del top 10. Dos palabras que comparten varias URL tienen la misma intención.'],
      ['Aplique un umbral', 'Una regla habitual es agrupar las palabras que comparten al menos tres o cuatro de las diez URL.'],
      ['Asigne una página a cada grupo', 'Cada grupo se atiende con una sola URL. Elija la palabra con más búsquedas como principal.'],
      ['Revise los casos dudosos', 'Si un grupo mezcla intenciones, por ejemplo información y compra, sepárelo en dos páginas.'],
    ],
    alt: 'Cinco pasos para agrupar palabras clave: reunir la lista, comparar resultados de Google, aplicar un umbral, asignar una página a cada grupo y revisar los casos dudosos',
    caption: 'El objetivo es que cada intención de búsqueda tenga una página, y solo una.',
    footer: 'Hágalo automáticamente: talkandtool.com/es/agrupar-palabras-clave',
  },
  html: `
<p>Agrupar palabras clave (keyword clustering) consiste en reunir en un mismo grupo las búsquedas que tienen la misma intención, para atenderlas con una sola página en lugar de crear una URL por cada variante. Dos palabras clave van juntas cuando Google les muestra casi los mismos resultados; si los resultados son distintos, necesitan páginas distintas.</p>

{{infographic}}

<h2>Por qué agrupar palabras clave</h2>
<ul>
<li><strong>Evita la canibalización.</strong> Si dos páginas de su sitio compiten por la misma búsqueda, Google alterna entre ellas y ninguna se consolida. La herramienta de <a href="/es/canibalizacion-palabras-clave">canibalización de palabras clave</a> detecta estos conflictos en un informe de Search Console.</li>
<li><strong>Ahorra contenido.</strong> «Agrupar palabras», «agrupar keywords» y «cómo agrupar palabras clave» suelen pedir lo mismo. Una buena página responde a las tres.</li>
<li><strong>Refuerza la página.</strong> Una página que cubre todas las variantes de una intención recibe más señales que varias páginas flojas.</li>
<li><strong>Ordena el plan de contenidos.</strong> Cada grupo es un tema; cada tema, una página.</li>
</ul>

<h2>El criterio: ¿misma intención?</h2>
<p>No basta con que dos palabras se parezcan. «Zapatillas running» y «zapatillas para correr» significan lo mismo, pero «zapatillas running baratas» y «cómo elegir zapatillas running» buscan cosas diferentes: comprar en un caso e informarse en el otro. Para decidirlo, mire lo que Google devuelve. Si las dos búsquedas muestran las mismas páginas, Google las trata como una sola intención. Si muestran páginas distintas, son dos.</p>

<h2>Método de las URL compartidas</h2>
<p>Es el método más fiable porque se basa en los resultados reales:</p>
<ol>
<li>Busque cada palabra clave y apunte las URL de los diez primeros resultados orgánicos.</li>
<li>Compare cada par de palabras. Cuente cuántas URL tienen en común.</li>
<li>Si comparten al menos tres o cuatro de diez, agrúpelas. Es un umbral habitual; con menos solapamiento, se separan.</li>
<li>Vaya ajustando: en nichos con pocas páginas competidoras puede necesitar un umbral más bajo.</li>
</ol>
<p>Hacerlo a mano con cientos de palabras es lento, y por eso existen herramientas. La <a href="/es/agrupar-palabras-clave">herramienta de agrupación de palabras clave</a> clasifica una lista según su parecido de intención y le muestra los grupos resultantes.</p>

<h2>Ejemplo paso a paso</h2>
<p>Una tienda de café tiene estas palabras clave:</p>
<ul>
<li>cómo preparar café en cafetera italiana</li>
<li>café con cafetera italiana</li>
<li>pasos cafetera moka</li>
<li>mejor cafetera italiana</li>
<li>comprar cafetera italiana</li>
<li>cafetera italiana precio</li>
</ul>
<p>Al comparar los resultados, las tres primeras comparten casi las mismas guías, así que forman un <strong>grupo informativo</strong>: una guía de «cómo preparar café en cafetera italiana». Las dos últimas muestran tiendas y comparadores y forman un <strong>grupo de compra</strong>. «Mejor cafetera italiana» muestra comparativas y se queda a medio camino: es un tercer grupo, el de los análisis, o se une al de compra según los resultados de su mercado. El resultado son tres páginas con objetivos distintos en vez de seis casi idénticas.</p>

<h2>Cómo elegir la palabra clave principal de cada grupo</h2>
<ul>
<li>La que tiene más búsquedas mensuales.</li>
<li>La que mejor describe la página, si dos tienen un volumen similar.</li>
<li>La que ya trae impresiones en Search Console, porque indica que Google ya asocia su sitio con ella.</li>
</ul>
<p>Las demás palabras del grupo se usan como variantes en títulos secundarios y en el texto, de forma natural. Si necesita ideas para ampliar el grupo, el <a href="/es/generador-palabras-clave-long-tail">generador de palabras clave long tail</a> propone variantes con más detalle.</p>

<h2>Errores frecuentes</h2>
<ul>
<li><strong>Agrupar solo por parecido de palabras.</strong> Las palabras similares pueden tener intenciones muy distintas.</li>
<li><strong>Crear una página por cada variante.</strong> Es el origen de la mayoría de canibalizaciones.</li>
<li><strong>Mezclar intención informativa y de compra en una página.</strong> Acaba sin ganar en ninguna.</li>
<li><strong>No revisar con el tiempo.</strong> Los resultados de Google cambian, y un grupo bueno hoy puede separarse mañana.</li>
</ul>

<h2>Cuándo conviene volver a agrupar</h2>
<p>Revise sus grupos cuando lance contenido nuevo, cuando Search Console muestre dos URL en la misma consulta, o cada seis meses en sitios que publican con frecuencia. Si una consulta alterna entre dos páginas, compruebe si debe fusionarlas o diferenciarlas.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuántas palabras clave puede tener una página?</h3>
<p>No hay un límite fijo. Una buena página posiciona decenas o cientos de variantes si responde bien a la intención. Lo importante es que todas compartan intención.</p>
<h3>¿Qué diferencia hay entre agrupar y canibalizar?</h3>
<p>Agrupar es una decisión de planificación: qué palabras van en qué página. La canibalización es el problema que aparece cuando varias páginas compiten por la misma intención.</p>
<h3>¿Puedo agrupar sin herramientas?</h3>
<p>Sí, con una hoja de cálculo y la comparación manual de resultados, pero resulta lento a partir de unas pocas decenas de palabras.</p>
<h3>¿Hay que agrupar en cada idioma por separado?</h3>
<p>Sí. Los resultados y las intenciones cambian según el idioma y el país, así que cada mercado necesita su propio análisis.</p>
`,
};
