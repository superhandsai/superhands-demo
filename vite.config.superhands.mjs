// superhands-source: auto-generated at sandbox provisioning. Never committed.
import { defineConfig, loadConfigFromFile } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import superhandsVite from "/root/sh-source-transform/vite-plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readManifest() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, '.superhands-diff-manifest.json'), 'utf8'),
    );
  } catch {
    return undefined;
  }
}

export default defineConfig(async (env) => {
  const loaded = await loadConfigFromFile(env, path.resolve(__dirname, "./vite.config.ts"));
  const base = loaded?.config ?? {};
  const resolvedBase = typeof base === 'function' ? await base(env) : base;
  const manifest = readManifest();
  return {
    ...resolvedBase,
    plugins: [
      superhandsVite({ projectRoot: __dirname, manifest }),
      ...(resolvedBase.plugins ?? []),
    ],
  };
});
