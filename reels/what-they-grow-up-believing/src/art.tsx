import React, {useId} from 'react';

// ---------- palette ----------
export const C = {
  cream: '#F5F0EA',
  orange: '#EB6234',
  dark: '#2A2925',
  skinBoy: '#F0C29E',
  skinMom: '#E9B690',
  hairBoy: '#6A4124',
  hairMom: '#4A2C20',
  blue: '#3F6CAE',
  blueDark: '#2F5590',
  stripe: '#F1EBDD',
  green: '#4F8A5B',
  greenDark: '#3C6F48',
  jeans: '#4B5874',
  line: '#3A2A22',
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
/** eased 0..1 progress of f between a and b */
export const prog = (f: number, a: number, b: number) => ease((f - a) / (b - a));
export const blink = (f: number, offset = 0, every = 78) => {
  const p = (((f + offset) % every) + every) % every;
  if (p < 3) return 1 - p / 3;
  if (p < 6) return (p - 3) / 3;
  return 1;
};
const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(clamp(v + amt * 255, 0, 255));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `rgb(${r},${g},${b})`;
};
export {shade};

// ---------- limbs ----------
type P = [number, number];
export const Limb: React.FC<{pts: P[]; w: number; color: string; cap?: 'round' | 'butt'}> = ({pts, w, color, cap = 'round'}) => {
  // smooth-ish bend through the joint
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  if (pts.length === 3) {
    d += ` Q ${pts[1][0]},${pts[1][1]} ${pts[2][0]},${pts[2][1]}`;
    // pull the curve so the elbow reads as a joint
    const [a, e, h] = pts;
    d = `M ${a[0]},${a[1]} C ${lerp(a[0], e[0], 0.9)},${lerp(a[1], e[1], 0.9)} ${lerp(h[0], e[0], 0.9)},${lerp(h[1], e[1], 0.9)} ${h[0]},${h[1]}`;
  } else {
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0]},${pts[i][1]}`;
  }
  return <path d={d} stroke={color} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" fill="none" />;
};

// ---------- head ----------
export type HairStyle = 'boy' | 'bun' | 'bob' | 'short' | 'curly' | 'long' | 'pigtails' | 'flat';
export type HeadProps = {
  kind?: 'child' | 'adult';
  skin?: string;
  hair?: string;
  style?: HairStyle;
  open?: number;
  gx?: number;
  gy?: number;
  brow?: number; // + worried, - stern
  mouth?: number; // -1 sad .. 1 smile
  mouthOpen?: number;
  turn?: number; // -1 left .. 1 right
  freckles?: boolean;
  glasses?: boolean;
  back?: boolean;
  blush?: number;
  earrings?: boolean;
};

const HAIR: Record<string, string> = {
  boy: 'M -99,2 C -110,-84 -52,-126 0,-124 C 56,-126 110,-82 99,2 C 92,-26 82,-42 68,-50 C 60,-32 48,-28 36,-48 C 26,-28 8,-28 -4,-50 C -14,-28 -34,-30 -44,-50 C -56,-34 -70,-32 -78,-46 C -88,-32 -95,-18 -99,2 Z',
  cowlick: 'M 14,-118 C 22,-152 58,-158 66,-134 C 52,-142 40,-130 46,-110 Z',
  bun: 'M -90,14 C -106,-80 -46,-118 0,-116 C 50,-118 104,-84 90,14 C 86,-28 62,-56 22,-70 C -18,-58 -64,-38 -90,14 Z',
  short: 'M -88,0 C -100,-84 -44,-116 0,-114 C 46,-116 100,-84 88,0 C 72,-48 30,-62 0,-60 C -30,-62 -72,-48 -88,0 Z',
  flat: 'M -88,4 C -100,-84 -44,-116 0,-114 C 46,-116 100,-84 88,4 C 84,-44 70,-56 0,-54 C -70,-56 -84,-44 -88,4 Z',
};

export const Head: React.FC<HeadProps> = ({
  kind = 'child',
  skin = C.skinBoy,
  hair = C.hairBoy,
  style = 'boy',
  open = 1,
  gx = 0,
  gy = 0,
  brow = 0,
  mouth = 0,
  mouthOpen = 0,
  turn = 0,
  freckles = false,
  glasses = false,
  back = false,
  blush = 0.38,
  earrings = false,
}) => {
  const id = useId().replace(/:/g, '');
  const child = kind === 'child';
  const rx = child ? 93 : 82;
  const fx = turn * (child ? 24 : 20);
  const ex = child ? 38 : 31;
  const ey = child ? 14 : 2;
  const srx = child ? 18 : 13.5;
  const sry = child ? 20.5 : 13.5;
  const ir = child ? 13 : 10;
  const face = child
    ? 'M -93,-8 C -95,-96 95,-96 93,-8 C 93,56 56,99 0,99 C -56,99 -93,56 -93,-8 Z'
    : 'M -82,-18 C -84,-92 84,-92 82,-18 C 82,44 52,106 0,108 C -52,106 -82,44 -82,-18 Z';
  const skinDark = shade(skin, -0.12);
  const hairDark = shade(hair, -0.1);
  const squash = 1 - Math.abs(turn) * 0.06;

  const backHair = () => {
    if (style === 'bob') return <path d="M -100,-40 C -108,40 -104,80 -84,96 L 84,96 C 104,80 108,40 100,-40 Z" fill={hairDark} />;
    if (style === 'long') return <path d="M -100,-40 C -116,60 -112,150 -92,176 L 92,176 C 112,150 116,60 100,-40 Z" fill={hairDark} />;
    if (style === 'bun')
      return (
        <g>
          <circle cx={-fx * 0.4} cy={-128} r={38} fill={hair} />
          <path d={`M ${-26 - fx * 0.4},-140 q 26,-16 52,0`} stroke={hairDark} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M ${-30 - fx * 0.4},-104 q 30,10 60,0`} stroke={shade(hair, -0.18)} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      );
    if (style === 'pigtails')
      return (
        <g fill={hair}>
          <ellipse cx={-112} cy={10} rx={26} ry={36} />
          <ellipse cx={112} cy={10} rx={26} ry={36} />
        </g>
      );
    if (style === 'curly')
      return (
        <g fill={hair}>
          {[-96, -66, -30, 8, 46, 80, 100].map((x, i) => (
            <circle key={i} cx={x} cy={-70 - Math.sin((i / 6) * Math.PI) * 50 + (i === 0 || i === 6 ? 40 : 0)} r={38} />
          ))}
          <circle cx={-104} cy={10} r={30} />
          <circle cx={104} cy={10} r={30} />
        </g>
      );
    return null;
  };

  if (back) {
    return (
      <g>
        {backHair()}
        <circle cx={-rx} cy={ey + 8} r={15} fill={skin} />
        <circle cx={rx} cy={ey + 8} r={15} fill={skin} />
        <path d={face} fill={skin} />
        <path
          d={
            child
              ? 'M -99,10 C -110,-84 -52,-126 0,-124 C 56,-126 110,-82 99,10 C 96,60 60,84 0,84 C -60,84 -96,60 -99,10 Z'
              : 'M -90,6 C -104,-84 -46,-118 0,-116 C 50,-118 104,-84 90,6 C 88,56 56,80 0,80 C -56,80 -88,56 -90,6 Z'
          }
          fill={hair}
        />
        {style === 'boy' && <path d={HAIR.cowlick} fill={hair} />}
        <path d="M -40,-60 q 20,-22 50,-14 M -10,-20 q 26,-14 52,2 M -52,14 q 22,-12 40,0" stroke={hairDark} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
      </g>
    );
  }

  const eye = (side: number) => {
    const cx = side * ex + fx;
    const cy = ey;
    const o = clamp(open, 0, 1);
    const w = srx * (side * turn > 0 ? 1 - Math.abs(turn) * 0.18 : 1);
    if (o < 0.14) {
      return <path d={`M ${cx - w},${cy + 2} Q ${cx},${cy + 12} ${cx + w},${cy + 2}`} stroke={C.line} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    }
    const cid = `${id}e${side > 0 ? 'r' : 'l'}`;
    const top = cy - sry * o + sry * (1 - o) * 0.5;
    return (
      <g>
        <clipPath id={cid}>
          <ellipse cx={cx} cy={cy + sry * (1 - o) * 0.5} rx={w} ry={sry * o} />
        </clipPath>
        <ellipse cx={cx} cy={cy + sry * (1 - o) * 0.5} rx={w} ry={sry * o} fill="#FBF7F0" />
        <g clipPath={`url(#${cid})`}>
          <circle cx={cx + gx * (w - ir + 3)} cy={cy + gy * 6} r={ir} fill="#4A2F1F" />
          <circle cx={cx + gx * (w - ir + 3)} cy={cy + gy * 6} r={ir * 0.52} fill="#1E1410" />
          <circle cx={cx + gx * (w - ir + 3) - ir * 0.32} cy={cy + gy * 6 - ir * 0.36} r={ir * 0.27} fill="#fff" />
        </g>
        <path d={`M ${cx - w - 2},${top + sry * o * 0.75} Q ${cx},${top - 5} ${cx + w + 2},${top + sry * o * 0.75}`} stroke={C.line} strokeWidth={child ? 4.5 : 4} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  const browEl = (side: number) => {
    const by = ey - (child ? 37 : 27);
    const x1 = side * (ex - 20) + fx;
    const x2 = side * (ex + 20) + fx;
    return <path d={`M ${x1},${by - brow * 11} Q ${(x1 + x2) / 2},${by - 7 - brow * 3} ${x2},${by + brow * 5}`} stroke={hairDark} strokeWidth={child ? 7 : 8} strokeLinecap="round" fill="none" />;
  };
  const my = ey + (child ? 50 : 58);
  const mw = 17 + Math.abs(mouth) * 6;

  return (
    <g>
      {backHair()}
      <g transform={`scale(${squash},1)`}>
        <circle cx={-rx + (turn > 0 ? turn * 10 : 0)} cy={ey + 8} r={15} fill={skinDark} opacity={turn > 0.5 ? 0 : 1} />
        <circle cx={rx + (turn < 0 ? turn * 10 : 0)} cy={ey + 8} r={15} fill={skinDark} opacity={turn < -0.5 ? 0 : 1} />
        <defs>
          <radialGradient id={`${id}g`} cx={0.5 + turn * 0.12} cy="0.45" r="0.62">
            <stop offset="0.55" stopColor={skin} />
            <stop offset="1" stopColor={shade(skin, -0.07)} />
          </radialGradient>
        </defs>
        <path d={face} fill={`url(#${id}g)`} />
        {/* cheeks */}
        <ellipse cx={-ex - 20 + fx * 0.7} cy={ey + 36} rx={18} ry={12} fill="#E8846B" opacity={blush} />
        <ellipse cx={ex + 20 + fx * 0.7} cy={ey + 36} rx={18} ry={12} fill="#E8846B" opacity={blush} />
        {freckles &&
          [-1, 1].map((s) => (
            <g key={s} fill="#B9774F" opacity={0.75}>
              <circle cx={s * (ex + 12) + fx * 0.8} cy={ey + 26} r={2.6} />
              <circle cx={s * (ex + 24) + fx * 0.8} cy={ey + 30} r={2.4} />
              <circle cx={s * (ex + 17) + fx * 0.8} cy={ey + 36} r={2.2} />
            </g>
          ))}
        {eye(-1)}
        {eye(1)}
        {browEl(-1)}
        {browEl(1)}
        {/* nose */}
        <path d={`M ${fx * 1.25 - 2},${ey + 18} q ${7 + turn * 5},9 ${-3 + turn * 2},14`} stroke={shade(skin, -0.25)} strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* mouth */}
        {mouthOpen > 0.05 ? (
          <g>
            <path
              d={`M ${fx * 1.1 - mw},${my} Q ${fx * 1.1},${my + mouth * 10 + mouthOpen * 26} ${fx * 1.1 + mw},${my} Q ${fx * 1.1},${my + mouth * 6 - 1} ${fx * 1.1 - mw},${my} Z`}
              fill="#7A2E28"
              stroke={C.line}
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
          </g>
        ) : (
          <path d={`M ${fx * 1.1 - mw},${my - mouth * 3} Q ${fx * 1.1},${my + mouth * 15} ${fx * 1.1 + mw},${my - mouth * 3}`} stroke="#8A4132" strokeWidth={5} fill="none" strokeLinecap="round" />
        )}
        {glasses && (
          <g stroke="#3A3A3A" strokeWidth={4} fill="rgba(255,255,255,0.18)">
            <rect x={-ex - 22 + fx} y={ey - 20} width={44} height={38} rx={14} />
            <rect x={ex - 22 + fx} y={ey - 20} width={44} height={38} rx={14} />
            <path d={`M ${-ex + 22 + fx},${ey - 4} L ${ex - 22 + fx},${ey - 4}`} fill="none" />
          </g>
        )}
      </g>
      {/* hair on top */}
      {style === 'boy' && (
        <g filter="url(#ps)" transform={child ? undefined : 'scale(0.9,0.97)'}>
          <path d={HAIR.boy} fill={hair} />
          <path d={HAIR.cowlick} fill={hair} />
          <path d="M -60,-92 q 26,-22 58,-14 M 10,-96 q 30,-10 52,12 M -30,-70 q 14,-10 30,-6" stroke={shade(hair, 0.1)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      )}
      {style === 'bun' && (
        <g filter="url(#ps)">
          <path d={HAIR.bun} fill={hair} />
          <path d="M -50,-88 q 30,-20 70,-10 M -70,-50 q 30,-24 66,-26" stroke={shade(hair, 0.1)} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
        </g>
      )}
      {(style === 'bob' || style === 'long') && <path d={HAIR.bun} fill={hair} transform="scale(-1,1)" />}
      {(style === 'short' || style === 'pigtails') && <path d={HAIR.short} fill={hair} />}
      {style === 'flat' && <path d={HAIR.flat} fill={hair} />}
      {style === 'curly' && (
        <g fill={hair}>
          {[-70, -36, 0, 36, 70].map((x, i) => (
            <circle key={i} cx={x} cy={-78 - Math.sin(((i + 0.5) / 5) * Math.PI) * 18} r={34} />
          ))}
        </g>
      )}
      {earrings && (
        <g fill="#E9C46A">
          {turn < 0.5 && <circle cx={-rx - 2} cy={ey + 28} r={6} />}
          {turn > -0.5 && <circle cx={rx + 2} cy={ey + 28} r={6} />}
        </g>
      )}
    </g>
  );
};

// ---------- figure (upper body, front) ----------
export type Arm = {e: P; h: P};
export type FigureProps = {
  x: number;
  y: number;
  s?: number;
  kind?: 'child' | 'adult';
  head?: HeadProps;
  headDx?: number;
  headDy?: number;
  headTilt?: number;
  lean?: number;
  top?: string;
  stripes?: boolean;
  sleeve?: 'short' | 'long';
  collar?: boolean;
  armL?: Arm; // screen-left arm
  armR?: Arm;
  legs?: {l: P; r: P; color?: string; shoe?: string} | null; // foot positions (local)
  skirt?: number; // dress length below torso
  back?: boolean;
  backpack?: boolean;
  torsoH?: number;
  flip?: boolean;
  under?: React.ReactNode; // drawn between torso and arms
  noArms?: boolean;
};

export const Figure: React.FC<FigureProps> = ({
  x,
  y,
  s = 1,
  kind = 'child',
  head = {},
  headDx = 0,
  headDy = 0,
  headTilt = 0,
  lean = 0,
  top = C.blue,
  stripes = false,
  sleeve = 'long',
  collar = false,
  armL,
  armR,
  legs = null,
  skirt = 0,
  back = false,
  backpack = false,
  torsoH,
  under,
  noArms = false,
}) => {
  const id = useId().replace(/:/g, '');
  const child = kind === 'child';
  const w = child ? 172 : 232;
  const h = torsoH ?? (child ? 190 : 290);
  const aw = child ? 42 : 52;
  const hs = child ? 1 : 0.8;
  const skin = head.skin ?? C.skinBoy;
  const fill = stripes ? `url(#${id}s)` : top;
  const sh: P = [w / 2 - 20, 28];
  const dL: Arm = armL ?? {e: [-(w / 2 + 6), h * 0.5], h: [-(w / 2 - 6), h * 0.92]};
  const dR: Arm = armR ?? {e: [w / 2 + 6, h * 0.5], h: [w / 2 - 6, h * 0.92]};
  const arm = (a: Arm, side: number) => {
    const s0: P = [side * sh[0], sh[1]];
    if (sleeve === 'short') {
      const mid: P = [lerp(s0[0], a.e[0], 0.62), lerp(s0[1], a.e[1], 0.62)];
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
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${lean})`}>
      <defs>
        <pattern id={`${id}s`} patternUnits="userSpaceOnUse" width={40} height={child ? 34 : 38}>
          <rect width={40} height={child ? 34 : 38} fill={C.blue} />
          <rect width={40} height={child ? 11 : 12} y={6} fill={C.stripe} />
        </pattern>
        <linearGradient id={`${id}sh`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {legs && (
        <g filter="url(#ps)">
          <Limb pts={[[-w * 0.2, h - 10], legs.l]} w={aw + 6} color={legs.color ?? C.jeans} />
          <Limb pts={[[w * 0.2, h - 10], legs.r]} w={aw + 6} color={legs.color ?? C.jeans} />
          <ellipse cx={legs.l[0] - 8} cy={legs.l[1] + aw * 0.35} rx={aw * 0.85} ry={aw * 0.48} fill={legs.shoe ?? '#E8E2D6'} />
          <ellipse cx={legs.r[0] + 8} cy={legs.r[1] + aw * 0.35} rx={aw * 0.85} ry={aw * 0.48} fill={legs.shoe ?? '#E8E2D6'} />
        </g>
      )}
      {skirt > 0 && <path d={`M ${-w * 0.46},${h - 30} L ${w * 0.46},${h - 30} L ${w * 0.62},${h + skirt} Q 0,${h + skirt + 18} ${-w * 0.62},${h + skirt} Z`} fill={top} />}
      {/* torso */}
      {(() => {
        const d = `M ${-w / 2},36 Q ${-w / 2},0 ${-w / 2 + 40},0 L ${w / 2 - 40},0 Q ${w / 2},0 ${w / 2},36 L ${w * 0.46},${h} L ${-w * 0.46},${h} Z`;
        return (
          <g filter="url(#ps)">
            <path d={d} fill={fill} />
            <path d={d} fill={`url(#${id}sh)`} />
          </g>
        );
      })()}
      {under}
      {/* neck */}
      {!back && <rect x={child ? -22 : -29} y={-34} width={child ? 44 : 58} height={50} rx={16} fill={shade(skin, -0.08)} />}
      {!back && <ellipse cx={0} cy={-22} rx={child ? 24 : 30} ry={14} fill="#5A3A2A" opacity={0.22} />}
      {!back && !collar && <path d={`M ${child ? -30 : -40},0 Q 0,${child ? 26 : 34} ${child ? 30 : 40},0 Z`} fill={shade(skin, -0.03)} />}
      {collar && !back && (
        <g>
          <path d="M -44,-4 L -4,40 L -40,52 L -62,6 Z" fill={stripes ? C.blueDark : shade(top, -0.08)} />
          <path d="M 44,-4 L 4,40 L 40,52 L 62,6 Z" fill={stripes ? C.blueDark : shade(top, -0.08)} />
          <path d="M -34,0 L 0,40 L 34,0 Z" fill={shade(skin, -0.04)} />
          <path d={`M 0,40 L 0,${h}`} stroke={shade(C.blue, -0.16)} strokeWidth={3} opacity={0.6} />
        </g>
      )}
      {back && <rect x={child ? -22 : -29} y={-34} width={child ? 44 : 58} height={50} rx={16} fill={shade(skin, -0.1)} />}
      {backpack && (
        <g>
          <rect x={-w * 0.4} y={14} width={w * 0.8} height={h * 0.86} rx={34} fill={C.orange} />
          <rect x={-w * 0.27} y={h * 0.44} width={w * 0.54} height={h * 0.34} rx={16} fill={shade(C.orange, -0.1)} />
          <path d={`M ${-w * 0.12},14 q ${w * 0.12},-26 ${w * 0.24},0`} stroke={shade(C.orange, -0.15)} strokeWidth={9} fill="none" strokeLinecap="round" />
        </g>
      )}
      <g filter="url(#ps)" transform={`translate(${headDx},${-100 + headDy}) rotate(${headTilt}) scale(${hs})`}>
        <Head kind={kind} back={back} {...head} />
      </g>
      {!noArms && arm(dL, -1)}
      {!noArms && arm(dR, 1)}
    </g>
  );
};

// ---------- furniture & props ----------
export const Desk: React.FC<{x: number; y: number; w: number; h?: number; legH?: number; color?: string}> = ({x, y, w, h = 30, legH = 150, color = '#C99158'}) => (
  <g filter="url(#ps)">
    <ellipse cx={x} cy={y + h + legH} rx={w * 0.62} ry={16} fill="#3A2A1E" opacity={0.16} />
    <rect x={x - w / 2 + 14} y={y + h} width={14} height={legH} fill={shade(color, -0.22)} />
    <rect x={x + w / 2 - 28} y={y + h} width={14} height={legH} fill={shade(color, -0.22)} />
    <rect x={x - w / 2} y={y + h - 4} width={w} height={h * 0.9} rx={6} fill={shade(color, -0.12)} />
    <rect x={x - w / 2 - 8} y={y} width={w + 16} height={h} rx={9} fill={color} />
    <rect x={x - w / 2 - 8} y={y} width={w + 16} height={h * 0.3} rx={5} fill={shade(color, 0.07)} />
  </g>
);

export const Paper: React.FC<{x: number; y: number; w: number; h: number; rot?: number; lines?: number; children?: React.ReactNode}> = ({x, y, w, h, rot = 0, lines = 4, children}) => (
  <g filter="url(#ps)" transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill="#FBF8F1" />
    {Array.from({length: lines}).map((_, i) => (
      <rect key={i} x={-w * 0.36} y={-h * 0.3 + (i * h * 0.62) / Math.max(1, lines - 1) - 2} width={w * (i % 2 ? 0.55 : 0.72)} height={Math.max(3, h * 0.045)} rx={2} fill="#B9B3A6" />
    ))}
    {children}
  </g>
);

export const Plant: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g filter="url(#ps)" transform={`translate(${x},${y}) scale(${s})`}>
    {[-38, -18, 0, 20, 40].map((a, i) => (
      <path key={i} d="M 0,0 C -16,-50 -10,-96 0,-124 C 12,-96 16,-50 0,0 Z" fill={i % 2 ? '#5E9A63' : '#4C8553'} transform={`rotate(${a}) scale(${1 - Math.abs(a) / 160})`} />
    ))}
    <path d="M -34,0 L 34,0 L 26,56 L -26,56 Z" fill="#D07A4B" />
    <rect x={-38} y={-6} width={76} height={14} rx={5} fill="#DD8A5A" />
  </g>
);

export const Check: React.FC<{x: number; y: number; s?: number; p: number; color?: string}> = ({x, y, s = 1, p, color = '#4F8A5B'}) => (
  <path d="M -14,0 L -4,11 L 16,-13" transform={`translate(${x},${y}) scale(${s})`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - clamp(p))} />
);

export const Bubble: React.FC<{x: number; y: number; p: number; flip?: boolean; warm?: boolean; children?: React.ReactNode}> = ({x, y, p, flip, warm, children}) => {
  const k = ease(p);
  if (k <= 0) return null;
  return (
    <g filter="url(#ps)" transform={`translate(${x},${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <path d={`M -70,-46 Q -70,-70 -46,-70 L 46,-70 Q 70,-70 70,-46 L 70,-10 Q 70,14 46,14 L ${flip ? 10 : -10},14 L ${flip ? 30 : -30},40 L ${flip ? -14 : 14},14 L -46,14 Q -70,14 -70,-10 Z`} fill={warm ? '#FFF6E6' : '#FBF8F1'} stroke={warm ? C.orange : 'none'} strokeWidth={warm ? 4 : 0} />
      {children ?? (
        <g fill="#9E9A91">
          <rect x={-44} y={-50} width={88} height={7} rx={3.5} />
          <rect x={-44} y={-33} width={64} height={7} rx={3.5} />
          <rect x={-44} y={-16} width={76} height={7} rx={3.5} />
        </g>
      )}
    </g>
  );
};
