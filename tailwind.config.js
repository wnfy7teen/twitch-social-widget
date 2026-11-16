/**
 @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'insta-gradient-start': '#feda75',
        'insta-gradient-end': '#d62976',
        'telegram-blue': '#0088cc',
        'glass-background': 'rgba(255,255,255,0.1)',
        'gray-transparent': 'rgba(0,0,0,0.001)',
      },
      backdropBlur: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '16px'
      }
    }
  },
  plugins: []
}
