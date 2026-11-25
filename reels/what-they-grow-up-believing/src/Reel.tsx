import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/fraunces/600.css';
import {C, clamp, ease, lerp, prog} from './art';
import {H, SceneAdvocate, SceneBeside, SceneClassroom, SceneGrowsUp, SceneHome, SceneNewSchool, SceneStruggle, SceneSupported, OfficeScene} from './scenes';

// ---- timeline (frames @30fps) ----
export const T = {s1: 0, s2: 120, s3: 270, s4: 390, s5: 570, s6: 660, s7: 870, s8: 1020, s9: 1200, end: 1350};
const SCENE_TOP = 490;
const SANS = 'Poppins, sans-serif';
const SERIF = 'Fraunces, serif';

const Paper: React.FC = () => (
  <AbsoluteFill style={{background: C.cream}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <filter id="pp" x={0} y={0} width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.9 -0.36" />
      </filter>
      <rect width={1080} height={1920} filter="url(#pp)" opacity={0.5} />
    </svg>
  </AbsoluteFill>
);

/** fades a block of text in at `from`, out by `to` */
const Appear: React.FC<{from: number; to: number; children: React.ReactNode; rise?: number; inDur?: number}> = ({from, to, children, rise = 18, inDur = 12}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const a = ease((f - from) / inDur) * (1 - ease((f - (to - 8)) / 8));
  return <div style={{opacity: a, transform: `translateY(${(1 - ease((f - from) / inDur)) * rise}px)`}}>{children}</div>;
};

const TextZone: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 70, right: 70, top: 190, height: 290, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>{children}</div>
);

const hook: React.CSSProperties = {fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.16, color: C.dark, letterSpacing: -1};
const thought: React.CSSProperties = {fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 78, lineHeight: 1.1, color: C.dark, whiteSpace: 'nowrap'};
const said: React.CSSProperties = {fontFamily: SANS, fontWeight: 700, fontSize: 52, lineHeight: 1.18, color: C.dark};

const ThoughtDots: React.FC<{color?: string}> = ({color = C.dark}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, marginTop: 20}}>
    {[15, 11, 7].map((d) => (
      <div key={d} style={{width: d, height: d, borderRadius: d, background: color, opacity: 0.55}} />
    ))}
  </div>
);

const TeacherWords: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    {t: T.s2 + 18, text: '“Sit down.”'},
    {t: T.s2 + 53, text: '“Pay attention.”'},
    {t: T.s2 + 88, text: '“Everyone else can do it.|Why can’t you?”'},
  ];
  if (f < T.s2 || f > T.s3) return null;
  const out = 1 - ease((f - (T.s3 - 8)) / 8);
  return (
    <div style={{opacity: out, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
      {lines.map((l, i) => {
        const a = ease((f - l.t) / 8);
        const next = lines[i + 1];
        const dim = next ? ease((f - next.t) / 10) : 0;
        return (
          <div key={i} style={{...said, opacity: a * lerp(1, 0.42, dim), transform: `scale(${lerp(1.12, 1, a)})`, maxWidth: 900}}>
            {l.text.split('|').map((part, k) => (
              <div key={k}>{part}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** rewind, gently: back in the same classroom, the clock turns backwards and the light warms */
const Rewind: React.FC<{f: number}> = ({f}) => <SceneClassroom f={f} calm={1} clock={1080 * (1 - prog(f, 0, 62))} warm={prog(f, 34, 88)} />;

const Slot: React.FC<{from: number; to: number; fade?: number; children: (f: number) => React.ReactNode}> = ({from, to, fade = 10, children}) => {
  const f = useCurrentFrame();
  // stay underneath until the next scene has fully faded in on top (no gap, no flash)
  if (f < from - fade / 2 || f >= to + 16) return null;
  const o = fade === 0 ? 1 : clamp((f - (from - fade / 2)) / fade);
  return <div style={{position: 'absolute', inset: 0, opacity: o}}>{children(f - from + fade / 2)}</div>;
};

export const Reel: React.FC<{music?: boolean}> = ({music = true}) => {
  const f = useCurrentFrame();
  // emotional grade: heavy first half, warmer second half
  const warm = prog(f, T.s5 + 30, T.s6 + 30);
  const sat = lerp(0.74, 1.06, warm);
  const sceneOut = 1 - prog(f, T.s9 - 12, T.s9 + 6);
  const end = f - T.s9;

  return (
    <AbsoluteFill style={{background: C.cream}}>
      <Paper />
      {/* illustration window */}
      {f < T.s9 + 8 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: SCENE_TOP,
            width: 1080,
            height: H,
            opacity: sceneOut,
            filter: `saturate(${sat}) brightness(${lerp(0.96, 1.02, warm)})`,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 46px, #000 calc(100% - 46px), transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0, #000 46px, #000 calc(100% - 46px), transparent 100%)',
          }}
        >
          <Slot from={T.s1} to={T.s2} fade={0}>{(l) => <SceneClassroom f={l} />}</Slot>
          <Slot from={T.s2} to={T.s3} fade={20}>{(l) => <SceneStruggle f={l} />}</Slot>
          <Slot from={T.s3} to={T.s4} fade={22}>{(l) => <SceneHome f={l} />}</Slot>
          <Slot from={T.s4} to={T.s5} fade={22}>{(l) => <SceneGrowsUp f={l} hopeful={false} />}</Slot>
          <Slot from={T.s5} to={T.s6} fade={26}>{(l) => <Rewind f={l} />}</Slot>
          <Slot from={T.s6} to={T.s6 + 74} fade={22}>{(l) => <SceneBeside f={l} />}</Slot>
          <Slot from={T.s6 + 74} to={T.s6 + 150} fade={20}>{(l) => <SceneAdvocate f={l} />}</Slot>
          <Slot from={T.s6 + 150} to={T.s7} fade={20}>{(l) => <SceneNewSchool f={l} />}</Slot>
          <Slot from={T.s7} to={T.s8} fade={20}>{(l) => <SceneSupported f={l} />}</Slot>
          <Slot from={T.s8} to={T.s9 + 8} fade={22}>{(l) => <SceneGrowsUp f={l} hopeful />}</Slot>
          {/* cool wash over the heavy half */}
          <div style={{position: 'absolute', inset: 0, background: '#4B5A73', opacity: 0.2 * (1 - warm), mixBlendMode: 'multiply'}} />
          <div style={{position: 'absolute', inset: 0, background: '#FFC88A', opacity: 0.1 * warm, mixBlendMode: 'soft-light'}} />
        </div>
      )}

      {/* text — always in the cream zone above the picture, never over a face */}
      <TextZone>
        <Appear from={T.s1 + 4} to={T.s2 - 2}>
          <div style={hook}>
            What happens when a child
            <br />
            grows up believing
            <br />
            <span style={{color: C.orange}}>he&rsquo;s the problem?</span>
          </div>
        </Appear>
        <TeacherWords />
        <Appear from={T.s3 + 44} to={T.s4 - 2} inDur={18}>
          <div style={thought}>“What&rsquo;s wrong with me?”</div>
          <ThoughtDots />
        </Appear>
        <Appear from={T.s4 + 92} to={T.s5 - 2} inDur={18}>
          <div style={thought}>“I&rsquo;m not good enough.”</div>
          <ThoughtDots />
        </Appear>
        <Appear from={T.s5 + 26} to={T.s6 - 2} inDur={14}>
          <div style={hook}>
            But what if someone
            <br />
            <span style={{color: C.orange}}>saw him differently?</span>
          </div>
        </Appear>
        <Appear from={T.s6 + 30} to={T.s7 - 2} inDur={16}>
          <div style={{...thought, fontStyle: 'normal', fontSize: 72}}>
            “You don&rsquo;t have to
            <br />
            do this alone.”
          </div>
        </Appear>
        <Appear from={T.s7 + 96} to={T.s8 - 2} inDur={16}>
          <div style={{...thought, color: C.orange}}>“I can learn.”</div>
          <ThoughtDots color={C.orange} />
        </Appear>
        <Appear from={T.s8 + 100} to={T.s9 - 6} inDur={16}>
          <div style={{...thought, color: C.orange}}>“I believe in myself.”</div>
          <ThoughtDots color={C.orange} />
        </Appear>
      </TextZone>

      {/* end card */}
      {end >= 0 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 80px'}}>
          <div style={{marginTop: -120}}>
            <div style={{...hook, fontSize: 68, opacity: ease((end - 8) / 16), transform: `translateY(${(1 - ease((end - 8) / 16)) * 20}px)`}}>
              We&rsquo;re not just
              <br />
              raising children.
            </div>
            <div style={{width: 120 * ease((end - 36) / 16), height: 6, borderRadius: 3, background: C.dark, opacity: 0.25, margin: '54px auto'}} />
            <div style={{...hook, fontSize: 78, color: C.orange, opacity: ease((end - 44) / 18), transform: `translateY(${(1 - ease((end - 44) / 18)) * 20}px)`}}>
              We&rsquo;re raising
              <br />
              the adults they
              <br />
              will become.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* handle — bottom, inside the Instagram safe area */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1474, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.dark, letterSpacing: 0.5}}>@taligal.parenting</div>

      {music && <Audio src={staticFile('music.wav')} />}
    </AbsoluteFill>
  );
};
