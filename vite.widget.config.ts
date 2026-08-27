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
      output: {
        banner: 'if (typeof window !== "undefined" && !window.process) { window.process = { env: { NODE_ENV: "production" } }; }',
      }
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
