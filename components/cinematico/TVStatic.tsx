'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TVStatic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // Fit renderer to container
    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create noise shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scale: { value: 12.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float scale;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 st = vUv * scale;
          
          float noise1 = random(st + time * 0.1);
          float noise2 = random((st * 2.0) + time * 0.15) * 0.5;
          float noise3 = random((st * 4.0) + time * 0.2) * 0.25;
          
          float mixedNoise = noise1 + noise2 + noise3;
          float vignette = 1.0 - length(vUv - 0.5) * 0.5;
          float finalNoise = mixedNoise * vignette * 0.2;
          
          vec3 purpleColor = vec3(0.4, 0.15, 0.4);
          vec3 finalColor = mix(purpleColor, vec3(finalNoise), 0.7);
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      material.uniforms.time.value = performance.now() * 0.005;
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
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ height: '100%' }}
      />
    </motion.div>
  );
}
