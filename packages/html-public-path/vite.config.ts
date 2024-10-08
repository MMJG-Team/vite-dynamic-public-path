import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'DynamicPublicPath',
            fileName: (format) => `index.${format}.js`
        },
        minify: false,
    }
})
