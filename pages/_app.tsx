import '@/styles/globals.css';

import type { AppProps } from 'next/app';

// Suppress the web-vitals "Cannot read properties of undefined (reading 'startTime')"
// error that Next.js 15's internal PerformanceObserver emits in dev when browser
// extensions or React 19 RC concurrent renders produce malformed PerformanceEntry
// objects. This is a framework/extension issue — not application code.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      msg.includes("Cannot read properties of undefined") &&
      new Error().stack?.includes('reportAllChanges')
    ) {
      return; // swallow web-vitals observer noise
    }
    originalError(...args);
  };
}
import { AppProgressBar as NextNProgress } from 'next-nprogress-bar';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import { store } from '@/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextNProgress
        color="#FFD700"
        height="1px"
        shallowRouting
        options={{ easing: 'ease', speed: 500 }}
      />
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: '13px',
            borderRadius: '999px',
            padding: '10px 16px',
          },
        }}
      />
    </Provider>
  );
}

export default MyApp;