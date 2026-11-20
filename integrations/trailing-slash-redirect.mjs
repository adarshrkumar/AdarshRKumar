export default {
    name: 'trailing-slash-redirect',
    hooks: {
        'astro:config:setup': ({ addMiddleware, updateConfig }) => {
            updateConfig({
                vite: {
                    plugins: [{
                        name: 'trailing-slash-redirect',
                        resolveId: id => id === 'virtual:trailing-slash-redirect' ? '\0virtual:trailing-slash-redirect' : null,
                        load: id => id === '\0virtual:trailing-slash-redirect' ? [
                            'import { defineMiddleware } from "astro:middleware";',
                            'export const onRequest = defineMiddleware(({ url, redirect }, next) => {',
                            '    if (url.pathname.endsWith("/") || url.pathname.split("/").pop().includes(".")) return next();',
                            '    return redirect(url.pathname + "/" + url.search, 308);',
                            '});'
                        ].join('\n') : null
                    }]
                }
            });
            addMiddleware({ entrypoint: 'virtual:trailing-slash-redirect', order: 'pre' });
        }
    }
};
