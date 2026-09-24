"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { EYES, LEFT, MARK_COLORS, RIGHT, SLASH, STROKE_W, toPath } from "@/lib/geekmark";

/*
 * Chinku, the Geek Room robot (T-37), rebuilt from photos of the cardboard original.
 * Everything is procedural (boxes + canvas-painted textures), so there is nothing to download,
 * and the canvas renders on demand: it only draws while Chinku is moving or gesturing.
 */

/* ---------- painted textures ---------- */

function canvasTexture(w: number, h: number, paint: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Deterministic speckle so paint and cardboard never look perfectly flat. */
function grain(g: CanvasRenderingContext2D, w: number, h: number, amount: number, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < (w * h) / 18; i++) {
    const a = (rnd() - 0.5) * amount;
    g.fillStyle = a > 0 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${-a})`;
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
  }
}

/** Worn edge: a slightly lighter, uneven stroke around a face, like handled card. */
function wornEdge(g: CanvasRenderingContext2D, w: number, h: number, color: string, width: number) {
  g.strokeStyle = color;
  g.lineWidth = width;
  g.strokeRect(width / 2, width / 2, w - width, h - width);
}

function faceTexture(blink: boolean) {
  return canvasTexture(256, 256, (g) => {
    const bg = g.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, "#d42a34");
    bg.addColorStop(1, "#b81d28");
    g.fillStyle = bg;
    g.fillRect(0, 0, 256, 256);
    // Inset screen outline
    g.strokeStyle = "#3a0a0e";
    g.lineWidth = 7;
    g.beginPath();
    g.roundRect(26, 26, 204, 204, 26);
    g.stroke();
    // Pixel eyes: white squares with a darker pupil block, or shut lines mid-blink
    for (const cx of [92, 164]) {
      if (blink) {
        g.fillStyle = "#2a0709";
        g.fillRect(cx - 20, 104, 40, 6);
        continue;
      }
      g.fillStyle = "#fbfaf6";
      g.fillRect(cx - 21, 86, 42, 42);
      g.strokeStyle = "#2a0709";
      g.lineWidth = 4;
      g.strokeRect(cx - 21, 86, 42, 42);
      g.fillStyle = "#8f1520";
      g.fillRect(cx - 4, 99, 20, 20);
    }
    // Smile
    g.strokeStyle = "#2a0709";
    g.lineWidth = 7;
    g.lineCap = "round";
    g.beginPath();
    g.arc(128, 150, 26, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();
    grain(g, 256, 256, 0.08);
  });
}

function redPaint(edge = "#5c0d13") {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = "#c9212c";
    g.fillRect(0, 0, 128, 128);
    grain(g, 128, 128, 0.1, 3);
    wornEdge(g, 128, 128, edge, 5);
  });
}

function drawMark(g: CanvasRenderingContext2D, x: number, y: number, size: number) {
  g.save();
  g.translate(x, y);
  g.scale(size / 400, size / 400);
  g.translate(-236, -192);
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = STROKE_W;
  g.strokeStyle = MARK_COLORS.teal;
  g.stroke(new Path2D(toPath(LEFT)));
  g.stroke(new Path2D(toPath(RIGHT)));
  g.fillStyle = MARK_COLORS.orange;
  g.fill(new Path2D(toPath(SLASH, true)));
  g.fillStyle = MARK_COLORS.white;
  for (const { c, r } of EYES) {
    g.beginPath();
    g.arc(c[0], c[1], r, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function torsoFront() {
  return canvasTexture(512, 512, (g) => {
    const bg = g.createLinearGradient(0, 0, 0, 512);
    bg.addColorStop(0, "#5e111a");
    bg.addColorStop(1, "#4a0c14");
    g.fillStyle = bg;
    g.fillRect(0, 0, 512, 512);
    // Red tape stripes: two straight on the left, two slanted on the right
    g.fillStyle = "#9c1b2a";
    g.fillRect(58, 0, 22, 512);
    g.fillRect(118, 0, 16, 512);
    g.beginPath();
    g.moveTo(398, 0); g.lineTo(424, 0); g.lineTo(346, 512); g.lineTo(320, 512);
    g.moveTo(452, 0); g.lineTo(470, 0); g.lineTo(404, 512); g.lineTo(386, 512);
    g.fill();
    // Thin seam across the middle
    g.fillStyle = "rgba(230,170,175,0.45)";
    g.fillRect(0, 262, 512, 3);
    drawMark(g, 256, 118, 120);
    grain(g, 512, 512, 0.07, 11);
    wornEdge(g, 512, 512, "#efece6", 14);
  });
}

function cardboard() {
  return canvasTexture(256, 256, (g) => {
    g.fillStyle = "#c29a68";
    g.fillRect(0, 0, 256, 256);
    // Corrugation shadows and fibres
    for (let x = 0; x < 256; x += 9) {
      g.fillStyle = "rgba(90,60,30,0.07)";
      g.fillRect(x, 0, 4, 256);
    }
    grain(g, 256, 256, 0.14, 5);
    wornEdge(g, 256, 256, "#efece6", 9);
  });
}

function torsoTop() {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = "#d9262f";
    g.fillRect(0, 0, 128, 128);
    grain(g, 128, 128, 0.08, 9);
    wornEdge(g, 128, 128, "#f2d5d5", 4);
  });
}

function baseFront() {
  return canvasTexture(384, 512, (g) => {
    g.fillStyle = "#eeebe4";
    g.fillRect(0, 0, 384, 512);
    // Red panel with a dark outline, deep at the top and brighter towards the floor
    const p = g.createLinearGradient(0, 70, 0, 512);
    p.addColorStop(0, "#6a0f19");
    p.addColorStop(1, "#b21f2b");
    g.fillStyle = p;
    g.beginPath();
    g.roundRect(28, 70, 328, 430, 14);
    g.fill();
    g.strokeStyle = "#1c0406";
    g.lineWidth = 6;
    g.stroke();
    g.fillStyle = "#f7f5f1";
    g.font = "900 92px Arial, Helvetica, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("T-37", 192, 352);
    g.fillStyle = "rgba(20,4,6,0.6)";
    g.fillRect(28, 452, 328, 4);
    grain(g, 384, 512, 0.07, 13);
  });
}

function whiteCard() {
  return canvasTexture(128, 128, (g) => {
    g.fillStyle = "#e9e5dd";
    g.fillRect(0, 0, 128, 128);
    grain(g, 128, 128, 0.09, 17);
  });
}

/** Box whose top and bottom have different footprints (the torso and base both taper). */
function taperedBox(wTop: number, wBottom: number, dTop: number, dBottom: number, h: number) {
  // Subdivided so painted stripes stay straight on the tapered faces instead of kinking across two triangles
  const g = new THREE.BoxGeometry(1, 1, 1, 8, 8, 8);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const t = p.getY(i) + 0.5;
    p.setX(i, p.getX(i) * THREE.MathUtils.lerp(wBottom, wTop, t));
    p.setZ(i, p.getZ(i) * THREE.MathUtils.lerp(dBottom, dTop, t));
    p.setY(i, t * h);
  }
  g.computeVertexNormals();
  return g;
}

/** Crumpled foil sheet for the right arm: a plane pushed around by layered waves. */
function foilSheet() {
  const g = new THREE.PlaneGeometry(0.46, 1.5, 10, 30);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z =
      Math.sin(y * 9 + x * 4) * 0.035 +
      Math.sin(y * 23 - x * 17) * 0.014 +
      Math.cos(x * 12) * 0.05 -
      x * x * 0.8;
    p.setZ(i, z);
  }
  g.computeVertexNormals();
  return g;
}

/* ---------- the model ---------- */

// Proportions measured off the photos (base floor at y = 0)
const BASE_H = 1.95;
const PLATE_H = 0.06;
const TORSO_H = 1.55;
const TORSO_Y = BASE_H + PLATE_H;
const TORSO_TOP = TORSO_Y + TORSO_H;

type Pose = {
  root: RefObject<THREE.Group | null>;
  body: RefObject<THREE.Group | null>;
  head: RefObject<THREE.Group | null>;
  face: RefObject<THREE.MeshStandardMaterial | null>;
};

function Chinku({ pose, faces }: { pose: Pose; faces: { open: THREE.Texture; shut: THREE.Texture } }) {
  const mats = useMemo(() => {
    const paint = (map: THREE.Texture, roughness = 0.62) =>
      new THREE.MeshStandardMaterial({ map, roughness, metalness: 0 });
    const red = paint(redPaint(), 0.55);
    const card = paint(cardboard(), 0.85);
    const white = paint(whiteCard(), 0.7);
    return {
      red,
      headRed: paint(redPaint("#3a0a0e"), 0.5),
      // [+x, -x, +y, -y, +z, -z]
      torso: [card, card, paint(torsoTop(), 0.5), card, paint(torsoFront(), 0.58), card],
      base: [white, white, white, white, paint(baseFront(), 0.6), white],
      plate: paint(cardboard(), 0.9),
      tube: new THREE.MeshPhysicalMaterial({ color: "#c81f2b", roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.4 }),
      foil: new THREE.MeshPhysicalMaterial({
        color: "#c01824",
        roughness: 0.24,
        metalness: 0.55,
        side: THREE.DoubleSide,
        clearcoat: 0.6,
      }),
      post: new THREE.MeshStandardMaterial({ color: "#8f1520", roughness: 0.5 }),
    };
  }, []);

  const geo = useMemo(
    () => ({
      torso: taperedBox(1.65, 1.2, 1.15, 0.95, TORSO_H),
      base: taperedBox(1.22, 1.46, 0.9, 1.02, BASE_H),
      foil: foilSheet(),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats)
        .flat()
        .forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          m.dispose();
        });
    },
    [geo, mats],
  );

  return (
    <group ref={pose.root} rotation={[0, 0.42, 0]}>
      <group ref={pose.body}>
        {/* Base: white card column with the T-37 panel */}
        <mesh geometry={geo.base} material={mats.base} castShadow receiveShadow />
        {/* Waist plate */}
        <mesh position={[0, BASE_H + PLATE_H / 2, 0]} material={mats.plate}>
          <boxGeometry args={[1.3, PLATE_H, 1.0]} />
        </mesh>
        {/* Torso */}
        <mesh position={[0, TORSO_Y, 0]} geometry={geo.torso} material={mats.torso} castShadow />

        {/* Left arm: rolled red tube hanging off the front corner */}
        <mesh position={[-0.9, TORSO_TOP - 0.62, 0.36]} rotation={[0.08, 0, 0.13]} material={mats.tube}>
          <cylinderGeometry args={[0.15, 0.15, 1.05, 28, 1]} />
        </mesh>
        <mesh position={[-0.83, TORSO_TOP - 0.1, 0.36]} rotation={[0, 0, 0.13]} material={mats.post}>
          <cylinderGeometry args={[0.155, 0.155, 0.06, 28]} />
        </mesh>
        {/* Right arm: crumpled red foil draped from the shoulder */}
        <mesh position={[0.86, TORSO_TOP - 0.95, -0.05]} rotation={[0, -1.25, -0.05]} geometry={geo.foil} material={mats.foil} />

        {/* Neck block and post */}
        <mesh position={[0, TORSO_TOP + 0.06, 0.05]} material={mats.red}>
          <boxGeometry args={[0.42, 0.12, 0.34]} />
        </mesh>
        <mesh position={[0, TORSO_TOP + 0.2, 0.05]} material={mats.post}>
          <cylinderGeometry args={[0.05, 0.06, 0.18, 16]} />
        </mesh>

        {/* Head, tilted like the original, with its painted face as a decal */}
        <group position={[0.04, TORSO_TOP + 0.72, 0.05]}>
          <group ref={pose.head} rotation={[0.05, 0.12, -0.13]}>
            <RoundedBox args={[1.02, 0.9, 0.86]} radius={0.035} smoothness={3} material={mats.headRed} castShadow />
            <mesh position={[0, 0, 0.432]}>
              <planeGeometry args={[0.94, 0.84]} />
              <meshStandardMaterial ref={pose.face} map={faces.open} roughness={0.5} polygonOffset polygonOffsetFactor={-1} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ---------- motion: scroll drives the dock across the screen ---------- */

const damp = THREE.MathUtils.damp;

function Rig({
  dock,
  pose,
  faces,
  reduced,
}: {
  dock: RefObject<HTMLDivElement | null>;
  pose: Pose;
  faces: { open: THREE.Texture; shut: THREE.Texture };
  reduced: boolean;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const m = useRef({ x: -1, v: 0, phase: 0, travel: 0, max: 1, gesture: -10 });

  useEffect(() => {
    const measure = () => {
      const el = document.documentElement;
      m.current.max = Math.max(1, el.scrollHeight - window.innerHeight);
      m.current.travel = Math.max(0, el.clientWidth - (dock.current?.offsetWidth ?? 0) - 48);
      invalidate();
    };
    const onScroll = () => invalidate();
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Every few seconds Chinku blinks and cocks his head, then the canvas goes idle again
    const idle = reduced
      ? 0
      : window.setInterval(() => {
          if (document.hidden) return;
          m.current.gesture = -1; // picked up on the next frame
          invalidate();
        }, 7000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(idle);
    };
  }, [dock, invalidate, reduced]);

  useFrame((state, delta) => {
    const s = m.current;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const target = 24 + Math.min(1, Math.max(0, window.scrollY / s.max)) * s.travel;

    // Glide the dock (compositor-only transform) and measure its speed in px/s
    const prev = s.x < 0 ? target : s.x;
    s.x = reduced ? target : damp(prev, target, 3.2, dt);
    s.v = dt > 0 ? (s.x - prev) / dt : 0;
    if (dock.current) dock.current.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;

    // Waddle while moving, lean and turn into the direction of travel
    const speed = Math.min(1, Math.abs(s.v) / 420);
    if (!reduced) s.phase += dt * (4 + speed * 6) * speed;
    const { root, body, head, face } = pose;
    if (root.current) root.current.rotation.y = damp(root.current.rotation.y, 0.42 + Math.sign(s.v) * speed * 0.55, 5, dt);
    if (body.current) {
      body.current.rotation.z = damp(body.current.rotation.z, reduced ? 0 : Math.sin(s.phase * 2) * 0.05 * speed - Math.sign(s.v) * speed * 0.04, 10, dt);
      body.current.position.y = reduced ? 0 : Math.abs(Math.sin(s.phase * 2)) * 0.06 * speed;
    }

    // Idle gesture: blink twice and tilt the head over ~1.4s
    if (s.gesture === -1) s.gesture = t;
    const g = t - s.gesture;
    const gesturing = g >= 0 && g < 1.4;
    if (head.current) {
      const tilt = gesturing ? Math.sin((g / 1.4) * Math.PI) * 0.16 : 0;
      head.current.rotation.z = damp(head.current.rotation.z, -0.13 + tilt, 8, dt);
      head.current.rotation.y = damp(head.current.rotation.y, 0.12 + (gesturing ? tilt * 0.8 : 0) + Math.sign(s.v) * speed * 0.2, 6, dt);
    }
    if (face.current) {
      const shut = gesturing && ((g > 0.15 && g < 0.27) || (g > 0.42 && g < 0.54));
      const map = shut ? faces.shut : faces.open;
      if (face.current.map !== map) {
        face.current.map = map;
        face.current.needsUpdate = true;
      }
    }

    // Keep drawing only while something is still settling
    const settling =
      Math.abs(target - s.x) > 0.3 ||
      speed > 0.002 ||
      gesturing ||
      Math.abs((root.current?.rotation.y ?? 0.42) - 0.42) > 0.002 ||
      Math.abs((head.current?.rotation.z ?? -0.13) + 0.13) > 0.002;
    if (settling) invalidate();
  });

  return null;
}

/* ---------- canvas ---------- */

export default function ChinkuBot({ dock }: { dock: RefObject<HTMLDivElement | null> }) {
  const pose: Pose = {
    root: useRef<THREE.Group>(null),
    body: useRef<THREE.Group>(null),
    head: useRef<THREE.Group>(null),
    face: useRef<THREE.MeshStandardMaterial>(null),
  };
  const faces = useMemo(() => ({ open: faceTexture(false), shut: faceTexture(true) }), []);
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useEffect(() => () => Object.values(faces).forEach((t) => t.dispose()), [faces]);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 2.7, 13.5], fov: 24 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => camera.lookAt(0, 2.35, 0)}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 7, 6]} intensity={2.1} />
      <directionalLight position={[5, 3, -4]} intensity={0.9} color="#ffb48a" />
      {/* Soft studio reflections, baked once */}
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 5, 5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#19b3bf" position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#ff5a1f" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} />
      </Environment>
      <Chinku pose={pose} faces={faces} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={4} blur={2.4} far={2} resolution={256} frames={1} />
      <Rig dock={dock} pose={pose} faces={faces} reduced={reduced} />
    </Canvas>
  );
}
