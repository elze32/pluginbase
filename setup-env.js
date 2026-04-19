const fs = require('fs');
const path = require('path');

function copyIfMissing(src, dest) {
  try {
    if (fs.existsSync(dest)) {
      console.log(`Skipped (exists): ${dest}`);
      return;
    }
    if (!fs.existsSync(src)) {
      console.warn(`Source missing: ${src}`);
      return;
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src} -> ${dest}:`, err);
    process.exitCode = 1;
  }
}

const repoRoot = path.join(__dirname);
const tasks = [
  {
    src: path.join(repoRoot, 'apps', 'api', '.env.example'),
    dest: path.join(repoRoot, 'apps', 'api', '.env')
  },
  {
    src: path.join(repoRoot, 'apps', 'web', '.env.local.example'),
    dest: path.join(repoRoot, 'apps', 'web', '.env.local')
  }
];

console.log('Running setup-env...');
tasks.forEach(t => copyIfMissing(t.src, t.dest));
console.log('Done. If any sources were missing, please create them from the examples.');
