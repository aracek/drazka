// @ts-check
import { defineConfig } from 'astro/config';

// Kde web poběží:
// - na počítači a na FTP v kořeni domény: BASE_PATH není potřeba (výchozí "/")
// - na GitHub Pages: BASE_PATH=/drazka (nastavuje to .github/workflows/deploy.yml)
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base,
  devToolbar: { enabled: false },
});
