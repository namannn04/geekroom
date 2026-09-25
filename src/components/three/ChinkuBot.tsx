"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EYES, LEFT, MARK_COLORS, RIGHT, SLASH, STROKE_W, toPath } from "@/lib/geekmark";

/*
 * Chinku, the Geek Room robot (T-37), rebuilt from photos of the cardboard original.
 * Everything is procedural (rounded shells + canvas-painted colour and bump maps), so there is nothing to download.
 * He drives on WALL-E style tracks across a full-width strip at the bottom of the screen, so the
 * perspective really changes as he crosses it. The canvas renders on demand: it only draws while
 * something is moving, and sits idle otherwise.
 */

/* ---------- painted textures ---------- */

function canvasTexture(w: number, h: number, paint: (g: CanvasRenderingContext2D) => void, color = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}

/**
 * Paints a colour map and a matching bump map from one routine, so panel seams, vents and screws
 * are both drawn and physically recessed or raised. In bump mode mid grey is the flat surface.
 */
type Painter = (g: CanvasRenderingContext2D, bump: boolean) => void;
function paintedTexture(w: number, h: number, paint: Painter) {
  return {
    map: canvasTexture(w, h, (g) => paint(g, false)),
    bump: canvasTexture(w, h, (g) => {
      g.fillStyle = "#808080";
      g.fillRect(0, 0, w, h);
      paint(g, true);
    }, false),
  };
}

/** Fine orange-peel noise, the texture of sprayed paint rather than paper fibre. */
function grain(g: CanvasRenderingContext2D, w: number, h: number, amount: number, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < (w * h) / 10; i++) {
    const a = (rnd() - 0.5) * amount;
    g.fillStyle = a > 0 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${-a})`;
    g.fillRect(rnd() * w, rnd() * h, 1, 1);
  }
}

/** Solid paint with a soft top-to-bottom falloff, like light across a real panel. */
function fill(g: CanvasRenderingContext2D, w: number, h: number, top: string, bottom: string) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, top);
  bg.addColorStop(1, bottom);
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
}

/** A recessed panel line: a dark groove with a thin catch-light on its lower lip. */
function seamRect(g: CanvasRenderingContext2D, bump: boolean, x: number, y: number, w: number, h: number, r: number, width = 3) {
  g.lineWidth = width;
  if (!bump) {
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.beginPath();
    g.roundRect(x + 1, y + 1.5, w, h, r);
    g.stroke();
  }
  g.strokeStyle = bump ? "#000" : "rgba(0,0,0,0.55)";
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.stroke();
}

function seamLine(g: CanvasRenderingContext2D, bump: boolean, x0: number, y0: number, x1: number, y1: number, width = 3) {
  g.lineWidth = width;
  g.lineCap = "butt";
  if (!bump) {
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.beginPath();
    g.moveTo(x0, y0 + 1.5);
    g.lineTo(x1, y1 + 1.5);
    g.stroke();
  }
  g.strokeStyle = bump ? "#000" : "rgba(0,0,0,0.55)";
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.stroke();
}

/** Domed hex-socket screw head. */
function screw(g: CanvasRenderingContext2D, bump: boolean, x: number, y: number, r: number) {
  const d = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  if (bump) {
    d.addColorStop(0, "#ffffff");
    d.addColorStop(1, "#909090");
  } else {
    d.addColorStop(0, "#e4e6e8");
    d.addColorStop(0.6, "#9da1a6");
    d.addColorStop(1, "#4b4e52");
  }
  g.fillStyle = d;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = bump ? "#404040" : "#1c1d1f";
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.lineTo(x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42);
  }
  g.fill();
}

function cornerScrews(g: CanvasRenderingContext2D, bump: boolean, w: number, h: number, inset: number, r: number) {
  for (const [x, y] of [[inset, inset], [w - inset, inset], [inset, h - inset], [w - inset, h - inset]]) screw(g, bump, x, y, r);
}

/** A row of cooling slots punched through the panel. */
function vents(g: CanvasRenderingContext2D, bump: boolean, x: number, y: number, w: number, slotH: number, n: number, gap: number) {
  for (let i = 0; i < n; i++) {
    const yy = y + i * (slotH + gap);
    g.fillStyle = bump ? "#000" : "#140305";
    g.beginPath();
    g.roundRect(x, yy, w, slotH, slotH / 2);
    g.fill();
    if (!bump) {
      g.fillStyle = "rgba(255,255,255,0.14)";
      g.fillRect(x + slotH / 2, yy + slotH, w - slotH, 1.5);
    }
  }
}

/** Face plate: screen bezel and smile. The eyes are real geometry so they can look around. */
function faceTexture() {
  return paintedTexture(256, 256, (g, bump) => {
    if (!bump) {
      fill(g, 256, 256, "#d42a34", "#b01b26");
      grain(g, 256, 256, 0.03);
    }
    g.strokeStyle = bump ? "#000" : "#3a0a0e";
    g.lineWidth = 7;
    g.beginPath();
    g.roundRect(22, 22, 212, 212, 26);
    g.stroke();
    g.strokeStyle = bump ? "#000" : "#2a0709";
    g.lineCap = "round";
    g.beginPath();
    g.arc(128, 160, 24, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();
  });
}

function redPaint() {
  return paintedTexture(128, 128, (g, bump) => {
    if (bump) return;
    fill(g, 128, 128, "#cf2430", "#b81d28");
    grain(g, 128, 128, 0.03, 3);
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
  return paintedTexture(512, 512, (g, bump) => {
    if (!bump) {
      fill(g, 512, 512, "#64131c", "#480b13");
      // Racing stripes: two straight on the left, two slanted on the right
      g.fillStyle = "#a31d2c";
      g.fillRect(58, 0, 22, 512);
      g.fillRect(118, 0, 16, 512);
      g.beginPath();
      g.moveTo(398, 0); g.lineTo(424, 0); g.lineTo(346, 512); g.lineTo(320, 512);
      g.moveTo(452, 0); g.lineTo(470, 0); g.lineTo(404, 512); g.lineTo(386, 512);
      g.fill();
      drawMark(g, 256, 118, 120);
      grain(g, 512, 512, 0.03, 11);
    }
    // Two access panels split across the middle
    seamLine(g, bump, 0, 263, 512, 263, 4);
    seamRect(g, bump, 14, 14, 484, 484, 18, 3);
    cornerScrews(g, bump, 512, 512, 34, 9);
    screw(g, bump, 34, 263, 7);
    screw(g, bump, 478, 263, 7);
  });
}

function torsoSide() {
  return paintedTexture(256, 256, (g, bump) => {
    if (!bump) {
      fill(g, 256, 256, "#5a1119", "#420a11");
      grain(g, 256, 256, 0.03, 5);
    }
    seamRect(g, bump, 12, 12, 232, 232, 12, 3);
    vents(g, bump, 62, 92, 132, 10, 5, 8);
    cornerScrews(g, bump, 256, 256, 28, 7);
  });
}

function torsoTop() {
  return paintedTexture(128, 128, (g, bump) => {
    if (!bump) {
      fill(g, 128, 128, "#d9262f", "#c3202a");
      grain(g, 128, 128, 0.03, 9);
    }
    seamRect(g, bump, 8, 8, 112, 112, 8, 2);
  });
}

function baseFront() {
  return paintedTexture(384, 512, (g, bump) => {
    if (!bump) {
      fill(g, 384, 512, "#f1eee8", "#dcd8d0");
      // Red panel, deep at the top and brighter towards the floor
      const p = g.createLinearGradient(0, 70, 0, 512);
      p.addColorStop(0, "#6a0f19");
      p.addColorStop(1, "#b21f2b");
      g.fillStyle = p;
      g.beginPath();
      g.roundRect(28, 70, 328, 430, 14);
      g.fill();
      g.fillStyle = "#f7f5f1";
      g.font = "900 92px Arial, Helvetica, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("T-37", 192, 352);
      grain(g, 384, 512, 0.025, 13);
    }
    seamRect(g, bump, 28, 70, 328, 430, 14, 5);
    seamLine(g, bump, 28, 454, 356, 454, 4);
    cornerScrews(g, bump, 384, 70, 22, 8);
  });
}

function baseSide() {
  return paintedTexture(256, 256, (g, bump) => {
    if (!bump) {
      fill(g, 256, 256, "#eeebe4", "#d6d2ca");
      grain(g, 256, 256, 0.025, 17);
    }
    seamRect(g, bump, 18, 30, 220, 196, 10, 3);
    cornerScrews(g, bump, 256, 256, 30, 6);
  });
}

/**
 * Box whose top and bottom have different footprints (the torso and base both taper), with
 * rounded edges so it reads as a moulded shell instead of folded card.
 */
function taperedBox(wTop: number, wBottom: number, dTop: number, dBottom: number, h: number, radius = 0.05) {
  const g = new RoundedBoxGeometry(1, 1, 1, 4, radius);
  const p = g.attributes.position as THREE.BufferAttribute;
  const n = g.attributes.normal as THREE.BufferAttribute;
  const dw = wTop - wBottom;
  const dd = dTop - dBottom;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const t = p.getY(i) + 0.5;
    const sw = THREE.MathUtils.lerp(wBottom, wTop, t);
    const sd = THREE.MathUtils.lerp(dBottom, dTop, t);
    p.setXYZ(i, x * sw, t * h, z * sd);
    // Carry the smooth normals through the taper with the map's inverse transpose
    const nx = n.getX(i) / sw;
    const nz = n.getZ(i) / sd;
    v.set(nx, (n.getY(i) - x * dw * nx - z * dd * nz) / h, nz).normalize();
    n.setXYZ(i, v.x, v.y, v.z);
  }
  return g;
}


/** Soft round shadow that travels with Chinku (cheaper than a shadow map, and never stale). */
function blobShadow() {
  return canvasTexture(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    r.addColorStop(0, "rgba(0,0,0,0.75)");
    r.addColorStop(0.55, "rgba(0,0,0,0.35)");
    r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
  });
}

/* ---------- tracks: links ride a stadium loop, WALL-E style ---------- */

const TR = 0.27; // wheel-end radius of the loop
const TA = 0.36; // half length of the straight runs
const TY = TR + 0.03; // loop centre height, so the bottom run sits on the floor
const LOOP = 4 * TA + 2 * Math.PI * TR;
const LINKS = 34;
const TRACK_X = 0.6;

/** Position and outward angle on the loop for arc length s (runs forward along the bottom). */
function onLoop(s: number): [number, number, number] {
  s = ((s % LOOP) + LOOP) % LOOP;
  if (s < 2 * TA) return [TA - s, TY - TR, Math.PI]; // bottom, moving back
  s -= 2 * TA;
  if (s < Math.PI * TR) {
    const f = s / TR; // back wheel, bottom → top
    return [-TA - TR * Math.sin(f), TY - TR * Math.cos(f), Math.atan2(-Math.sin(f), -Math.cos(f))];
  }
  s -= Math.PI * TR;
  if (s < 2 * TA) return [-TA + s, TY + TR, 0]; // top, moving forward
  const f = (s - 2 * TA) / TR; // front wheel, top → bottom
  return [TA + TR * Math.sin(f), TY + TR * Math.cos(f), Math.atan2(Math.sin(f), Math.cos(f))];
}

const tmp = new THREE.Object3D();
function layTrack(mesh: THREE.InstancedMesh, offset: number) {
  for (let i = 0; i < LINKS; i++) {
    const [z, y, a] = onLoop((i / LINKS) * LOOP + offset);
    tmp.position.set(0, y, z);
    tmp.rotation.set(a, 0, 0);
    tmp.updateMatrix();
    mesh.setMatrixAt(i, tmp.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

/* ---------- the model ---------- */

// Heights measured off the photos, lifted onto the tracks (floor at y = 0)
const HIP = 0.62; // suspension pivot: everything above the tracks leans from here
const BASE_H = 1.32;
const PLATE_H = 0.05;
const TORSO_Y = HIP + BASE_H + PLATE_H;
const TORSO_H = 1.34;
const TORSO_TOP = TORSO_Y + TORSO_H;
const NECK_H = 0.34;
const HEAD_Y = TORSO_TOP + NECK_H + 0.42;

type Parts = {
  root: THREE.Group | null;
  upper: THREE.Group | null;
  neck: THREE.Group | null;
  head: THREE.Group | null;
  eyes: (THREE.Group | null)[];
  pupils: (THREE.Mesh | null)[];
  armL: THREE.Group | null;
  armR: THREE.Group | null;
  elbowL: THREE.Group | null;
  elbowR: THREE.Group | null;
  trackL: THREE.InstancedMesh | null;
  trackR: THREE.InstancedMesh | null;
  wheels: (THREE.Mesh | null)[];
  shadow: THREE.Mesh | null;
};

function useMaterials() {
  const mats = useMemo(() => {
    // Sprayed, clear-coated paint over a moulded shell; the bump map sinks the seams and raises the screws
    const paint = ({ map, bump }: { map: THREE.Texture; bump: THREE.Texture }, roughness = 0.42, clearcoat = 0.7) =>
      new THREE.MeshPhysicalMaterial({ map, bumpMap: bump, bumpScale: 2, roughness, metalness: 0.15, clearcoat, clearcoatRoughness: 0.22 });
    const side = paint(torsoSide());
    const white = paint(baseSide(), 0.38, 0.45);
    return {
      red: paint(redPaint()),
      headRed: paint(redPaint(), 0.38, 0.8),
      face: paint(faceTexture(), 0.34, 0.9),
      // [+x, -x, +y, -y, +z, -z]
      torso: [side, side, paint(torsoTop()), side, paint(torsoFront()), side],
      base: [white, white, white, white, paint(baseFront(), 0.4, 0.5), white],
      tube: new THREE.MeshPhysicalMaterial({ color: "#c81f2b", roughness: 0.3, metalness: 0.15, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
      steel: new THREE.MeshStandardMaterial({ color: "#a4a8ad", metalness: 0.95, roughness: 0.26 }),
      gunmetal: new THREE.MeshStandardMaterial({ color: "#3a3d41", metalness: 0.85, roughness: 0.38 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#1c1c1d", roughness: 0.8 }),
      eyeWhite: new THREE.MeshPhysicalMaterial({ color: "#f6f4ef", roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }),
      eyeFrame: new THREE.MeshStandardMaterial({ color: "#1d0507", roughness: 0.4, metalness: 0.3 }),
      pupil: new THREE.MeshPhysicalMaterial({ color: "#7d111b", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 }),
      shadow: new THREE.MeshBasicMaterial({ map: blobShadow(), transparent: true, depthWrite: false }),
    };
  }, []);
  useEffect(
    () => () =>
      Object.values(mats)
        .flat()
        .forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          (m as THREE.MeshStandardMaterial).bumpMap?.dispose();
          m.dispose();
        }),
    [mats],
  );
  return mats;
}

function Track({ x, mats, set, wheel }: { x: number; mats: ReturnType<typeof useMaterials>; set: (m: THREE.InstancedMesh | null) => void; wheel: (i: number, m: THREE.Mesh | null) => void }) {
  return (
    <group position={[x, 0, 0]}>
      <instancedMesh
        ref={(m) => {
          set(m);
          if (m) layTrack(m, 0);
        }}
        args={[undefined, undefined, LINKS]}
        material={mats.rubber}
      >
        <boxGeometry args={[0.36, 0.05, 0.1]} />
      </instancedMesh>
      {/* Drive wheels at each end and a small road wheel between them */}
      {[
        [TA, TY, TR - 0.05],
        [-TA, TY, TR - 0.05],
        [0, TY - 0.1, 0.15],
      ].map(([z, y, r], i) => (
        <mesh
          key={i}
          ref={(m) => wheel(i, m)}
          position={[0, y, z]}
          rotation={[0, 0, Math.PI / 2]}
          material={i < 2 ? mats.steel : mats.gunmetal}
        >
          <cylinderGeometry args={[r, r, 0.3, 40]} />
        </mesh>
      ))}
      {/* Hub caps with bolts read the rotation clearly */}
      {[TA, -TA].map((z) => (
        <mesh key={z} position={[x > 0 ? 0.16 : -0.16, TY, z]} rotation={[0, 0, Math.PI / 2]} material={mats.gunmetal}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 6]} />
        </mesh>
      ))}
      <mesh position={[0, TY, 0]} material={mats.gunmetal}>
        <boxGeometry args={[0.2, 0.16, 2 * TA]} />
      </mesh>
    </group>
  );
}

function Arm({ side, mats, shoulder, elbow }: { side: 1 | -1; mats: ReturnType<typeof useMaterials>; shoulder: (g: THREE.Group | null) => void; elbow: (g: THREE.Group | null) => void }) {
  return (
    <group position={[side * 0.86, TORSO_TOP - 0.2, 0.12]}>
      <mesh material={mats.steel}>
        <sphereGeometry args={[0.1, 20, 20]} />
      </mesh>
      <group ref={shoulder}>
        <mesh position={[0, -0.3, 0]} material={mats.tube}>
          <cylinderGeometry args={[0.095, 0.1, 0.52, 20]} />
        </mesh>
        <group ref={elbow} position={[0, -0.6, 0]}>
          <mesh material={mats.steel}>
            <sphereGeometry args={[0.085, 18, 18]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={mats.tube}>
            <cylinderGeometry args={[0.08, 0.09, 0.44, 18]} />
          </mesh>
          {/* Two-finger claw */}
          <group position={[0, -0.5, 0]}>
            <mesh material={mats.gunmetal}>
              <boxGeometry args={[0.2, 0.08, 0.16]} />
            </mesh>
            {[-0.06, 0.06].map((z) => (
              <mesh key={z} position={[0, -0.1, z]} rotation={[z * 3, 0, 0]} material={mats.steel}>
                <boxGeometry args={[0.16, 0.16, 0.04]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

function Chinku({ parts }: { parts: RefObject<Parts> }) {
  const mats = useMaterials();
  const geo = useMemo(
    () => ({
      torso: taperedBox(1.55, 1.12, 1.05, 0.88, TORSO_H),
      base: taperedBox(1.1, 1.24, 0.82, 0.9, BASE_H),
    }),
    [],
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);
  const p = parts.current;

  return (
    <>
      <mesh ref={(m) => void (p.shadow = m)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} scale={[2.6, 2, 1]} material={mats.shadow}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={(g) => void (p.root = g)}>
        <Track x={-TRACK_X} mats={mats} set={(m) => void (p.trackL = m)} wheel={(i, m) => void (p.wheels[i] = m)} />
        <Track x={TRACK_X} mats={mats} set={(m) => void (p.trackR = m)} wheel={(i, m) => void (p.wheels[3 + i] = m)} />
        {/* Axle housing between the tracks */}
        <mesh position={[0, TY + 0.05, 0]} material={mats.gunmetal}>
          <boxGeometry args={[0.95, 0.24, 0.62]} />
        </mesh>

        {/* Everything above the tracks rides on a suspension pivot so it can lean */}
        <group ref={(g) => void (p.upper = g)} position={[0, HIP, 0]}>
          <group position={[0, -HIP, 0]}>
            <mesh position={[0, HIP, 0]} geometry={geo.base} material={mats.base} />
            <RoundedBox args={[1.22, PLATE_H, 0.94]} radius={0.02} smoothness={2} position={[0, HIP + BASE_H + PLATE_H / 2, 0]} material={mats.gunmetal} />
            <mesh position={[0, TORSO_Y, 0]} geometry={geo.torso} material={mats.torso} />

            <Arm side={-1} mats={mats} shoulder={(g) => void (p.armL = g)} elbow={(g) => void (p.elbowL = g)} />
            <Arm side={1} mats={mats} shoulder={(g) => void (p.armR = g)} elbow={(g) => void (p.elbowR = g)} />

            {/* Neck: collar, post and a pivot the head swivels on */}
            <RoundedBox args={[0.4, 0.1, 0.32]} radius={0.03} smoothness={2} position={[0, TORSO_TOP + 0.05, 0.05]} material={mats.red} />
            <group ref={(g) => void (p.neck = g)} position={[0, TORSO_TOP + 0.1, 0.05]}>
              <mesh position={[0, NECK_H / 2, 0]} material={mats.steel}>
                <cylinderGeometry args={[0.055, 0.07, NECK_H, 16]} />
              </mesh>
              <mesh position={[0, NECK_H, 0]} material={mats.gunmetal}>
                <sphereGeometry args={[0.085, 18, 18]} />
              </mesh>

              <group ref={(g) => void (p.head = g)} position={[0, NECK_H, 0]}>
                <group position={[0, 0.42, 0]} rotation={[0, 0, -0.1]}>
                  <RoundedBox args={[0.98, 0.84, 0.8]} radius={0.07} smoothness={4} material={mats.headRed} />
                  <mesh position={[0, 0, 0.401]} material={mats.face}>
                    <planeGeometry args={[0.84, 0.7]} />
                  </mesh>
                  {/* 3D eyes: framed white blocks with pupils that track what Chinku looks at */}
                  {[-0.2, 0.2].map((x, i) => (
                    <group key={x} ref={(g) => void (p.eyes[i] = g)} position={[x, 0.08, 0.41]}>
                      <mesh material={mats.eyeFrame}>
                        <boxGeometry args={[0.22, 0.22, 0.03]} />
                      </mesh>
                      <RoundedBox args={[0.18, 0.18, 0.03]} radius={0.012} smoothness={2} position={[0, 0, 0.018]} material={mats.eyeWhite} />
                      <mesh ref={(m) => void (p.pupils[i] = m)} position={[0, 0, 0.038]} material={mats.pupil}>
                        <boxGeometry args={[0.08, 0.08, 0.015]} />
                      </mesh>
                    </group>
                  ))}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

/* ---------- behaviour ---------- */

const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;
const STRIP_UNITS = 5.45; // world units visible top to bottom of the strip

type Idle = "look" | "wave";

function Rig({ parts, reduced }: { parts: RefObject<Parts>; reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const s = useRef({
    x: NaN,
    v: 0,
    speed: 0,
    max: 1,
    dist: 0,
    yaw: 0.25,
    lookX: 0,
    lookY: 0,
    pointer: { x: 0, y: 0, t: -10 },
    idle: { kind: "look" as Idle, t: -10, x: 0, y: 0 },
    blinkT: -10,
    count: 0,
  });

  useEffect(() => {
    const st = s.current;
    const measure = () => {
      st.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      invalidate();
    };
    const onScroll = () => invalidate();
    const onPointer = (e: PointerEvent) => {
      st.pointer = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 };
      invalidate();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    // While parked, Chinku glances around every few seconds, blinks, and now and then waves
    const idle = reduced
      ? 0
      : window.setInterval(() => {
          if (document.hidden || st.speed > 0.05) return;
          st.count += 1;
          st.idle = {
            kind: st.count % 4 === 0 ? "wave" : "look",
            t: -1,
            x: (Math.random() * 2 - 1) * 0.9,
            y: Math.random() * 0.7 - 0.2,
          };
          if (Math.random() < 0.7) st.blinkT = -1;
          invalidate();
        }, 4000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.clearInterval(idle);
    };
  }, [invalidate, reduced]);

  useFrame((state, delta) => {
    const st = s.current;
    const p = parts.current;
    const dt = Math.min(delta, 0.1); // cap only big stalls (tab switches), so damping keeps real time
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    if (st.idle.t === -1) st.idle.t = t;
    if (st.blinkT === -1) st.blinkT = t;
    let busy = 0; // largest amount anything still has to move; drives the demand loop
    const to = (cur: number, target: number, lambda: number) => {
      const next = damp(cur, target, lambda, dt);
      busy = Math.max(busy, Math.abs(target - next));
      return next;
    };

    // Scroll progress → a spot on the floor between the strip's edges, in world units
    const halfW = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]).width / 2;
    const margin = 1.6;
    const progress = clamp(window.scrollY / st.max, 0, 1);
    const target = -halfW + margin + progress * (2 * halfW - 2 * margin);
    if (Number.isNaN(st.x)) st.x = target;
    const prevX = st.x;
    st.x = reduced ? target : to(st.x, target, 2.4);
    const v = (st.x - prevX) / Math.max(dt, 1e-4);
    const accel = (Math.abs(v) - Math.abs(st.v)) / Math.max(dt, 1e-4);
    st.v = v;
    st.speed = to(st.speed, Math.min(1, Math.abs(v) / 5), 6);
    const dir = Math.sign(v) || 0;
    const moving = st.speed > 0.04;

    // Where to look: ahead while driving, the cursor if it moved lately, otherwise idle glances
    const robotPx = ((st.x / halfW + 1) / 2) * window.innerWidth;
    const headPx = window.innerHeight - (state.size.height * (HEAD_Y + 0.2)) / STRIP_UNITS;
    let lx = st.idle.x;
    let ly = st.idle.y;
    if (now - st.pointer.t < 2.5) {
      lx = clamp((st.pointer.x - robotPx) / (window.innerWidth * 0.35), -1, 1);
      ly = clamp((headPx - st.pointer.y) / (window.innerHeight * 0.5), -0.6, 1);
    }
    if (moving) {
      lx = dir * 0.75 + lx * 0.25;
      ly = ly * 0.3;
    }
    st.lookX = to(st.lookX, lx, 5);
    st.lookY = to(st.lookY, ly, 5);

    // Body: turn to face the direction of travel, square back up to the viewer when parked
    const faceYaw = moving ? dir * 1.2 * Math.min(1, st.speed * 4) : 0.18 + st.lookX * 0.25;
    const prevYaw = st.yaw;
    st.yaw = reduced ? faceYaw : to(st.yaw, faceYaw, moving ? 7 : 3);
    const turn = st.yaw - prevYaw;

    // Tracks: links and wheels roll with distance; turning in place counter-rotates them
    const roll = Math.abs(st.x - prevX);
    st.dist += roll;
    if (p.trackL) layTrack(p.trackL, st.dist + turn * TRACK_X);
    if (p.trackR) layTrack(p.trackR, st.dist - turn * TRACK_X);
    p.wheels.forEach((w, i) => {
      if (!w) return;
      const r = i % 3 === 2 ? 0.15 : TR - 0.05;
      w.rotation.x = (st.dist + (i < 3 ? 1 : -1) * turn * TRACK_X) / r;
    });

    if (p.root) {
      p.root.position.x = st.x;
      p.root.rotation.y = st.yaw;
    }
    if (p.shadow) p.shadow.position.x = st.x;

    // Suspension: lean back on acceleration and forward on braking, plus a little track rumble
    if (p.upper) {
      const lean = reduced ? 0 : clamp(-accel * 0.012, -0.13, 0.13);
      p.upper.rotation.x = to(p.upper.rotation.x, lean, 6);
      p.upper.position.y = HIP + (reduced ? 0 : Math.sin(st.dist * 16) * 0.012 * st.speed);
      p.upper.rotation.z = reduced ? 0 : Math.sin(st.dist * 9) * 0.012 * st.speed;
    }

    // Head swivels on the neck towards the look target (in world terms, minus the body's yaw)
    if (p.neck) p.neck.rotation.y = to(p.neck.rotation.y, clamp(st.lookX * 0.95 - st.yaw * 0.85, -1.1, 1.1), 7);
    if (p.head) {
      p.head.rotation.x = to(p.head.rotation.x, -st.lookY * 0.32 + (reduced ? 0 : clamp(accel * 0.006, -0.1, 0.1)), 6);
      p.head.rotation.z = to(p.head.rotation.z, -st.lookX * 0.08, 5);
    }
    // Pupils finish the glance the neck can't
    p.pupils.forEach((m) => {
      if (!m) return;
      m.position.x = to(m.position.x, clamp(st.lookX * 0.05, -0.05, 0.05), 12);
      m.position.y = to(m.position.y, clamp(st.lookY * 0.05, -0.05, 0.05), 12);
    });
    const b = t - st.blinkT;
    const lid = b >= 0 && b < 0.16 ? 0.1 : 1;
    p.eyes.forEach((e) => e && (e.scale.y = lid));
    if (b >= 0 && b < 0.2) busy = Math.max(busy, 1);

    // Arms: swing against each other while driving; the right one waves on some idles
    const g = t - st.idle.t;
    const waving = !moving && st.idle.kind === "wave" && g >= 0 && g < 2.2;
    const swing = reduced ? 0 : Math.sin(st.dist * 3.2) * 0.35 * st.speed;
    if (p.armL) {
      p.armL.rotation.x = to(p.armL.rotation.x, swing - st.speed * 0.2, 8);
      p.armL.rotation.z = to(p.armL.rotation.z, -0.08, 6);
    }
    if (p.armR) {
      p.armR.rotation.x = to(p.armR.rotation.x, waving ? -0.2 : -swing - st.speed * 0.2, 8);
      p.armR.rotation.z = to(p.armR.rotation.z, waving ? 2.5 : 0.08, 6);
    }
    if (p.elbowL) p.elbowL.rotation.x = to(p.elbowL.rotation.x, -0.35 - st.speed * 0.4, 8);
    if (p.elbowR) p.elbowR.rotation.z = to(p.elbowR.rotation.z, waving ? Math.sin(g * 11) * 0.45 : 0, 12);
    if (p.elbowR) p.elbowR.rotation.x = to(p.elbowR.rotation.x, waving ? 0 : -0.35 - st.speed * 0.4, 8);
    if (waving) busy = Math.max(busy, 1);

    if (busy > 0.004 || Math.abs(target - st.x) > 0.004) invalidate();
  });

  return null;
}

/* ---------- canvas ---------- */

export default function ChinkuBot() {
  const parts = useRef<Parts>({
    root: null,
    upper: null,
    neck: null,
    head: null,
    eyes: [],
    pupils: [],
    armL: null,
    armR: null,
    elbowL: null,
    elbowR: null,
    trackL: null,
    trackR: null,
    wheels: [],
    shadow: null,
  });
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      // A long lens: perspective still shifts as Chinku crosses the screen, without edge distortion
      camera={{ position: [0, 3.1, 40], fov: 2 * THREE.MathUtils.radToDeg(Math.atan(STRIP_UNITS / 2 / 40)) }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => camera.lookAt(0, STRIP_UNITS / 2 - 0.18, 0)}
    >
      {/* Warm sky, dark floor bounce: gives the shell a top-to-bottom falloff instead of flat fill */}
      <hemisphereLight args={["#fff4ea", "#1a1210", 0.55]} />
      <directionalLight position={[-6, 9, 8]} intensity={2.2} />
      <directionalLight position={[7, 4, -5]} intensity={0.9} color="#ffe2d0" />
      {/* Studio reflections for the clear coat and metal parts, baked once */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-5, 3, 6]} rotation-y={Math.PI / 5} scale={[1.2, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 3, 6]} rotation-y={-Math.PI / 5} scale={[1.2, 6, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#19b3bf" position={[8, 1, 2]} rotation-y={-Math.PI / 2} scale={[5, 4, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ff5a1f" position={[-8, 0, 2]} rotation-y={Math.PI / 2} scale={[5, 4, 1]} />
      </Environment>
      <Chinku parts={parts} />
      <Rig parts={parts} reduced={reduced} />
    </Canvas>
  );
}
