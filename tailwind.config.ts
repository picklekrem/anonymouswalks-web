import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        border: '#1C1C1C',
        accent: '#6E56CF',
        'accent-light': '#8b7cf8',
        success: '#30D158',
        destructive: '#FF3B30',
        primary: '#FFFFFF',
        secondary: '#888888',
        tertiary: '#444444',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(110,86,207,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(110,86,207,0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
