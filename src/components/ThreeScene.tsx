import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PageRoute } from '../data/studioContent';

interface ThreeSceneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  activeRoute: PageRoute;
}

const COLOR_IVORY = new THREE.Color('#FAF6F2');
const COLOR_BLUSH_MIST = new THREE.Color('#F0E5DE');
const COLOR_ESPRESSO = new THREE.Color('#231919');
const _bgColor = new THREE.Color('#FAF6F2');
const _fogColor = new THREE.Color('#FAF6F2');

interface RouteCameraPreset {
  darkFactor: number;
  camX: number;
  camY: number;
  camZ: number;
  ringOrbit: number;
}

const ROUTE_PRESETS: Record<PageRoute, RouteCameraPreset> = {
  '/': { darkFactor: 0, camX: 0, camY: 0, camZ: 9.4, ringOrbit: 0 },
  '/specialties': { darkFactor: 0.08, camX: -0.55, camY: 0.35, camZ: 8.6, ringOrbit: 0.9 },
  '/services': { darkFactor: 1, camX: 0.65, camY: -0.25, camZ: 8.3, ringOrbit: 1.8 },
  '/founders': { darkFactor: 1, camX: -0.45, camY: 0.45, camZ: 9.1, ringOrbit: 2.6 },
  '/book': { darkFactor: 1, camX: 0.15, camY: -0.4, camZ: 8.1, ringOrbit: 3.4 },
};

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return { supported: false, isSoftwareGl: true };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

function createChampagneParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 248, 240, 1)');
    grad.addColorStop(0.32, 'rgba(225, 187, 150, 0.85)');
    grad.addColorStop(0.68, 'rgba(158, 94, 99, 0.25)');
    grad.addColorStop(1, 'rgba(158, 94, 99, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function buildCompositeCoutureRing(
  radius: number,
  tube: number,
  primaryMat: THREE.Material,
  filigreeMat: THREE.Material,
  crystalMat: THREE.Material,
  disposables: { geometries: THREE.BufferGeometry[] },
): THREE.Group {
  const group = new THREE.Group();

  const mainRingGeo = new THREE.TorusGeometry(radius, tube, 24, 96);
  disposables.geometries.push(mainRingGeo);
  group.add(new THREE.Mesh(mainRingGeo, primaryMat));

  const innerRingGeo = new THREE.TorusGeometry(radius * 0.91, tube * 0.34, 16, 80);
  disposables.geometries.push(innerRingGeo);
  group.add(new THREE.Mesh(innerRingGeo, filigreeMat));

  const outerHaloGeo = new THREE.TorusGeometry(radius * 1.07, tube * 0.22, 12, 72);
  disposables.geometries.push(outerHaloGeo);
  const outerHalo = new THREE.Mesh(outerHaloGeo, filigreeMat);
  outerHalo.rotation.x = 0.08;
  group.add(outerHalo);

  const crystalGeo = new THREE.OctahedronGeometry(tube * 2.1, 0);
  const bezelGeo = new THREE.TorusGeometry(tube * 2.35, tube * 0.38, 10, 20);
  disposables.geometries.push(crystalGeo, bezelGeo);

  const jewelCount = 6;
  for (let i = 0; i < jewelCount; i++) {
    const angle = (i / jewelCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(x, y, tube * 0.65);
    crystal.rotation.set(angle, angle * 0.5, 0);
    group.add(crystal);

    const bezel = new THREE.Mesh(bezelGeo, primaryMat);
    bezel.position.set(x, y, tube * 0.35);
    group.add(bezel);
  }

  return group;
}

function buildSilkRibbon(
  points: THREE.Vector3[],
  radius: number,
  material: THREE.Material,
  disposables: { geometries: THREE.BufferGeometry[] },
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 96, radius, 12, false);
  geo.scale(1, 1, 0.22);
  disposables.geometries.push(geo);
  return new THREE.Mesh(geo, material);
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ scrollProgressRef, activeRoute }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRouteRef = useRef<PageRoute>(activeRoute);
  const [useFallback2D, setUseFallback2D] = useState(false);

  useEffect(() => {
    activeRouteRef.current = activeRoute;
  }, [activeRoute]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    if (!supported) {
      setUseFallback2D(true);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    let envTarget: THREE.WebGLRenderTarget | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
      });

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);
    } catch {
      setUseFallback2D(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = COLOR_IVORY.clone();
    scene.fog = new THREE.FogExp2('#FAF6F2', 0.042);

    const camera = new THREE.PerspectiveCamera(
      44,
      window.innerWidth / window.innerHeight,
      0.1,
      60,
    );
    camera.position.set(0, 0, 9.4);

    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      pmremGenerator.dispose();
    } catch {
      envTarget = null;
    }

    const hemiLight = new THREE.HemisphereLight('#FFF7EE', '#472E30', 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFE5C7', 2.4);
    keyLight.position.set(6, 7, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#D99DA3', 1.45);
    rimLight.position.set(-7, -3, 4);
    scene.add(rimLight);

    const disposables = {
      geometries: [] as THREE.BufferGeometry[],
      materials: [] as THREE.Material[],
      textures: [] as THREE.Texture[],
    };

    const brushedRoseGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D3A47E'),
      metalness: 0.94,
      roughness: 0.17,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
      anisotropy: 0.78,
      envMapIntensity: 1.25,
    });

    const matteChampagneMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#B57B7B'),
      metalness: 0.72,
      roughness: 0.44,
      envMapIntensity: 1.0,
    });

    const crystalAccentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFF8F1'),
      metalness: 0.12,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      ior: 1.85,
      envMapIntensity: 1.6,
    });

    const roseSilkMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#A8686D'),
      roughness: 0.36,
      metalness: 0.06,
      sheen: 1.0,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#F3DCC7'),
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const champagneSilkMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D6B493'),
      roughness: 0.32,
      metalness: 0.18,
      sheen: 1.0,
      sheenRoughness: 0.28,
      sheenColor: new THREE.Color('#FFF5EC'),
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    disposables.materials.push(
      brushedRoseGoldMat,
      matteChampagneMat,
      crystalAccentMat,
      roseSilkMat,
      champagneSilkMat,
    );

    const ringRig = new THREE.Group();
    scene.add(ringRig);

    const ringPrimary = buildCompositeCoutureRing(
      2.35,
      0.048,
      brushedRoseGoldMat,
      matteChampagneMat,
      crystalAccentMat,
      disposables,
    );
    ringPrimary.position.set(2.85, 0.35, -1.6);
    ringPrimary.rotation.set(0.45, -0.55, 0.22);
    ringRig.add(ringPrimary);

    const ringSecondary = buildCompositeCoutureRing(
      1.75,
      0.036,
      brushedRoseGoldMat,
      matteChampagneMat,
      crystalAccentMat,
      disposables,
    );
    ringSecondary.position.set(-3.2, -1.25, -3.4);
    ringSecondary.rotation.set(-0.6, 0.4, 0.5);
    ringRig.add(ringSecondary);

    const ringDeep = buildCompositeCoutureRing(
      3.15,
      0.032,
      matteChampagneMat,
      brushedRoseGoldMat,
      crystalAccentMat,
      disposables,
    );
    ringDeep.position.set(-0.4, 1.8, -6.2);
    ringDeep.rotation.set(0.92, 0.25, -0.32);
    ringRig.add(ringDeep);

    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);

    const ribbon1 = buildSilkRibbon(
      [
        new THREE.Vector3(-8.5, 2.2, -4.5),
        new THREE.Vector3(-3.4, 3.6, -2.8),
        new THREE.Vector3(1.6, 0.6, -2.2),
        new THREE.Vector3(5.8, -1.9, -3.6),
        new THREE.Vector3(9.4, 0.4, -5.2),
      ],
      0.34,
      roseSilkMat,
      disposables,
    );
    ribbonGroup.add(ribbon1);

    const ribbon2 = buildSilkRibbon(
      [
        new THREE.Vector3(-9.0, -2.6, -5.0),
        new THREE.Vector3(-3.8, -1.1, -3.2),
        new THREE.Vector3(0.8, -2.8, -2.0),
        new THREE.Vector3(4.9, 1.1, -3.2),
        new THREE.Vector3(9.2, 2.8, -5.4),
      ],
      0.28,
      champagneSilkMat,
      disposables,
    );
    ribbonGroup.add(ribbon2);

    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const paletteHex = ['#EBD4BA', '#C59B76', '#B37378', '#FFF5EB'];
    const tempCol = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 11 - 2.2;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      tempCol.set(paletteHex[i % paletteHex.length]);
      colors[i3] = tempCol.r;
      colors[i3 + 1] = tempCol.g;
      colors[i3 + 2] = tempCol.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    disposables.geometries.push(particleGeo);

    const particleTex = createChampagneParticleTexture();
    disposables.textures.push(particleTex);

    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });
    disposables.materials.push(particleMat);

    const dustPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(dustPoints);

    if (!isSoftwareGl) {
      try {
        renderer.compile(scene, camera);
      } catch {
        // Non-fatal pre-warm failure; shaders will compile on draw
      }
    }

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };
    let smoothScroll = scrollProgressRef.current;
    let smoothDark = ROUTE_PRESETS[activeRouteRef.current].darkFactor;
    let smoothOrbit = ROUTE_PRESETS[activeRouteRef.current].ringOrbit;
    let smoothCamX = ROUTE_PRESETS[activeRouteRef.current].camX;
    let smoothCamY = ROUTE_PRESETS[activeRouteRef.current].camY;
    let smoothCamZ = ROUTE_PRESETS[activeRouteRef.current].camZ;

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 90);
      }
    }

    function updateScene(elapsed: number, delta: number) {
      const preset = ROUTE_PRESETS[activeRouteRef.current] ?? ROUTE_PRESETS['/'];
      smoothScroll = THREE.MathUtils.damp(smoothScroll, scrollProgressRef.current, 4.5, delta);
      smoothDark = THREE.MathUtils.damp(smoothDark, preset.darkFactor, 3.6, delta);
      smoothOrbit = THREE.MathUtils.damp(smoothOrbit, preset.ringOrbit, 3.2, delta);
      smoothCamX = THREE.MathUtils.damp(smoothCamX, preset.camX, 3.2, delta);
      smoothCamY = THREE.MathUtils.damp(smoothCamY, preset.camY, 3.2, delta);
      smoothCamZ = THREE.MathUtils.damp(smoothCamZ, preset.camZ, 3.2, delta);

      pointer.x = THREE.MathUtils.damp(pointer.x, pointer.targetX, 3.5, delta);
      pointer.y = THREE.MathUtils.damp(pointer.y, pointer.targetY, 3.5, delta);

      const motionScale = reducedMotion ? 0.15 : 1;

      if (smoothDark < 0.35) {
        _bgColor.copy(COLOR_IVORY).lerp(COLOR_BLUSH_MIST, smoothDark / 0.35);
      } else {
        _bgColor.copy(COLOR_BLUSH_MIST).lerp(COLOR_ESPRESSO, (smoothDark - 0.35) / 0.65);
      }
      scene.background = _bgColor;
      if (scene.fog instanceof THREE.FogExp2) {
        _fogColor.copy(_bgColor);
        scene.fog.color.copy(_fogColor);
      }

      keyLight.intensity = THREE.MathUtils.lerp(2.4, 3.05, smoothDark);
      hemiLight.intensity = THREE.MathUtils.lerp(1.2, 0.72, smoothDark);
      particleMat.opacity = THREE.MathUtils.lerp(0.62, 0.88, smoothDark);
      roseSilkMat.opacity = THREE.MathUtils.lerp(0.24, 0.36, smoothDark);
      champagneSilkMat.opacity = THREE.MathUtils.lerp(0.2, 0.34, smoothDark);

      camera.position.x = smoothCamX + pointer.x * 0.48 * motionScale;
      camera.position.y = smoothCamY - pointer.y * 0.34 * motionScale - smoothScroll * 0.7;
      camera.position.z = smoothCamZ - smoothScroll * 0.6;
      camera.lookAt(0, -smoothScroll * 0.35, -2.5);

      const t = elapsed * motionScale;
      const orbitPhase = smoothOrbit + smoothScroll * 1.1;

      ringPrimary.rotation.x = 0.45 + orbitPhase * 0.55 + Math.sin(t * 0.38) * 0.14;
      ringPrimary.rotation.y = -0.55 + t * 0.16 + orbitPhase * 0.85;
      ringPrimary.position.y = 0.35 + Math.sin(t * 0.5) * 0.22 - smoothScroll * 0.7;
      ringPrimary.position.x = 2.85 - Math.sin(orbitPhase * 0.7) * 1.1;

      ringSecondary.rotation.x = -0.6 - orbitPhase * 0.7 + Math.cos(t * 0.32) * 0.12;
      ringSecondary.rotation.y = 0.4 - t * 0.14 - orbitPhase * 0.65;
      ringSecondary.position.y = -1.25 + Math.cos(t * 0.44) * 0.25 + smoothScroll * 0.9;
      ringSecondary.position.x = -3.2 + Math.sin(orbitPhase * 0.8) * 1.25;

      ringDeep.rotation.z = -0.32 + t * 0.08 + orbitPhase * 0.48;
      ringDeep.rotation.x = 0.92 + Math.sin(t * 0.26) * 0.1;
      ringDeep.position.y = 1.8 - smoothScroll * 1.2;

      ribbon1.rotation.z = Math.sin(t * 0.25) * 0.07 + orbitPhase * 0.18;
      ribbon1.position.y = Math.sin(t * 0.35) * 0.25 - smoothScroll * 0.5;
      ribbon2.rotation.z = Math.cos(t * 0.22) * 0.08 - orbitPhase * 0.16;
      ribbon2.position.y = Math.cos(t * 0.3) * 0.22 + smoothScroll * 0.45;

      dustPoints.rotation.y = t * 0.028 + orbitPhase * 0.22;
      dustPoints.rotation.x = smoothScroll * 0.18;
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        posAttr.array[i3] = bx + Math.sin(t * 0.42 + i * 0.7) * 0.16 * motionScale;
        posAttr.array[i3 + 1] = ((by + t * 0.12 * motionScale + 7) % 14) - 7;
      }
      posAttr.needsUpdate = true;
    }

    function tick() {
      if (disposed) return;
      try {
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();
        updateScene(elapsed, delta);
        renderer.render(scene, camera);
      } catch {
        disposed = true;
        setUseFallback2D(true);
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());
      envTarget?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef]);

  useEffect(() => {
    if (!useFallback2D) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let currentDark = ROUTE_PRESETS[activeRouteRef.current].darkFactor;
    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.4 + 0.8,
      speed: Math.random() * 0.00025 + 0.00012,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const preset = ROUTE_PRESETS[activeRouteRef.current] ?? ROUTE_PRESETS['/'];
      currentDark += (preset.darkFactor - currentDark) * 0.08;

      const r = Math.round(250 + (35 - 250) * currentDark);
      const g = Math.round(246 + (25 - 246) * currentDark);
      const b = Math.round(242 + (25 - 242) * currentDark);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.strokeStyle = `rgba(197, 155, 118, ${0.28 + currentDark * 0.14})`;
      ctx.lineWidth = 1.5;
      ctx.translate(w * 0.72, h * 0.38);
      ctx.rotate(time * 0.00018 + preset.ringOrbit * 0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(w, h) * 0.24, Math.min(w, h) * 0.14, 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      for (const p of particles) {
        p.y = (p.y - p.speed + 1) % 1;
        const px = p.x * w + Math.sin(time * 0.0008 + p.phase) * 16;
        const py = p.y * h;
        ctx.fillStyle = `rgba(218, 179, 140, ${0.35 + currentDark * 0.35})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [useFallback2D]);

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {useFallback2D ? (
        <canvas ref={fallbackCanvasRef} className="w-full h-full block" />
      ) : (
        <div ref={mountRef} className="w-full h-full" />
      )}
    </div>
  );
};
