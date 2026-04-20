const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['app/javascript/application.jsx'],
  bundle: true,
  outfile: 'app/assets/builds/application.js',
  minify: !isWatch,
  sourcemap: true,
  target: ['es2020'],
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
  },
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
};

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  });
} else {
  esbuild.build(buildOptions).then(() => {
    console.log('Build complete!');
  }).catch(() => process.exit(1));
}
