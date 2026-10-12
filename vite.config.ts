import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const siteUrl = `${(process.env.VITE_SITE_URL || 'https://airansh.github.io/').replace(/\/+$/, '')}/`
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-metadata',
      transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    },
  ],
  base: process.env.VITE_BASE_PATH || '/',
})
