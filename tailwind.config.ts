import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
      },
      colors: {
        coffee: {
          bg: '#0B0706',
          'bg-alt': '#140C09',
          primary: '#D8A778',
          accent: '#8D4F27',
          cream: '#F2E7DC',
          muted: '#6B5847',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'coffee-radial':
          'radial-gradient(circle at 50% 45%, rgba(216,167,120,0.18) 0%, rgba(141,79,39,0.06) 35%, rgba(11,7,6,0) 70%)',
      },
      keyframes: {
        steam: {
          '0%': { opacity: '0', transform: 'translateY(0) scaleX(1)' },
          '15%': { opacity: '0.6' },
          '50%': { opacity: '0.35', transform: 'translateY(-40px) scaleX(1.3)' },
          '100%': { opacity: '0', transform: 'translateY(-90px) scaleX(1.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(8deg)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        steam: 'steam 4s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
