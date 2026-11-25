"""Original score for 'What They Grow Up Believing' Ep.1 — synthesized from scratch (no samples, no third-party audio)."""
import numpy as np, wave
SR=44100; DUR=45.0; N=int(SR*DUR)
out=np.zeros(N)
pad=np.zeros(N)
def hz(m): return 440*2**((m-69)/12)
def piano(m,t0,vel=0.5,length=5.0):
    n=int(SR*length); t=np.arange(n)/SR; f=hz(m); y=np.zeros(n)
    for k in range(1,9):
        fk=f*k*(1+0.0004*k*k)
        if fk>9000: break
        y+= (1/k**1.5)*np.exp(-t*(0.9+0.55*k)*(1+m/140))*np.sin(2*np.pi*fk*t)
    y*=np.minimum(1,t/0.012)
    i=int(t0*SR); j=min(N,i+n)
    if i<N: out[i:j]+=vel*y[:j-i]
def strings(ms,t0,t1,vel=0.1,att=1.8,rel=2.0):
    n=int(SR*(t1-t0+rel)); t=np.arange(n)/SR; y=np.zeros(n)
    for m in ms:
        for d in (-0.06,0.05,0.0):
            f=hz(m+d)
            y+=np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*2*f*t)+0.12*np.sin(2*np.pi*3*f*t)
    env=np.minimum(1,t/att)*np.minimum(1,np.maximum(0,(t1-t0+rel-t)/rel))
    y*=env*(1+0.06*np.sin(2*np.pi*0.23*t))
    i=int(t0*SR); j=min(N,i+n)
    pad[i:j]+=vel*y[:j-i]/len(ms)
# --- Part A: heavy, sparse, A minor (0-19s) ---
A=[ (0.3,[45,52,57],[76]), (4.0,[41,48,57],[72]), (8.0,[38,50,53],[74,69]), (12.0,[40,47,56],[71]), (15.6,[45,52,60],[72,69]) ]
for t0,ch,mel in A:
    for i,m in enumerate(ch): piano(m,t0+i*0.42,0.34,6)
    for i,m in enumerate(mel): piano(m,t0+1.5+i*1.0,0.42,5)
strings([45,57,60],0.5,8,0.06); strings([41,53,57],4,12,0.06); strings([38,50,53],8,15.5,0.06); strings([45,52,57],13,18.6,0.07,rel=0.8)
# --- rewind (19-22): reversed swell, breath, one clear note ---
sw=np.zeros(int(SR*1.3)); t=np.arange(len(sw))/SR
for m in (57,60,64,69): sw+=np.exp(-t*2.2)*np.sin(2*np.pi*hz(m)*t)
sw=sw[::-1]*0.16
i=int(18.95*SR); out[i:i+len(sw)]+=sw
piano(76,20.6,0.36,5); piano(79,21.3,0.3,5)
# --- Part B: warmth arrives, C major (22-40) ---
prog=[[48,55,64],[43,55,62],[45,57,64],[41,53,60],[48,55,64],[43,55,62],[41,53,60],[43,55,62]]
mel =[79,76,77,74, 79,81,84,83, 84,81,79,76, 77,79,81,79, 84,83,84,86, 88,86,84,83, 81,84,86,88, 86,84,83,86]
step=18.0/8
for c,ch in enumerate(prog):
    t0=22+c*step; g=0.30+0.03*c
    piano(ch[0]-12,t0,g*0.9,6); piano(ch[0],t0,g*0.7,6)
    arp=[ch[0],ch[1],ch[2],ch[1]+12,ch[2],ch[1],ch[2],ch[1]+12]
    for i,m in enumerate(arp): piano(m+12 if c>=4 else m,t0+i*step/8,g*0.55,4)
    for i in range(4): piano(mel[c*4+i],t0+i*step/4,g*1.05,5)
    strings([ch[0],ch[1],ch[2],ch[2]+12],t0,t0+step,0.07+0.012*c,att=1.0,rel=1.6)
# --- end card: resolve (40-45) ---
for i,m in enumerate([36,48,55,60,64,72,76]): piano(m,40.0+i*0.09,0.42,6)
piano(79,41.6,0.3,5); piano(84,42.6,0.26,5)
strings([48,55,60,64],40,43,0.11,att=0.8,rel=2.0)
x=out+pad
# gentle low-pass (one-pole, zero-phase-ish) for a felt-piano warmth
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.empty_like(x); z=0.0
    for i in range(len(x)): z=(1-a)*x[i]+a*z; y[i]=z
    return y
x=0.45*x+0.55*lp(x,2600)
# reverb: convolution with decaying noise
rng=np.random.default_rng(4)
def ir(seed):
    r=np.random.default_rng(seed); n=int(SR*2.6); t=np.arange(n)/SR
    return r.standard_normal(n)*np.exp(-t*2.4)*np.minimum(1,t/0.02)
def conv(a,b):
    n=len(a)+len(b)-1; m=1<<(n-1).bit_length()
    return np.fft.irfft(np.fft.rfft(a,m)*np.fft.rfft(b,m),m)[:len(a)]
L=x+0.022*conv(x,ir(1)); R=x+0.022*conv(x,ir(2))
st=np.stack([L,R],1)
t=np.arange(N)/SR
fade=np.minimum(1,t/0.4)*np.minimum(1,np.maximum(0,(DUR-t)/2.2))
st*=fade[:,None]
st=np.tanh(st/np.max(np.abs(st))*1.15)*0.82
w=wave.open('public/music.wav','w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype('<i2').tobytes()); w.close()
print('ok',np.max(np.abs(st)))
