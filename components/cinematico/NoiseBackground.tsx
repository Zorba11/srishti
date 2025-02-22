'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper function to convert from HSL to RGB (all values in the range [0,1])
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r, g, b };
}

export default function NoiseBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the Three.js scene, camera, and renderer.
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    // Responsive resizing based on container dimensions.
    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate a random seed for fractal variation.
    const randomSeed = Math.random() * 100.0;

    // Generate random hues using the golden ratio offset.
    const randomHue = Math.random();
    const goldenRatioConjugate = 0.61803398875;
    const newHue = (randomHue + goldenRatioConjugate) % 1;
    // Moderate saturation and lightness for a calm palette.
    const saturation = 0.6;
    const lightness = 0.5;
    const rgb1 = hslToRgb(randomHue, saturation, lightness);
    const rgb2 = hslToRgb(newHue, saturation, lightness);

    // Uniforms for the shader.
    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
      seed: { value: randomSeed },
      colorStart: { value: new THREE.Vector3(rgb1.r, rgb1.g, rgb1.b) },
      colorEnd: { value: new THREE.Vector3(rgb2.r, rgb2.g, rgb2.b) },
    };

    // Custom shader with fBm noise generation.
    const material = new THREE.ShaderMaterial({
      uniforms,
      fragmentShader: `
        uniform float time;
        uniform float seed;
        uniform vec3 colorStart;
        uniform vec3 colorEnd;
        varying vec2 vUv;
        
        // Helper functions for Perlin noise.
        vec3 mod289(vec3 x) { 
          return x - floor(x * (1.0 / 289.0)) * 289.0; 
        }
        vec2 mod289(vec2 x) { 
          return x - floor(x * (1.0 / 289.0)) * 289.0; 
        }
        vec3 permute(vec3 x) { 
          return mod289(((x * 34.0) + 1.0) * x); 
        }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187,
                              0.366025403784439,
                             -0.577350269189626,
                              0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                         + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), 
                                  dot(x12.xy, x12.xy), 
                                  dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        // Fractal Brownian Motion (fBm)
        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 5; i++) {
            value += amplitude * snoise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          float n = fbm(uv * 3.0 + vec2(seed, seed) + time * 0.1);
          vec3 baseColor = mix(colorStart, colorEnd, smoothstep(0.0, 1.0, uv.y));
          vec3 finalColor = baseColor + n * 0.05;
          finalColor += 0.02 * sin(time * 0.2);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      material.uniforms.time.value = performance.now() * 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    containerRef.current.appendChild(renderer.domElement);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{
        zIndex: 0,
        opacity: 0.9,
        mixBlendMode: 'normal',
      }}
    />
  );
}
