import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        ignored: ["**.log"]
      }
    }
  },
  site: 'https://vintedbot.com',
  integrations: [tailwind(), sitemap({
    filter: (page) =>
      page !== 'https://vintedbot.com/return/' &&
      page !== 'https://vintedbot.com/congrats/' &&
      !page.startsWith('https://vintedbot.com/localized-files/') &&
      page !== 'https://vintedbot.com/discord/',
  }),]
});