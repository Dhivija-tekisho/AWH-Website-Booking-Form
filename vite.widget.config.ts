import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    outDir: 'dist/widget',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/WidgetEntry.tsx'),
      name: 'AWHChatWidget',
      fileName: () => 'widget.js',
      formats: ['iife'],
    },
    rollupOptions: {
      // Don't externalize React/ReactDOM so they are bundled into the widget
    },
  },
  define: {
    'process.env': {}
  }
});
