import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn, util } from 'vite-plugin-monkey'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [util.unimportPreset]
    }),
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        match: ['https://app.ynab.com/*']
      },
      build: {
        // externalGlobals: {
        //   vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js')
        // }
      },
      server: { mountGmApi: true }
    })
  ],
  build: {
    minify: true
  }
})
