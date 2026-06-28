import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain via public/CNAME → base stays '/'.
export default defineConfig({
  site: 'https://shinylogic.tech',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant', 'en', 'zh-Hans'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
