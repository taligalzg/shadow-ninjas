import React from 'react';
import {Bubble, C, Check, Desk, Figure, Head, HeadProps, Limb, Paper, Plant, blink, clamp, ease, lerp, prog, shade} from './art';

export const W = 1080;
export const H = 960;

// ---------- stage: hand-drawn wobble + paper grain ----------
export const Stage: React.FC<{f: number; z?: number; fx?: number; fy?: number; children: React.ReactNode; id?: string}> = ({f, z = 1, fx = W / 2, fy = H / 2, children, id = 'st'}) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{display: 'block', position: 'absolute', inset: 0}}>
    <defs>
      <filter id={`${id}w`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={(Math.floor(f / 5) % 3) + 2} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id={`${id}g`} filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={3} seed={7} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 1.5 -0.55" />
      </filter>
      <linearGradient id={`${id}l`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF2D0" stopOpacity="0.55" />
        <stop offset="0.55" stopColor="#FFF2D0" stopOpacity="0" />
        <stop offset="1" stopColor="#2B2233" stopOpacity="0.45" />
      </linearGradient>
      <filter id="ps" x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow dx={0} dy={5} stdDeviation={3.5} floodColor="#2A1E14" floodOpacity={0.34} />
      </filter>
      <radialGradient id={`${id}v`} cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.6" stopColor="#3A2A1E" stopOpacity="0" />
        <stop offset="1" stopColor="#3A2A1E" stopOpacity="0.28" />
      </radialGradient>
    </defs>
    <g filter={`url(#${id}w)`}>
      <rect width={W} height={H} fill="#D8CDBB" />
      <g transform={`translate(${W / 2},${H / 2}) scale(${z}) translate(${-fx},${-fy})`}>{children}</g>
    </g>
    <rect width={W} height={H} fill={`url(#${id}l)`} style={{mixBlendMode: 'soft-light'}} />
    <rect width={W} height={H} fill={`url(#${id}v)`} />
    <rect width={W} height={H} filter={`url(#${id}g)`} opacity={0.42} style={{mixBlendMode: 'multiply'}} />
  </svg>
);

const Planks: React.FC<{y: number; color: string}> = ({y, color}) => (
  <g>
    <rect x={-600} y={y} width={W + 1200} height={H - y + 600} fill={color} />
    {[0.12, 0.3, 0.52, 0.78].map((t, i) => (
      <rect key={i} x={-600} y={y + (H - y) * t} width={W + 1200} height={3} fill={shade(color, -0.07)} />
    ))}
    {[80, 300, 470, 690, 860, 1010].map((x, i) => (
      <rect key={i} x={x} y={y + (H - y) * [0, 0.12, 0.3, 0.52, 0.12, 0.3][i]} width={3} height={(H - y) * 0.18} fill={shade(color, -0.07)} />
    ))}
    <rect x={-600} y={y - 16} width={W + 1200} height={18} fill={shade(color, -0.18)} />
  </g>
);

// ---------- classroom (old) ----------
const ClassroomBG: React.FC<{warm?: number}> = ({warm = 0}) => (
  <g>
    <rect x={-600} y={-400} width={W + 1200} height={1010} fill="#D9CEBC" />
    <rect x={-600} y={470} width={W + 1200} height={140} fill="#C9BBA4" />
    <Planks y={610} color="#B49269" />
    {/* board */}
    <rect x={70} y={100} width={520} height={300} rx={10} fill="#7B5A3B" />
    <rect x={86} y={116} width={488} height={268} fill="#48695B" />
    <g stroke="#DDE6DC" strokeWidth={5} strokeLinecap="round" opacity={0.75} fill="none">
      <path d="M 120,160 h 180 M 120,196 h 250 M 120,232 h 140" />
      <path d="M 410,180 l 40,60 l 40,-60 M 400,300 h 130 M 120,310 q 30,-30 60,0 t 60,0" />
    </g>
    <rect x={86} y={384} width={488} height={14} fill="#8E6A47" />
    <rect x={430} y={376} width={40} height={10} rx={3} fill="#F4F0E6" />
    {/* window */}
    <rect x={720} y={96} width={290} height={340} rx={8} fill="#F1E9DA" />
    <rect x={738} y={114} width={254} height={304} fill={warm > 0.5 ? '#F6DDA6' : '#BFD2D8'} />
    <circle cx={930} cy={190} r={warm > 0.5 ? 46 : 0} fill="#FFF1C9" />
    <path d="M 738,340 q 60,-50 130,-10 t 124,-10 v 98 h -254 z" fill={warm > 0.5 ? '#A9BF8A' : '#9DB2A2'} />
    <rect x={858} y={114} width={12} height={304} fill="#F1E9DA" />
    <rect x={738} y={258} width={254} height={12} fill="#F1E9DA" />
    {/* clock */}
    <circle cx={655} cy={150} r={36} fill="#F4EEE2" stroke="#6C5846" strokeWidth={6} />
    <path d="M 655,150 v -22 M 655,150 l 16,8" stroke="#4A3C30" strokeWidth={5} strokeLinecap="round" />
    <polygon filter="url(#ps)" points="738,610 992,610 1180,960 620,960" fill="#FFF3CF" opacity={0.1 + warm * 0.25} />
  </g>
);

const teacherHead: HeadProps = {kind: 'adult', skin: '#E8BB98', hair: '#8B7361', style: 'bob', glasses: true};
const KID_A: HeadProps = {skin: '#C68E69', hair: '#2E211C', style: 'pigtails'};
const KID_B: HeadProps = {skin: '#F1CBA8', hair: '#C98A3E', style: 'short'};
const BOY: HeadProps = {kind: 'child', skin: C.skinBoy, hair: C.hairBoy, style: 'boy', freckles: true};
const MAN: HeadProps = {kind: 'adult', skin: C.skinBoy, hair: C.hairBoy, style: 'boy', freckles: true};
const MOM: HeadProps = {kind: 'adult', skin: C.skinMom, hair: C.hairMom, style: 'bun', earrings: true};

export const SceneClassroom: React.FC<{f: number; warm?: number; calm?: number}> = ({f, warm = 0, calm = 0}) => {
  const k = 1 - calm * 0.6;
  const z = 1.04 + f * 0.0006;
  const turn = Math.sin(f / 21) * 0.6 * k;
  return (
    <Stage f={f} z={z} fx={540} fy={500}>
      <ClassroomBG warm={warm} />
      {/* teacher */}
      <Figure
        x={300}
        y={335}
        s={0.56}
        kind="adult"
        top="#C39A45"
        head={{...teacherHead, turn: 0.4, gx: 0.7, gy: 0.35, brow: -0.35, mouth: -0.35, open: blink(f, 20)}}
        headTilt={4}
        armL={{e: [-160, 150], h: [-100, 262]}}
        armR={{e: [170, 96 + Math.sin(f / 16) * 4], h: [74, -52]}}
        legs={{l: [-40, 520], r: [40, 520], color: '#4B4640', shoe: '#3A332E'}}
      />
      {/* quiet classmates */}
      {[
        {x: 180, hd: KID_A, top: '#B9695A', o: 0},
        {x: 905, hd: KID_B, top: '#7E9F88', o: 30},
      ].map((kd, i) => (
        <g key={i}>
          <Figure
            x={kd.x}
            y={560}
            s={0.5}
            top={kd.top}
            head={{...kd.hd, open: 0.58 * blink(f, kd.o), gy: 1, mouth: 0.1}}
            headDy={16}
            headTilt={i ? -3 : 3}
            armL={{e: [-96, 120], h: [-40, 172]}}
            armR={{e: [96, 120], h: [36 + Math.sin(f / 3 + i) * 5, 170]}}
            legs={{l: [-34, 400], r: [34, 400]}}
          />
          <Desk x={kd.x} y={644} w={230} h={24} legH={110} />
        </g>
      ))}
      {/* the boy */}
      <Figure
        x={560}
        y={648 - Math.abs(Math.sin(f / 5)) * 4 * k}
        s={0.8}
        stripes
        sleeve="short"
        lean={Math.sin(f / 7) * 4 * k}
        head={{...BOY, turn, gx: turn * 1.3, gy: 0.1, brow: 0.55, mouth: -0.25, open: blink(f, 5, 60)}}
        headTilt={Math.sin(f / 9) * 5 * k}
        armL={{e: [-118, 118], h: [-58, 174]}}
        armR={{e: [118, 112], h: [60 + Math.sin(f / 2.6) * 9 * k, 170 - Math.abs(Math.sin(f / 2.6)) * 16 * k]}}
        legs={{l: [-38 + Math.sin(f / 3.4) * 34 * k, 360], r: [38 + Math.sin(f / 3.4 + 2.2) * 34 * k, 360]}}
      />
      <Desk x={560} y={792} w={330} h={30} legH={150} />
    </Stage>
  );
};

// ---------- scene 2: close on the boy ----------
export const SceneStruggle: React.FC<{f: number}> = ({f}) => {
  const down = prog(f, 104, 146);
  const flinch = [22, 57, 92].reduce((a, t) => a + (f >= t && f < t + 10 ? Math.sin(((f - t) / 10) * Math.PI) : 0), 0);
  const roll = prog(f, 26, 42);
  const fall = clamp((f - 42) / 20);
  const px = lerp(720, 962, roll) + fall * 40;
  const py = 728 + fall * fall * 300;
  const look = prog(f, 30, 44) * (1 - prog(f, 64, 76));
  const dart = Math.sin(f / 8) * 0.8 * (1 - down);
  const fig = {
    x: 540,
    y: 470 + flinch * 5 + down * 10,
    s: 1.55,
    stripes: true,
    sleeve: 'short' as const,
    lean: Math.sin(f / 6) * 2.4 * (1 - down),
    head: {
      ...BOY,
      gx: lerp(dart, 1, look),
      gy: lerp(0.15, 1, Math.max(down, look * 0.6)),
      brow: 0.6 + 0.35 * prog(f, 20, 100),
      mouth: -0.3 - 0.45 * prog(f, 20, 110),
      open: Math.min(blink(f, 12, 54), 1 - down * 0.62),
      turn: lerp(dart * 0.25, 0.35, look) * (1 - down),
    },
    headDy: down * 40 + flinch * 6,
    headTilt: down * 5 + Math.sin(f / 10) * 2 * (1 - down),
    armL: {e: [-124, 120] as [number, number], h: [-60 + Math.sin(f / 4) * 6 * (1 - down), 170] as [number, number]},
    armR: {e: [124, 120] as [number, number], h: [70 + (1 - roll) * Math.sin(f / 2.2) * 8, 170 - (1 - roll) * Math.abs(Math.sin(f / 2.2)) * 10] as [number, number]},
    legs: {
      l: [-40 + Math.sin(f / 3.2) * 36 * (1 - down * 0.8), 300] as [number, number],
      r: [40 + Math.sin(f / 3.2 + 2.1) * 36 * (1 - down * 0.8), 300] as [number, number],
    },
  };
  return (
    <Stage f={f} z={1.02 + f * 0.0007} fx={540} fy={470}>
      <g transform="translate(-380,-330) scale(1.75)">
        <ClassroomBG />
      </g>
      <rect x={-200} y={-200} width={1500} height={1400} fill="#D9CEBC" opacity={0.3} />
      <FigNoArms {...fig} />
      {/* desk with visible top */}
      <rect x={176} y={800} width={18} height={220} fill="#8F6238" />
      <rect x={886} y={800} width={18} height={220} fill="#8F6238" />
      <polygon filter="url(#ps)" points="190,702 890,702 950,764 130,764" fill="#D6A066" />
      <rect x={130} y={764} width={820} height={40} rx={6} fill="#B67F47" />
      <polygon filter="url(#ps)" points="430,712 640,712 660,754 420,754" fill="#FBF8F1" />
      <g fill="#B9B3A6">
        <polygon filter="url(#ps)" points="452,722 560,722 562,727 451,727" />
        <polygon filter="url(#ps)" points="449,734 610,734 612,739 448,739" />
      </g>
      {/* pencil */}
      <g transform={`translate(${px},${py}) rotate(${-12 + roll * 30 + fall * 210})`}>
        <rect x={-46} y={-6} width={78} height={12} rx={2} fill="#EBB93A" />
        <polygon filter="url(#ps)" points="32,-6 50,0 32,6" fill="#EBD3A8" />
        <rect x={-56} y={-6} width={12} height={12} rx={3} fill="#D98B86" />
      </g>
      <FigArms {...fig} />
    </Stage>
  );
};

// helpers to split a figure around furniture
const HIDE: [number, number] = [0, 0];
const FigNoArms: React.FC<any> = (p) => (
  <g>
    <Figure {...p} noArms />
  </g>
);
const FigArms: React.FC<any> = (p) => {
  // draw only the arms: re-render the figure clipped out by drawing arms via a transparent body
  const child = (p.kind ?? 'child') === 'child';
  const w = child ? 172 : 232;
  const aw = child ? 42 : 52;
  const skin = p.head?.skin ?? C.skinBoy;
  const h = p.torsoH ?? (child ? 190 : 290);
  const aL = p.armL ?? {e: [-(w / 2 + 6), h * 0.5], h: [-(w / 2 - 6), h * 0.92]};
  const aR = p.armR ?? {e: [w / 2 + 6, h * 0.5], h: [w / 2 - 6, h * 0.92]};
  const id = React.useId().replace(/:/g, '');
  const fill = p.stripes ? `url(#${id}s)` : p.top ?? C.blue;
  const arm = (a: any, side: number) => {
    const s0: [number, number] = [side * (w / 2 - 20), 28];
    if (p.sleeve === 'short') {
      const mid: [number, number] = [lerp(s0[0], a.e[0], 0.62), lerp(s0[1], a.e[1], 0.62)];
      return (
        <g filter="url(#ps)">
          <Limb pts={[mid, a.e, a.h]} w={aw - 8} color={skin} />
          <circle cx={a.h[0]} cy={a.h[1]} r={aw * 0.5} fill={skin} />
          <Limb pts={[s0, mid]} w={aw} color={fill} />
        </g>
      );
    }
    return (
      <g filter="url(#ps)">
        <Limb pts={[s0, a.e, a.h]} w={aw} color={fill} />
        <circle cx={a.h[0]} cy={a.h[1]} r={aw * 0.5} fill={skin} />
      </g>
    );
  };
  return (
    <g transform={`translate(${p.x},${p.y}) scale(${p.s ?? 1}) rotate(${p.lean ?? 0})`}>
      <defs>
        <pattern id={`${id}s`} patternUnits="userSpaceOnUse" width={40} height={child ? 34 : 38}>
          <rect width={40} height={child ? 34 : 38} fill={C.blue} />
          <rect width={40} height={child ? 11 : 12} y={6} fill={C.stripe} />
        </pattern>
      </defs>
      {arm(aL, -1)}
      {arm(aR, 1)}
    </g>
  );
};
void HIDE;

// ---------- home ----------
const HomeBG: React.FC<{lamp?: number}> = ({lamp = 0}) => (
  <g>
    <defs>
      <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8E88A8" />
        <stop offset="1" stopColor="#E9A97E" />
      </linearGradient>
      <radialGradient id="lampglow">
        <stop offset="0" stopColor="#FFE2A0" stopOpacity="0.85" />
        <stop offset="1" stopColor="#FFE2A0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-600} y={-400} width={W + 1200} height={1050} fill="#CFBEAB" />
    <Planks y={650} color="#9F7E5F" />
    <ellipse cx={640} cy={850} rx={420} ry={90} fill="#B9695A" opacity={0.55} />
    <ellipse cx={640} cy={850} rx={340} ry={66} fill="#D9A58C" opacity={0.5} />
    {/* door */}
    <rect x={60} y={140} width={250} height={510} rx={6} fill="#8C6A4C" />
    <rect x={76} y={156} width={218} height={494} fill="#B48B63" />
    <rect x={98} y={186} width={174} height={190} rx={6} fill="#A77E58" />
    <rect x={98} y={410} width={174} height={200} rx={6} fill="#A77E58" />
    <circle cx={270} cy={420} r={11} fill="#E3C16F" />
    {/* window */}
    <rect x={630} y={110} width={300} height={330} rx={8} fill="#F1E9DA" />
    <rect x={648} y={128} width={264} height={294} fill="url(#dusk)" />
    <path d="M 648,360 q 50,-40 110,-14 t 154,-20 v 96 h -264 z" fill="#6E6A82" opacity={0.7} />
    <rect x={774} y={128} width={12} height={294} fill="#F1E9DA" />
    <rect x={648} y={266} width={264} height={12} fill="#F1E9DA" />
    <path d="M 610,100 h 70 q 10,170 -30,350 h -40 z" fill="#B9695A" opacity={0.85} />
    <path d="M 950,100 h -70 q -10,170 30,350 h 40 z" fill="#B9695A" opacity={0.85} />
    <rect x={596} y={92} width={368} height={14} rx={7} fill="#7B5A3B" />
    {/* picture */}
    <rect x={390} y={170} width={150} height={120} rx={4} fill="#F1E9DA" />
    <rect x={404} y={184} width={122} height={92} fill="#A9BF8A" />
    <circle cx={500} cy={212} r={14} fill="#F6DDA6" />
    <path d="M 404,276 l 40,-50 l 30,30 l 22,-18 l 30,38 z" fill="#6E8C6A" />
    {/* lamp */}
    <rect x={1000} y={520} width={10} height={130} fill="#6C5846" />
    <path d="M 960,420 h 90 l 22,104 h -134 z" fill={lamp > 0.5 ? '#FBE3AE' : '#D9C6A6'} />
    <circle cx={1005} cy={500} r={420} fill="url(#lampglow)" opacity={lamp * 0.8} />
    <rect x={-600} y={-400} width={W + 1200} height={1800} fill="#FFD9A0" opacity={lamp * 0.14} />
  </g>
);

const Backpack: React.FC<{x: number; y: number; rot: number}> = ({x, y, rot}) => (
  <g filter="url(#ps)" transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d="M -30,-74 q 30,-34 60,0" stroke={shade(C.orange, -0.18)} strokeWidth={11} fill="none" strokeLinecap="round" />
    <rect x={-56} y={-74} width={112} height={140} rx={34} fill={C.orange} />
    <rect x={-38} y={-10} width={76} height={56} rx={14} fill={shade(C.orange, -0.1)} />
    <rect x={-12} y={-4} width={24} height={8} rx={4} fill="#F3D9A6" />
  </g>
);

const SitBoy: React.FC<{x: number; y: number; s: number; f: number; up: number; turn?: number; mouth?: number; brow?: number}> = ({x, y, s, f, up, turn = 0, mouth = -0.6, brow = 0.85}) => (
  <Figure
    x={x}
    y={y + Math.sin(f / 16) * 1.5}
    s={s}
    stripes
    sleeve="short"
    torsoH={170}
    head={{...BOY, turn, gx: turn * 1.2, gy: lerp(1, 0.1, up), open: Math.min(blink(f, 9), lerp(0.5, 1, up)), mouth, brow}}
    headDy={lerp(52, 4, up)}
    headTilt={lerp(7, turn * -6, up)}
    armL={{e: [-116, 104], h: [-20, 150]}}
    armR={{e: [116, 104], h: [24, 156]}}
    under={
      <g>
        <Limb pts={[[-46, 166], [-54, 78]]} w={56} color={shade(C.jeans, -0.06)} />
        <Limb pts={[[46, 166], [54, 78]]} w={56} color={shade(C.jeans, -0.06)} />
        <Limb pts={[[-54, 78], [-64, 236]]} w={52} color={C.jeans} />
        <Limb pts={[[54, 78], [64, 236]]} w={52} color={C.jeans} />
        <ellipse cx={-72} cy={254} rx={40} ry={22} fill="#E8E2D6" />
        <ellipse cx={72} cy={254} rx={40} ry={22} fill="#E8E2D6" />
      </g>
    }
  />
);

export const SceneHome: React.FC<{f: number}> = ({f}) => {
  const drop = clamp((f - 12) / 12);
  const bounce = f > 24 && f < 34 ? Math.sin(((f - 24) / 10) * Math.PI) * 10 : 0;
  const sit = prog(f, 32, 48);
  return (
    <Stage f={f} z={1.0 + f * 0.0012} fx={lerp(540, 640, prog(f, 30, 120))} fy={500}>
      <HomeBG />
      <g opacity={1 - sit}>
        <Figure
          x={400}
          y={410}
          s={0.72}
          stripes
          sleeve="short"
          lean={2}
          head={{...BOY, gy: 1, open: 0.5, mouth: -0.55, brow: 0.8}}
          headDy={18}
          headTilt={5}
          armR={{e: [108, 96], h: [104, 190]}}
          legs={{l: [-36, 400], r: [36, 400]}}
        />
      </g>
      <Backpack x={lerp(490, 470, drop)} y={lerp(590, 742, drop * drop) - bounce} rot={lerp(4, 78, drop)} />
      <g opacity={sit}>
        <SitBoy x={770} y={610} s={0.86} f={f} up={0} />
      </g>
    </Stage>
  );
};

// ---------- scene 6a: mother sits beside him ----------
export const SceneBeside: React.FC<{f: number}> = ({f}) => {
  const up = prog(f, 16, 46);
  const mom = {
    x: 545,
    y: 545 + Math.sin(f / 18) * 1.5,
    s: 0.8,
    kind: 'adult' as const,
    top: C.green,
    sleeve: 'short' as const,
    head: {...MOM, turn: 0.6, gx: 0.6, gy: 0.3, brow: 0.3, mouth: 0.12 + 0.2 * up, open: blink(f, 30)},
    headTilt: 6 + Math.max(0, Math.sin(f / 9)) * 3,
    headDy: Math.max(0, Math.sin(f / 9)) * 5,
    armL: {e: [-150, 140] as [number, number], h: [-76, 236] as [number, number]},
    armR: {e: [170, 64] as [number, number], h: [236, 112] as [number, number]},
  };
  return (
    <Stage f={f} z={1.12 + f * 0.0012} fx={660} fy={560}>
      <HomeBG lamp={prog(f, 0, 30)} />
      <Backpack x={270} y={742} rot={78} />
      {/* dress on the floor */}
      <path d="M 450,690 Q 360,720 290,800 Q 260,860 330,876 L 600,880 Q 660,860 640,760 Z" fill={C.green} />
      <path d="M 470,760 Q 400,800 380,870" stroke={C.greenDark} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
      <ellipse cx={300} cy={866} rx={36} ry={18} fill={C.skinMom} />
      <FigNoArms {...mom} />
      <SitBoy x={790} y={612} s={0.86} f={f} up={up} turn={-0.6 * up} mouth={lerp(-0.6, -0.05, up)} brow={lerp(0.85, 0.35, up)} />
      <FigArms {...mom} />
    </Stage>
  );
};

// ---------- scene 6b: meeting with the teachers ----------
export const SceneAdvocate: React.FC<{f: number}> = ({f}) => {
  const nod = Math.max(0, Math.sin(f / 7)) * 7;
  const mom = {
    x: 262,
    y: 440,
    s: 0.9,
    kind: 'adult' as const,
    top: C.green,
    sleeve: 'short' as const,
    lean: 3,
    head: {...MOM, turn: 0.55, gx: 0.6, brow: 0.1, mouth: 0.15, mouthOpen: 0.25 + 0.25 * Math.sin(f / 2.3), open: blink(f, 11)},
    headTilt: Math.sin(f / 11) * 3,
    armL: {e: [-150, 150] as [number, number], h: [-40, 200] as [number, number]},
    armR: {e: [160, 190] as [number, number], h: [212 + Math.sin(f / 7) * 14, 112 + Math.cos(f / 7) * 12] as [number, number]},
  };
  const teacher = {
    x: 826,
    y: 440,
    s: 0.9,
    kind: 'adult' as const,
    top: '#C39A45',
    lean: -3,
    head: {...teacherHead, turn: -0.5, gx: -0.6, brow: 0.2, mouth: 0.25, open: blink(f, 40)},
    headDy: nod,
    armL: {e: [-150, 160] as [number, number], h: [-116 + Math.sin(f / 2) * 5, 204] as [number, number]},
    armR: {e: [150, 160] as [number, number], h: [40, 200] as [number, number]},
  };
  const coun = {
    x: 545,
    y: 420,
    s: 0.74,
    kind: 'adult' as const,
    top: '#5F7F9C',
    head: {kind: 'adult' as const, skin: '#9B6C4D', hair: '#2B1E1A', style: 'flat' as const, turn: -0.35, gx: -0.6, brow: 0.15, mouth: 0.3, open: blink(f, 60)},
    headDy: Math.max(0, Math.sin(f / 7 + 2)) * 5,
    armL: {e: [-130, 170] as [number, number], h: [-40, 262] as [number, number]},
    armR: {e: [130, 170] as [number, number], h: [30, 262] as [number, number]},
  };
  return (
    <Stage f={f} z={1.03 + f * 0.001} fx={540} fy={470}>
      <rect x={-600} y={-400} width={W + 1200} height={1100} fill="#E3D5BC" />
      <Planks y={700} color="#B49269" />
      {/* bulletin board with children's drawings */}
      <rect x={300} y={70} width={480} height={240} rx={8} fill="#8E6A47" />
      <rect x={314} y={84} width={452} height={212} fill="#C9A475" />
      {[
        ['#F6E7C8', 340, 104, -4],
        ['#CFE0D2', 450, 112, 3],
        ['#F3D2C2', 560, 100, -2],
        ['#DCE4F0', 664, 114, 5],
        ['#F6E7C8', 400, 204, 4],
        ['#F3D2C2', 520, 206, -3],
        ['#CFE0D2', 640, 210, 2],
      ].map(([c, x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <rect width={84} height={70} fill={c as string} />
          <circle cx={26 + (i % 3) * 14} cy={30} r={12} fill={['#EB6234', '#4F8A5B', '#3F6CAE'][i % 3]} opacity={0.75} />
          <rect x={14} y={52} width={56} height={5} rx={2} fill="#8A8377" opacity={0.6} />
        </g>
      ))}
      <Plant x={960} y={640} s={0.9} />
      <FigNoArms {...coun} />
      <FigNoArms {...mom} />
      <FigNoArms {...teacher} />
      {/* table */}
      <polygon filter="url(#ps)" points="90,610 990,610 1100,700 -20,700" fill="#C99158" />
      <rect x={-20} y={700} width={1120} height={42} fill="#A9753F" />
      <rect x={60} y={742} width={960} height={400} fill="#8C6238" />
      {/* folder & plan */}
      <polygon filter="url(#ps)" points="400,622 690,622 716,690 380,690" fill="#EB9A6E" />
      <polygon filter="url(#ps)" points="418,626 540,626 544,684 404,684" fill="#FBF8F1" />
      <polygon filter="url(#ps)" points="552,626 674,626 694,684 556,684" fill="#FBF8F1" />
      <g fill="#B9B3A6">
        <rect x={428} y={638} width={90} height={5} rx={2} />
        <rect x={426} y={652} width={70} height={5} rx={2} />
        <rect x={424} y={666} width={96} height={5} rx={2} />
        <rect x={588} y={638} width={84} height={5} rx={2} />
        <rect x={590} y={652} width={90} height={5} rx={2} />
        <rect x={592} y={666} width={66} height={5} rx={2} />
      </g>
      <Check x={568} y={641} s={0.55} p={(f - 20) / 10} />
      <Check x={570} y={655} s={0.55} p={(f - 40) / 10} />
      <Check x={572} y={669} s={0.55} p={(f - 58) / 10} />
      <ellipse cx={170} cy={652} rx={30} ry={12} fill="#F4EEE2" />
      <rect x={140} y={622} width={60} height={32} rx={8} fill="#F4EEE2" />
      <FigArms {...coun} />
      <FigArms {...mom} />
      <FigArms {...teacher} />
    </Stage>
  );
};

// ---------- scene 6c: toward a place where he can learn ----------
export const SceneNewSchool: React.FC<{f: number}> = ({f}) => {
  const bob = Math.sin(f / 4.5) * 5;
  return (
    <Stage f={f} z={1.0 + f * 0.0022} fx={540} fy={520}>
      <rect x={-600} y={-400} width={W + 1200} height={1100} fill="#F6E4C0" />
      <circle cx={880} cy={110} r={70} fill="#FFF1C9" />
      <circle cx={90} cy={420} r={150} fill="#7FA873" />
      <circle cx={10} cy={300} r={110} fill="#8DB380" />
      <circle cx={1010} cy={440} r={140} fill="#7FA873" />
      <rect x={80} y={470} width={24} height={200} fill="#7B5A3B" />
      <rect x={1000} y={480} width={24} height={200} fill="#7B5A3B" />
      {/* school */}
      <rect x={170} y={150} width={740} height={500} fill="#EBCB9E" />
      <polygon filter="url(#ps)" points="140,160 540,40 940,160" fill="#C9744C" />
      {[230, 740].map((x) => (
        <g key={x}>
          <rect x={x} y={230} width={120} height={140} rx={8} fill="#F8EFD9" />
          <rect x={x + 12} y={242} width={96} height={116} fill="#BFDCE0" />
          <rect x={x + 55} y={242} width={10} height={116} fill="#F8EFD9" />
          <rect x={x} y={440} width={120} height={140} rx={8} fill="#F8EFD9" />
          <rect x={x + 12} y={452} width={96} height={116} fill="#BFDCE0" />
          <rect x={x + 55} y={452} width={10} height={116} fill="#F8EFD9" />
        </g>
      ))}
      <rect x={410} y={300} width={260} height={350} rx={12} fill="#C9744C" />
      <rect x={428} y={318} width={224} height={332} fill="#FFE9B4" />
      <circle cx={540} cy={480} r={300} fill="#FFE9B4" opacity={0.25} />
      {/* welcoming teacher */}
      <Figure
        x={540}
        y={470}
        s={0.36}
        kind="adult"
        top="#3F8F8A"
        head={{kind: 'adult', skin: '#B77F5C', hair: '#2E211C', style: 'curly', mouth: 0.8, open: 1}}
        armR={{e: [180, 20], h: [200 + Math.sin(f / 3) * 30, -130]}}
        legs={{l: [-40, 500], r: [40, 500], color: '#5B5248', shoe: '#3A332E'}}
      />
      {/* path */}
      <rect x={-600} y={650} width={W + 1200} height={700} fill="#A9BF8A" />
      <polygon filter="url(#ps)" points="430,650 650,650 900,1100 180,1100" fill="#F0E2C8" />
      {/* mother and son, from behind */}
      <Figure
        x={430}
        y={560 + bob}
        s={0.85}
        kind="adult"
        back
        top={C.green}
        sleeve="short"
        skirt={220}
        head={{...MOM, back: true}}
        headTilt={5}
        armR={{e: [146, 160], h: [136, 280 - bob * 0.5]}}
      />
      <Figure
        x={664}
        y={690 - bob}
        s={0.8}
        back
        stripes
        sleeve="short"
        backpack
        head={{...BOY, back: true}}
        headTilt={-6}
        armL={{e: [-120, 90], h: [-150, 132 + bob * 1.6]}}
        legs={{l: [-36, 380], r: [36, 380]}}
      />
    </Stage>
  );
};

// ---------- scene 7: a classroom that fits ----------
export const SceneSupported: React.FC<{f: number}> = ({f}) => {
  const raise = prog(f, 96, 118);
  const lookUp = prog(f, 80, 94);
  const bounce = Math.abs(Math.sin(f / 6)) * 7;
  const boy = {
    x: 660,
    y: 446 - bounce,
    s: 1.12,
    stripes: true,
    sleeve: 'short' as const,
    lean: Math.sin(f / 12) * 1.5,
    head: {
      ...BOY,
      gy: lerp(0.9, 0, lookUp),
      gx: lerp(0.1, -0.5, lookUp),
      turn: lerp(0, -0.3, lookUp),
      open: Math.min(blink(f, 14), lerp(0.72, 1, lookUp)),
      brow: lerp(0.1, -0.05, lookUp),
      mouth: lerp(0.25, 0.9, lookUp),
      mouthOpen: lookUp * 0.35,
    },
    headDy: lerp(14, 0, lookUp),
    armL: {e: [-128, 118] as [number, number], h: [-70, 196] as [number, number]},
    armR: {
      e: [lerp(124, 176, raise), lerp(120, -10, raise)] as [number, number],
      h: [lerp(50 + Math.sin(f / 2) * 7 * (1 - lookUp), 150, raise), lerp(198, -196, raise)] as [number, number],
    },
    legs: {l: [-60, 420] as [number, number], r: [60, 420] as [number, number]},
  };
  const t = {
    x: 250,
    y: 520,
    s: 0.98,
    kind: 'adult' as const,
    top: '#3F8F8A',
    skirt: 200,
    head: {kind: 'adult' as const, skin: '#B77F5C', hair: '#2E211C', style: 'curly' as const, turn: 0.55, gx: 0.6, gy: lerp(0.5, 0, lookUp), mouth: lerp(0.5, 0.9, lookUp), mouthOpen: lookUp * 0.3, open: blink(f, 44)},
    headTilt: 4,
    headDy: Math.max(0, Math.sin(f / 8)) * 4,
    armL: {e: [-140, 160] as [number, number], h: [-70, 270] as [number, number]},
    armR: {e: [170, 170] as [number, number], h: [lerp(236, 200, lookUp), lerp(158, 120, lookUp)] as [number, number]},
  };
  return (
    <Stage f={f} z={1.03 + f * 0.0008} fx={540} fy={480}>
      <rect x={-600} y={-400} width={W + 1200} height={1100} fill="#EBD8B4" />
      <rect x={-600} y={520} width={W + 1200} height={180} fill="#E0C89E" />
      <Planks y={700} color="#C29A6C" />
      {/* window with sun */}
      <rect x={60} y={90} width={330} height={340} rx={8} fill="#F8EFD9" />
      <rect x={78} y={108} width={294} height={304} fill="#FBE3A8" />
      <circle cx={150} cy={180} r={52} fill="#FFF4D0" />
      <path d="M 78,340 q 70,-50 150,-10 t 144,-14 v 96 h -294 z" fill="#A9BF8A" />
      <rect x={219} y={108} width={12} height={304} fill="#F8EFD9" />
      <polygon filter="url(#ps)" points="78,412 372,412 700,960 200,960" fill="#FFF3CF" opacity={0.22} />
      {/* bunting */}
      <path d="M 380,60 Q 720,130 1090,50" stroke="#8A7A66" strokeWidth={3} fill="none" />
      {[430, 510, 592, 676, 760, 846, 934, 1020].map((x, i) => (
        <polygon key={x} points={`${x - 22},${76 + Math.sin((i / 7) * Math.PI) * 34} ${x + 22},${80 + Math.sin(((i + 0.3) / 7) * Math.PI) * 34} ${x},${126 + Math.sin((i / 7) * Math.PI) * 34}`} fill={[C.orange, '#4F8A5B', '#3F6CAE', '#E9C46A'][i % 4]} opacity={0.9} />
      ))}
      {/* visual schedule: clear steps */}
      <rect x={770} y={170} width={270} height={290} rx={12} fill="#F8EFD9" />
      <rect x={770} y={170} width={270} height={40} rx={12} fill={C.orange} opacity={0.85} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(790,${226 + i * 76})`}>
          <rect width={230} height={62} rx={10} fill={['#DCE8F2', '#DDEBDD', '#F6E7C8'][i]} />
          <circle cx={34} cy={31} r={18} fill={['#3F6CAE', '#4F8A5B', '#E9A53A'][i]} />
          <rect x={66} y={18} width={92} height={8} rx={4} fill="#8A8377" />
          <rect x={66} y={36} width={62} height={8} rx={4} fill="#B9B3A6" />
          <Check x={196} y={32} s={1} p={(f - 18 - i * 26) / 10} />
        </g>
      ))}
      <Plant x={450} y={470} s={0.7} />
      <rect x={400} y={520} width={110} height={12} fill="#B58352" />
      {/* wobble seat */}
      <circle cx={660} cy={850 - bounce * 0.4} r={118} fill="#5FA6A0" />
      <ellipse cx={624} cy={800 - bounce * 0.4} rx={36} ry={20} fill="#8CC4BE" opacity={0.7} />
      <FigNoArms {...t} />
      <FigNoArms {...boy} />
      {/* desk */}
      <rect x={380} y={730} width={18} height={300} fill="#A9753F" />
      <rect x={922} y={730} width={18} height={300} fill="#A9753F" />
      <polygon filter="url(#ps)" points="390,640 930,640 990,704 330,704" fill="#DDB07A" />
      <rect x={330} y={704} width={660} height={36} rx={6} fill="#BC8B52" />
      {/* step card */}
      <polygon filter="url(#ps)" points="420,650 540,650 536,694 404,694" fill="#F8EFD9" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={432 + i * 2 - 4} cy={660 + i * 12} r={4.5} fill={C.orange} />
          <rect x={446 + i * 2 - 4} y={657 + i * 12} width={70} height={5} rx={2} fill="#8A8377" />
        </g>
      ))}
      {/* his work */}
      <polygon filter="url(#ps)" points="600,650 780,650 800,696 592,696" fill="#FBF8F1" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={620 + i} y={659 + i * 12} width={96} height={5} rx={2} fill="#B9B3A6" />
          <Check x={748 + i * 4} y={660 + i * 12} s={0.5} p={(f - 22 - i * 26) / 10} />
        </g>
      ))}
      <g transform={`translate(830,668) scale(${ease((f - 82) / 12) * (1 + Math.sin(f / 5) * 0.05)})`}>
        <polygon filter="url(#ps)" points="0,-30 9,-9 31,-9 13,5 20,27 0,13 -20,27 -13,5 -31,-9 -9,-9" fill="#F2B632" />
      </g>
      <FigArms {...t} />
      <FigArms {...boy} />
    </Stage>
  );
};

// ---------- office (two possible paths) ----------
const OfficeBG: React.FC<{warm: number}> = ({warm}) => (
  <g>
    <rect x={-600} y={-400} width={W + 1200} height={1300} fill={warm > 0.5 ? '#E8DAC0' : '#C8CCCB'} />
    <rect x={50} y={90} width={390} height={350} rx={8} fill="#F1E9DA" />
    <rect x={68} y={108} width={354} height={314} fill={warm > 0.5 ? '#FBE3A8' : '#B7C6CF'} />
    <g fill={warm > 0.5 ? '#E3B77C' : '#8E9CA8'}>
      <rect x={90} y={250} width={60} height={172} />
      <rect x={160} y={190} width={70} height={232} />
      <rect x={244} y={280} width={56} height={142} />
      <rect x={312} y={220} width={80} height={202} />
    </g>
    <circle cx={370} cy={160} r={warm > 0.5 ? 34 : 0} fill="#FFF4D0" />
    <rect x={239} y={108} width={12} height={314} fill="#F1E9DA" />
    {/* whiteboard */}
    <rect x={610} y={100} width={410} height={290} rx={10} fill="#8A8377" />
    <rect x={624} y={114} width={382} height={262} fill="#FBF8F1" />
    <g fill={warm > 0.5 ? '#EBA27F' : '#A9B4BC'}>
      <rect x={660} y={290} width={40} height={60} />
      <rect x={716} y={250} width={40} height={100} />
      <rect x={772} y={270} width={40} height={80} />
      <rect x={828} y={210} width={40} height={140} />
    </g>
    <path d="M 660,200 h 120 M 660,170 h 190" stroke="#8A8377" strokeWidth={7} strokeLinecap="round" />
    <circle cx={940} cy={190} r={34} fill="none" stroke={warm > 0.5 ? '#4F8A5B' : '#A9B4BC'} strokeWidth={12} />
    <Plant x={520} y={560} s={0.8} />
  </g>
);

const WORK_A: HeadProps = {kind: 'adult', skin: '#8E5F45', hair: '#2B1E1A', style: 'curly', earrings: true};
const WORK_B: HeadProps = {kind: 'adult', skin: '#EBC3A2', hair: '#B5673A', style: 'short', glasses: true};

export const OfficeScene: React.FC<{f: number; hopeful: boolean; cam: {z: number; fx: number; fy: number}; a: number}> = ({f, hopeful, cam, a}) => {
  // a = local "action" frame (starts once the camera has pulled back)
  const talkA = !hopeful ? clamp((a - 6) / 8) * (1 - prog(a, 44, 52)) : 0;
  const talkB = !hopeful ? prog(a, 40, 48) : 0;
  const half = !hopeful ? prog(a, 26, 44) * (1 - prog(a, 54, 76)) : 0;
  const raise = hopeful ? prog(a, 6, 28) * (1 - prog(a, 58, 72) * 0.72) : 0;
  const speak = hopeful ? prog(a, 50, 60) : 0;
  const listen = hopeful ? prog(a, 12, 34) : 0;
  const A = {
    x: 205,
    y: 446,
    s: 0.82,
    kind: 'adult' as const,
    top: '#D3A244',
    head: {
      ...WORK_A,
      turn: lerp(0.35, 0.6, listen),
      gx: 0.6,
      mouth: hopeful ? 0.3 + 0.4 * listen : 0.2,
      mouthOpen: talkA * (0.3 + 0.3 * Math.sin(f / 2.1)),
      open: blink(f, 22),
      brow: 0,
    },
    headDy: hopeful ? Math.max(0, Math.sin(a / 7)) * 6 * listen : 0,
    armL: {e: [-140, 170] as [number, number], h: [-50, 214] as [number, number]},
    armR: {e: [150, lerp(170, 150, talkA)] as [number, number], h: [lerp(60, 150 + Math.sin(f / 6) * 12, talkA), lerp(214, 110 + Math.cos(f / 6) * 10, talkA)] as [number, number]},
  };
  const B = {
    x: 495,
    y: 430,
    s: 0.8,
    kind: 'adult' as const,
    top: '#5E8C87',
    head: {
      ...WORK_B,
      turn: hopeful ? lerp(-0.3, 0.55, listen) : -0.35,
      gx: hopeful ? lerp(-0.5, 0.6, listen) : -0.6,
      mouth: hopeful ? 0.25 + 0.35 * listen : 0.15,
      mouthOpen: talkB * (0.3 + 0.3 * Math.sin(f / 2.4)),
      open: blink(f, 50),
    },
    armL: {e: [-140, lerp(170, 150, talkB)] as [number, number], h: [lerp(-50, -130 + Math.sin(f / 5) * 10, talkB), lerp(222, 130, talkB)] as [number, number]},
    armR: {e: [140, 170] as [number, number], h: [50, 222] as [number, number]},
  };
  const hero = {
    x: 800,
    y: 446 + (hopeful ? 0 : 6),
    s: 0.85,
    kind: 'adult' as const,
    stripes: true,
    collar: true,
    lean: hopeful ? -1 : 2,
    head: {
      ...MAN,
      turn: hopeful ? -0.3 * listen : 0,
      gx: hopeful ? -0.5 * listen : lerp(0, -0.5, half),
      gy: hopeful ? 0 : lerp(0.85, 0.3, half),
      open: Math.min(blink(f, 3, 66), hopeful ? 1 : lerp(0.66, 0.9, half)),
      brow: hopeful ? -0.05 : 0.7,
      mouth: hopeful ? 0.55 : -0.4,
      mouthOpen: hopeful ? speak * (0.3 + 0.28 * Math.sin(f / 2.2)) : half * 0.18,
    },
    headDy: hopeful ? 0 : lerp(14, 6, half),
    headTilt: hopeful ? 0 : 3,
    armL: {e: [-140, 170] as [number, number], h: [-44, 208] as [number, number]},
    armR: {
      e: [lerp(140, 178, Math.max(raise, half * 0.5)), lerp(170, 10, raise) - half * 20] as [number, number],
      h: [lerp(lerp(44, 110, half), 156, raise), lerp(lerp(208, 140, half), -176, raise)] as [number, number],
    },
  };
  return (
    <Stage f={f} z={cam.z} fx={cam.fx} fy={cam.fy}>
      <OfficeBG warm={hopeful ? 1 : 0} />
      <FigNoArms {...A} />
      <FigNoArms {...B} />
      <FigNoArms {...hero} />
      {/* table */}
      <polygon filter="url(#ps)" points="70,612 1010,612 1120,704 -40,704" fill={hopeful ? '#C99A66' : '#B08A68'} />
      <rect x={-40} y={704} width={1160} height={44} fill={hopeful ? '#A9763F' : '#8E6E52'} />
      <rect x={-40} y={748} width={1160} height={400} fill={hopeful ? '#8A5F36' : '#6F5846'} />
      <polygon filter="url(#ps)" points="270,630 400,630 410,676 262,676" fill="#FBF8F1" />
      <rect x={556} y={618} width={120} height={62} rx={8} fill="#5B5F66" />
      <polygon filter="url(#ps)" points="548,680 684,680 696,696 536,696" fill="#7A7F87" />
      <polygon filter="url(#ps)" points="850,634 960,634 972,680 846,680" fill="#FBF8F1" />
      <rect x={868} y={646} width={70} height={5} rx={2} fill="#B9B3A6" />
      <rect x={868} y={660} width={52} height={5} rx={2} fill="#B9B3A6" />
      <rect x={690} y={630} width={44} height={40} rx={8} fill={C.orange} opacity={0.9} />
      <FigArms {...A} />
      <FigArms {...B} />
      <FigArms {...hero} />
      {!hopeful && <Bubble x={300} y={236} p={(a - 6) / 10} />}
      {!hopeful && <Bubble x={560} y={214} p={(a - 40) / 10} flip />}
      {hopeful && (
        <Bubble x={660} y={236} p={(a - 52) / 12} flip warm>
          <g transform="translate(0,-28)">
            <circle cx={0} cy={-6} r={20} fill="#F2B632" />
            <rect x={-9} y={12} width={18} height={10} rx={3} fill="#8A8377" />
            <path d="M -34,-6 h -10 M 34,-6 h 10 M -24,-30 l -7,-7 M 24,-30 l 7,-7 M 0,-38 v -9" stroke={C.orange} strokeWidth={4} strokeLinecap="round" />
          </g>
        </Bubble>
      )}
    </Stage>
  );
};

/** child face -> adult face -> pull back to the meeting */
export const SceneGrowsUp: React.FC<{f: number; hopeful: boolean}> = ({f, hopeful}) => {
  const t0 = 20;
  const t1 = 46;
  const t2 = 104;
  const morph = prog(f, t0, t1);
  const pull = prog(f, t1 - 4, t2);
  const cam = {z: lerp(3.5, 1.02, pull) + (f > t2 ? (f - t2) * 0.0005 : 0), fx: lerp(800, 540, pull), fy: lerp(392, 480, pull)};
  const a = f - (t2 - 30);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <OfficeScene f={f} hopeful={hopeful} cam={cam} a={a} />
      {morph < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - morph}}>
          <Stage f={f} id="cu" z={1 + f * 0.002} fx={540} fy={420}>
            <rect x={-600} y={-400} width={W + 1200} height={1800} fill={hopeful ? '#EBD8B4' : '#CFBEAB'} />
            <circle cx={540} cy={420} r={520} fill={hopeful ? '#FFF1C9' : '#B9A894'} opacity={0.35} />
            <Figure
              x={540}
              y={600}
              s={2.15}
              stripes
              sleeve="short"
              head={{
                ...BOY,
                gy: hopeful ? 0 : lerp(0.9, 0.2, prog(f, 4, 18)),
                open: Math.min(blink(f, 70), hopeful ? 1 : lerp(0.55, 0.95, prog(f, 4, 18))),
                brow: hopeful ? -0.05 : 0.8,
                mouth: hopeful ? 0.75 : -0.5,
              }}
              headTilt={hopeful ? 0 : 3}
            />
          </Stage>
        </div>
      )}
    </div>
  );
};
