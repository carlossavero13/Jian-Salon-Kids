import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync,
  renameSync, statSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const backupDir = join(root, 'originales', 'imagenes');
const option = process.argv.indexOf('--ffmpeg');
const ffmpeg = option >= 0 ? process.argv[option + 1] : process.env.FFMPEG_PATH || 'ffmpeg';
if (!ffmpeg) throw new Error('Provide the FFmpeg executable after --ffmpeg.');

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}
function hash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8', windowsHide: true });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || 'FFmpeg failed.');
}
function webpPath(path) {
  return path.slice(0, -extname(path).length) + '.webp';
}

const sources = filesIn(publicDir).filter((path) => /\.(jpe?g|png)$/i.test(path) && relative(publicDir, path) !== 'favicon.png');
if (!sources.length) {
  console.log('No JPG/PNG images to convert. The favicon is intentionally kept as PNG.');
  process.exit(0);
}
// Do not overwrite a WebP supplied or edited by the user.
for (const source of sources) {
  if (existsSync(webpPath(source))) throw new Error(`WebP already exists: ${webpPath(source)}. Use a new filename to preserve it.`);
}

const workRoot = join(tmpdir(), 'opencode');
mkdirSync(workRoot, { recursive: true });
const staging = mkdtempSync(join(workRoot, 'jian-webp-'));
const records = [];
for (const source of sources) {
  const path = relative(publicDir, source);
  const output = webpPath(join(staging, path));
  mkdirSync(dirname(output), { recursive: true });
  const logo = path === 'logo.png';
  const maximum = logo ? 720 : 1600;
  const filter = `scale=w='min(${maximum},iw)':h='min(${maximum},ih)':force_original_aspect_ratio=decrease`;
  const sourceHash = hash(source);
  const beforeBytes = statSync(source).size;
  const encoding = logo
    ? ['-c:v', 'libwebp', '-lossless', '1', '-pix_fmt', 'bgra', '-quality', '100']
    : ['-c:v', 'libwebp', '-quality', '82', '-preset', 'picture'];
  run(['-n', '-i', source, '-frames:v', '1', '-vf', filter, '-map_metadata', '-1', ...encoding, output]);
  const bytes = readFileSync(output);
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Invalid WebP output: ${output}`);
  }
  run(['-i', output, '-frames:v', '1', '-f', 'null', '-']);
  records.push({ source, path, output, sourceHash, beforeBytes, afterBytes: statSync(output).size });
}

// A tiny PNG favicon remains for broad browser compatibility, not the full logo.
const originalLogo = sources.find((path) => relative(publicDir, path) === 'logo.png');
const favicon = join(publicDir, 'favicon.png');
let stagedFavicon;
if (originalLogo && !existsSync(favicon)) {
  stagedFavicon = join(staging, 'favicon.png');
  run(['-n', '-i', originalLogo, '-frames:v', '1', '-vf', 'scale=64:64:force_original_aspect_ratio=decrease,pad=64:64:(ow-iw)/2:(oh-ih)/2:color=0xFFFFFF00,format=rgba', '-map_metadata', '-1', stagedFavicon]);
}

// All conversions must succeed before any original is moved.
for (const record of records) {
  if (hash(record.source) !== record.sourceHash) throw new Error(`Source changed during conversion: ${record.path}`);
  if (existsSync(webpPath(record.source))) throw new Error(`Output appeared during conversion: ${record.path}`);
}
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
mkdirSync(backupDir, { recursive: true });
for (const record of records) {
  let backup = join(backupDir, record.path);
  if (existsSync(backup)) backup = join(backupDir, 'versiones', stamp, record.path);
  mkdirSync(dirname(backup), { recursive: true });
  renameSync(record.output, webpPath(record.source));
  renameSync(record.source, backup);
  if (hash(backup) !== record.sourceHash) throw new Error(`Backup verification failed: ${record.path}`);
  record.backup = relative(root, backup).replaceAll('\\', '/');
  console.log(`${record.path}: ${record.beforeBytes} -> ${record.afterBytes} bytes`);
}
if (stagedFavicon) renameSync(stagedFavicon, favicon);

const beforeBytes = records.reduce((sum, item) => sum + item.beforeBytes, 0);
const afterBytes = records.reduce((sum, item) => sum + item.afterBytes, 0);
const report = {
  converted: records.length, beforeBytes, afterBytes,
  savedPercent: Math.round((1 - afterBytes / beforeBytes) * 100),
  images: records.map(({ path, beforeBytes, afterBytes, sourceHash, backup }) => ({
    source: path.replaceAll('\\', '/'), webp: webpPath(path).replaceAll('\\', '/'),
    beforeBytes, afterBytes, sourceHash, backup,
  })),
};
writeFileSync(join(backupDir, `conversion-${stamp}.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ converted: report.converted, beforeBytes, afterBytes, savedPercent: report.savedPercent, backupDirectory: relative(root, backupDir) }));
