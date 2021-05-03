import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    target: 'es2020'
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  },
  plugins: [visualizer()],
  resolve: {
    alias: {
      // minified
      pako: resolve(__dirname, './node_modules/pako/dist/pako.min.js'),
      // ditto; npm import showed up uninvited in workers and crashed them
      'pixi.js': resolve(__dirname, './static/scripts/pixi.min.mjs'),
      // local aliases
      '@ui': resolve(__dirname, './src/ui'),
      '@utils': resolve(__dirname, './src/utils'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
      '@core': resolve(__dirname, './src/core'),
      '@workers': resolve(__dirname, './src/workers')
    }
  }
});
