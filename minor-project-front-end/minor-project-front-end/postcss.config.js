module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': "postcss-nesting",
    "@tailwindcss/jit": {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
}
