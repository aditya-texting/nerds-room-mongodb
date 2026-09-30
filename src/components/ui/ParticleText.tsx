'use client';

import * as React from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  vx: number;
  vy: number;
}

export function ParticleText({ text = 'COGNEE X NERDS ROOM' }: { text?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animationRef = React.useRef<number>(0);
  const mouseRef = React.useRef({ x: -9999, y: -9999, radius: 100 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      // Make text aggressively large to cover width
      const fontSize = Math.floor(canvas.width / 4.8);
      // Tightly wrap the height around the text so there is no empty vertical space
      canvas.height = fontSize * 0.8; 
      initParticles(fontSize);
    };

    const initParticles = (fontSize: number) => {
      particlesRef.current = [];
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff'; // White text
      ctx.font = `900 ${fontSize}px "Arial", sans-serif`; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < textCoordinates.height; y += 4) {
        for (let x = 0; x < textCoordinates.width; x += 4) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3];

          if (alpha > 128) {
            particlesRef.current.push({
              x: x + (Math.random() - 0.5) * 50,
              y: y + (Math.random() - 0.5) * 50,
              originX: x,
              originY: y,
              color: '#ffffff', // White particles
              vx: 0,
              vy: 0,
            });
          }
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          p.vx -= forceDirectionX * force * 5;
          p.vy -= forceDirectionY * force * 5;
        }

        p.vx += (p.originX - p.x) * 0.1;
        p.vy += (p.originY - p.y) * 0.1;
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Smaller particles for dotted effect
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [text]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  return (
    <div className="w-full flex justify-center py-10 cursor-crosshair">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="block"
      />
    </div>
  );
}
