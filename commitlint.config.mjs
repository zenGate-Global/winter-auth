export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only changes
        'style',    // Changes that don't affect code meaning
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding missing tests or correcting existing tests
        'build',    // Changes that affect build system or external dependencies
        'ci',       // Changes to CI configuration files and scripts
        'chore',    // Other changes that don't modify src or test files
        'revert'    // Reverts a previous commit
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',           // Authorization module changes
        'metadata',       // Image metadata module changes
        'providers',      // Provider system changes
        'aws',           // AWS Rekognition provider
        'proxy',         // Proxy client changes
        'web',           // Documentation website
        'deps',          // Dependency updates
        'release',       // Release related changes
        'config'         // Configuration changes
      ]
    ]
  }
};