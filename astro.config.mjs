import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import { remarkReadingTime } from './src/utils/frontmatter.mjs';
import { SITE } from './src/config.mjs';
import cloudflare from "@astrojs/cloudflare";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ mode: "directory" }),
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), mdx(), ...whenExternalScripts(() => partytown({
    config: {
      forward: ['dataLayer.push']
    }
  }))],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    extendDefaultPlugins: true
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    }
  },
  adapter: cloudflare()
});
