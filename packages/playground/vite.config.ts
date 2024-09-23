import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import htmlPublicPath from 'vite-plugin-html-public-path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    htmlPublicPath({
      // it will be injected to head of script tag
      initialPrefixScript: `
        const prefix = window.__PREFIX__ = "/customPrefix";
        return prefix;
      `
    })
  ],
})
