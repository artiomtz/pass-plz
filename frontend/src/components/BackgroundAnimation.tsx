import useTheme from '@hooks/useTheme';
import { CircleConfig, createCircles, drawCircles, updateCircles } from '@utils/backgroundUtil';
import logger from '@utils/loggerUtil';
import { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
    const { appTheme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const circlesRef = useRef<CircleConfig[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        let resizeTimeout: number;
        let animationFrameId: number;
        let ctx: CanvasRenderingContext2D | null = null;

        const getColor = () => (appTheme === 'light' ? '#000000' : '#ffffff');

        const resizeCanvas = () => {
            if (!canvas) {
                return;
            }

            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                for (const circle of circlesRef.current) {
                    if (circle.x > canvas.width) {
                        circle.x = Math.random() * canvas.width;
                    }

                    if (circle.y > canvas.height) {
                        circle.y = Math.random() * canvas.height;
                    }
                }
            }, 100);
        };

        try {
            ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas 2D context not supported');
            }

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            circlesRef.current = createCircles(canvas, getColor());
            window.addEventListener('resize', resizeCanvas);

            const animate = () => {
                try {
                    updateCircles(circlesRef.current, canvas);
                    drawCircles(ctx!, circlesRef.current);
                    animationFrameId = requestAnimationFrame(animate);
                } catch (error) {
                    logger.warn('failed to animate background', error);
                }
            };

            animate();
        } catch (error) {
            logger.warn('failed to initialize background canvas', error);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimeout);
        };
    }, [appTheme]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                height: '100%',
                left: 0,
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: -10,
            }}
        />
    );
};

export default BackgroundAnimation;
