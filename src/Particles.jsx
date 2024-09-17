import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  attribute float random;
  varying vec3 vColor;
  varying vec2 vUv;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform float time;

  void main() {
    vec3 pos = position;
    float t = mod(time * 0.5 + pos.x * 0.05, 1.0);
    pos.x = mix(-1.0, 2.0, t);
    pos.y += sin(t * 2.28318 + random * -1000.0 + time * random) * random * 0.05;
    pos.z -= cos(t * -10.0 + random * 1.0 + time * random * 1.0) * random * 0.15;

    float colorT = smoothstep(-3.0, 2.0, pos.x);
    vColor = mix(colorA, colorB, colorT);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 0.4 * (0.45 / -mvPosition.z);
    vUv = uv;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float circle = smoothstep(0.4, 0.5, r);
    float glow = exp(5.0 * 0.5) * 0.1;

    vec3 color = vColor * (circle + glow);
    gl_FragColor = vec4(color, circle);
  }
`;

export function Particles() {
  const ref = useRef();
  const shaderRef = useRef();
  const particlesCount = 10000;

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-5, -0.05, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 0.05, 0),
      new THREE.Vector3(10, 0, 0),
    ],
    []
  );

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5),
    [curvePoints]
  );

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const randoms = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const t = i / particlesCount;
      const pos = curve.getPoint(t);
      positions.set([pos.x, pos.y, pos.z], i * 3);
      randoms[i] = Math.random();
    }

    return { positions, randoms };
  }, [curve, particlesCount]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.getElapsedTime() / 5;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 5;
    }
  });

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      colorA: { value: new THREE.Color("#d1d5db") },
      colorB: { value: new THREE.Color("#38bdf8") },
    }),
    []
  );

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-random"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
