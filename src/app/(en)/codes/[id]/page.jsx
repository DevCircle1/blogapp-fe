import CodeShare from '../../../../components/tools/CodeShare.jsx';

// Any id renders the same shell; the component reads the id from the URL in the browser.
export const dynamicParams = true;
export const generateStaticParams = () => [];

export default function Page() {
  return <CodeShare />;
}
