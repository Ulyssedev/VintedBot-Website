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
  site: 'https://thebotbay.com',
  integrations: [tailwind(), sitemap({
    filter: (page) =>
      page !== 'https://thebotbay.com/return/' &&
      page !== 'https://thebotbay.com/congrats/' &&
      !page.startsWith('https://thebotbay.com/localized-files/') &&
      page !== 'https://thebotbay.com/discord/',
  }),]
});