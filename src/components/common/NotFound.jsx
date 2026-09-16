import { Link } from 'react-router-dom';
import Seo from './Seo.jsx';

const SUGGESTIONS = [
  ['/tools', 'All free tools', 'Calculators, converters, text and developer utilities.'],
  ['/blogs', 'Blog', 'Guides, tutorials, and practical how-tos.'],
  ['/tools/word-counter', 'Word counter', 'Count words, characters, and reading time.'],
  ['/tools/percentage-calculator', 'Percentage calculator', 'Percentages, changes, and shares.'],
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-950 px-4 py-24 text-white">
      <Seo title="Page Not Found" description="This page could not be found." path="/404" noindex />
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-300">404 error</p>
        <h1 className="mt-4 text-4xl font-black">Page not found</h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-400">
          The page may have moved, or the address may be mistyped. Here are a few places to pick up from.
        </p>
        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {SUGGESTIONS.map(([to, label, description]) => (
            <Link key={to} to={to} className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/60">
              <strong className="text-white">{label}</strong>
              <span className="mt-1 block text-sm text-slate-500">{description}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
