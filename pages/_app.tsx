import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import { store } from '@/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextNProgress
        color="#FFD700"
        startPosition={0.3}
        stopDelayMs={200}
        height={1}
        showOnShallow={true}
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