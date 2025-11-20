export interface CircleConfig {
    color: string;
    dx: number;
    dy: number;
    opacity: number;
    radius: number;
    x: number;
    y: number;
}

const CONFIG = {
    baseRadius: 8,
    baseSpeed: 0.1,
    circleCount: 30,
    color: '#ffffff',
    opacity: 0.04,
    radiusVariance: 0.2,
    speedVariance: 0.4,
};

export function createCircles(canvas: HTMLCanvasElement, color: string): CircleConfig[] {
    const circles: CircleConfig[] = [];
    const { height, width } = canvas;

    for (let i = 0; i < CONFIG.circleCount; i++) {
        const radius = CONFIG.baseRadius * (1 + (Math.random() - 0.5) * 2 * CONFIG.radiusVariance);
        const speed = CONFIG.baseSpeed * (1 + (Math.random() - 0.5) * 2 * CONFIG.speedVariance);
        const angle = Math.random() * 2 * Math.PI;

        circles.push({
            color,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            opacity: CONFIG.opacity,
            radius,
            x: Math.random() * width,
            y: Math.random() * height,
        });
    }

    return circles;
}

export function updateCircles(circles: CircleConfig[], canvas: HTMLCanvasElement) {
    const { height, width } = canvas;

    for (const circle of circles) {
        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x < -circle.radius) {
            circle.x = width + circle.radius;
        }
        if (circle.x > width + circle.radius) {
            circle.x = -circle.radius;
        }
        if (circle.y < -circle.radius) {
            circle.y = height + circle.radius;
        }
        if (circle.y > height + circle.radius) {
            circle.y = -circle.radius;
        }
    }
}

export function drawCircles(ctx: CanvasRenderingContext2D, circles: CircleConfig[]) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const circle of circles) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.globalAlpha = circle.opacity;
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}
