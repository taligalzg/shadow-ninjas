// Builds the "Weekend With Kids | South Florida, Nov 7–8, 2026" carousel.
// Each slide is rendered from HTML to a 1080 x 1350 PNG in ./slides
// Run: node build.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUT = path.join(DIR, 'slides');
const TOTAL = 10;

const C = {
  cream: '#F5F0EA',
  sand: '#EADFCF',
  sandDeep: '#DCCBB4',
  charcoal: '#2A2925',
  orange: '#EC6136',
  terracotta: '#C8775A',
  sage: '#9AA58C',
  mustard: '#D6A04A',
};

// ---------- small icons ----------
const ic = {
  pin: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>`,
  cal: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,
  ticket: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5V6.5h17v2a2.5 2.5 0 0 0 0 5v2h-17v-2a2.5 2.5 0 0 0 0-5z"/><path d="M14 6.5v11" stroke-dasharray="2 2.4"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16.3 9.4"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l9 16H3z"/><path d="M12 10v4.5M12 17.2v.2"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3.5L10.5 13.5M21 3.5l-6.5 17-4-7-7-4z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/></svg>`,
};

// ---------- illustrations (viewBox 0 0 900 420) ----------
const S = `stroke="${C.charcoal}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"`;

function droneDots() {
  // a heart drawn with "drone" dots
  let dots = '';
  for (let y = -1.3; y <= 1.3; y += 0.13) {
    for (let x = -1.4; x <= 1.4; x += 0.13) {
      const v = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(-y, 3);
      if (v <= 0) {
        const cx = 450 + x * 120, cy = 150 - y * 110;
        const r = 4.2 + ((x * 7 + y * 3) % 1 > 0.5 ? 1 : 0);
        dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${Math.abs(x) + Math.abs(y) < 0.7 ? C.mustard : C.orange}"/>`;
      }
    }
  }
  return dots;
}
function stars() {
  const pts = [[90,60],[180,120],[760,70],[820,160],[640,40],[260,40],[120,200],[720,230],[300,170],[600,190]];
  return pts.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?2:3}" fill="${C.cream}" opacity=".7"/>`).join('');
}

const art = {
  cover: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <circle cx="450" cy="300" r="150" fill="${C.orange}" opacity=".9"/>
    <rect x="0" y="300" width="900" height="160" rx="28" fill="${C.sand}"/>
    <path d="M60 318 q40 -18 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" ${S}/>
    <path d="M120 352 q40 -18 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" ${S} opacity=".55"/>
    <path d="M200 386 q40 -16 80 0 t80 0 t80 0 t80 0 t80 0 t80 0" ${S} opacity=".3"/>
    <g ${S}><path d="M150 300 C 160 230, 168 170, 200 120"/><path d="M200 120 c -30 -10 -60 0 -80 20"/><path d="M200 120 c -10 -30 -40 -45 -70 -40"/><path d="M200 120 c 20 -25 55 -30 80 -15"/><path d="M200 120 c 35 0 60 20 70 45"/></g>
    <g ${S}><path d="M760 300 C 752 250, 744 210, 720 175"/><path d="M720 175 c 25 -10 50 -2 66 14"/><path d="M720 175 c 8 -25 32 -36 56 -32"/><path d="M720 175 c -18 -20 -46 -22 -66 -10"/><path d="M720 175 c -28 2 -48 18 -55 38"/></g>
    <g ${S}><path d="M590 60 l40 40 l-40 40 l-40 -40 z" fill="${C.cream}"/><path d="M590 140 c -10 30 20 40 5 70 s 15 40 0 60"/></g>
  </svg>`,

  drone: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${stars()}
    ${droneDots()}
    <path d="M0 330 q45 -14 90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0" stroke="${C.cream}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M40 368 q45 -12 90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0" stroke="${C.cream}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".45"/>
    <g stroke="${C.cream}" stroke-width="4" stroke-linecap="round" fill="none" opacity=".9">
      <path d="M560 300 H 900"/><path d="M600 300 v 70 M680 300 v 70 M760 300 v 70 M840 300 v 70"/>
    </g>
  </svg>`,

  arts: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <path d="M300 90 C 420 40, 600 60, 640 170 C 670 250, 600 260, 560 250 C 520 240, 500 280, 530 320 C 560 360, 480 390, 380 360 C 250 320, 200 140, 300 90 z" fill="${C.cream}" ${S}/>
    <circle cx="350" cy="160" r="26" fill="${C.orange}"/>
    <circle cx="440" cy="120" r="24" fill="${C.mustard}"/>
    <circle cx="540" cy="140" r="24" fill="${C.sage}"/>
    <circle cx="330" cy="260" r="26" fill="${C.terracotta}"/>
    <circle cx="430" cy="320" r="22" fill="${C.charcoal}"/>
    <ellipse cx="560" cy="200" rx="26" ry="20" fill="${C.sand}" ${S}/>
    <g ${S}><path d="M690 70 L 600 260"/><path d="M600 260 c -12 20 -30 30 -40 26 c 2 -14 14 -30 30 -36"/></g>
    <path d="M610 240 l -16 34" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/>
    <g fill="${C.orange}" opacity=".9"><circle cx="160" cy="90" r="9"/><circle cx="190" cy="130" r="6"/><circle cx="760" cy="300" r="10"/><circle cx="730" cy="340" r="6"/></g>
    <path d="M110 300 q30 -40 60 0 t60 0" ${S} opacity=".6"/>
    <path d="M740 140 l18 -18 M770 160 l26 -6 M752 108 l4 -26" ${S}/>
  </svg>`,

  paws: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${[[150,330,-20,1],[250,260,-10,.85],[360,300,10,.7],[470,220,0,.55]].map(([x,y,r,o])=>`<g transform="translate(${x} ${y}) rotate(${r})" fill="${C.terracotta}" opacity="${o}"><ellipse cx="0" cy="18" rx="28" ry="23"/><circle cx="-27" cy="-14" r="11"/><circle cx="-9" cy="-28" r="11"/><circle cx="11" cy="-28" r="11"/><circle cx="28" cy="-14" r="11"/></g>`).join('')}
    <g ${S}>
      <path d="M560 300 C 600 280, 660 280, 700 300 C 740 280, 800 280, 840 300 V 150 C 800 130, 740 130, 700 150 C 660 130, 600 130, 560 150 Z" fill="${C.cream}"/>
      <path d="M700 150 V 300"/>
      <path d="M590 180 q 40 -12 80 0 M590 210 q 40 -12 80 0 M590 240 q 40 -12 80 0 M730 180 q 40 -12 80 0 M730 210 q 40 -12 80 0"/>
    </g>
    <path d="M770 240 c 0 -10 14 -14 18 -4 c 4 -10 18 -6 18 4 c 0 14 -18 22 -18 22 s -18 -8 -18 -22z" fill="${C.orange}"/>
    <path d="M620 100 c 0 -14 20 -20 26 -6 c 6 -14 26 -8 26 6 c 0 20 -26 32 -26 32 s -26 -12 -26 -32z" fill="${C.orange}" opacity=".85"/>
  </svg>`,

  nature: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <g ${S}>
      <path d="M210 340 C 200 220, 280 110, 420 90 C 430 230, 350 330, 210 340 z" fill="${C.sage}"/>
      <path d="M210 340 C 270 260, 330 190, 410 105"/>
      <path d="M280 255 l -30 -40 M320 205 l -24 -44 M300 230 l 40 0 M350 170 l 36 6"/>
    </g>
    <g ${S}>
      <circle cx="560" cy="200" r="110" fill="${C.cream}" opacity=".6"/>
      <circle cx="560" cy="200" r="110"/>
      <circle cx="560" cy="200" r="90" stroke-width="2.5" opacity=".5"/>
      <path d="M638 278 L 740 380" stroke-width="22"/>
    </g>
    <g transform="translate(560 200)">
      <ellipse cx="-24" cy="-12" rx="30" ry="22" fill="${C.orange}" transform="rotate(-25 -24 -12)"/>
      <ellipse cx="24" cy="-12" rx="30" ry="22" fill="${C.orange}" transform="rotate(25 24 -12)"/>
      <ellipse cx="-18" cy="20" rx="20" ry="15" fill="${C.mustard}" transform="rotate(20 -18 20)"/>
      <ellipse cx="18" cy="20" rx="20" ry="15" fill="${C.mustard}" transform="rotate(-20 18 20)"/>
      <path d="M0 -30 V 40" stroke="${C.charcoal}" stroke-width="7" stroke-linecap="round"/>
      <path d="M0 -30 q -8 -20 -20 -24 M0 -30 q 8 -20 20 -24" ${S}/>
    </g>
    <g fill="${C.charcoal}" opacity=".5"><circle cx="760" cy="110" r="5"/><circle cx="790" cy="140" r="4"/><circle cx="130" cy="120" r="5"/></g>
  </svg>`,

  lights: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <path d="M30 70 Q 450 230 870 70" ${S}/>
    ${Array.from({length:11},(_,i)=>{const t=(i+0.5)/11;const x=30+840*t;const y=70+2*(1-t)*t*160*2*0.5*2;const col=[C.orange,C.mustard,C.terracotta,C.sage][i%4];return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path d="M0 0 v 14" ${S}/><path d="M-11 14 h22 v 8 h-22z" fill="${C.charcoal}"/><path d="M0 22 c -20 10 -22 40 0 52 c 22 -12 20 -42 0 -52z" fill="${col}"/></g>`}).join('')}
    <path d="M60 230 Q 450 380 840 230" ${S} opacity=".55"/>
    ${Array.from({length:9},(_,i)=>{const t=(i+0.5)/9;const x=60+780*t;const y=230+4*(1-t)*t*75;const col=[C.mustard,C.orange,C.sage][i%3];return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" opacity=".85"><path d="M0 0 v 10" ${S}/><circle cx="0" cy="26" r="15" fill="${col}"/></g>`}).join('')}
    <g ${S} stroke="${C.orange}"><path d="M120 360 v 30 M105 375 h 30"/><path d="M780 365 v 24 M768 377 h 24"/></g>
  </svg>`,

  train: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <g ${S}>
      <path d="M60 350 H 840"/>
      ${Array.from({length:16},(_,i)=>`<path d="M${80+i*48} 350 v 18"/>`).join('')}
      <rect x="430" y="150" width="200" height="150" rx="10" fill="${C.orange}"/>
      <rect x="460" y="175" width="60" height="55" rx="6" fill="${C.cream}"/>
      <rect x="540" y="175" width="60" height="55" rx="6" fill="${C.cream}"/>
      <path d="M410 140 h 240" stroke-width="10"/>
      <rect x="230" y="210" width="200" height="90" rx="12" fill="${C.cream}"/>
      <rect x="270" y="140" width="34" height="70" fill="${C.charcoal}"/>
      <path d="M262 140 h 50"/>
      <circle cx="355" cy="200" r="16" fill="${C.mustard}"/>
      <path d="M230 300 L 190 340 H 240"/>
      <circle cx="300" cy="318" r="28" fill="${C.cream}"/><circle cx="300" cy="318" r="7" fill="${C.charcoal}"/>
      <circle cx="380" cy="318" r="28" fill="${C.cream}"/><circle cx="380" cy="318" r="7" fill="${C.charcoal}"/>
      <circle cx="490" cy="312" r="34" fill="${C.cream}"/><circle cx="490" cy="312" r="8" fill="${C.charcoal}"/>
      <circle cx="580" cy="312" r="34" fill="${C.cream}"/><circle cx="580" cy="312" r="8" fill="${C.charcoal}"/>
      <path d="M300 318 H 580" stroke-width="6"/>
      <rect x="660" y="200" width="160" height="100" rx="10" fill="${C.sage}"/>
      <path d="M630 280 h 30"/>
      <circle cx="700" cy="318" r="22" fill="${C.cream}"/><circle cx="780" cy="318" r="22" fill="${C.cream}"/>
    </g>
    <g fill="${C.cream}" ${S}><circle cx="300" cy="110" r="22"/><circle cx="250" cy="80" r="30"/><circle cx="180" cy="62" r="38"/></g>
  </svg>`,

  calendar: `<svg viewBox="0 0 900 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <g ${S}>
      <rect x="330" y="70" width="240" height="250" rx="22" fill="${C.cream}"/>
      <path d="M330 140 H 570" />
      <rect x="330" y="70" width="240" height="70" rx="22" fill="${C.orange}"/>
      <path d="M390 50 v 40 M510 50 v 40" stroke-width="8"/>
    </g>
    <text x="450" y="118" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="34" letter-spacing="4" fill="${C.cream}">NOV</text>
    <text x="450" y="275" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="120" fill="${C.charcoal}">14</text>
    <path d="M640 120 c 0 -14 20 -20 26 -6 c 6 -14 26 -8 26 6 c 0 20 -26 32 -26 32 s -26 -12 -26 -32z" fill="${C.orange}"/>
    <g ${S}><path d="M200 140 l 30 -30 M190 200 h 40 M200 260 l 30 30"/><path d="M700 220 h 40 M690 280 l 30 30"/></g>
  </svg>`,

  sensory: `<svg viewBox="0 0 300 160" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <g stroke="${C.charcoal}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M90 110 V 80 a 60 60 0 0 1 120 0 V 110"/>
      <rect x="70" y="95" width="34" height="52" rx="12" fill="${C.orange}"/>
      <rect x="196" y="95" width="34" height="52" rx="12" fill="${C.orange}"/>
      <path d="M30 105 q 10 15 0 30 M250 105 q -10 15 0 30" opacity=".5"/>
      <path d="M12 95 q 18 27 0 54 M268 95 q -18 27 0 54" opacity=".3"/>
    </g>
  </svg>`,
};

// ---------- page shell ----------
const noise = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0 0.12  0 0 0 .07 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`;

const css = `
@font-face{font-family:'Archivo';src:url('fonts/archivo.woff2') format('woff2');font-weight:100 900;font-style:normal}
@font-face{font-family:'Fraunces';src:url('fonts/fraunces-italic.woff2') format('woff2');font-weight:100 900;font-style:italic}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;background:${C.cream}}
body{font-family:'Archivo',sans-serif;color:${C.charcoal};-webkit-font-smoothing:antialiased}
.slide{position:relative;width:1080px;height:1350px;overflow:hidden;background:${C.cream};background-image:${noise};padding:64px 72px 0;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:19px;letter-spacing:.2em;text-transform:uppercase;height:40px}
.top .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:${C.orange};margin:0 14px 2px;vertical-align:middle}
.top .num{font-weight:700;opacity:.55}
.handle{position:absolute;left:0;right:0;bottom:46px;text-align:center;font-weight:700;font-size:22px;letter-spacing:.06em;opacity:.75}
.panel{position:relative;flex:1 1 auto;min-height:280px;margin-top:26px;border-radius:30px;background:${C.sand};display:flex;align-items:center;justify-content:center;padding:28px 40px}
.panel.night{background:${C.charcoal}}
.panel svg{max-height:100%}
.badge{position:absolute;right:34px;bottom:-56px;width:178px;height:178px;border-radius:50%;background:${C.orange};color:${C.cream};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:900;line-height:.95;box-shadow:0 0 0 10px ${C.cream};transform:rotate(-6deg)}
.badge .big{font-size:52px;letter-spacing:.01em}
.badge .small{font-size:17px;font-weight:800;letter-spacing:.08em;margin-top:6px;text-transform:uppercase;line-height:1.1}
.body{flex:0 0 auto;padding:34px 0 120px}
.kicker{font-weight:800;font-size:21px;letter-spacing:.22em;color:${C.orange};text-transform:uppercase;margin-bottom:14px}
h1{font-weight:900;font-size:78px;line-height:.94;letter-spacing:-.01em;text-transform:uppercase;max-width:760px}
h1 .o{color:${C.orange}}
.venue{display:flex;align-items:center;gap:12px;margin-top:22px;font-weight:700;font-size:31px}
.venue svg{color:${C.orange};flex:0 0 auto}
.rows{margin-top:24px;display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600}
.row svg{color:${C.charcoal};opacity:.75;flex:0 0 auto}
.row b{font-weight:900}
.row .hl{background:${C.orange};color:${C.cream};padding:2px 14px 4px;border-radius:10px;font-weight:900}
.desc{margin-top:24px;font-size:30px;line-height:1.32;font-weight:500;max-width:900px}
.note{margin-top:22px;display:flex;gap:14px;align-items:flex-start;background:${C.sand};border-radius:18px;padding:18px 22px;font-size:24px;line-height:1.35;font-weight:600}
.note svg{flex:0 0 auto;color:${C.orange};margin-top:1px}
.note.warn{background:#F6DCCF;border:2.5px dashed ${C.orange}}
.serif{font-family:'Fraunces',serif;font-style:italic;font-weight:400}
`;

function shell(n, inner, extraClass = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div class="slide ${extraClass}">
    <div class="top"><span>This weekend with the kids<span class="dot"></span>Nov 7–8</span><span class="num">${String(n).padStart(2,'0')} / ${TOTAL}</span></div>
    ${inner}
    <div class="handle">@taligal.parenting</div>
  </div></body></html>`;
}

function badge(big, small = '') {
  return `<div class="badge"><div class="big">${big}</div>${small ? `<div class="small">${small}</div>` : ''}</div>`;
}

function event(n, o) {
  const rows = o.rows.map(([icon, html]) => `<div class="row">${ic[icon]}<span>${html}</span></div>`).join('');
  const note = o.note ? `<div class="note ${o.warn ? 'warn' : ''}">${o.warn ? ic.flag : ic.info}<span>${o.note}</span></div>` : '';
  return shell(n, `
    <div class="panel ${o.night ? 'night' : ''}">${art[o.art]}${badge(o.badge, o.badgeSmall)}</div>
    <div class="body">
      <div class="kicker">${o.kicker}</div>
      <h1>${o.title}</h1>
      <div class="venue">${ic.pin}<span>${o.venue}</span></div>
      <div class="rows">${rows}</div>
      <div class="desc">${o.desc}</div>
      ${note}
    </div>`);
}

// ---------- slides ----------
const slides = [];

// 1 — Cover (matches the "This Weekend With the Kids" series cover)
slides.push(`<!doctype html><html><head><meta charset="utf-8"><style>${css}
  .cv{align-items:center;text-align:center;padding:96px 72px 0}
  .t1{font-weight:900;font-size:112px;line-height:.9;letter-spacing:-.01em;text-transform:uppercase;white-space:nowrap}
  .rib{margin-top:20px;background:${C.orange};color:#fff;font-weight:900;font-size:84px;line-height:1;text-transform:uppercase;padding:14px 40px 20px;border-radius:14px;transform:rotate(-2.5deg);box-shadow:0 10px 0 ${C.terracotta}}
  .pill{margin-top:44px;background:${C.charcoal};color:${C.cream};font-weight:800;font-size:32px;padding:12px 30px 14px;border-radius:999px}
  .cvart{margin-top:40px;width:100%;flex:1 1 auto;min-height:200px;display:flex;align-items:center;justify-content:center}
  .cvart svg{width:auto;height:100%;max-width:100%;aspect-ratio:900/420;overflow:hidden}
  .cd{font-size:31px;line-height:1.3;font-weight:600;max-width:820px;margin-bottom:22px}
  .tags{display:flex;gap:12px;justify-content:center;margin-bottom:130px;flex-wrap:wrap}
  .tags span{border:2.5px solid ${C.charcoal};border-radius:999px;padding:6px 18px 8px;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
  .tags span.o{background:${C.orange};border-color:${C.orange};color:#fff}
  .swipe{position:absolute;right:72px;bottom:44px;display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:${C.orange}}
</style></head><body>
<div class="slide cv">
  <div class="t1">This weekend</div>
  <div class="rib">With the kids</div>
  <div class="pill">South Florida · Nov 7 – 8</div>
  <div class="cvart">${art.cover}</div>
  <div class="cd">Fun family events, unique experiences &amp; sensory-friendly activities!</div>
  <div class="tags"><span>Free picks</span><span>Drone show</span><span class="o">Sensory-friendly</span></div>
  <div class="handle">@taligal.parenting</div>
  <div class="swipe">Swipe <svg width="36" height="18" viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h34M28 3l8 7-8 7"/></svg></div>
</div></body></html>`);

// 2 — Drone show
slides.push(event(2, {
  art: 'drone', night: true, badge: 'FREE',
  kicker: 'Beach night',
  title: 'Drone Show <span class="o">Extravaganza</span>',
  venue: 'Fisher Family Pier · Pompano Beach',
  rows: [
    ['cal', '<b>Saturday, November 7</b>'],
    ['clock', '5:30–9:00 PM &nbsp;·&nbsp; <span class="hl">Drones at 7:00 PM</span>'],
  ],
  desc: 'A beautiful illuminated drone show above the beach! Live music starts at 5:30.',
  note: 'Free shuttle from Pompano Community Park. Watch from the south side of the pier.',
}));

// 3 — Children's Festival of the Arts
slides.push(event(3, {
  art: 'arts', badge: '$5', badgeSmall: 'museum<br>admission',
  kicker: 'Art & creativity',
  title: 'Children’s Festival <span class="o">of the Arts</span>',
  venue: 'Young At Art Museum · Davie',
  rows: [
    ['cal', '<b>Saturday &amp; Sunday</b>, Nov 7–8'],
    ['clock', '12:00–4:00 PM'],
  ],
  desc: 'Young artists (grades K–12) show and sell their own art. Then explore the whole museum!',
  note: 'Museum admission is only $5 during the festival.',
}));

// 4 — Paws & Play
slides.push(event(4, {
  art: 'paws', badge: '$20', badgeSmall: 'Florida<br>residents',
  kicker: 'Animals & stories',
  title: 'Paws &amp; Play <span class="o">Weekend</span>',
  venue: 'Miami Children’s Museum',
  rows: [
    ['cal', '<b>Saturday &amp; Sunday</b>, Nov 7–8'],
    ['clock', 'Museum open 10:00 AM–6:00 PM'],
  ],
  desc: 'Pet-themed fun, storytime, crafts, and adoptable pets from Miami-Dade Animal Services.',
  note: 'Please check the date before you go. One museum page also lists this for Nov 14. Bring a Florida ID for the $20 price.',
  warn: true,
}));

// 5 — Nature Detectives
slides.push(event(5, {
  art: 'nature', badge: 'INCL.', badgeSmall: 'with museum<br>admission',
  kicker: 'Science & nature',
  title: 'Nature <span class="o">Detectives</span>',
  venue: 'Museum of Discovery and Science · Fort Lauderdale',
  rows: [
    ['cal', '<b>Saturday &amp; Sunday</b>, Nov 7–8'],
    ['ticket', 'Included with museum admission'],
  ],
  desc: 'Explore nature, science, and hands-on activities about animals, habitats, and patterns.',
  note: 'Bank of America cardholders: free general admission this weekend with Museums on Us.',
}));

// 6 — Diwali
slides.push(event(6, {
  art: 'lights', badge: 'FREE',
  kicker: 'Culture & community',
  title: 'Diwali: Festival <span class="o">of Lights</span>',
  venue: 'Lauderhill Central Park Library',
  rows: [
    ['cal', '<b>Saturday, November 7</b>'],
    ['clock', '3:30–5:30 PM'],
  ],
  desc: 'A colorful cultural celebration for the whole family!',
  note: 'Hosted by the Friends of the Library. Registration may be needed. Check the Broward County Library calendar.',
}));

// 7 — Gold Coast Railroad Museum
slides.push(event(7, {
  art: 'train', badge: 'FREE', badgeSmall: 'admission',
  kicker: 'All aboard',
  title: 'Free Railroad <span class="o">Museum Day</span>',
  venue: 'Gold Coast Railroad Museum · Miami',
  rows: [
    ['cal', '<b>Saturday, November 7</b>'],
    ['clock', '10:00 AM–4:00 PM'],
  ],
  desc: 'Explore historic trains and enjoy a fun family outing.',
  note: 'It’s their Free First Saturday. Train rides and food cost extra.',
}));

// 8 — Special needs & sensory-friendly (dedicated design)
slides.push(shell(8, `
  <style>
    .sn-head{margin-top:26px;background:${C.charcoal};color:${C.cream};border-radius:30px;padding:34px 40px 32px;display:flex;gap:26px;align-items:center}
    .sn-head .ico{flex:0 0 180px;height:100px;background:${C.cream};border-radius:22px;padding:8px}
    .sn-head .k{font-weight:800;font-size:20px;letter-spacing:.22em;color:${C.orange};text-transform:uppercase}
    .sn-head h1{font-size:60px;max-width:none;margin-top:8px;line-height:.96}
    .sn-head h1 .o{color:${C.orange}}
    .sn-intro{margin:30px 4px 0;font-size:31px;font-weight:600;line-height:1.3}
    .cards{margin-top:26px;display:flex;flex-direction:column;gap:22px}
    .card{background:#fff;border-radius:26px;padding:34px 34px;border:3px solid ${C.sandDeep};position:relative}
    .card .tag{position:absolute;right:26px;top:24px;background:${C.orange};color:${C.cream};font-weight:900;font-size:30px;padding:6px 18px 8px;border-radius:14px}
    .card h2{font-weight:900;font-size:46px;text-transform:uppercase;line-height:1;max-width:690px}
    .card .v{margin-top:14px;font-size:29px;font-weight:700;display:flex;align-items:center;gap:10px}
    .card .v svg{color:${C.orange}}
    .card .w{margin-top:12px;font-size:32px;font-weight:600}
    .card .w b{font-weight:900}
    .card .g{margin-top:16px;display:flex;gap:10px;align-items:center;font-size:25px;font-weight:700;color:#3d5a36}
    .card .g svg{color:#5d7a52}
    .card .g.r{color:#8a3b1f}.card .g.r svg{color:${C.orange}}
    .care{margin-top:28px;display:flex;gap:14px;align-items:flex-start;font-size:27px;line-height:1.38;font-weight:600;padding:0 6px}
    .care svg{flex:0 0 auto;color:${C.orange};margin-top:-4px}
  </style>
  <div class="sn-head">
    <div class="ico">${art.sensory}</div>
    <div><div class="k">Inclusive weekend</div><h1>Special needs &amp; <span class="o">sensory&#8209;friendly</span></h1></div>
  </div>
  <div class="sn-intro">Calmer spaces. Gentler mornings. Made with our kids in mind.</div>
  <div class="cards">
    <div class="card">
      <div class="tag">$5</div>
      <h2>Sensory Saturdays</h2>
      <div class="v">${ic.pin}Cox Science Center &amp; Aquarium · West Palm Beach</div>
      <div class="w"><b>Sat, Nov 7</b> &nbsp;·&nbsp; 9:00–10:00 AM</div>
      <div class="g">${ic.check}No pre-registration needed · Sensory kits on request</div>
    </div>
    <div class="card">
      <div class="tag">FREE</div>
      <h2>Sensory-Friendly Museum Time</h2>
      <div class="v">${ic.pin}The Museum of Miami · Downtown Miami</div>
      <div class="w"><b>Sat, Nov 7</b> &nbsp;·&nbsp; 10:00 AM–12:00 PM</div>
      <div class="g r">${ic.flag}Advance registration required</div>
    </div>
  </div>
  <div class="care">${ic.heart}<span>Every child is different. Call ahead to ask what to expect, and choose what feels right for your child.</span></div>
`));

// 9 — Coming next weekend
slides.push(shell(9, `
  <style>
    .nx-art{margin-top:26px;height:420px;border-radius:30px;background:${C.sand};display:flex;align-items:center;justify-content:center;padding:20px}
    .nx-art svg{height:100%}
    .nx .kicker{margin-top:38px}
    .nx h1{font-size:84px}
    .ncard{margin-top:28px;background:#fff;border:3px solid ${C.sandDeep};border-radius:26px;padding:28px 32px;position:relative}
    .ncard .tag{position:absolute;right:28px;top:26px;background:${C.orange};color:${C.cream};font-weight:900;font-size:30px;padding:6px 18px 8px;border-radius:14px}
    .ncard h2{font-weight:900;font-size:44px;text-transform:uppercase;line-height:1;max-width:640px}
    .ncard .v{margin-top:12px;font-size:28px;font-weight:700;display:flex;gap:10px;align-items:center}
    .ncard .v svg{color:${C.orange}}
    .ncard .w{margin-top:10px;font-size:29px;font-weight:600}
    .ncard .w b{font-weight:900}
    .ncard .g{margin-top:12px;display:flex;gap:10px;align-items:center;font-size:24px;font-weight:700;color:#8a3b1f}
    .ncard .g svg{color:${C.orange}}
    .also{margin-top:26px;font-size:28px;font-weight:600;line-height:1.35;padding:0 4px}
    .also b{font-weight:900}
  </style>
  <div class="nx-art">${art.calendar}</div>
  <div class="nx">
    <div class="kicker">Plan ahead</div>
    <h1>Coming <span class="o">next weekend</span></h1>
    <div class="ncard">
      <div class="tag">FREE</div>
      <h2>Sensory-Friendly Saturday</h2>
      <div class="v">${ic.pin}Miami Children’s Museum</div>
      <div class="w"><b>Sat, Nov 14</b> &nbsp;·&nbsp; 9:00–11:00 AM</div>
      <div class="g">${ic.flag}Free with advance RSVP · Register by Fri, Nov 13, 5 PM</div>
    </div>
    <div class="also"><b>Also:</b> Nature Detectives continues at the Museum of Discovery and Science on weekends in November.</div>
  </div>
`));

// 10 — Final
slides.push(shell(10, `
  <style>
    .fin{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:120px}
    .q{font-weight:900;font-size:80px;line-height:1;text-transform:uppercase;letter-spacing:-.01em}
    .q .o{color:${C.orange}}
    .qbar{width:90px;height:6px;background:${C.orange};border-radius:3px;margin:0 0 40px}
    .acts{margin-top:56px;display:flex;flex-direction:column;gap:18px}
    .act{display:flex;align-items:center;gap:24px;background:${C.sand};border-radius:24px;padding:22px 28px;font-size:31px;font-weight:700;line-height:1.25}
    .act .i{flex:0 0 80px;height:80px;border-radius:50%;background:${C.orange};color:${C.cream};display:flex;align-items:center;justify-content:center}
    .act.dark{background:${C.charcoal};color:${C.cream}}
    .act.dark b{color:${C.orange}}
    .disc{margin-top:30px;font-size:22px;font-weight:600;opacity:.7;line-height:1.35}
  </style>
  <div class="fin">
    <div class="qbar"></div>
    <div class="q">Every child deserves a weekend filled with <span class="o">fun, connection, and belonging.</span></div>
    <div class="acts">
      <div class="act"><div class="i">${ic.bookmark}</div><span>Save this post for the weekend!</span></div>
      <div class="act"><div class="i">${ic.send}</div><span>Share it with another South Florida parent.</span></div>
      <div class="act dark"><div class="i">${ic.heart}</div><span>Follow <b>@taligal.parenting</b> for weekly family activities, parenting tips, and inclusive experiences.</span></div>
    </div>
    <div class="disc">Details can change. Please check each event’s website before you go.</div>
  </div>
`));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (let i = 0; i < slides.length; i++) {
    const html = path.join(DIR, `.slide-${i + 1}.html`);
    fs.writeFileSync(html, slides[i]);
    await page.goto('file://' + html);
    await page.evaluate(() => document.fonts.ready);
    // overflow check: content must end above the handle
    const over = await page.evaluate(() => {
      const s = document.querySelector('.slide');
      return s.scrollHeight > 1350;
    });
    if (over) console.warn(`WARNING: slide ${i + 1} overflows`);
    await page.screenshot({ path: path.join(OUT, `${String(i + 1).padStart(2, '0')}.png`) });
    fs.unlinkSync(html);
  }
  await browser.close();
  console.log(`Rendered ${slides.length} slides to ${OUT}`);
})();
