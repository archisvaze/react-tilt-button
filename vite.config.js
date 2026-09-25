import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'react-tilt-button',
            fileName: (format) => `react-tilt-button.${format}.js`,
        },
        rollupOptions: {
            // react/jsx-runtime must stay external too, or a copy of it ends up inside dist.
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'ReactJSXRuntime',
                },
            },
        },
    },
    plugins: [react(), cssInjectedByJsPlugin()],
    server: { port: 3000 },
});
