# Generates assets/img/jar.svg: 20 L jar with the real NAYRA label wrapped on it.
# Usage: python3 scripts/make-jar.py /tmp/label-front.webp assets/img/jar.svg   (label crop: see make-bottle.py)
import base64, math, sys
lbl = base64.b64encode(open(sys.argv[1], 'rb').read()).decode()
LW, LH = 525, 306
cx, R = 130, 104                 # jar centre / radius
A = math.radians(52)             # label covers ±52° of the front
lh = round(2 * A * R * LH / LW)  # keep the label's true proportions
ly = 222 - lh // 2
N, strips = 30, []
xmax = R * math.sin(A)
for i in range(N):
    x0 = -xmax + 2 * xmax * i / N; x1 = -xmax + 2 * xmax * (i + 1) / N
    s = lambda x: (math.asin(x / R) / A + 1) / 2 * LW
    s0, s1 = s(x0), s(x1); sx = (x1 - x0) / (s1 - s0); sy = lh / LH
    strips.append(f'<clipPath id="c{i}"><rect x="{cx+x0-0.15:.3f}" y="{ly}" width="{x1-x0+0.3:.3f}" height="{lh}"/></clipPath>'
                  f'<g clip-path="url(#c{i})"><use href="#lbl" transform="translate({cx+x0-s0*sx:.3f} {ly}) scale({sx:.5f} {sy:.5f})"/></g>')
body = "M111 39h38v14c0 10 26 16 50 30 20 12 35 26 35 52v180c0 24-16 38-40 38H66c-24 0-40-14-40-38V135c0-26 15-40 35-52 24-14 50-20 50-30z"
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 372">
<title>NAYRA 20 litre water jar</title>
<defs>
  <image id="lbl" width="{LW}" height="{LH}" preserveAspectRatio="none" href="data:image/webp;base64,{lbl}"/>
  <clipPath id="body"><path d="{body}"/></clipPath>
  <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stop-color="#8fcaf2" stop-opacity=".9"/><stop offset=".2" stop-color="#e3f4ff" stop-opacity=".6"/><stop offset=".5" stop-color="#f4fbff" stop-opacity=".4"/><stop offset=".82" stop-color="#cdeaff" stop-opacity=".6"/><stop offset="1" stop-color="#6fb6e8" stop-opacity=".95"/></linearGradient>
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".45"/><stop offset="1" stop-color="#4fa8ea" stop-opacity=".6"/></linearGradient>
  <linearGradient id="band" x1="0" x2="1"><stop offset="0" stop-color="#0d1f5c"/><stop offset=".5" stop-color="#2140a8"/><stop offset="1" stop-color="#0d1f5c"/></linearGradient>
  <linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="#03113a" stop-opacity=".55"/><stop offset=".15" stop-color="#03113a" stop-opacity=".12"/><stop offset=".33" stop-color="#fff" stop-opacity="0"/><stop offset=".38" stop-color="#fff" stop-opacity=".2"/><stop offset=".44" stop-color="#fff" stop-opacity="0"/><stop offset=".82" stop-color="#03113a" stop-opacity=".1"/><stop offset="1" stop-color="#03113a" stop-opacity=".6"/></linearGradient>
  <linearGradient id="cap" x1="0" x2="1"><stop offset="0" stop-color="#0f1f55"/><stop offset=".3" stop-color="#3554b8"/><stop offset=".55" stop-color="#1E3A8A"/><stop offset="1" stop-color="#0c1a48"/></linearGradient>
  <linearGradient id="ring" x1="0" x2="1"><stop offset="0" stop-color="#b85a0a"/><stop offset=".35" stop-color="#ffb066"/><stop offset=".6" stop-color="#F58220"/><stop offset="1" stop-color="#a84f06"/></linearGradient>
  <radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="130" cy="358" rx="110" ry="10" fill="url(#shadow)"/>
<rect x="104" y="6" width="52" height="26" rx="6" fill="url(#cap)"/>
<rect x="106" y="7" width="48" height="3" rx="1.5" fill="#fff" opacity=".25"/>
<rect x="98" y="30" width="64" height="9" rx="3" fill="url(#ring)"/>
<path d="{body}" fill="url(#glass)" stroke="#8cc8ee" stroke-width="1.5"/>
<g clip-path="url(#body)">
  <rect x="0" y="70" width="260" height="300" fill="url(#water)"/>
  <g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"><path d="M20 140h220M20 302h220M20 318h220"/></g>
  <rect x="{cx-R}" y="{ly}" width="{2*R}" height="{lh}" fill="url(#band)"/>
  {''.join(strips)}
  <rect x="{cx-R}" y="{ly}" width="{2*R}" height="{lh}" fill="url(#shade)"/>
</g>
<path d="M50 140c-6 50-6 120 0 176" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".5" fill="none"/>
<path d="M214 150c4 50 4 110 0 150" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35" fill="none"/>
</svg>'''
open(sys.argv[2], 'w').write(svg)
