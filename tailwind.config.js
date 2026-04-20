/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/views/**/*.html.erb',
    './app/views/**/*.html.haml',
    './app/views/**/*.html.slim',
    './app/javascript/**/*.js',
    './app/javascript/**/*.jsx',
    './app/javascript/**/*.ts',
    './app/javascript/**/*.tsx',
    './app/components/**/*.rb',
  ],
  theme: {
    extend: {
      colors: {
        board: {
          backdrop: '#f8fafc',
          column: '#e2e8f0',
          'column-header': '#cbd5e1',
          'card-bg': '#ffffff',
          'card-border': '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
}
