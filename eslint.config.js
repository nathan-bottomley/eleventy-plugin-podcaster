import neostandard from 'neostandard'

export default [
  ...neostandard(),
  {
    rules: {
      '@stylistic/comma-dangle': ['error', 'never']
    }
  }
]
