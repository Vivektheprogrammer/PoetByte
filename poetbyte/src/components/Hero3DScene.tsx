'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export default function Hero3DScene() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Inkpot
    const inkwellGroup = new THREE.Group();
    inkwellGroup.position.set(0, -1.2, 0);

    // Glass Base
    const jarGeo = new THREE.CylinderGeometry(0.9, 1.1, 1.0, 32);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a120b,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const jarMesh = new THREE.Mesh(jarGeo, jarMat);
    inkwellGroup.add(jarMesh);

    // Brass Collar
    const rimGeo = new THREE.TorusGeometry(0.9, 0.08, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xdfa84a,
      roughness: 0.3,
      metalness: 0.85,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.5;
    inkwellGroup.add(rimMesh);

    // Liquid Ink Surface
    const inkGeo = new THREE.CircleGeometry(0.85, 32);
    const inkMat = new THREE.MeshBasicMaterial({ color: 0x050403 });
    const inkMesh = new THREE.Mesh(inkGeo, inkMat);
    inkMesh.rotation.x = -Math.PI / 2;
    inkMesh.position.y = 0.45;
    inkwellGroup.add(inkMesh);

    mainGroup.add(inkwellGroup);

    // 2. Vintage Feathered Quill
    const quillGroup = new THREE.Group();
    quillGroup.position.set(0, -0.6, 0);
    quillGroup.rotation.z = -Math.PI / 7;
    quillGroup.rotation.x = Math.PI / 10;

    // Golden Nib
    const nibGeo = new THREE.ConeGeometry(0.08, 0.45, 16);
    const nibMat = new THREE.MeshStandardMaterial({
      color: 0xf9e29d,
      roughness: 0.2,
      metalness: 0.95,
      emissive: 0xdfa84a,
      emissiveIntensity: 0.2,
    });
    const nibMesh = new THREE.Mesh(nibGeo, nibMat);
    nibMesh.position.y = -0.2;
    nibMesh.rotation.x = Math.PI;
    quillGroup.add(nibMesh);

    // Quill Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.035, 0.05, 3.2, 16);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.4,
      metalness: 0.1,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.y = 1.4;
    quillGroup.add(shaftMesh);

    // Feather Barbs / Vane (Sculpted Feather Geometry)
    const featherGeo = new THREE.PlaneGeometry(0.8, 2.4, 8, 8);
    // Displace vertices to create curved feather curve
    const posAttr = featherGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const curve = Math.sin((y + 1.2) / 2.4 * Math.PI) * (1 - Math.abs(x) * 0.5);
      posAttr.setZ(i, Math.sin(x * 3) * 0.08);
      posAttr.setX(i, x * (1 - Math.abs(y - 0.5) * 0.28));
    }
    featherGeo.computeVertexNormals();

    const featherMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      metalness: 0.2,
      side: THREE.DoubleSide,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const featherMesh = new THREE.Mesh(featherGeo, featherMat);
    featherMesh.position.set(0.2, 1.8, 0);
    featherMesh.rotation.z = Math.PI / 18;
    quillGroup.add(featherMesh);

    // Second feather layer for volume
    const featherBack = featherMesh.clone();
    featherBack.rotation.y = Math.PI;
    featherBack.position.set(-0.2, 1.8, 0);
    quillGroup.add(featherBack);

    mainGroup.add(quillGroup);

    // 3. Floating Calligraphy Ribbon & Golden Motes
    const calligCount = 120;
    const calligGeo = new THREE.BufferGeometry();
    const calligPos = new Float32Array(calligCount * 3);
    const calligColors = new Float32Array(calligCount * 3);

    for (let i = 0; i < calligCount; i++) {
      const t = i / calligCount;
      const angle = t * Math.PI * 6;
      const radius = 0.4 + t * 2.2;
      calligPos[i * 3] = Math.cos(angle) * radius;
      calligPos[i * 3 + 1] = t * 3.0 - 1.2;
      calligPos[i * 3 + 2] = Math.sin(angle) * radius;

      calligColors[i * 3] = 0.98; // Gold R
      calligColors[i * 3 + 1] = 0.75 + Math.random() * 0.2; // Gold G
      calligColors[i * 3 + 2] = 0.3; // Gold B
    }

    calligGeo.setAttribute('position', new THREE.BufferAttribute(calligPos, 3));
    calligGeo.setAttribute('color', new THREE.BufferAttribute(calligColors, 3));

    const calligMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const calligParticles = new THREE.Points(calligGeo, calligMat);
    mainGroup.add(calligParticles);

    // 4. Lights (Warm Candlelight Amber)
    const candleLight1 = new THREE.PointLight(0xf59e0b, 3, 20);
    candleLight1.position.set(2.5, 3.0, 3.5);
    scene.add(candleLight1);

    const goldLight = new THREE.PointLight(0xdfa84a, 2, 15);
    goldLight.position.set(-2.5, 1.0, 2.0);
    scene.add(goldLight);

    const ambientLight = new THREE.AmbientLight(0xffecd1, 0.7);
    scene.add(ambientLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = mouseX * 0.7;
      targetRotationX = -mouseY * 0.5;
    };

    container.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Render loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth group rotation
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;

      // Candlelight subtle flicker intensity
      candleLight1.intensity = 2.8 + Math.sin(elapsed * 4) * 0.4 + Math.cos(elapsed * 7) * 0.2;

      // Quill breathing & drafting animation
      quillGroup.position.y = -0.6 + Math.sin(elapsed * 2) * 0.12;
      quillGroup.rotation.z = -Math.PI / 7 + Math.sin(elapsed * 1.5) * 0.08;
      quillGroup.rotation.y = Math.cos(elapsed * 1.2) * 0.1;

      // Rotate calligraphy swirl
      calligParticles.rotation.y = elapsed * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      jarGeo.dispose();
      jarMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      inkGeo.dispose();
      inkMat.dispose();
      nibGeo.dispose();
      nibMat.dispose();
      shaftGeo.dispose();
      shaftMat.dispose();
      featherGeo.dispose();
      featherMat.dispose();
      calligGeo.dispose();
      calligMat.dispose();
    };
  }, []);

  return (
    <div className="relative py-8 md:py-16 overflow-hidden">
      {/* Warm Candlelight Glow Blurs */}
      <div className="absolute w-96 h-96 bg-[#dfa84a]/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-[#be123c]/10 rounded-full blur-3xl top-40 right-0 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl -bottom-10 left-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Calligraphy Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-tight">
              Penned in <span className="gold-foil-text">Parchment</span>, Preserved in{' '}
              <span className="candle-amber-text">Gold</span>
            </h1>

            <p className="text-lg md:text-xl text-[#b8a690] max-w-2xl font-serif leading-relaxed italic">
              Immerse yourself in a timeless library of lyrical verses. Drafted with vintage quills, bound in aged leather, and sealed with crimson wax.
            </p>

            {/* Illuminated Epigraph */}
            <div className="pt-4 border-t border-[#dfa84a]/20 flex items-center gap-3 text-xs sm:text-sm text-[#786a58] font-serif italic">
              <span className="text-[#dfa84a] text-xl">“</span>
              <span>Words are, in my not-so-humble opinion, our most inexhaustible source of magic.</span>
              <span className="text-[#dfa84a] text-xl">”</span>
            </div>
          </motion.div>

          {/* Right 3D Interactive Inkpot & Quill Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div
              className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full flex items-center justify-center group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Candlelight Aura Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dfa84a]/20 via-[#f59e0b]/25 to-[#be123c]/20 blur-2xl animate-candle-flicker" />

              {/* Three.js Canvas Container */}
              <div
                ref={canvasContainerRef}
                className="w-full h-full relative z-10"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
