const tokens = require('./frontendDevAgt/design-tokens.json');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        background: tokens.colors.background,
        textPrimary: tokens.colors.textPrimary,
        textSecondary: tokens.colors.textSecondary,
        accent: tokens.colors.accent
      },
      fontFamily: {
        heading: tokens.fonts.heading,
        body: tokens.fonts.body
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl
      },
      borderRadius: {
        sm: tokens.borderRadius.small,
        lg: tokens.borderRadius.large
      }
    }
  },
  plugins: []
};
