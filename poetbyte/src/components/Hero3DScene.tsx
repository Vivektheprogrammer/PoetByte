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
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // 1. Scene & Camera Setup (Balanced Standing Tome & Quill View)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isMobile ? 40 : 38, width / height, 0.1, 100);
    camera.position.set(0, -0.05, isMobile ? 4.35 : 4.55);
    camera.lookAt(0, -0.05, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Root Group for interactive parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ========================================================
    // 2. REALISTIC STANDING OPEN LEATHER-BOUND MANUSCRIPT
    // ========================================================
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, 0, 0);
    rootGroup.add(bookGroup);

    // Materials
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x1a0f08,
      roughness: 0.6,
      metalness: 0.15,
    });

    const goldLeafMat = new THREE.MeshStandardMaterial({
      color: 0xdfa84a,
      roughness: 0.22,
      metalness: 0.92,
    });

    const gildedEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xc89230,
      roughness: 0.38,
      metalness: 0.65,
    });

    // --- LEFT PAGE TEXTURE (Aged prologue with illuminated emblem) ---
    const leftCanvas = document.createElement('canvas');
    leftCanvas.width = 1024;
    leftCanvas.height = 1024;
    const lCtx = leftCanvas.getContext('2d')!;
    
    // Parchment base
    lCtx.fillStyle = '#f4ebd4';
    lCtx.fillRect(0, 0, 1024, 1024);

    // Vignette borders
    lCtx.strokeStyle = 'rgba(180, 130, 60, 0.75)';
    lCtx.lineWidth = 6;
    lCtx.strokeRect(32, 32, 960, 960);
    lCtx.strokeStyle = 'rgba(120, 80, 30, 0.5)';
    lCtx.lineWidth = 2;
    lCtx.strokeRect(48, 48, 928, 928);

    // Corner Fleurons
    lCtx.fillStyle = '#8c591c';
    lCtx.font = 'bold 30px Georgia, serif';
    lCtx.fillText('✤', 58, 86);
    lCtx.fillText('✤', 938, 86);
    lCtx.fillText('✤', 58, 958);
    lCtx.fillText('✤', 938, 958);

    // Left Page Header
    lCtx.fillStyle = '#6b3f10';
    lCtx.font = 'bold 42px Georgia, serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('— ANTHOLOGY —', 512, 145);

    lCtx.fillStyle = '#160d07';
    lCtx.font = 'bold italic 32px Georgia, serif';
    lCtx.fillText('Folio I • Inscription of the Soul', 512, 205);

    // Vintage Central Crest / Seal
    lCtx.strokeStyle = 'rgba(160, 100, 30, 0.85)';
    lCtx.lineWidth = 4;
    lCtx.beginPath();
    lCtx.arc(512, 420, 130, 0, Math.PI * 2);
    lCtx.stroke();
    lCtx.beginPath();
    lCtx.arc(512, 420, 144, 0, Math.PI * 2);
    lCtx.stroke();

    lCtx.fillStyle = '#8b181b';
    lCtx.font = '76px Georgia, serif';
    lCtx.fillText('✒', 512, 446);

    lCtx.fillStyle = '#6b3f10';
    lCtx.font = 'bold 30px Georgia, serif';
    lCtx.fillText('POETBYTE ARCHIVES', 512, 620);

    lCtx.fillStyle = '#110703';
    lCtx.font = 'bold italic 30px Georgia, serif';
    lCtx.fillText('“A sanctuary where emotions take form', 512, 695);
    lCtx.fillText('and timeless words endure forever.”', 512, 745);

    lCtx.fillStyle = '#8c591c';
    lCtx.font = 'bold 36px Georgia, serif';
    lCtx.fillText('❧   ✦   ❧', 512, 850);

    const leftPageTexture = new THREE.CanvasTexture(leftCanvas);
    leftPageTexture.anisotropy = 4;
    const leftPageMat = new THREE.MeshStandardMaterial({
      map: leftPageTexture,
      roughness: 0.85,
      metalness: 0.02,
    });

    // --- RIGHT PAGE TEXTURE (Live Calligraphy Canvas) ---
    const rightCanvas = document.createElement('canvas');
    rightCanvas.width = 1024;
    rightCanvas.height = 1024;
    const rCtx = rightCanvas.getContext('2d')!;

    const rightPageTexture = new THREE.CanvasTexture(rightCanvas);
    rightPageTexture.anisotropy = 4;
    const rightPageMat = new THREE.MeshStandardMaterial({
      map: rightPageTexture,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Book Dimensions (Standing Upright)
    const pageWidth = 1.58;
    const pageHeight = 2.28;
    const openAngle = 0.22; // Natural V-angle of a standing open book

    // Vertical Standing Spine
    const spineGeo = new THREE.CylinderGeometry(0.12, 0.12, pageHeight + 0.1, 16, 1, false, -Math.PI / 2, Math.PI);
    const spine = new THREE.Mesh(spineGeo, leatherMat);
    spine.position.set(0, 0, -0.08);
    bookGroup.add(spine);

    // Left Standing Page & Wing
    const leftWing = new THREE.Group();
    leftWing.rotation.y = openAngle;
    bookGroup.add(leftWing);

    const leftCoverGeo = new THREE.BoxGeometry(pageWidth + 0.08, pageHeight + 0.08, 0.05);
    const leftCover = new THREE.Mesh(leftCoverGeo, leatherMat);
    leftCover.position.set(-pageWidth / 2 - 0.04, 0, -0.04);
    leftWing.add(leftCover);

    const blockGeo = new THREE.BoxGeometry(pageWidth, pageHeight, 0.08);
    const leftBlock = new THREE.Mesh(blockGeo, gildedEdgeMat);
    leftBlock.position.set(-pageWidth / 2, 0, 0.01);
    leftWing.add(leftBlock);

    const sheetGeo = new THREE.PlaneGeometry(pageWidth, pageHeight);
    const leftPageMesh = new THREE.Mesh(sheetGeo, leftPageMat);
    leftPageMesh.position.set(-pageWidth / 2, 0, 0.055);
    leftWing.add(leftPageMesh);

    // Right Standing Page & Wing
    const rightWing = new THREE.Group();
    rightWing.rotation.y = -openAngle;
    bookGroup.add(rightWing);

    const rightCover = new THREE.Mesh(leftCoverGeo, leatherMat);
    rightCover.position.set(pageWidth / 2 + 0.04, 0, -0.04);
    rightWing.add(rightCover);

    const rightBlock = new THREE.Mesh(blockGeo, gildedEdgeMat);
    rightBlock.position.set(pageWidth / 2, 0, 0.01);
    rightWing.add(rightBlock);

    const rightPageMesh = new THREE.Mesh(sheetGeo, rightPageMat);
    rightPageMesh.position.set(pageWidth / 2, 0, 0.055);
    rightWing.add(rightPageMesh);

    // Crimson Silk Bookmark Ribbon (Draped gracefully down the vertical center cleft)
    const ribbonPoints = [
      new THREE.Vector3(0, pageHeight / 2 + 0.06, 0.08),
      new THREE.Vector3(0, 0.3, 0.12),
      new THREE.Vector3(0.01, -0.4, 0.13),
      new THREE.Vector3(0.02, -pageHeight / 2 - 0.08, 0.16),
      new THREE.Vector3(0.03, -pageHeight / 2 - 0.28, 0.22),
    ];
    const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 20, 0.02, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.4,
      metalness: 0.15,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    bookGroup.add(ribbon);

    // ========================================================
    // 3. MASTERPIECE REALISTIC CALLIGRAPHY FEATHER QUILL
    // ========================================================
    const quillGroup = new THREE.Group();
    quillGroup.scale.set(0.68, 0.68, 0.68);
    rightWing.add(quillGroup); // Attached to right wing for accurate local page tracking

    // --- High-Detail Calligraphy Metal Dip Nib ---
    const nibMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5d061,
      roughness: 0.12,
      metalness: 0.98,
      emissive: 0xb8860b,
      emissiveIntensity: 0.25,
    });

    // Nib Tip (Pointed sharp calligraphy tines)
    const nibPointGeo = new THREE.ConeGeometry(0.022, 0.18, 12);
    const nibPointMesh = new THREE.Mesh(nibPointGeo, nibMaterial);
    nibPointMesh.position.z = 0.09;
    nibPointMesh.rotation.x = Math.PI / 2;
    quillGroup.add(nibPointMesh);

    // Nib Body (Curved metal barrel of the nib)
    const nibBodyGeo = new THREE.CylinderGeometry(0.038, 0.022, 0.16, 16, 1, true);
    const nibBodyMesh = new THREE.Mesh(nibBodyGeo, nibMaterial);
    nibBodyMesh.position.z = 0.22;
    nibBodyMesh.rotation.x = Math.PI / 2;
    quillGroup.add(nibBodyMesh);

    // Ornate Engraved Brass/Gold Ferrule Ring (Collar connecting nib to feather)
    const ferruleGeo = new THREE.TorusGeometry(0.042, 0.012, 12, 24);
    const ferruleMesh = new THREE.Mesh(ferruleGeo, goldLeafMat);
    ferruleMesh.position.z = 0.31;
    quillGroup.add(ferruleMesh);

    const ferruleRing2 = new THREE.TorusGeometry(0.038, 0.008, 12, 24);
    const ferruleMesh2 = new THREE.Mesh(ferruleRing2, goldLeafMat);
    ferruleMesh2.position.z = 0.34;
    quillGroup.add(ferruleMesh2);

    // Nib Glow Light at writing point
    const nibLight = new THREE.PointLight(0xf59e0b, 1.4, 2.0);
    nibLight.position.set(0, 0, 0.06);
    quillGroup.add(nibLight);

    // Natural Curved Quill Shaft (Rachis / Barrel)
    const shaftPoints = [
      new THREE.Vector3(0, 0, 0.3),
      new THREE.Vector3(0.03, 0.6, 0.6),
      new THREE.Vector3(0.09, 1.4, 1.1),
      new THREE.Vector3(0.2, 2.2, 1.6),
      new THREE.Vector3(0.35, 2.9, 2.0),
    ];
    const shaftCurve = new THREE.CatmullRomCurve3(shaftPoints);
    const shaftGeo = new THREE.TubeGeometry(shaftCurve, 32, 0.022, 12, false);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0xfbf6ea,
      roughness: 0.25,
      metalness: 0.15,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    quillGroup.add(shaft);

    // --- Realistic Feather Texture with Natural Barbs & Gold Gradient ---
    const featherCanvas = document.createElement('canvas');
    featherCanvas.width = 512;
    featherCanvas.height = 1024;
    const fCtx = featherCanvas.getContext('2d')!;

    // Create realistic feather vane gradient (ivory base to rich burnished gold edge)
    const fGrad = fCtx.createLinearGradient(0, 0, 512, 1024);
    fGrad.addColorStop(0, '#ffffff');
    fGrad.addColorStop(0.3, '#fdf8ec');
    fGrad.addColorStop(0.7, '#e8c374');
    fGrad.addColorStop(1.0, '#b8860b');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 512, 1024);

    // Draw realistic feather barbs / striations
    fCtx.strokeStyle = 'rgba(184, 134, 11, 0.35)';
    fCtx.lineWidth = 1.5;
    for (let y = 50; y < 1000; y += 8) {
      fCtx.beginPath();
      fCtx.moveTo(256, y);
      // Curve upwards and outwards to mimic natural feather barbs
      fCtx.quadraticCurveTo(380, y - 25, 500, y - 50);
      fCtx.stroke();

      fCtx.beginPath();
      fCtx.moveTo(256, y);
      fCtx.quadraticCurveTo(130, y - 20, 15, y - 45);
      fCtx.stroke();
    }

    // Spine shadow
    fCtx.fillStyle = 'rgba(139, 90, 20, 0.25)';
    fCtx.fillRect(250, 0, 12, 1024);

    const featherTexture = new THREE.CanvasTexture(featherCanvas);
    featherTexture.anisotropy = 4;

    const featherMat = new THREE.MeshStandardMaterial({
      map: featherTexture,
      roughness: 0.45,
      metalness: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96,
    });

    // Asymmetrical Natural Feather Vane Shapes
    // Trailing (Wide) Vane
    const trailingShape = new THREE.Shape();
    trailingShape.moveTo(0, 0.6);
    trailingShape.bezierCurveTo(0.25, 1.1, 0.42, 1.8, 0.35, 2.5);
    trailingShape.bezierCurveTo(0.25, 2.8, 0.1, 2.9, 0, 3.0);
    trailingShape.lineTo(0, 0.6);

    const trailingGeo = new THREE.ExtrudeGeometry(trailingShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    });
    const trailingMesh = new THREE.Mesh(trailingGeo, featherMat);
    trailingMesh.position.set(0.04, 0, 0.6);
    trailingMesh.rotation.y = 0.2;
    quillGroup.add(trailingMesh);

    // Leading (Narrow) Vane
    const leadingShape = new THREE.Shape();
    leadingShape.moveTo(0, 0.7);
    leadingShape.bezierCurveTo(-0.12, 1.2, -0.18, 1.9, -0.12, 2.6);
    leadingShape.bezierCurveTo(-0.08, 2.8, -0.04, 2.95, 0, 3.0);
    leadingShape.lineTo(0, 0.7);

    const leadingGeo = new THREE.ExtrudeGeometry(leadingShape, {
      depth: 0.006,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    });
    const leadingMesh = new THREE.Mesh(leadingGeo, featherMat);
    leadingMesh.position.set(-0.02, 0, 0.6);
    leadingMesh.rotation.y = -0.1;
    quillGroup.add(leadingMesh);

    // Subtle Golden Ink Sparks at the nib
    const sparkCount = 35;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      const radius = 0.02 + Math.random() * 0.12;
      const theta = Math.random() * Math.PI * 2;
      sparkPositions[i * 3] = Math.cos(theta) * radius;
      sparkPositions[i * 3 + 1] = Math.sin(theta) * radius;
      sparkPositions[i * 3 + 2] = 0.02 + Math.random() * 0.2;

      sparkColors[i * 3] = 1.0;
      sparkColors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      sparkColors[i * 3 + 2] = 0.4;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    quillGroup.add(sparks);

    // ========================================================
    // 4. LIGHTING & ATMOSPHERE
    // ========================================================
    const candleLight = new THREE.PointLight(0xf59e0b, 3.2, 16);
    candleLight.position.set(2.4, 2.0, 3.0);
    scene.add(candleLight);

    const rimLight = new THREE.PointLight(0xdfa84a, 2.0, 14);
    rimLight.position.set(-2.8, 1.5, 2.0);
    scene.add(rimLight);

    const frontSoftLight = new THREE.DirectionalLight(0xfff8ea, 0.95);
    frontSoftLight.position.set(0, 1.5, 4.5);
    scene.add(frontSoftLight);

    const ambientLight = new THREE.AmbientLight(0xffeedb, 0.8);
    scene.add(ambientLight);

    // ========================================================
    // 5. EXTRA-LARGE, BOLD CENTERED VERSE WITH LIVE PEN TRACKING
    // ========================================================
    interface CenteredStrokeLine {
      fullText: string;
      y: number;
      font: string;
      color: string;
    }

    const poemLines: CenteredStrokeLine[] = [
      {
        fullText: 'Writing is an art',
        y: 220,
        font: 'bold italic 62px Georgia, serif',
        color: '#000000',
      },
      {
        fullText: 'where the soul finds its voice,',
        y: 295,
        font: 'bold italic 52px Georgia, serif',
        color: '#000000',
      },
      {
        fullText: 'turning unspoken emotions',
        y: 395,
        font: 'bold italic 48px Georgia, serif',
        color: '#050201',
      },
      {
        fullText: 'into words and silent thoughts',
        y: 468,
        font: 'bold italic 46px Georgia, serif',
        color: '#050201',
      },
      {
        fullText: 'into poetry.',
        y: 545,
        font: 'bold italic 52px Georgia, serif',
        color: '#050201',
      },
      {
        fullText: '— Vivek R',
        y: 665,
        font: 'bold italic 68px Georgia, serif',
        color: '#8b1014',
      },
      {
        fullText: '❧     ✦     ❧',
        y: 775,
        font: 'bold 42px Georgia, serif',
        color: '#7a4e18',
      },
    ];

    const totalChars = poemLines.reduce((sum, item) => sum + item.fullText.length, 0);

    const renderRightPage = (charsToDrawTotal: number): { px: number; py: number } => {
      // 1. Clear & Paint Rich Aged Parchment Background
      rCtx.fillStyle = '#f4ebd4';
      rCtx.fillRect(0, 0, 1024, 1024);

      // 2. Elegant Dual Borders
      rCtx.strokeStyle = 'rgba(180, 130, 60, 0.75)';
      rCtx.lineWidth = 6;
      rCtx.strokeRect(32, 32, 960, 960);

      rCtx.strokeStyle = 'rgba(120, 80, 30, 0.5)';
      rCtx.lineWidth = 2;
      rCtx.strokeRect(48, 48, 928, 928);

      // Corner Fleurons
      rCtx.fillStyle = '#8c591c';
      rCtx.font = 'bold 30px Georgia, serif';
      rCtx.textAlign = 'left';
      rCtx.fillText('✤', 58, 86);
      rCtx.fillText('✤', 938, 86);
      rCtx.fillText('✤', 58, 958);
      rCtx.fillText('✤', 938, 958);

      // Decorative top ornament
      rCtx.fillStyle = '#5c350e';
      rCtx.font = 'bold 28px Georgia, serif';
      rCtx.textAlign = 'center';
      rCtx.fillText('✦   SCRIBED VERSE   ✦', 512, 135);

      let remaining = charsToDrawTotal;
      let penPixelX = 512;
      let penPixelY = 235;

      for (let s = 0; s < poemLines.length; s++) {
        if (remaining <= 0) break;
        const line = poemLines[s];
        rCtx.font = line.font;
        rCtx.fillStyle = line.color;

        const count = Math.min(remaining, line.fullText.length);
        const chunk = line.fullText.substring(0, count);

        // Calculate line metrics to keep text centered while typing
        const fullLineWidth = rCtx.measureText(line.fullText).width;
        const lineStartX = 512 - fullLineWidth / 2;

        rCtx.textAlign = 'left';
        rCtx.fillText(chunk, lineStartX, line.y);

        // If it's Vivek R, add rich dark ink outline
        if (line.fullText.includes('Vivek R') && chunk.length > 0) {
          rCtx.strokeStyle = '#000000';
          rCtx.lineWidth = 1.2;
          rCtx.strokeText(chunk, lineStartX, line.y);
        }

        const chunkWidth = rCtx.measureText(chunk).width;
        penPixelX = lineStartX + chunkWidth;
        penPixelY = line.y;
        remaining -= count;
      }

      rightPageTexture.needsUpdate = true;
      return { px: penPixelX, py: penPixelY };
    };

    renderRightPage(0);

    // ========================================================
    // 6. ANIMATION LOOP & SMOOTH INTERACTION
    // ========================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotY = mouseX * 0.35;
      targetRotX = -mouseY * 0.25;
    };

    container.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const mobile = window.innerWidth < 640;
      camera.fov = mobile ? 40 : 38;
      camera.position.set(0, -0.05, mobile ? 4.35 : 4.55);
      camera.lookAt(0, -0.05, 0);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    let animId: number;
    let currentChars = 0;
    let lastCharTick = performance.now();
    let isHolding = false;
    let holdStart = 0;
    const startTime = performance.now();

    let quillX = pageWidth / 2;
    let quillY = 0.4;
    let quillZ = 0.08;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      // Mouse Parallax
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.05;

      // Flickering candlelight
      candleLight.intensity = 3.2 + Math.sin(elapsed * 5.5) * 0.35 + Math.cos(elapsed * 7.8) * 0.15;
      nibLight.intensity = 1.8 + Math.sin(elapsed * 4.2) * 0.35;

      // Progression
      if (!isHolding) {
        if (now - lastCharTick > 35) {
          currentChars++;
          lastCharTick = now;

          if (currentChars >= totalChars) {
            isHolding = true;
            holdStart = now;
          }
        }
      } else {
        // Hold for 5 seconds so user reads the completed page, then re-scribe
        if (now - holdStart > 5000) {
          currentChars = 0;
          isHolding = false;
          lastCharTick = now;
        }
      }

      // Render 2D Canvas & get pen pixel coordinate
      const { px, py } = renderRightPage(currentChars);

      // Coordinate Mapping to Right Standing Page Plane
      const u = px / 1024;
      const v = py / 1024;

      const targetX = pageWidth / 2 + (u - 0.5) * (pageWidth * 0.88);
      const targetY = (0.5 - v) * (pageHeight * 0.88);

      // When writing, nib touches standing page at Z ~ 0.065. When holding, pen pulls back to Z ~ 0.35
      const targetZ = isHolding
        ? 0.35 + Math.sin(elapsed * 1.6) * 0.04
        : 0.065 + Math.sin(elapsed * 18.0) * 0.005;

      quillX += (targetX - quillX) * 0.16;
      quillY += (targetY - quillY) * 0.16;
      quillZ += (targetZ - quillZ) * 0.16;

      quillGroup.position.set(quillX, quillY, quillZ);

      // Realistic scribe pen tilting (leaning comfortably to the right corner)
      quillGroup.rotation.z = -0.58 + Math.sin(elapsed * 4.0) * 0.02;
      quillGroup.rotation.x = 0.32 + Math.cos(elapsed * 3.5) * 0.02;
      quillGroup.rotation.y = 0.22;

      // Rotate stardust sparks around nib
      sparks.rotation.z = elapsed * 1.5;

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
      leftCoverGeo.dispose();
      spineGeo.dispose();
      blockGeo.dispose();
      sheetGeo.dispose();
      ribbonGeo.dispose();
      nibPointGeo.dispose();
      nibBodyGeo.dispose();
      ferruleGeo.dispose();
      ferruleRing2.dispose();
      shaftGeo.dispose();
      trailingGeo.dispose();
      leadingGeo.dispose();
      sparkGeo.dispose();
      leftPageTexture.dispose();
      rightPageTexture.dispose();
      featherTexture.dispose();
      leatherMat.dispose();
      goldLeafMat.dispose();
      gildedEdgeMat.dispose();
      leftPageMat.dispose();
      rightPageMat.dispose();
      ribbonMat.dispose();
      nibMaterial.dispose();
      shaftMat.dispose();
      featherMat.dispose();
      sparkMat.dispose();
    };
  }, []);

  return (
    <div className="relative py-6 md:py-16 overflow-hidden">
      {/* Warm Candlelight Glow Blurs */}
      <div className="absolute w-96 h-96 bg-[#dfa84a]/12 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-[#be123c]/12 rounded-full blur-3xl top-40 right-0 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-[#f59e0b]/12 rounded-full blur-3xl -bottom-10 left-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text & Calligraphy Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 text-center lg:text-left space-y-5"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
              Penned in <span className="gold-foil-text">Parchment</span>, Preserved in{' '}
              <span className="candle-amber-text">Gold</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#b8a690] max-w-2xl font-serif leading-relaxed italic">
              Immerse yourself in a timeless library of lyrical verses. Drafted with vintage quills, bound in aged leather, and sealed with crimson wax.
            </p>
          </motion.div>

          {/* Right 3D Standing Open Illuminated Book & Live Writing Quill Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-6 flex flex-col items-center justify-center relative w-full"
          >
            <div
              className="relative w-full max-w-[440px] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[580px] aspect-square rounded-full flex items-center justify-center group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Candlelight Aura Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dfa84a]/25 via-[#f59e0b]/30 to-[#be123c]/20 blur-3xl animate-candle-flicker" />

              {/* Three.js Canvas Container */}
              <div
                ref={canvasContainerRef}
                className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
