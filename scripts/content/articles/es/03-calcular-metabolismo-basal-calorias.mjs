export default {
  slug: 'calcular-metabolismo-basal-calorias',
  title: 'Cómo calcular tu metabolismo basal y las calorías diarias',
  category: 'health',
  theme: 'health',
  tags: ['metabolismo basal', 'calcular metabolismo basal', 'calorias diarias', 'gasto energetico diario', 'mifflin st jeor', 'harris benedict'],
  description: 'Calcula tu metabolismo basal con Mifflin-St Jeor o Harris-Benedict, multiplícalo por tu nivel de actividad y obtén las calorías que gastas al día. Con ejemplo.',
  cover: {
    kicker: 'Metabolismo basal × actividad = gasto diario',
    visual: { type: 'stat', value: '1.328', label: 'kcal de metabolismo basal', note: 'mujer, 30 años, 62 kg, 163 cm' },
  },
  infographic: {
    type: 'table',
    title: 'Del metabolismo basal al gasto diario',
    subtitle: 'Ejemplo: mujer de 30 años, 62 kg y 163 cm. Metabolismo basal (Mifflin-St Jeor): 1.328 kcal.',
    columns: ['Nivel de actividad', 'Factor', 'Calorías al día'],
    widths: [520, 200, 336],
    rows: [
      ['Sedentaria (trabajo de oficina, sin ejercicio)', '× 1,2', '≈ 1.593 kcal'],
      ['Ligera (ejercicio 1–3 días por semana)', '× 1,375', '≈ 1.826 kcal'],
      ['Moderada (ejercicio 3–5 días por semana)', '× 1,55', '≈ 2.058 kcal'],
      ['Intensa (ejercicio 6–7 días por semana)', '× 1,725', '≈ 2.290 kcal'],
    ],
    alt: 'Tabla con el gasto calórico diario de una mujer de 30 años según su nivel de actividad, a partir de un metabolismo basal de 1.328 kcal',
    caption: 'Casi todo el mundo sobrestima su actividad. Ante la duda, elige el nivel inferior.',
    footer: 'Calcula el tuyo: talkandtool.com/es/calculadora-de-calorias',
  },
  html: `
<p>El metabolismo basal (TMB) es la energía que tu cuerpo gasta en reposo total. Se calcula con tu peso, altura, edad y sexo. La fórmula más utilizada hoy es Mifflin-St Jeor. Para saber cuántas calorías gastas al día, multiplica el resultado por un factor de actividad. Una mujer de 30 años, 62 kg y 163 cm tiene un metabolismo basal de unas 1.328 kcal y gasta entre 1.600 y 2.300 kcal al día según su actividad.</p>

<p><em>Estas cifras son estimaciones para adultos sanos. Si estás embarazada, tienes alguna enfermedad o antecedentes de trastornos alimentarios, consulta con un profesional sanitario.</em></p>

<h2>Paso 1: calcula tu metabolismo basal</h2>
<h3>Fórmula de Mifflin-St Jeor (1990)</h3>
<ul>
<li><strong>Hombres:</strong> 10 × peso (kg) + 6,25 × altura (cm) − 5 × edad + 5</li>
<li><strong>Mujeres:</strong> 10 × peso (kg) + 6,25 × altura (cm) − 5 × edad − 161</li>
</ul>
<p>Ejemplo, mujer de 30 años, 62 kg y 163 cm: 620 + 1.018,75 − 150 − 161 = <strong>1.327,75 kcal</strong>, redondeado 1.328 kcal.</p>
<h3>Fórmula de Harris-Benedict (revisada en 1984)</h3>
<ul>
<li><strong>Hombres:</strong> 88,362 + 13,397 × peso + 4,799 × altura − 5,677 × edad</li>
<li><strong>Mujeres:</strong> 447,593 + 9,247 × peso + 3,098 × altura − 4,330 × edad</li>
</ul>
<p>Para el mismo ejemplo da <strong>1.396 kcal</strong>, unas 70 kcal más. Es normal: Harris-Benedict tiende a dar valores algo más altos, y los estudios comparativos suelen encontrar Mifflin-St Jeor más precisa en la población actual. Por eso es la que usa la <a href="/es/calculadora-de-calorias">calculadora de calorías</a>.</p>

<h2>Paso 2: multiplica por tu nivel de actividad</h2>
<p>El metabolismo basal solo cubre el reposo. Tu <strong>gasto energético diario total</strong> suma el movimiento, el ejercicio y la digestión. Se estima con estos factores:</p>

{{infographic}}

<p>Con actividad moderada, la mujer del ejemplo gasta unas <strong>2.058 kcal al día</strong>. Es la cantidad que mantendría su peso estable.</p>

<h2>Paso 3: ajusta según tu objetivo</h2>
<ul>
<li><strong>Mantener el peso:</strong> come aproximadamente tu gasto diario.</li>
<li><strong>Perder peso:</strong> un déficit del 15–20 % es sostenible para la mayoría. En el ejemplo, unas 1.650–1.750 kcal. Suele traducirse en una pérdida de 0,5–1 % del peso corporal por semana.</li>
<li><strong>Ganar masa muscular:</strong> un superávit moderado del 5–10 % junto con entrenamiento de fuerza.</li>
</ul>
<p>Además de las calorías, conviene repartir bien los macronutrientes: proteínas, grasas e hidratos. Proteína suficiente ayuda a no perder músculo durante un déficit. La <a href="/es/calculadora-de-macros">calculadora de macros</a> convierte tus calorías en gramos de cada uno.</p>

<h2>Qué influye en el metabolismo basal</h2>
<ul>
<li><strong>Masa muscular:</strong> el músculo consume más energía en reposo que la grasa. Dos personas con el mismo peso pueden tener metabolismos distintos.</li>
<li><strong>Edad:</strong> el gasto en reposo tiende a bajar con los años, en parte por la pérdida de músculo.</li>
<li><strong>Tamaño corporal:</strong> un cuerpo más grande gasta más, también en reposo.</li>
<li><strong>Dietas muy restrictivas:</strong> el cuerpo se adapta y gasta algo menos, una razón más para evitar déficits extremos.</li>
</ul>
<p>Ninguna fórmula conoce tu composición corporal, así que el resultado puede desviarse en unos cientos de kilocalorías. Úsalo como punto de partida. Pésate varias veces por semana en las mismas condiciones y ajusta 100–200 kcal si en 2–3 semanas el peso no evoluciona como esperabas.</p>

<h2>Errores frecuentes</h2>
<ul>
<li><strong>Elegir un nivel de actividad demasiado alto.</strong> Una hora de gimnasio no convierte un trabajo sedentario en «actividad intensa».</li>
<li><strong>Contar dos veces el ejercicio:</strong> incluirlo en el factor de actividad y volver a sumar las calorías que marca el reloj.</li>
<li><strong>Comer por debajo del metabolismo basal durante mucho tiempo</strong> sin supervisión profesional.</li>
<li><strong>Olvidar las bebidas y el aceite,</strong> que pueden sumar cientos de calorías al día.</li>
</ul>
<p>Si tu objetivo es un peso concreto, revisa también <a href="/es/guias/como-calcular-peso-ideal">cuál es tu peso ideal según las distintas fórmulas</a>. Y no olvides el agua: la <a href="/es/cuanta-agua-tomar-al-dia">calculadora de agua diaria</a> te da una referencia según tu peso y actividad.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Qué diferencia hay entre metabolismo basal y gasto calórico diario?</h3>
<p>El metabolismo basal es lo que gastas en reposo absoluto. El gasto diario total añade toda la actividad del día y suele ser entre 1,2 y 1,9 veces el basal.</p>
<h3>¿Qué fórmula es más precisa?</h3>
<p>Para adultos en general, Mifflin-St Jeor suele acercarse más a las mediciones reales que Harris-Benedict. Si conoces tu porcentaje de grasa, las fórmulas basadas en masa magra (como Katch-McArdle) pueden ser más precisas.</p>
<h3>¿Cuántas calorías necesito para adelgazar?</h3>
<p>Aproximadamente tu gasto diario menos un 15–20 %. Para la mujer del ejemplo, con actividad moderada, unas 1.650–1.750 kcal al día.</p>
`,
};
