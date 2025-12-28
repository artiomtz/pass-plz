import { MotionProps, Transition, Variants } from 'framer-motion';

export const fadeInOut: Variants = {
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    initial: { opacity: 0 },
};

export const scaleInOut: Variants = {
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    initial: { opacity: 0, scale: 0.9 },
};

export const slideUpDown: Variants = {
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    initial: { height: 0, opacity: 0 },
};

export const slideLeftRight: Variants = {
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    initial: { opacity: 0, x: '-100%' },
};

export const transitions: Record<string, Transition> = {
    fast: { duration: 0.2, ease: 'easeOut' },
    normal: { duration: 0.3, ease: 'easeOut' },
    slow: { duration: 0.5, ease: 'easeOut' },
};

export const fadeMotionProps: MotionProps = {
    animate: 'animate',
    exit: 'exit',
    initial: 'initial',
    layout: true,
    transition: transitions.slow,
    variants: fadeInOut,
};
export const slideMotionProps: MotionProps = {
    animate: 'animate',
    exit: 'exit',
    initial: 'initial',
    layout: true,
    transition: transitions.normal,
    variants: slideLeftRight,
};

export const scaleMotionProps: MotionProps = {
    animate: 'animate',
    exit: 'exit',
    initial: 'initial',
    layout: 'position',
    transition: transitions.normal,
    variants: scaleInOut,
};

export const descendMotionProps: MotionProps = {
    animate: 'animate',
    exit: 'exit',
    initial: 'initial',
    layout: true,
    transition: transitions.normal,
    variants: slideUpDown,
};
