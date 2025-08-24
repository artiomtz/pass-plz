import { resolve } from 'path';

const pathSrc = (dir: string) => resolve(__dirname, 'src', dir);

export const alias = {
    '@api': pathSrc('api'),
    '@assets': pathSrc('assets'),
    '@components': pathSrc('components'),
    '@contexts': pathSrc('contexts'),
    '@hooks': pathSrc('hooks'),
    '@layouts': pathSrc('layouts'),
    '@models': pathSrc('models'),
    '@pages': pathSrc('pages'),
    '@routes': pathSrc('routes'),
    '@services': pathSrc('services'),
    '@styles': pathSrc('styles'),
    '@utils': pathSrc('utils'),
    // 'jwt-decode': path.resolve(__dirname, 'node_modules/jwt-decode/build/esm/index.js'),
};
