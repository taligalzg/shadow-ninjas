#!/bin/bash
# Finds single broken frames in out/seq (renderer glitches) and re-renders them until the scan is clean.
scan(){ ffmpeg -hide_banner -framerate 30 -i out/seq/element-%04d.jpeg -vf "select='gte(scene,0)',metadata=print:file=-" -f null - 2>/dev/null | grep -E "^frame:|scene_score" | paste - - | awk '{split($1,a,":"); split($NF,b,"="); if (b[2]>0.1) print a[2]}'; }
for pass in 1 2 3 4 5 6; do
  bad=$(scan); echo "pass $pass bad: $(echo $bad)"
  [ -z "$bad" ] && exit 0
  for n in $bad; do
    npx remotion still src/index.ts Episode1 out/seq/element-$(printf %04d $n).jpeg --frame=$n --image-format=jpeg --jpeg-quality=96 >/dev/null 2>&1
  done
done
exit 1
