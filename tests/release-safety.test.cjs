const {test} = require('node:test');
const assert = require('node:assert/strict');
const {inspectFile} = require('./release-safety.cjs');

test('release scan rejects credential files and leaked private key content',()=>{
  assert.deepEqual(inspectFile('.env.production'),['credential file']);
  assert.deepEqual(inspectFile('assets/server.key'),['credential file']);
  assert.deepEqual(inspectFile('docs/sample.txt','-----BEGIN '+'PRIVATE KEY-----'),['private key']);
});
test('release scan detects synthetic tokens without returning their values',()=>{
  const token='sk_'+'live_'+'A'.repeat(24);
  const result=inspectFile('assets/config.js',token);
  assert.deepEqual(result,['credential pattern']);
  assert.ok(!JSON.stringify(result).includes(token));
});
test('release scan rejects local artifacts and permits ordinary public files',()=>{
  assert.deepEqual(inspectFile('audit/customer.csv'),['local artifact']);
  assert.deepEqual(inspectFile('assets/dress.webp.qa-backup'),['local artifact']);
  assert.deepEqual(inspectFile('.env.example','API_KEY=replace_me'),[]);
  assert.deepEqual(inspectFile('docs/support-email-templates.md','Hi [first name]'),[]);
});
