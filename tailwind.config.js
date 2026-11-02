// Configuration Tailwind du portfolio.
// Le CSS est généré une fois et intégré dans index.html (plus rapide que le CDN,
// qui surveillait la page en continu pendant le scroll).
// Après avoir ajouté de nouvelles classes Tailwind dans index.html : npm run build:css
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        // Palette inspirée de victor.work : bleu nuit #001446, beige #E2DED4 / #DBD6C9, accent rouge #8C0000
        ink:    { DEFAULT: '#001446', 2: '#0A1E52', 3: '#13285E' },
        accent: { DEFAULT: '#8C0000', 900: '#5A0000', 700: '#6E0000', 400: '#BF2020', 300: '#E6A79C', 200: '#F0CFC7' },
        paper:  { DEFAULT: '#E2DED4', 2: '#DBD6C9', 3: '#CEC8B9' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
};
