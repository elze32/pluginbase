import fs from 'fs';
import path from 'path';
import { normalizePluginPattern, resolveKnownPlugin } from '../lib/plugin-normalizer';

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'real-collection.txt');

function audit() {
  if (!fs.existsSync(FIXTURE_PATH)) {
    console.error(`Fixture file not found at ${FIXTURE_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(FIXTURE_PATH, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');

  let total = 0;
  let recognized = 0;
  const unrecognized: { raw: string; pattern: string }[] = [];

  for (const line of lines) {
    const [fullName] = line.split('|').map(s => s.trim());
    if (!fullName) continue;

    total++;
    const known = resolveKnownPlugin(fullName);
    
    if (known) {
      recognized++;
    } else {
      unrecognized.push({
        raw: fullName,
        pattern: normalizePluginPattern(fullName)
      });
    }
  }

  const rate = (recognized / total) * 100;

  console.log('--- DICTIONARY AUDIT ---');
  console.log(`Total plugins: ${total}`);
  console.log(`Recognized:    ${recognized}`);
  console.log(`Unrecognized:  ${total - recognized}`);
  console.log(`Rate:          ${rate.toFixed(2)}%`);
  console.log('------------------------');

  if (unrecognized.length > 0) {
    console.log('\nTop 20 unrecognized patterns (to help diagnosis):');
    unrecognized.slice(0, 20).forEach(u => {
      console.log(`- ${u.pattern}  (from: ${u.raw})`);
    });
  }

  if (rate < 85) {
    console.log('\n❌ Recognition rate is below 85%. Update the dictionary!');
    process.exit(1);
  } else {
    console.log('\n✅ Dictionary coverage is solid (>= 85%).');
  }
}

audit();
