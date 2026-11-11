import RootDocument from '../_components/RootDocument.jsx';

export const viewport = { themeColor: '#020617' };

/** Root layout for the English site, served from the domain root. */
export default function EnglishLayout({ children }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
