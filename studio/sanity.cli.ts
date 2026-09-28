import { defineCliConfig } from 'sanity/cli';

// Isi projectId setelah `npx sanity init` / dari sanity.io/manage
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
