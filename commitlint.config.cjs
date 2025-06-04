module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New Features
        'fix', // Fix the error
        'improve', // Improve code
        'refactor', // Refactoring code
        'docs', // Add documents
        'chore', // Minor changes in development
        'style', // Fix typography, formatting, no logic impact
        'test', // Write test
        'revert', // Revert previous commit
        'ci', // Change CI/CD configuration
        'build' // Build file
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-empty': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72]
  }
}
