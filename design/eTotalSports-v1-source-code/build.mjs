import { build } from 'esbuild';
await build({ entryPoints: ['src/main.jsx'], bundle: true, minify: true, format: 'iife', outfile: 'dist/app.js', jsx: 'transform', loader: { '.js': 'jsx' }, define: { 'process.env.NODE_ENV': '"production"' }, target: 'es2020', legalComments: 'none', logLevel: 'warning' });
