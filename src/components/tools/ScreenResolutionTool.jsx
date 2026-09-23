import React, { useState, useEffect } from 'react';
import { StandaloneToolSeo, ToolContentSections } from './StandaloneToolSeo.jsx';
import {
  SCREEN_RESOLUTION_INTRO, SCREEN_RESOLUTION_EXTRA_PARAGRAPHS, SCREEN_RESOLUTION_STEPS, SCREEN_RESOLUTION_FAQS as FAQS,
} from './screenResolutionContent.js';

const ScreenResolutionTool = () => {
  const [info, setInfo] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const read = () => setInfo({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth,
      orientation: window.innerWidth >= window.innerHeight ? 'Landscape' : 'Portrait',
    });
    read();
    window.addEventListener('resize', read);
    window.addEventListener('orientationchange', read);
    return () => {
      window.removeEventListener('resize', read);
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  const copy = async () => {
    if (!info) return;
    try {
      await navigator.clipboard.writeText(`Viewport: ${info.viewportWidth}x${info.viewportHeight}, Screen: ${info.screenWidth}x${info.screenHeight}, DPR: ${info.pixelRatio}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  const breakpoint = !info ? '' : info.viewportWidth < 640 ? 'Mobile (below sm)'
    : info.viewportWidth < 768 ? 'Small (sm)'
      : info.viewportWidth < 1024 ? 'Tablet (md)'
        : info.viewportWidth < 1280 ? 'Laptop (lg)'
          : info.viewportWidth < 1536 ? 'Desktop (xl)' : 'Large desktop (2xl)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <StandaloneToolSeo
        title="What Is My Screen Resolution? Free Screen Size Checker"
        description="Check your screen resolution, browser viewport size, device pixel ratio, colour depth, and current CSS breakpoint instantly. Free and updates live as you resize."
        path="/screen-resolution"
        category="Screen Resolution Checker"
        intro="Instantly see your display resolution, browser viewport size, and pixel ratio."
        steps={[
          'The values below are read from your browser as soon as the page loads.',
          'Resize the window and watch the viewport figures update live.',
          'Compare viewport width against screen width to see how much space the browser chrome takes.',
          'Copy the full summary in one click when reporting a bug or a layout issue.',
        ]}
        faqs={FAQS}
      />

      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">What is my screen resolution?</h1>
            <p className="mt-2 text-gray-600">Live viewport, display, and pixel ratio information from your browser</p>
          </div>

          <div className="mb-6 rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Browser viewport</p>
            <div className="mt-2 text-4xl font-bold text-gray-800">
              {info ? <>{info.viewportWidth} <span className="text-gray-400">×</span> {info.viewportHeight}</> : '—'}
            </div>
            <p className="text-gray-600">pixels</p>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            {[
              ['Screen width', info && `${info.screenWidth}px`, 'bg-blue-50 text-blue-600'],
              ['Screen height', info && `${info.screenHeight}px`, 'bg-purple-50 text-purple-600'],
              ['Available width', info && `${info.availWidth}px`, 'bg-emerald-50 text-emerald-600'],
              ['Available height', info && `${info.availHeight}px`, 'bg-amber-50 text-amber-600'],
              ['Device pixel ratio', info && `${info.pixelRatio}×`, 'bg-cyan-50 text-cyan-600'],
              ['Colour depth', info && `${info.colorDepth}-bit`, 'bg-rose-50 text-rose-600'],
              ['Orientation', info && info.orientation, 'bg-indigo-50 text-indigo-600'],
              ['CSS breakpoint', breakpoint, 'bg-slate-100 text-slate-700'],
            ].map(([label, value, tone]) => (
              <div key={label} className={`rounded-lg p-4 text-center ${tone.split(' ')[0]}`}>
                <dt className={`text-sm font-semibold ${tone.split(' ')[1]}`}>{label}</dt>
                <dd className="mt-1 text-lg font-medium text-gray-800">{value || '—'}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={copy}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {isCopied ? 'Copied to clipboard' : 'Copy all values'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">Resize your browser window to see the viewport figures change in real time.</p>
        </div>
      </div>

      <ToolContentSections
        light
        heading="About this screen resolution checker"
        intro={SCREEN_RESOLUTION_INTRO}
        extraParagraphs={SCREEN_RESOLUTION_EXTRA_PARAGRAPHS}
        steps={SCREEN_RESOLUTION_STEPS}
        faqs={FAQS}
        related={[
          { to: '/check-ip', label: 'IP Address Checker', description: 'See your public IP address and network details.' },
          { to: '/tools/color-converter', label: 'Colour Converter', description: 'Convert between HEX, RGB, and HSL with contrast checks.' },
          { to: '/tools/css-gradient-generator', label: 'CSS Gradient Generator', description: 'Build linear and radial gradients visually.' },
          { to: '/tools/user-agent-parser', label: 'User Agent Parser', description: 'Identify the browser, engine, and device from a user agent string.' },
        ]}
      />
    </div>
  );
};

export default ScreenResolutionTool;
