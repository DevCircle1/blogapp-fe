export default {
  slug: 'como-calcular-cuota-prestamo',
  title: 'Cómo calcular la cuota de un préstamo (sistema francés)',
  translationKey: 'loan-payment-formula',
  category: 'finance',
  theme: 'finance',
  tags: ['calcular cuota prestamo', 'calculadora de prestamos', 'sistema frances', 'formula cuota prestamo', 'tin y tae', 'excel funcion pago'],
  description: 'Calcula la cuota mensual de un préstamo con la fórmula del sistema francés: ejemplo paso a paso, la función PAGO de Excel, la diferencia entre TIN y TAE y el coste total.',
  cover: {
    kicker: 'La fórmula, un ejemplo y la función PAGO',
    visual: { type: 'formula', title: 'CUOTA MENSUAL', lines: ['C = P·i(1+i)^n', '    ÷ ((1+i)^n − 1)', '15.000 € · 7 % · 60', '= 297,02 €/mes'] },
  },
  infographic: {
    type: 'steps',
    title: 'Calcular la cuota paso a paso',
    subtitle: 'Préstamo de 15.000 € al 7 % TIN, a devolver en 5 años con cuotas mensuales.',
    items: [
      ['Interés mensual i = 0,005833', 'Divide el TIN anual entre 12: 7 % ÷ 12 = 0,5833 % = 0,005833.'],
      ['Número de cuotas n = 60', '5 años × 12 meses.'],
      ['Factor (1 + i)^n ≈ 1,4176', '1,005833 elevado a 60. Usa la tecla x^y de la calculadora.'],
      ['Aplica la fórmula', '15.000 × 0,005833 × 1,4176 ÷ (1,4176 − 1) ≈ 297,02 € al mes.'],
      ['Coste total = 17.821,08 €', '297,02 × 60, de los que 2.821,08 € son intereses.'],
    ],
    alt: 'Cinco pasos para calcular la cuota mensual de un préstamo de 15.000 euros al 7 % durante 5 años con el sistema francés',
    caption: 'En Excel en español: =PAGO(7%/12;60;-15000) devuelve 297,02.',
    footer: 'Sin fórmulas: talkandtool.com/es/calculadora-de-prestamos',
  },
  html: `
<p>La cuota mensual de un préstamo con sistema francés se calcula con la fórmula <strong>C = P × i × (1 + i)^n ÷ ((1 + i)^n − 1)</strong>, donde P es el capital, i el interés mensual y n el número de cuotas. Un préstamo de 15.000 € al 7 % TIN a 5 años sale a 297,02 € al mes. Aquí tienes el cálculo paso a paso, la versión en Excel y cómo leer el TIN y la TAE.</p>

<h2>Qué es el sistema francés</h2>
<p>Es el sistema de amortización más habitual en préstamos personales, de coche e hipotecas en España y en buena parte de Latinoamérica. Todas las cuotas son iguales, pero su composición cambia. Al principio pagas sobre todo intereses. Con cada cuota baja la deuda pendiente, bajan los intereses y aumenta la parte que amortiza capital.</p>

<h2>La fórmula</h2>
<p><strong>C = P × i × (1 + i)^n ÷ ((1 + i)^n − 1)</strong></p>
<ul>
<li><strong>C:</strong> cuota mensual.</li>
<li><strong>P:</strong> capital prestado.</li>
<li><strong>i:</strong> tipo de interés mensual en decimal, es decir, TIN anual ÷ 12. Un 7 % anual es 0,07 ÷ 12 = 0,005833.</li>
<li><strong>n:</strong> número de cuotas: 5 años son 60 y 30 años son 360.</li>
</ul>

<h2>Ejemplo resuelto</h2>

{{infographic}}

<p>Los dos errores más frecuentes son usar el interés anual en lugar del mensual y los años en lugar de los meses. Si la cuota te sale disparatada, revisa eso primero. Con la <a href="/es/calculadora-de-prestamos">calculadora de préstamos</a> obtienes la cuota, los intereses totales y el importe a devolver sin hacer cuentas.</p>

<h2>Cómo se reparte cada cuota</h2>
<p>En la primera cuota del ejemplo:</p>
<ul>
<li>Intereses: 15.000 × 0,005833 = <strong>87,50 €</strong></li>
<li>Amortización de capital: 297,02 − 87,50 = <strong>209,52 €</strong></li>
</ul>
<p>La deuda pasa a 14.790,48 €. En la segunda cuota los intereses se calculan sobre esa cifra, así que son algo menores, y la amortización algo mayor. Por eso <strong>amortizar anticipadamente</strong> al principio del préstamo ahorra más intereses que hacerlo al final.</p>

<h2>El plazo cambia mucho el coste total</h2>
<p>El mismo préstamo de 15.000 € al 7 %:</p>
<ul>
<li><strong>A 5 años:</strong> 297,02 € al mes, 17.821,08 € en total.</li>
<li><strong>A 8 años:</strong> 204,51 € al mes, 19.632,55 € en total.</li>
</ul>
<p>Alargar el plazo baja la cuota en 92,51 € al mes, pero los intereses pasan de 2.821 € a 4.633 €. Antes de elegir plazo, compara las dos cifras: la cuota y el total a devolver.</p>

<h2>TIN y TAE: cuál mirar</h2>
<ul>
<li><strong>TIN (tipo de interés nominal):</strong> el tipo que se usa en la fórmula de la cuota. No incluye comisiones.</li>
<li><strong>TAE (tasa anual equivalente):</strong> incluye el efecto de pagar mensualmente y las comisiones obligatorias, como la de apertura. Es la cifra que permite comparar ofertas.</li>
</ul>
<p>Ejemplo: al 7 % TIN sin comisiones, la TAE es de <strong>7,23 %</strong>, solo por el efecto de pagar cada mes. Si además hay una comisión de apertura del 1,5 % (225 €), la TAE sube a aproximadamente <strong>7,91 %</strong>, aunque la cuota sea la misma. Dos préstamos con el mismo TIN pueden costar cosas muy distintas. Compara siempre la TAE.</p>
<p>En México el indicador equivalente es el <strong>CAT</strong> (costo anual total), que además suele incluir seguros. La lógica es la misma: sirve para comparar, no para calcular la cuota.</p>

<h2>La cuota en Excel o Google Sheets</h2>
<p>La función <strong>PAGO</strong> aplica la fórmula por ti. En Excel en español se separan los argumentos con punto y coma:</p>
<ul>
<li><code>=PAGO(7%/12;60;-15000)</code> → <strong>297,02</strong></li>
<li><code>=PAGOINT(7%/12;1;60;-15000)</code> → intereses de la cuota 1 (87,50)</li>
<li><code>=PAGOPRIN(7%/12;1;60;-15000)</code> → capital amortizado en la cuota 1 (209,52)</li>
</ul>
<p>El capital va en negativo porque, para ti, el dinero entra y las cuotas salen. Si lo pones en positivo, el resultado sale negativo pero con el mismo valor.</p>

<h2>Hipotecas</h2>
<p>La fórmula es la misma para una hipoteca a tipo fijo. En las de tipo variable, la cuota se recalcula en cada revisión con el nuevo tipo (índice, como el euríbor, más el diferencial) y el capital pendiente. La <a href="/es/calculadora-de-hipoteca">calculadora de hipoteca</a> calcula la cuota a partir del precio de la vivienda, la entrada, el tipo y el plazo, con impuestos y seguro incluidos.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cómo calculo cuánto puedo pedir con una cuota determinada?</h3>
<p>Despeja P: P = C × ((1 + i)^n − 1) ÷ (i × (1 + i)^n). Con 250 € al mes al 7 % a 5 años puedes pedir unos 12.625 €.</p>
<h3>¿Qué pasa si el interés es 0 %?</h3>
<p>La fórmula no funciona (divide entre cero). La cuota es simplemente el capital entre el número de cuotas.</p>
<h3>¿El sistema francés es el único?</h3>
<p>No. En el sistema alemán se amortiza la misma cantidad de capital cada mes, y la cuota baja con el tiempo. En España y Latinoamérica el francés es el más habitual.</p>
`,
};
