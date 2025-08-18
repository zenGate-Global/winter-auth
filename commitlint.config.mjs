/**
 * CommitLint Configuration for Winter Auth
 *
 * 🔄 RELEASE WORKFLOW:
 * - Releases are triggered automatically on push to 'main' branch
 * - Uses semantic-release with conventional commits to determine version bumps
 * - Only 'feat', 'fix', and 'perf' types trigger NPM releases
 * - Other types run CI tests but don't publish new versions
 *
 * 📦 NPM PUBLISH TRIGGERS:
 * - feat: → Minor release (new features)
 * - fix/perf: → Patch release (bug fixes/improvements)
 * - feat!/fix! or "BREAKING CHANGE:" → Major release
 *
 * 🚫 NO PUBLISH:
 * - docs, style, refactor, test, build, ci, chore, revert
 *
 *  MAJOR VERSION RELEASE (x.0.0 → y.0.0) + NPM PUBLISH
 *  - Add "BREAKING CHANGE:" in commit body or "!" after type (e.g., feat!:)
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature - adds functionality
        "fix", // Bug fix - fixes existing functionality
        "perf", // Performance improvement - improves existing code
        "docs", // Documentation only changes
        "style", // Code formatting, semicolons, etc. (no logic changes)
        "refactor", // Code restructuring without changing external behavior
        "test", // Adding/updating tests only
        "build", // Build system, webpack, dependencies (non-breaking)
        "ci", // CI/CD configuration changes (.github/workflows, etc.)
        "chore", // Maintenance tasks, package.json scripts, etc.
        "revert", // Reverts a previous commit
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "auth", // Authorization module changes
        "metadata", // Image metadata module changes
        "providers", // Provider system changes
        "aws", // AWS Rekognition provider
        "proxy", // Proxy client changes
        "web", // Documentation website
        "deps", // Dependency updates
        "release", // Release related changes
        "config", // Configuration changes
      ],
    ],
    "body-max-line-length": [0, "always"], // Disable line length check for semantic-release
  },
};
