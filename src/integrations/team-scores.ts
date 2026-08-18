/**
 * src/integrations/team-scores.ts
 *
 * Astro integration that unpacks team-scores.zip into src/data/team-scores/
 * before every build or dev-server start, then copies the chart PNG images
 * into public/team-scores/ so they are served as static assets.
 *
 * If the zip doesn't exist yet (first checkout, or the workflow hasn't run),
 * the integration creates stub data so the site still builds.
 */

import type { AstroIntegration } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { createReadStream } from 'node:fs';

// unzipper is a devDependency added to support the build pipeline.
async function unzip(zipPath: string, outDir: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const unzipper = await import('unzipper') as typeof import('unzipper');
  await new Promise<void>((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: outDir }))
      .on('close', resolve)
      .on('error', reject);
  });
}

const STUB_SCORES = JSON.stringify({ generatedAt: null, metrics: {}, teams: [] }, null, 2);

const CHART_FILES = [
  'chart-leaderboard.png',
  'chart-supporters.png',
  'chart-attendance.png',
];

export function teamScoresIntegration(): AstroIntegration {
  return {
    name: 'team-scores',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        await processBundle(logger);
      },

      'astro:server:start': async ({ logger }) => {
        await processBundle(logger);
      },
    },
  };
}

async function processBundle(
  logger: { info(msg: string): void; warn(msg: string): void }
): Promise<void> {
  const root = process.cwd();
  const zipPath = path.join(root, 'src', 'data', 'team-scores.zip');
  const dataDir = path.join(root, 'src', 'data', 'team-scores');
  const publicDir = path.join(root, 'public', 'team-scores');

  // ── Ensure output dirs exist ─────────────────────────────────────────────
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  // ── Extract zip ──────────────────────────────────────────────────────────
  if (!fs.existsSync(zipPath)) {
    logger.warn('[team-scores] team-scores.zip not found — using stub data.');
    ensureStub(dataDir);
    return;
  }

  logger.info('[team-scores] Extracting team-scores.zip…');
  try {
    await unzip(zipPath, dataDir);
    logger.info(`[team-scores] Extracted to ${dataDir}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[team-scores] Extraction failed: ${msg} — falling back to existing data.`);
    ensureStub(dataDir);
  }

  // ── Copy chart images to public/team-scores/ ─────────────────────────────
  for (const file of CHART_FILES) {
    const src = path.join(dataDir, file);
    const dst = path.join(publicDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      logger.info(`[team-scores] Copied ${file} to public/team-scores/`);
    }
  }
}

function ensureStub(dataDir: string): void {
  const scoresPath = path.join(dataDir, 'scores.json');
  if (!fs.existsSync(scoresPath)) {
    fs.writeFileSync(scoresPath, STUB_SCORES);
  }
}
