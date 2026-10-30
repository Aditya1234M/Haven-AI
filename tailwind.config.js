/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4A853',
          'gold-light': '#E8C97A',
          'gold-dark': '#B8902E',
          rose: '#E8A0BF',
          'rose-light': '#F0C0D4',
          emerald: '#50C878',
          indigo: '#4F46E5',
          'indigo-light': '#818CF8',
        },
        surface: {
          '50': '#0A0A0F',
          '100': '#12121A',
          '200': '#1A1A25',
          '300': '#222233',
          '400': '#2A2A3D',
          '500': '#333348',
          '600': '#444460',
          '700': '#666680',
          '800': '#8888A0',
          '900': '#AAAAC0',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.08)',
          bg: 'rgba(255, 255, 255, 0.03)',
          'bg-hover': 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4A853 0%, #E8C97A 50%, #D4A853 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0A0A0F 0%, #1A1A25 40%, #12121A 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'gold': '0 4px 24px rgba(212, 168, 83, 0.25)',
        'glow': '0 0 40px rgba(212, 168, 83, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 83, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 83, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
