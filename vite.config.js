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
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
    plugins: [react(), cssInjectedByJsPlugin()],
    server: { port: 3000 },
});
