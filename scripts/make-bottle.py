# Generates assets/img/nayra-bottle.svg: the real NAYRA label wrapped onto a 3D bottle.
# Usage: cwebp -q 85 -crop 758 0 525 306 assets/img/label-wide.jpg -o /tmp/label-front.webp
#        python3 scripts/make-bottle.py /tmp/label-front.webp assets/img/nayra-bottle.svg
import base64, math, sys
lbl = base64.b64encode(open(sys.argv[1],'rb').read()).decode()
out = sys.argv[2]
LW, LH = 525, 306          # cropped label pixels (≈ front half of the wrap)
cx, R = 100, 62            # bottle centre / body radius (svg units)
ly, lh = 252, 118           # label top / height
N = 28
strips = []
for i in range(N):
    x0 = -R + 2*R*i/N; x1 = -R + 2*R*(i+1)/N
    # screen x -> angle -> position along label arc (cylindrical projection)
    s = lambda x: (math.asin(max(-1,min(1,x/R))) / (math.pi/2) + 1) / 2 * LW
    s0, s1 = s(x0), s(x1)
    sx = (x1-x0)/(s1-s0); sy = lh/LH
    tx = cx + x0 - s0*sx
    strips.append(f'<clipPath id="c{i}"><rect x="{cx+x0-0.15:.3f}" y="{ly}" width="{x1-x0+0.3:.3f}" height="{lh}"/></clipPath>'
                  f'<g clip-path="url(#c{i})"><use href="#lbl" transform="translate({tx:.3f} {ly}) scale({sx:.5f} {sy:.5f})"/></g>')
body = "M85 59h30v49c0 18 46 38 46 84v318c0 14-10 24-24 26-10 1.5-18 2-38 2s-28-.5-38-2c-14-2-24-12-24-26V192c0-46 46-66 46-84z"
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 580">
<title>NAYRA Pure Packaged Drinking Water bottle</title>
<defs>
  <image id="lbl" width="{LW}" height="{LH}" preserveAspectRatio="none" href="data:image/webp;base64,{lbl}"/>
  <clipPath id="body"><path d="{body}"/></clipPath>
  <linearGradient id="glass" x1="0" x2="1">
    <stop offset="0" stop-color="#9fd3f5" stop-opacity=".85"/>
    <stop offset=".18" stop-color="#e3f4ff" stop-opacity=".55"/>
    <stop offset=".5" stop-color="#f4fbff" stop-opacity=".35"/>
    <stop offset=".82" stop-color="#cdeaff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#7fc0ec" stop-opacity=".9"/>
  </linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#bfe6ff" stop-opacity=".45"/>
    <stop offset="1" stop-color="#5fb4ee" stop-opacity=".55"/>
  </linearGradient>
  <linearGradient id="shade" x1="0" x2="1">
    <stop offset="0" stop-color="#03113a" stop-opacity=".55"/>
    <stop offset=".14" stop-color="#03113a" stop-opacity=".12"/>
    <stop offset=".3" stop-color="#fff" stop-opacity=".0"/>
    <stop offset=".36" stop-color="#fff" stop-opacity=".22"/>
    <stop offset=".42" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".8" stop-color="#03113a" stop-opacity=".1"/>
    <stop offset="1" stop-color="#03113a" stop-opacity=".6"/>
  </linearGradient>
  <linearGradient id="cap" x1="0" x2="1">
    <stop offset="0" stop-color="#0f1f55"/><stop offset=".3" stop-color="#3554b8"/>
    <stop offset=".55" stop-color="#1E3A8A"/><stop offset="1" stop-color="#0c1a48"/>
  </linearGradient>
  <linearGradient id="ring" x1="0" x2="1">
    <stop offset="0" stop-color="#b85a0a"/><stop offset=".35" stop-color="#ffb066"/>
    <stop offset=".6" stop-color="#F58220"/><stop offset="1" stop-color="#a84f06"/>
  </linearGradient>
  <pattern id="ribs" width="3.2" height="10" patternUnits="userSpaceOnUse"><rect width="1.3" height="10" fill="#000" opacity=".22"/></pattern>
  <radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="100" cy="562" rx="74" ry="9" fill="url(#shadow)"/>
<!-- cap -->
<rect x="78" y="10" width="44" height="40" rx="5" fill="url(#cap)"/>
<rect x="78" y="10" width="44" height="40" rx="5" fill="url(#ribs)"/>
<rect x="80" y="11" width="40" height="3" rx="1.5" fill="#fff" opacity=".25"/>
<rect x="72" y="50" width="56" height="9" rx="3" fill="url(#ring)"/>
<!-- glass + water -->
<path d="{body}" fill="url(#glass)" stroke="#8cc8ee" stroke-width="1.2"/>
<g clip-path="url(#body)">
  <rect x="0" y="150" width="200" height="420" fill="url(#water)"/>
  <path d="M30 150q35 -6 70 0t70 0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/>
  <!-- ridges -->
  <g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4"><path d="M38 200h124M38 212h124M38 456h124M38 468h124"/></g>
  <g fill="none" stroke="#3d8fd0" stroke-opacity=".25" stroke-width="1.2"><path d="M38 203h124M38 215h124M38 459h124M38 471h124"/></g>
  <!-- wrapped label -->
  {''.join(strips)}
  <rect x="{cx-R}" y="{ly}" width="{2*R}" height="{lh}" fill="url(#shade)"/>
  <rect x="{cx-R}" y="{ly}" width="{2*R}" height="1.2" fill="#fff" opacity=".5"/>
  <rect x="{cx-R}" y="{ly+lh-1.2}" width="{2*R}" height="1.2" fill="#000" opacity=".25"/>
</g>
<!-- neck threads -->
<g stroke="#9fd3f5" stroke-width="1.5" opacity=".9"><path d="M86 66h28M86 72h28"/></g>
<!-- specular highlights -->
<path d="M62 190c-8 70-8 230 0 300" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55" fill="none"/>
<path d="M72 196c-3 60-3 200 0 280" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5" fill="none"/>
<path d="M146 210c4 60 4 200 0 260" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".35" fill="none"/>
<path d="M90 112c-14 12-30 26-34 50" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55" fill="none"/>
</svg>'''
open(out,'w').write(svg)
print(len(svg))
