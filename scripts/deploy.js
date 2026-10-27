import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 1. Building production bundle...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📄 2. Generating SPA fallback (404.html) & .nojekyll...');
fs.copyFileSync(path.join('dist', 'index.html'), path.join('dist', '404.html'));
fs.writeFileSync(path.join('dist', '.nojekyll'), '');

console.log('📤 3. Deploying to GitHub Pages branch (gh-pages)...');
const gitBin = fs.existsSync('C:\\Program Files\\Git\\cmd\\git.exe')
  ? '"C:\\Program Files\\Git\\cmd\\git.exe"'
  : 'git';

const gitCmds = [
  `${gitBin} -C dist init`,
  `${gitBin} -C dist config user.email "fadhilalfarabi145@gmail.com"`,
  `${gitBin} -C dist config user.name "fadhi869"`,
  `${gitBin} -C dist add -A`,
  `${gitBin} -C dist commit --allow-empty -m "deploy: update live site"`,
  `${gitBin} -C dist branch -M gh-pages`,
  `${gitBin} -C dist push https://github.com/fadhi869/simtq-bengkulu.git gh-pages --force`,
].join(' && ');

execSync(gitCmds, { stdio: 'inherit' });

console.log('✨ 4. Live website updated: https://fadhi869.github.io/simtq-bengkulu/');
