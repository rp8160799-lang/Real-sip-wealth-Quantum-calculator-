import React, { useEffect, useRef } from 'react';

export const ParticleMatrix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Particle nodes configuration
    const cols = 28;
    const rows = 18;
    const particles: { x: number; y: number; z: number; origX: number; origY: number; origZ: number }[] = [];

    const spacingX = width / (cols - 1);
    const spacingY = height / (rows - 1);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * 60;
        const y = (j - rows / 2) * 50;
        const z = Math.sin((i / cols) * Math.PI * 2) * Math.cos((j / rows) * Math.PI * 2) * 120;
        particles.push({
          x,
          y,
          z,
          origX: x,
          origY: y,
          origZ: z,
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric cyber glow orbs in background
      const grad1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(time * 0.5) * 80,
        height * 0.25 + Math.cos(time * 0.4) * 80,
        20,
        width * 0.25,
        height * 0.25,
        Math.max(width * 0.4, 300)
      );
      grad1.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(time * 0.6) * 90,
        height * 0.65 + Math.sin(time * 0.5) * 90,
        20,
        width * 0.75,
        height * 0.65,
        Math.max(width * 0.35, 250)
      );
      grad2.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      const rotY = (mouseX / width - 0.5) * 0.6 + Math.sin(time * 0.3) * 0.15;
      const rotX = (mouseY / height - 0.5) * 0.4 + Math.cos(time * 0.2) * 0.1;
      const fov = 450;

      const projected: { px: number; py: number; scale: number; alpha: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Mathematical wave dynamic
        const waveZ = p.origZ + Math.sin(time * 2 + p.origX * 0.015 + p.origY * 0.015) * 45;

        // 3D rotation around Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        let x1 = p.origX * cosY - waveZ * sinY;
        let z1 = p.origX * sinY + waveZ * cosY;

        // 3D rotation around X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let y1 = p.origY * cosX - z1 * sinX;
        let z2 = p.origY * sinX + z1 * cosX;

        // Projection
        const distance = 600 + z2;
        if (distance > 10) {
          const scale = fov / distance;
          const px = x1 * scale + width / 2;
          const py = y1 * scale + height / 2;
          const alpha = Math.min(1, Math.max(0.1, (z2 + 300) / 600));
          projected.push({ px, py, scale, alpha });
        } else {
          projected.push({ px: -100, py: -100, scale: 0, alpha: 0 });
        }
      }

      // Draw grid lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          const p1 = projected[idx];
          if (p1.scale <= 0) continue;

          // Connect horizontally
          if (i < cols - 1) {
            const rightIdx = (i + 1) * rows + j;
            const p2 = projected[rightIdx];
            if (p2.scale > 0) {
              const alpha = Math.min(p1.alpha, p2.alpha) * 0.18;
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }

          // Connect vertically
          if (j < rows - 1) {
            const bottomIdx = i * rows + (j + 1);
            const p2 = projected[bottomIdx];
            if (p2.scale > 0) {
              const alpha = Math.min(p1.alpha, p2.alpha) * 0.15;
              ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 0.9})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }
      }

      // Draw glowing particle vertices
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.scale <= 0) continue;

        const size = Math.max(1, p.scale * 2.2);
        ctx.fillStyle = i % 2 === 0 ? `rgba(129, 140, 248, ${p.alpha * 0.8})` : `rgba(52, 211, 153, ${p.alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        ctx.fill();

        // Extra glow on prominent nodes
        if (i % 7 === 0) {
          ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.px, p.py, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particleMatrix"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
