"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { achievements } from "@/data/site";
import {
  CENTER,
  EYES,
  LEFT,
  MARK_COLORS,
  RIGHT,
  SLASH,
  STROKE_W,
  type Pt,
} from "@/lib/geekmark";

/* ---------- geometry traced from the logo (see lib/geekmark) ---------- */

const S = 1 / 85; // logo units → world units
const toWorld = (x: number, y: number) =>
  new THREE.Vector3((x - CENTER[0]) * S, (CENTER[1] - y) * S, 0);
const RADIUS = (STROKE_W / 2) * S;

type Seg = [number, number, number, number];
const segments = (pts: Pt[]): Seg[] =>
  pts.slice(1).map((p, i) => [pts[i][0], pts[i][1], p[0], p[1]]);
const LEFT_SEGS = segments(LEFT);
const RIGHT_SEGS = segments(RIGHT);

/** A round-capped stroke between two logo points; neighbours overlap into round joins. */
function Stroke({ seg, material }: { seg: Seg; material: THREE.Material }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = toWorld(seg[0], seg[1]);
    const b = toWorld(seg[2], seg[3]);
    const dir = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: q,
      length: dir.length(),
    };
  }, [seg]);
  return (
    <mesh
      position={position}
      quaternion={quaternion}
      material={material}
      castShadow
    >
      <capsuleGeometry args={[RADIUS, length, 12, 32]} />
    </mesh>
  );
}

/** The brush-stroke slash: its traced outline extruded to the brackets' depth, edges bevelled. */
function Slash({ material }: { material: THREE.Material }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape(
      SLASH.map(([x, y]) => {
        const v = toWorld(x, y);
        return new THREE.Vector2(v.x, v.y);
      }),
    );
    const bevel = 4 * S;
    const depth = STROKE_W * S - bevel * 2;
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: 2.5 * S,
      bevelSegments: 6,
      curveSegments: 1,
    });
    g.translate(0, 0, -depth / 2);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} castShadow />;
}

/* ---------- materials ---------- */

function useMaterials() {
  return useMemo(
    () => ({
      teal: new THREE.MeshPhysicalMaterial({
        color: MARK_COLORS.teal,
        roughness: 0.22,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
      orange: new THREE.MeshPhysicalMaterial({
        color: MARK_COLORS.orange,
        // A touch of self-light so the flat slash face keeps the logo's punch
        emissive: MARK_COLORS.orange,
        emissiveIntensity: 0.18,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      }),
      paper: new THREE.MeshPhysicalMaterial({
        color: MARK_COLORS.white,
        roughness: 0.35,
        clearcoat: 0.6,
      }),
      ring: new THREE.MeshBasicMaterial({
        color: "#eeece6",
        transparent: true,
        opacity: 0.22,
      }),
      ringFaint: new THREE.MeshBasicMaterial({
        color: "#eeece6",
        transparent: true,
        opacity: 0.08,
      }),
      node: new THREE.MeshStandardMaterial({
        color: "#ff5a1f",
        emissive: "#ff5a1f",
        emissiveIntensity: 0.6,
      }),
    }),
    [],
  );
}

/* ---------- the mark ---------- */

type Progress = MutableRefObject<number>;

function Mark({ progress, reduced }: { progress: Progress; reduced: boolean }) {
  const m = useMaterials();
  const root = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const slash = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const p = progress.current; // 0 → 1 while the hero scrolls away
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent damping

    // Idle sway + pointer tilt, both damped
    const targetY =
      (reduced ? 0 : Math.sin(t * 0.45) * 0.35) +
      state.pointer.x * 0.35 +
      p * 1.2;
    const targetX =
      -state.pointer.y * 0.2 + (reduced ? 0 : Math.sin(t * 0.3) * 0.06);
    root.current.rotation.y = THREE.MathUtils.lerp(
      root.current.rotation.y,
      targetY,
      k * 0.08,
    );
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      targetX,
      k * 0.08,
    );
    root.current.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.06;

    // Scroll pulls the mark apart at the seams
    if (left.current)
      left.current.position.x = THREE.MathUtils.lerp(
        left.current.position.x,
        -p * 0.9,
        k * 0.15,
      );
    if (right.current)
      right.current.position.x = THREE.MathUtils.lerp(
        right.current.position.x,
        p * 0.9,
        k * 0.15,
      );
    if (slash.current)
      slash.current.rotation.z = THREE.MathUtils.lerp(
        slash.current.rotation.z,
        -p * Math.PI * 0.5,
        k * 0.15,
      );
  });

  return (
    <group ref={root}>
      <group ref={left}>
        {LEFT_SEGS.map((s, i) => (
          <Stroke key={i} seg={s} material={m.teal} />
        ))}
      </group>
      <group ref={right}>
        {RIGHT_SEGS.map((s, i) => (
          <Stroke key={i} seg={s} material={m.teal} />
        ))}
      </group>
      <group ref={slash}>
        <Slash material={m.orange} />
      </group>
      {/* Eyes are flat discs in the logo: slightly squashed spheres keep the gloss without bulging */}
      {EYES.map(({ c, r }) => (
        <mesh key={c[0]} position={toWorld(c[0], c[1])} scale={[1, 1, 0.7]} material={m.paper}>
          <sphereGeometry args={[r * S, 48, 48]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- achievement orbit ---------- */

const ORBIT_R = 2.85;

type Labels = MutableRefObject<(HTMLDivElement | null)[]>;

function Orbit({ reduced, labels }: { reduced: boolean; labels: Labels }) {
  const m = useMaterials();
  const spin = useRef<THREE.Group>(null);
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const world = useMemo(() => new THREE.Vector3(), []);
  const screen = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, delta) => {
    if (!spin.current) return;
    if (!reduced) spin.current.rotation.y += delta * 0.22;
    nodes.current.forEach((node, i) => {
      const el = labels.current[i];
      if (!node || !el) return;
      node.getWorldPosition(world);
      // Depth cue: satellites behind the mark dim and shrink
      const front = THREE.MathUtils.clamp(
        (world.z + ORBIT_R) / (2 * ORBIT_R),
        0,
        1,
      );
      screen.copy(world).project(camera);
      const x = ((screen.x + 1) / 2) * size.width;
      const y = ((1 - screen.y) / 2) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -160%) scale(${(0.78 + front * 0.22).toFixed(3)})`;
      el.style.opacity = (0.16 + front * 0.84).toFixed(3);
      el.style.zIndex = String(Math.round(front * 10));
    });
  });

  return (
    <group rotation={[0.42, 0, -0.18]}>
      {/* rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.ring}>
        <torusGeometry args={[ORBIT_R, 0.008, 8, 200]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.ringFaint}>
        <torusGeometry args={[ORBIT_R * 1.22, 0.006, 8, 200]} />
      </mesh>

      <group ref={spin}>
        {achievements.map((ms, i) => {
          const a = (i / achievements.length) * Math.PI * 2;
          return (
            <group
              key={ms.label}
              ref={(g) => {
                nodes.current[i] = g;
              }}
              position={[Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R]}
            >
              <mesh material={m.node}>
                <sphereGeometry args={[0.07, 24, 24]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/* ---------- canvas ---------- */

export default function GeekMark3D({
  progress,
  className = "",
}: {
  progress: Progress;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(max-width: 1023px)");
    const onMq = () => setCompact(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "100px",
    });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <div className="relative h-full w-full">
        <Canvas
          dpr={[1, 1.6]}
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0.6, compact ? 14.5 : 11.5], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} />
          <directionalLight
            position={[-5, -2, -4]}
            intensity={0.5}
            color="#ff5a1f"
          />
          {/* Procedural studio reflections: no HDR download */}
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={3}
              position={[0, 4, 5]}
              scale={[10, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              color="#ff5a1f"
              position={[-6, 0, 2]}
              rotation-y={Math.PI / 2}
              scale={[6, 4, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#19b3bf"
              position={[6, -1, 2]}
              rotation-y={-Math.PI / 2}
              scale={[6, 4, 1]}
            />
            <Lightformer
              form="ring"
              intensity={2}
              position={[0, 0, -6]}
              scale={4}
            />
          </Environment>
          <Mark progress={progress} reduced={reduced} />
          <Orbit reduced={reduced} labels={labels} />
        </Canvas>

        {/* Achievement labels live in plain DOM above the canvas, positioned every frame */}
        <div className="pointer-events-none absolute inset-0">
          {achievements.map((ms, i) => (
            <div
              key={ms.label}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="absolute top-0 left-0 rounded-full border border-line-strong bg-ink/85 px-3 py-1.5 whitespace-nowrap opacity-0 will-change-transform"
            >
              <span className="font-mono text-xs text-orange">{ms.value}</span>
              <span className={`ml-2 text-paper ${compact ? "text-xs" : "text-sm"}`}>
                {compact ? ms.short : ms.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
