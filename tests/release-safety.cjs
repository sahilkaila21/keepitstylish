const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

// Only filenames and categories are reported; credential values never reach logs.
function inspectFile(filename, content = '') {
  const name = path.posix.basename(filename.replaceAll('\\', '/'));
  const findings = [];
  if ((/^\.env(?:\.|$)/i.test(name) && name !== '.env.example') || /\.(?:pem|key|p12|pfx)$/i.test(name)) {
    findings.push('credential file');
  }
  if (/(?:^|\/)(?:node_modules|\.next|audit|backups)(?:\/|$)/.test(filename) || /\.qa-backup$/i.test(name)) {
    findings.push('local artifact');
  }
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) findings.push('private key');
  if (/\b(?:sk_live_[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/.test(content)) findings.push('credential pattern');
  return findings;
}

function scanRepository(root) {
  const files = execFileSync('git', ['ls-files', '-z'], {cwd:root, encoding:'utf8'}).split('\0').filter(Boolean);
  const failures = [];
  for (const filename of files) {
    // Skip binary content, while checking all filenames.
    const textFile = /\.(?:html|css|js|cjs|mjs|json|md|ya?ml|txt|svg|pem|key)$/i.test(filename) || path.basename(filename).startsWith('.env');
    const content = textFile ? fs.readFileSync(path.join(root,filename),'utf8') : '';
    const findings = inspectFile(filename,content);
    if (findings.length) failures.push({filename,findings});
  }
  return {files:files.length,failures};
}

if (require.main === module) {
  const result = scanRepository(path.join(__dirname,'..'));
  for (const failure of result.failures) console.error(`${failure.filename}: ${failure.findings.join(', ')}`);
  if (result.failures.length) process.exitCode = 1;
  else console.log(`Release safety patterns checked in ${result.files} tracked files. No matches.`);
}
module.exports = {inspectFile,scanRepository};

