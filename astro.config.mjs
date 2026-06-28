import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://robertoshiu.github.io',
  base: '/shiny4/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant', 'en', 'zh-Hans'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
});
