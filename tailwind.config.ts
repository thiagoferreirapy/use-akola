import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        akola: {
          brand: '#0E5C57',
          success: '#4FC3A1',
          water: '#3B82C4',
          toilet: '#7767C7',
          warning: '#D89B35',
          danger: '#D85B5B',
          background: '#F7F8F6',
          surface: '#FFFFFF',
          text: '#17211F',
          muted: '#687471',
          border: '#E4E9E6',
          soft: '#EEF4F1'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(23, 33, 31, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
