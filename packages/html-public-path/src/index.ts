import { Plugin } from 'vite'
import * as prettier from 'prettier/standalone'
import parserHtml from 'prettier/plugins/html'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'

function definePlugin<T extends (...args: any[]) => Plugin>(pluginCreator: T) {
    return pluginCreator
}

export default definePlugin((options: {
    initialPrefixScript: string
}) => {
    const {
        initialPrefixScript = ''
    } = options ?? {}

    if (!initialPrefixScript) {
        throw new Error('initialPrefixScript is required')
    }

    return {
        name: 'dynamic-public-path-for-html',
        async transformIndexHtml(html) {
            const assetLinkPaths: string[] = []
            const assetScriptPaths: string[] = []
            
            // collecting all paths of link and script tags while removing them from the html
            html = html.replace(/<link[\s\S]*?href="(.*?)"[\s\S]*?>/g, (_$0, $1) => {
                assetLinkPaths.push($1)
                return ''
            })

            html = html.replace(/<script[\s\S]*?src="(.*?)"[\s\S]*?><\/script>/g, (_$0, $1) => {
                assetScriptPaths.push($1)
                return ''
            })

            const injectTagScript = `
                <script type="module">
                    const prefix = await (async () => {
                        ${initialPrefixScript}
                    })();

                    const withPrefix = (path) => {
                        if (!path.startsWith('/')) {
                            if (path.startsWith('./')) {
                                path = path.replace(/^.\\//, '/')
                            } else {
                                path = '/' + path
                            }
                        }
                        return prefix + path
                    }

                    const fragment = document.createDocumentFragment();
                    ${JSON.stringify(assetLinkPaths)}.forEach((path) => {
                        const asset = document.createElement('link')
                        if (path.endsWith('.css')) {
                            asset.rel = 'stylesheet'
                        } else if (path.endsWith('.js')) {
                            asset.rel = 'modulepreload'
                        } else if (path.endsWith('.svg')) {
                            asset.rel = 'icon'
                            asset.type = 'image/svg+xml'
                        }
                        asset.href = withPrefix(path)
                        fragment.appendChild(asset)
                    });

                    ${JSON.stringify(assetScriptPaths)}.forEach((path) => {
                        const asset = document.createElement('script')
                        if (path.endsWith('.js')) {
                            asset.type = 'module'
                        }
                        asset.src = withPrefix(path)
                        fragment.appendChild(asset)
                    });
                    document.head.appendChild(fragment)
                </script>
            `;

            html = html.replace('</head>', `${injectTagScript}</head>`);

            html = await prettier.format(html, {
                parser: 'html',
                plugins: [parserHtml, parserBabel, parserEstree]
            });

            return html;
        }
    }
})

