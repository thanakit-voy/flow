#!/usr/bin/env node
/**
 * Branch validation for husky hooks
 * - pre-push: block push to protected branches (main, master)
 * - pre-rebase: block rebase when on protected branch
 * - pre-merge-commit: block merge commit on protected branch
 * - pre-commit: block direct commit on protected branch
 *
 * Branch naming: feature/*, bugfix/*, hotfix/*, release/*, develop, main, master
 */

const { execSync } = require('child_process');

const CONFIG = {
  protectedBranches: ['main', 'master'],
  allowedBranchPatterns: [
    /^main$/,
    /^master$/,
    /^develop$/,
    /^staging$/,
    /^feature\/.+/,
    /^bugfix\/.+/,
    /^hotfix\/.+/,
    /^release\/.+/,
  ],
};

function getCurrentBranch() {
  return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
}

function isProtectedBranch(branch) {
  return CONFIG.protectedBranches.includes(branch);
}

function isAllowedBranchName(name) {
  return CONFIG.allowedBranchPatterns.some((re) => re.test(name));
}

function fail(msg) {
  console.error('\x1b[31m%s\x1b[0m', msg);
  process.exit(1);
}

function run(mode) {
  switch (mode) {
    case 'pre-push': {
      // stdin: <local_ref> <local_sha> <remote_ref> <remote_sha>
      let input = '';
      process.stdin.setEncoding('utf-8');
      process.stdin.on('data', (chunk) => (input += chunk));
      process.stdin.on('end', () => {
        const lines = input.trim().split('\n').filter(Boolean);
        for (const line of lines) {
          const parts = line.split(/\s+/);
          if (parts.length >= 3) {
            const remoteRef = parts[2];
            const remoteBranch = remoteRef.replace(/^refs\/heads\//, '');
            if (isProtectedBranch(remoteBranch)) {
              fail(
                `\n❌ Pushing directly to protected branch "${remoteBranch}" is not allowed.\n` +
                  `   Create a feature branch and open a Pull Request instead.\n`
              );
            }
            if (!isAllowedBranchName(remoteBranch)) {
              fail(
                `\n❌ Branch name "${remoteBranch}" does not match the required pattern.\n` +
                  `   Allowed: main, master, develop, feature/*, bugfix/*, hotfix/*, release/*\n`
              );
            }
          }
        }
        process.exit(0);
      });
      return;
    }

    case 'pre-rebase': {
      const branch = getCurrentBranch();
      if (isProtectedBranch(branch)) {
        fail(
          `\n❌ Rebasing on protected branch "${branch}" is not allowed.\n` +
            `   Create a feature branch and rebase there instead.\n`
        );
      }
      break;
    }

    case 'pre-merge-commit': {
      const branch = getCurrentBranch();
      if (isProtectedBranch(branch)) {
        fail(
          `\n❌ Merging directly into protected branch "${branch}" is not allowed.\n` +
            `   Use a Pull Request to merge into this branch.\n`
        );
      }
      break;
    }

    case 'pre-commit': {
      const branch = getCurrentBranch();
      if (isProtectedBranch(branch)) {
        fail(
          `\n❌ Committing directly to protected branch "${branch}" is not allowed.\n` +
            `   Create a feature branch and commit on that branch instead.\n`
        );
      }
      if (!isAllowedBranchName(branch)) {
        fail(
          `\n❌ Branch name "${branch}" does not match the required pattern.\n` +
            `   Allowed: main, master, develop, feature/*, bugfix/*, hotfix/*, release/*\n`
        );
      }
      break;
    }

    default:
      fail(`Unknown mode: ${mode}`);
  }
}

const mode = process.argv[2];
if (!mode) {
  console.error('Usage: node validate-branch.cjs <pre-push|pre-rebase|pre-merge-commit|pre-commit>');
  process.exit(1);
}
run(mode);
