#!/usr/bin/env bash
# Builds reel/weekend-with-the-kids-nov7-8.mp4 from reel/frames/*.png
# Silent (Tali adds music in the Instagram app). 1080x1920, 30 fps.
set -euo pipefail
cd "$(dirname "$0")"
D=(2.6 4 4 4.5 4 4 4 6.5 4.5 4.5)   # seconds each slide is on screen
F=0.35                                # soft cross-fade
args=(); for i in $(seq 1 10); do args+=(-loop 1 -t "${D[$((i-1))]}" -i "frames/$(printf %02d $i).png"); done
filter=""; prev="[0:v]"; off=0
for i in $(seq 1 9); do
  off=$(python3 -c "print(round($off + ${D[$((i-1))]} - $F, 3))")
  out="[v$i]"; [ $i -eq 9 ] && out="[vout]"
  filter+="${prev}[$i:v]xfade=transition=fade:duration=$F:offset=$off${out};"
  prev="[v$i]"
done
total=$(python3 -c "print(round(sum([$(IFS=,; echo "${D[*]}")]) - 9*$F, 2))")
ffmpeg -y -loglevel error "${args[@]}" -f lavfi -t "$total" -i anullsrc=r=44100:cl=stereo \
  -filter_complex "${filter%;}" -map "[vout]" -map 10:a \
  -r 30 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -movflags +faststart \
  weekend-with-the-kids-nov7-8.mp4
cp frames/01.png reel-cover.png
echo "Done: ${total}s"
