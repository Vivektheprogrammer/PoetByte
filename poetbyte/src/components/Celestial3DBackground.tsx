'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Celestial3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Warm Dust Motes & Candlelight Embers
    const dustCount = 800;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    const palette = [
      new THREE.Color(0xdfa84a), // aged gold leaf
      new THREE.Color(0xf59e0b), // candlelight amber
      new THREE.Color(0xfef08a), // warm candlelight highlight
      new THREE.Color(0xbe123c), // crimson wax mote
      new THREE.Color(0xd97706), // warm bronze
    ];

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 300;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 180 - 15;

      const color = palette[Math.floor(Math.random() * palette.length)];
      dustColors[i * 3] = color.r;
      dustColors[i * 3 + 1] = color.g;
      dustColors[i * 3 + 2] = color.b;

      dustSizes[i] = Math.random() * 2.8 + 1.0;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    // Glow Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 245, 210, 1)');
      grad.addColorStop(0.3, 'rgba(223, 168, 74, 0.7)');
      grad.addColorStop(0.7, 'rgba(180, 83, 9, 0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const dustTexture = new THREE.CanvasTexture(canvas);

    const dustMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: dustTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const dustField = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustField);

    // Golden Filigree Constellations
    const linesCount = 40;
    const linePositions = new Float32Array(linesCount * 6);
    for (let i = 0; i < linesCount; i++) {
      const idx1 = Math.floor(Math.random() * 100) * 3;
      const idx2 = Math.floor(Math.random() * 100) * 3;
      linePositions[i * 6] = dustPositions[idx1];
      linePositions[i * 6 + 1] = dustPositions[idx1 + 1];
      linePositions[i * 6 + 2] = dustPositions[idx1 + 2];
      linePositions[i * 6 + 3] = dustPositions[idx2];
      linePositions[i * 6 + 4] = dustPositions[idx2 + 1];
      linePositions[i * 6 + 5] = dustPositions[idx2 + 2];
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xdfa84a,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(constellationLines);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      dustField.rotation.y = elapsedTime * 0.012 + targetX;
      dustField.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05 + targetY;
      constellationLines.rotation.y = dustField.rotation.y;
      constellationLines.rotation.x = dustField.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      dustTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
