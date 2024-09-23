# vite-plugin-html-public-path
implement dynamic public path in index.html

## Install

```bash
pnpm install vite-plugin-html-public-path -D
```

## Usage

you can use `initialPrefixScript` to return the `public path` of the application.
```js
import { defineConfig } from 'vite'
import htmlPublicPath from 'vite-plugin-html-public-path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    htmlPublicPath({
      // it will be injected to head of script tag
      initialPrefixScript: `
        const prefix = window.__PREFIX__ = "/customPrefix";
        return prefix;
      `
    })
  ],
})
```

with `async` case, you can use `await` in `initialPrefixScript`
```js
import { defineConfig } from 'vite'
import htmlPublicPath from 'vite-plugin-html-public-path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    htmlPublicPath({
      initialPrefixScript: `
        const prefix = await new Promise((resolve) => {
          setTimeout(() => {
            resolve("/customPrefix");
          }, 1000);
        });
        return prefix;
      `
    })
  ],
})
```

## Options

### initialPrefixScript

- **type**: `string`
- **default**: ""

provide `runtime code` to get the `public path` of the application. It will be injected to head of `script` tag. support async and await.