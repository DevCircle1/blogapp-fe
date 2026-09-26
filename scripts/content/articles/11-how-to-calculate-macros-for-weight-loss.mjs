export default {
  slug: 'how-to-calculate-macros-for-weight-loss',
  title: 'How to Calculate Macros for Weight Loss (Step-by-Step Example)',
  category: 'health',
  theme: 'health',
  tags: ['macro calculator', 'macros for weight loss', 'how to calculate macros', 'protein intake', 'calorie deficit', 'macronutrients'],
  description: 'Calculate your macros for weight loss in five steps: BMR, TDEE, deficit, protein, then fat and carbs. A full worked example with the formulas and grams per day.',
  cover: {
    kicker: 'Five steps from calories to grams per day',
    visual: { type: 'formula', title: 'WORKED EXAMPLE', lines: ['BMR       1,395', '× 1.55  = 2,160', '− 20%   = 1,730', '126P · 56F · 180C'] },
  },
  infographic: {
    type: 'steps',
    title: 'Macros for weight loss: the worked example',
    subtitle: 'Woman, 35, 70 kg, 165 cm, moderately active. Mifflin-St Jeor equation, 20% calorie deficit.',
    items: [
      ['BMR ≈ 1,395 kcal', '10 × 70 + 6.25 × 165 − 5 × 35 − 161 = 1,395 kcal burned at complete rest.'],
      ['TDEE ≈ 2,160 kcal', '1,395 × 1.55 (moderately active) = maintenance calories per day.'],
      ['Target ≈ 1,730 kcal', '2,160 × 0.80 = a 20% deficit of about 430 kcal, roughly 0.4 kg of loss per week.'],
      ['Protein 126 g (504 kcal)', '1.8 g per kg of body weight protects muscle while dieting.'],
      ['Fat 56 g (504 kcal)', '0.8 g per kg, about 29% of calories, supports hormones and satiety.'],
      ['Carbs 180 g (722 kcal)', 'The remaining calories ÷ 4 kcal per gram fuel training and daily activity.'],
    ],
    alt: 'Six-step worked example of calculating macros for weight loss, from BMR and TDEE to grams of protein, fat and carbohydrate',
    caption: 'Protein and fat are set per kilogram first; carbohydrates fill whatever calories remain.',
    footer: 'Get your numbers: talkandtool.com/tools/macro-calculator',
  },
  html: `
<p>To calculate macros for weight loss, estimate your daily calorie burn, subtract a moderate deficit, set protein and fat in grams per kilogram of body weight, and give the remaining calories to carbohydrates. Below is the full method with a worked example, so you can check any macro calculator's numbers by hand.</p>

<p><em>This is general information, not medical advice. If you are pregnant, have a medical condition, or have a history of disordered eating, talk to a doctor or registered dietitian before changing your diet.</em></p>

<h2>The numbers you need</h2>
<p>Every macro plan rests on four facts:</p>
<ul>
<li>Protein has <strong>4 kcal</strong> per gram.</li>
<li>Carbohydrate has <strong>4 kcal</strong> per gram.</li>
<li>Fat has <strong>9 kcal</strong> per gram.</li>
<li>Alcohol has <strong>7 kcal</strong> per gram and counts toward calories but not toward any macro.</li>
</ul>

<h2>Step 1: Estimate your BMR</h2>
<p>Basal metabolic rate is the energy you burn at complete rest. The Mifflin-St Jeor equation is the most widely used estimate:</p>
<ul>
<li><strong>Men:</strong> 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5</li>
<li><strong>Women:</strong> 10 × weight (kg) + 6.25 × height (cm) − 5 × age − 161</li>
</ul>
<p>For our example, a 35-year-old woman who is 70 kg and 165 cm: 700 + 1,031 − 175 − 161 = <strong>1,395 kcal</strong>.</p>

<h2>Step 2: Multiply by activity to get TDEE</h2>
<p>Total daily energy expenditure adds everything you do on top of resting. The standard multipliers:</p>
<ul>
<li>1.2: sedentary (desk job, little exercise)</li>
<li>1.375: lightly active (exercise 1–3 days a week)</li>
<li>1.55: moderately active (exercise 3–5 days a week)</li>
<li>1.725: very active (hard exercise 6–7 days a week)</li>
<li>1.9: extremely active (physical job plus training)</li>
</ul>
<p>Most people overestimate their activity. If unsure, pick the lower level. Our example: 1,395 × 1.55 = <strong>about 2,160 kcal</strong> to maintain weight.</p>

<h2>Step 3: Subtract a deficit</h2>
<p>A deficit of 15–25% below TDEE is a common, sustainable range. It usually produces a loss of about 0.5–1% of body weight per week. Larger deficits speed things up at first but make hunger, muscle loss and rebound more likely.</p>
<p>Example: 2,160 × 0.80 = <strong>about 1,730 kcal per day</strong>.</p>

<h2>Step 4: Set protein first</h2>
<p>Protein is the most important macro when dieting: it helps preserve muscle and is the most filling per calorie. A common evidence-based target during weight loss is <strong>1.6–2.2 g per kg of body weight</strong>, especially with resistance training. If you have a lot of weight to lose, base it on your goal weight instead.</p>
<p>Example: 1.8 × 70 = <strong>126 g protein</strong> = 504 kcal.</p>

<h2>Step 5: Set fat, then carbs</h2>
<p>Fat supports hormone production and absorption of fat-soluble vitamins. Around <strong>0.6–1.0 g per kg</strong>, or 20–35% of calories, is a sensible range. Example: 0.8 × 70 = <strong>56 g fat</strong> = 504 kcal.</p>
<p>Carbohydrates get whatever calories remain: 1,730 − 504 − 504 = 722 kcal ÷ 4 = <strong>about 180 g carbs</strong>.</p>

{{infographic}}

<p>Final plan: <strong>1,730 kcal, 126 g protein, 56 g fat, 180 g carbs</strong>. That works out to roughly 29% protein, 29% fat and 42% carbs. The <a href="/tools/macro-calculator">macro calculator</a> splits your calories into protein, carb and fat grams, with a weight-loss preset. It also shows your protein per kilogram, so you can check it against the 1.6–2.2 g range.</p>

<h2>Percentage splits vs grams per kilogram</h2>
<p>Many macro calculators use a fixed split like 40/30/30. That is simple, but it scales protein with calories rather than body size. A heavier, very active person on 3,000 kcal would get 225 g of protein at 30%, and a small person on 1,400 kcal only 105 g. Setting protein and fat per kilogram and letting carbs flex is more accurate for both. Use percentages as a sanity check, not the starting point.</p>

<h2>Adjusting after two to three weeks</h2>
<p>Every equation is an estimate. Individual metabolism varies by a few hundred calories either way. Weigh yourself under the same conditions several times a week and compare weekly averages:</p>
<ul>
<li><strong>Losing 0.5–1% a week:</strong> keep going.</li>
<li><strong>No change after 2–3 weeks:</strong> reduce calories by 100–200, preferably from carbs or fat, not protein.</li>
<li><strong>Losing faster than about 1% a week</strong> and feeling drained: add 100–200 kcal back.</li>
</ul>
<p>Recalculate every 4–5 kg of weight lost, because a lighter body burns less.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Counting exercise calories twice,</strong> once in the activity multiplier and again by "eating back" tracker estimates.</li>
<li><strong>Setting calories too low.</strong> Very low intakes are hard to sustain and make adequate protein and nutrients difficult. A registered dietitian can set a floor that suits you.</li>
<li><strong>Ignoring cooking oils, sauces and drinks,</strong> which can easily add several hundred untracked calories a day.</li>
<li><strong>Chasing perfect numbers.</strong> Landing within about 10 g of protein and 100 kcal of the target most days is enough.</li>
</ul>
<p>If you want a broader picture than the scale, the <a href="/tools/body-fat-calculator">body fat calculator</a> tracks composition, and we explain the limits of weight-based measures in <a href="/blogs/article/is-bmi-accurate-what-it-measures">is BMI accurate?</a>. For maintenance calories on their own, use the <a href="/tools/calorie-calculator">calorie calculator</a>.</p>

<h2>Frequently asked questions</h2>
<h3>What is the best macro ratio for weight loss?</h3>
<p>There is no single best ratio. Total calories drive weight loss; protein drives how much of it is fat rather than muscle. Set protein high (1.6–2.2 g/kg), keep fat moderate, and fill the rest with carbs you enjoy.</p>
<h3>How do I calculate calories from macros?</h3>
<p>Multiply grams of protein and carbs by 4 and grams of fat by 9, then add them up. For example, 126 g protein, 56 g fat and 180 g carbs give 504 + 504 + 720 = 1,728 kcal.</p>
<h3>Are macro calculators for women different?</h3>
<p>The method is the same. The BMR equation uses −161 instead of +5, which lowers the calorie estimate, and protein is set by body weight, so it adjusts automatically.</p>
`,
};
