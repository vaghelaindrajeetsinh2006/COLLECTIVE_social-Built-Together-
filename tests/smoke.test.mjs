import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.build, 'vite build', 'Build script must use Vite');
assert.equal(pkg.scripts.typecheck, 'tsc --noEmit', 'Typecheck script must use TypeScript');
assert.equal(pkg.scripts.test, 'node tests/smoke.test.mjs', 'Smoke test script must be configured');
assert.equal(pkg.name, 'collective-social-built-together', 'Package name should match the final product identity');
assert.equal('motion' in pkg.dependencies, false, 'Unused motion dependency should not be shipped');

const vite = read('vite.config.ts');
assert.match(vite, /base:\s*['"]\/collective_social-built-together-\//, 'GitHub Pages base path is incorrect');

const index = read('index.html');
assert.match(index, /<div id="root"><\/div>/, 'React root is missing');
assert.match(index, /src="\/src\/main\.tsx"/, 'Main entry file is missing');

for (const file of [
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'src/data/initialCollectives.ts',
  'src/utils/aiAnalysis.ts',
  'src/utils/storage.ts',
  'src/utils/avatar.ts',
  'src/hooks/useCollectivePlatform.ts',
  'src/components/Workspace/CollectivePulse.tsx',
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Required file missing: ${file}`);
}

for (const directory of ['src', 'public', 'tests', 'docs']) {
  assert.ok(fs.existsSync(path.join(root, directory)), `Required directory missing: ${directory}`);
}

assert.equal(fs.existsSync(path.join(root, 'metadata.json')), false, 'Provider-specific metadata should not be shipped');
assert.ok(fs.statSync(path.join(root, 'src/App.tsx')).size < 14000, 'App should remain a lightweight composition layer');

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|css|js|mjs)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'src'));

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  assert.equal(/dangerouslySetInnerHTML|<script[^>]+src=["']https?:\/\//i.test(content), false, `Unsafe or remote script pattern found in ${path.relative(root, file)}`);
  assert.equal(/images\.unsplash\.com|api\.openai\.com|generativelanguage\.googleapis\.com/i.test(content), false, `Third-party runtime asset/API reference found in ${path.relative(root, file)}`);
}

console.log('✅ COLLECTIVE evaluator smoke tests passed');
