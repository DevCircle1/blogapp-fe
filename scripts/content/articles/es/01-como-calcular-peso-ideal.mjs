export default {
  slug: 'como-calcular-peso-ideal',
  title: '¿Cuál es mi peso ideal? Fórmulas, ejemplos y sus límites',
  category: 'health',
  theme: 'health',
  tags: ['peso ideal', 'calculadora peso ideal', 'como calcular el peso ideal', 'formula de lorentz', 'peso ideal segun altura', 'imc'],
  description: 'Calcula tu peso ideal según tu altura con las fórmulas de Devine, Robinson, Miller, Hamwi y Lorentz. Ejemplos para mujer y hombre, rango de IMC y sus límites.',
  cover: {
    kicker: 'Cinco fórmulas, un rango y sus límites',
    visual: {
      type: 'bars',
      title: 'Mujer de 165 cm (kg)',
      items: [
        { label: 'Devine', value: 56.9, display: '56,9' },
        { label: 'Robins.', value: 57.4, display: '57,4' },
        { label: 'Miller', value: 59.8, display: '59,8', highlight: true },
        { label: 'Hamwi', value: 56.4, display: '56,4' },
        { label: 'Lorentz', value: 59.0, display: '59,0' },
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Peso ideal según la fórmula',
    subtitle: 'Ejemplos para una mujer de 165 cm y un hombre de 178 cm. Las fórmulas solo usan altura y sexo.',
    columns: ['Fórmula', 'Mujer, 165 cm', 'Hombre, 178 cm'],
    widths: [400, 328, 328],
    rows: [
      ['Devine (1974)', '56,9 kg', '73,2 kg'],
      ['Robinson (1983)', '57,4 kg', '71,1 kg'],
      ['Miller (1983)', '59,8 kg', '70,4 kg'],
      ['Hamwi (1964)', '56,4 kg', '75,2 kg'],
      ['Lorentz', '59,0 kg', '71,0 kg'],
      ['Rango de IMC saludable (18,5–24,9)', '50,4–67,8 kg', '58,6–78,9 kg'],
    ],
    alt: 'Tabla del peso ideal de una mujer de 165 cm y un hombre de 178 cm según las fórmulas de Devine, Robinson, Miller, Hamwi y Lorentz y el rango de IMC',
    caption: 'Las fórmulas dan un punto; el IMC da un rango. El rango es la referencia más útil.',
    footer: 'Calcula el tuyo: talkandtool.com/es/calculadora-peso-ideal',
  },
  html: `
<p>No existe un único peso ideal: cada fórmula da un número distinto. Para una mujer de 165 cm, las más usadas dan entre 56 y 60 kg. Un IMC saludable abarca de 50,4 a 67,8 kg. Aquí verás cómo se calcula el peso ideal con cada fórmula, ejemplos para mujer y hombre, y por qué conviene pensar en un rango y no en una cifra exacta.</p>

<p><em>Esta guía es informativa y no sustituye la valoración de un profesional sanitario, sobre todo en el embarazo, en la adolescencia o si tienes alguna enfermedad.</em></p>

<h2>Las fórmulas del peso ideal</h2>
<p>Las fórmulas clásicas parten de una base para 152,4 cm (5 pies) y suman una cantidad por cada pulgada (2,54 cm) de altura adicional:</p>
<ul>
<li><strong>Devine (1974):</strong> hombres 50 kg + 2,3 kg por pulgada; mujeres 45,5 kg + 2,3 kg por pulgada.</li>
<li><strong>Robinson (1983):</strong> hombres 52 kg + 1,9 kg; mujeres 49 kg + 1,7 kg por pulgada.</li>
<li><strong>Miller (1983):</strong> hombres 56,2 kg + 1,41 kg; mujeres 53,1 kg + 1,36 kg por pulgada.</li>
<li><strong>Hamwi (1964):</strong> hombres 48 kg + 2,7 kg; mujeres 45,5 kg + 2,2 kg por pulgada.</li>
</ul>
<p>En España también es muy conocida la <strong>fórmula de Lorentz</strong>, que trabaja directamente en centímetros:</p>
<ul>
<li><strong>Hombres:</strong> altura − 100 − (altura − 150) ÷ 4</li>
<li><strong>Mujeres:</strong> altura − 100 − (altura − 150) ÷ 2,5</li>
</ul>

<h2>Ejemplo paso a paso</h2>
<p>Una mujer de 165 cm mide 64,96 pulgadas, es decir, 4,96 pulgadas por encima de los 5 pies.</p>
<ul>
<li>Devine: 45,5 + 2,3 × 4,96 = <strong>56,9 kg</strong></li>
<li>Robinson: 49 + 1,7 × 4,96 = <strong>57,4 kg</strong></li>
<li>Miller: 53,1 + 1,36 × 4,96 = <strong>59,8 kg</strong></li>
<li>Hamwi: 45,5 + 2,2 × 4,96 = <strong>56,4 kg</strong></li>
<li>Lorentz: 165 − 100 − (15 ÷ 2,5) = <strong>59,0 kg</strong></li>
</ul>
<p>Cinco fórmulas y un margen de 3,4 kg entre la más baja y la más alta. La <a href="/es/calculadora-peso-ideal">calculadora de peso ideal</a> aplica Devine, Robinson, Miller y Hamwi a la vez y muestra también el rango de IMC saludable para tu altura.</p>

{{infographic}}

<h2>Por qué es mejor pensar en un rango</h2>
<p>Las fórmulas se crearon con otros fines: Devine, por ejemplo, para calcular dosis de medicamentos, no para fijar un objetivo personal. Solo tienen en cuenta la altura y el sexo. No saben nada de:</p>
<ul>
<li><strong>Composición corporal:</strong> dos personas con el mismo peso pueden tener cantidades muy distintas de músculo y grasa.</li>
<li><strong>Complexión:</strong> una estructura ósea ancha pesa más.</li>
<li><strong>Edad:</strong> la distribución de la grasa y la masa muscular cambian con los años.</li>
</ul>
<p>Por eso, como referencia general, es más útil el rango de <strong>IMC entre 18,5 y 24,9</strong>. Se calcula así: peso mínimo = 18,5 × altura², peso máximo = 24,9 × altura², con la altura en metros. Para 1,65 m: 18,5 × 2,7225 = 50,4 kg y 24,9 × 2,7225 = 67,8 kg. Puedes comprobar tu IMC con la <a href="/es/calculadora-imc">calculadora de IMC</a>.</p>

<h2>Los límites del IMC</h2>
<p>El IMC también tiene puntos ciegos. Una persona muy musculada puede tener un IMC de «sobrepeso» y estar sana. Otra puede tener un IMC normal con demasiada grasa abdominal. Dos medidas complementarias:</p>
<ul>
<li><strong>Perímetro de cintura:</strong> se suele considerar de riesgo más de 88 cm en mujeres y más de 102 cm en hombres.</li>
<li><strong>Porcentaje de grasa corporal:</strong> la <a href="/es/calculadora-grasa-corporal">calculadora de grasa corporal</a> lo estima a partir de medidas del cuerpo.</li>
</ul>

<h2>Si quieres llegar a tu peso ideal</h2>
<p>El peso cambia cuando cambia el balance entre lo que comes y lo que gastas. El primer paso es saber cuántas calorías necesitas al día. Lo explicamos en <a href="/es/guias/calcular-metabolismo-basal-calorias">cómo calcular tu metabolismo basal y las calorías diarias</a>. Un ritmo de pérdida de 0,5 a 1 % del peso corporal por semana es sostenible para la mayoría de las personas. Con la <a href="/es/calculadora-de-calorias">calculadora de calorías</a> tienes el punto de partida.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuál es la fórmula más exacta para el peso ideal?</h3>
<p>Ninguna es «exacta», porque no existe un único peso correcto para cada altura. Robinson y Miller suelen dar valores intermedios. Lorentz es la más citada en España. Todas son estimaciones.</p>
<h3>¿El peso ideal depende de la edad?</h3>
<p>Las fórmulas clásicas no la tienen en cuenta. El rango de IMC saludable tampoco cambia para adultos, aunque en personas mayores se acepta a menudo un IMC algo más alto.</p>
<h3>¿Sirven estas fórmulas para niños y adolescentes?</h3>
<p>No. En menores de 18 años se usan tablas de percentiles por edad y sexo, que interpreta el pediatra.</p>
`,
};
