import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="min-h-[70vh] bg-slate-950 px-4 py-24 text-center text-white">
    <Helmet><title>Page Not Found | Talk & Tool</title><meta name="robots" content="noindex, nofollow" /></Helmet>
    <p className="text-sm font-bold uppercase tracking-widest text-indigo-300">404 error</p>
    <h1 className="mt-4 text-4xl font-black">Page not found</h1>
    <p className="mx-auto mt-4 max-w-lg text-slate-400">The page may have moved or the address may be incorrect.</p>
    <Link to="/tools" className="mt-8 inline-block rounded-xl bg-indigo-500 px-5 py-3 font-semibold hover:bg-indigo-400">Browse free tools</Link>
  </main>;
}
