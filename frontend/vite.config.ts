import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        outDir: 'dist',
    },
});
