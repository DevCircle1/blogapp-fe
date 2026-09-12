/**
 * French page copy for the tool catalogue: page chrome, the /fr directory,
 * and every tool's title, description, guide, and FAQ.
 *
 * Written for French speakers rather than translated from English — the
 * keywords, examples, VAT rates, the 35-hour week, and the marge/marque
 * distinction are the ones people there actually search for and use.
 */
import { developerTools } from './fr/developer.js';
import { calculatorTools } from './fr/calculators.js';
import { financeTools } from './fr/finance.js';
import { textTools } from './fr/text.js';
import { datetimeTools } from './fr/datetime.js';
import { healthTools } from './fr/health.js';
import { seoTools } from './fr/seo.js';

export default {
  chrome: {
    home: 'Accueil',
    tools: 'Outils',
    breadcrumb: 'Fil d’Ariane',
    toolRegion: 'Outil : {name}',
    privacy: 'Tout est calculé dans votre navigateur. Ce que vous saisissez n’est envoyé à aucun serveur.',
    about: '{name} : à quoi ça sert',
    howTo: '{name} : mode d’emploi',
    formula: 'La formule utilisée',
    faq: 'Questions fréquentes',
    related: 'Outils associés',
    browseAll: 'Voir tous les outils →',
    alsoAvailable: 'Également disponible en :',
    openTool: 'Ouvrir l’outil',
    notFoundTitle: 'Outil introuvable',
    notFoundBody: 'Cette adresse ne correspond à aucun outil. Consultez le répertoire complet pour trouver celui qu’il vous faut.',
  },
  categories: {
    Calculator: { name: 'Calculatrices', blurb: 'Les maths du quotidien : pourcentages, moyennes, produit en croix, fractions, âge et conversion d’unités.' },
    Finance: { name: 'Finances', blurb: 'Prêts, crédit immobilier, intérêts, TVA, marges et les calculs qui font tourner une petite entreprise.' },
    Health: { name: 'Santé', blurb: 'IMC, calories, macros, masse grasse, hydratation et date d’accouchement, avec les limites de chaque méthode.' },
    Developer: { name: 'Développement', blurb: 'JSON, Base64, JWT, regex, hachage, couleurs, CSS et les tableaux de référence que vous cherchez sans arrêt.' },
    Security: { name: 'Sécurité', blurb: 'Générez et testez des mots de passe, vérifiez cartes et e-mails sans que rien ne quitte votre navigateur.' },
    Text: { name: 'Texte', blurb: 'Comptez, changez la casse, triez, dédoublonnez, comparez et nettoyez vos textes avant publication.' },
    'Date & Time': { name: 'Dates et heures', blurb: 'Jours entre deux dates, échéances, jours ouvrés, heures travaillées, compte à rebours et timestamps Unix.' },
    SEO: { name: 'SEO', blurb: 'Mots-clés, longue traîne, planification de contenu et regroupement thématique avec des méthodes transparentes.' },
  },
  hub: {
    title: 'Outils en ligne gratuits : calculatrices et convertisseurs',
    description: 'Calculatrices, convertisseurs et utilitaires en ligne gratuits en français : pourcentage, TVA, produit en croix, IMC, compteur de mots et plus.',
    heading: 'Des outils en ligne gratuits, utilisables immédiatement',
    body: 'Calculatrices, convertisseurs, utilitaires de texte et outils pour développeurs. Rien à installer, aucune inscription et vos données ne quittent pas votre navigateur.',
    badge: '{n} outils, tous gratuits',
    searchLabel: 'Rechercher un outil',
    searchPlaceholder: 'Cherchez : pourcentage, TVA, IMC, JSON…',
    shown: '{shown} outils sur {total}',
    empty: 'Aucun outil ne correspond à « {q} ». Essayez un terme plus général.',
    paragraphs: [
      ['Des outils utiles, sans téléchargement ni inscription', 'Talk & Tool rassemble les petits utilitaires que l’on cherche tous les jours — un pourcentage, la mensualité d’un prêt, la TVA d’une facture, un nombre de mots, un JSON qui refuse de se valider — dans une interface cohérente. Chaque outil s’ouvre immédiatement, fonctionne sur mobile et explique la méthode derrière le résultat au lieu d’afficher un simple chiffre.'],
      ['Pensés pour le français et pour vos usages', 'Les outils utilisent la virgule décimale et le format numérique de votre pays, l’euro comme devise par défaut, les taux de TVA français et des repères locaux comme le produit en croix, la semaine de 35 heures ou la distinction entre taux de marge et taux de marque. Tout est calculé dans votre navigateur : ce que vous saisissez ne part jamais vers un serveur.'],
    ],
    faqs: [
      { q: 'Les outils sont-ils vraiment gratuits ?', a: 'Oui. Tous sont gratuits, sans compte, sans période d’essai et sans limite d’utilisation. Le site est financé par la publicité et non en facturant les outils.' },
      { q: 'Mes données sont-elles envoyées à un serveur ?', a: 'Non. Les calculatrices, les convertisseurs et les utilitaires de texte s’exécutent entièrement dans votre navigateur. Les textes que vous collez et les nombres que vous saisissez ne quittent pas votre appareil.' },
      { q: 'Les outils fonctionnent-ils sur mobile ?', a: 'Oui. Tous s’adaptent à n’importe quel écran et fonctionnent dans tout navigateur moderne, sur mobile comme sur ordinateur. Rien à installer.' },
      { q: 'Puis-je utiliser les résultats dans un cadre professionnel ?', a: 'Oui, pour un usage personnel, scolaire ou commercial. Les calculatrices sont fournies à titre indicatif et ne remplacent pas l’avis d’un professionnel en matière financière, médicale ou juridique.' },
    ],
  },
  tools: {
    ...developerTools,
    ...calculatorTools,
    ...financeTools,
    ...textTools,
    ...datetimeTools,
    ...healthTools,
    ...seoTools,
  },
};
