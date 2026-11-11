'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

/**
 * The rich-text editor. Quill reads the DOM when it is imported, so it is loaded
 * in the browser only; the server renders a placeholder of the same height. React
 * 19 passes `ref` through as a normal prop, so callers can still use
 * ref.current.getEditor().
 */
const QuillEditor = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-96 mb-12 animate-pulse rounded-md bg-gray-100" aria-hidden="true" />,
});

export default QuillEditor;
