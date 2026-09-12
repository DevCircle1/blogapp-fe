/**
 * Brazilian Portuguese page copy for the tool catalogue: page chrome, the /pt
 * directory, and every tool's title, description, guide, and FAQ.
 *
 * Written for Brazil rather than translated from English — the keywords,
 * examples, tax rules (ICMS por dentro), CLT working hours, and currency
 * references are the ones people there actually search for and use.
 */
import { developerTools } from './pt/developer.js';
import { calculatorTools } from './pt/calculators.js';
import { financeTools } from './pt/finance.js';
import { textTools } from './pt/text.js';
import { datetimeTools } from './pt/datetime.js';
import { healthTools } from './pt/health.js';
import { seoTools } from './pt/seo.js';

export default {
  chrome: {
    home: 'Início',
    tools: 'Ferramentas',
    breadcrumb: 'Trilha de navegação',
    toolRegion: 'Ferramenta: {name}',
    privacy: 'Tudo é calculado no seu navegador. O que você digita não é enviado para nenhum servidor.',
    about: '{name}: para que serve',
    howTo: '{name}: como usar',
    formula: 'A fórmula usada',
    faq: 'Perguntas frequentes',
    related: 'Ferramentas relacionadas',
    browseAll: 'Ver todas as ferramentas →',
    alsoAvailable: 'Também disponível em:',
    openTool: 'Abrir ferramenta',
    notFoundTitle: 'Ferramenta não encontrada',
    notFoundBody: 'Esse endereço não corresponde a nenhuma ferramenta. Veja o diretório completo para encontrar a que você precisa.',
  },
  categories: {
    Calculator: { name: 'Calculadoras', blurb: 'Matemática do dia a dia: porcentagem, média, regra de três, frações, idade e conversão de unidades.' },
    Finance: { name: 'Finanças', blurb: 'Empréstimos, financiamento, juros, impostos, margem de lucro e as contas por trás de um pequeno negócio.' },
    Health: { name: 'Saúde', blurb: 'IMC, calorias, macros, gordura corporal, hidratação e data do parto, com os limites de cada método explicados.' },
    Developer: { name: 'Desenvolvimento', blurb: 'JSON, Base64, JWT, regex, hashes, cores, CSS e as tabelas de referência que você sempre procura de novo.' },
    Security: { name: 'Segurança', blurb: 'Gere e teste senhas e valide cartões e e-mails sem que nada saia do seu navegador.' },
    Text: { name: 'Texto', blurb: 'Conte palavras, mude maiúsculas, ordene, remova duplicados, compare e limpe textos antes de publicar.' },
    'Date & Time': { name: 'Datas e horas', blurb: 'Dias entre datas, prazos, dias úteis, horas trabalhadas, contagem regressiva e timestamps Unix.' },
    SEO: { name: 'SEO', blurb: 'Palavras-chave, cauda longa, planejamento de conteúdo e agrupamento temático com métodos transparentes.' },
  },
  hub: {
    title: 'Ferramentas online grátis: calculadoras e conversores',
    description: 'Calculadoras, conversores e utilitários online grátis em português: porcentagem, regra de três, juros compostos, IMC, contador de palavras e mais.',
    heading: 'Ferramentas online grátis que funcionam na hora',
    body: 'Calculadoras, conversores, utilitários de texto e ferramentas para desenvolvedores. Sem instalar nada, sem cadastro e sem que seus dados saiam do navegador.',
    badge: '{n} ferramentas, todas grátis',
    searchLabel: 'Buscar ferramentas',
    searchPlaceholder: 'Busque: porcentagem, regra de três, IMC, JSON…',
    shown: '{shown} de {total} ferramentas',
    empty: 'Nenhuma ferramenta corresponde a “{q}”. Tente um termo mais geral.',
    paragraphs: [
      ['Ferramentas úteis sem download e sem cadastro', 'O Talk & Tool reúne os pequenos utilitários que as pessoas procuram todo dia — uma porcentagem, a parcela de um empréstimo, o imposto de uma venda, a contagem de palavras de um texto ou um JSON que não valida — em uma interface consistente. Cada ferramenta abre na hora, funciona no celular e explica o método por trás do resultado em vez de só mostrar um número.'],
      ['Adaptadas ao português e ao Brasil', 'As ferramentas usam vírgula decimal e o formato numérico do seu país, o real como moeda padrão, a jornada de 44 horas da CLT e exemplos próximos, como a regra de três ou o cálculo de imposto por dentro. Tudo roda no seu navegador, então o que você digita nunca vai para um servidor.'],
    ],
    faqs: [
      { q: 'As ferramentas são realmente grátis?', a: 'Sim. Todas são gratuitas, sem conta, sem período de teste e sem limite de uso. O site se mantém com publicidade, não cobrando pelas ferramentas.' },
      { q: 'Meus dados são enviados para algum servidor?', a: 'Não. As calculadoras, os conversores e os utilitários de texto rodam inteiramente no seu navegador. Os textos que você cola e os números que digita não saem do seu aparelho.' },
      { q: 'Funcionam no celular?', a: 'Sim. Todas as ferramentas se adaptam a qualquer tela e funcionam em qualquer navegador moderno, no celular ou no computador. Não é preciso instalar nada.' },
      { q: 'Posso usar os resultados no meu trabalho?', a: 'Sim, em trabalhos pessoais, acadêmicos ou comerciais. As calculadoras são informativas e não substituem orientação financeira, médica ou jurídica de um profissional.' },
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
