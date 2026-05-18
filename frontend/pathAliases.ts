import { resolve } from 'node:path';

const pathSrc = (dir: string) => resolve(__dirname, 'src', dir);

const alias = {
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
};

export default alias;
