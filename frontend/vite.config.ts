import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { alias } from './pathAliases';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias,
    },
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        host: true,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
    // define: {
    //     BACKEND_URL: `'${process.env.BACKEND_URL}'`,
    // },
});
