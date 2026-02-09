import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const BloodCellParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 12 + 4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const drawCell = (p: Particle) => {
      const pulseFactor = 1 + Math.sin(p.pulse) * 0.15;
      const r = p.radius * pulseFactor;

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2);
      gradient.addColorStop(0, `rgba(220, 38, 38, ${p.opacity * 0.4})`);
      gradient.addColorStop(0.5, `rgba(220, 38, 38, ${p.opacity * 0.1})`);
      gradient.addColorStop(1, "rgba(220, 38, 38, 0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Cell body
      const cellGrad = ctx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 0, p.x, p.y, r);
      cellGrad.addColorStop(0, `rgba(248, 80, 80, ${p.opacity * 1.5})`);
      cellGrad.addColorStop(0.7, `rgba(185, 28, 28, ${p.opacity})`);
      cellGrad.addColorStop(1, `rgba(127, 29, 29, ${p.opacity * 0.8})`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = cellGrad;
      ctx.fill();

      // Inner dimple (biconcave disc look)
      const dimple = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 0.5);
      dimple.addColorStop(0, `rgba(127, 29, 29, ${p.opacity * 0.6})`);
      dimple.addColorStop(1, "rgba(127, 29, 29, 0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = dimple;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < -20) p.x = canvas.offsetWidth + 20;
        if (p.x > canvas.offsetWidth + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.offsetHeight + 20;
        if (p.y > canvas.offsetHeight + 20) p.y = -20;
        drawCell(p);
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default BloodCellParticles;
