/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        'surface-muted': '#e3e7ee',
        ink: '#1b2430',
        'ink-muted': '#5b6472',
        border: '#d7dce4',
        warm: '#e2a63b',
        cool: '#2f8fa6',
        low: '#c1594a',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};