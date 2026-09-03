module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
    theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        'accent-pink': 'var(--accent-pink)',
        'accent-orange': 'var(--accent-orange)',
        'accent-gold': 'var(--accent-gold)',
        'accent-blue': 'var(--accent-blue)',
        'gold-light': 'var(--gold-light)',
        'orange-light': 'var(--orange-light)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-on-primary': 'var(--text-on-primary)',
        border: 'var(--border)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
    },
  },
  plugins: [],
}