export default function decorate(block) {
  const rows = [...block.children];
  const phases = rows.map((row) => {
    const cols = [...row.children];
    return {
      name: cols[0]?.textContent.trim(),
      tagline: cols[1]?.textContent.trim(),
      features: cols[2] ? cols[2] : null,
    };
  });

  block.textContent = '';

  // Phase colors for each quadrant
  const colors = ['#8888d8', '#8860cc', '#30b0b8', '#48c8a8'];

  // SVG geometry
  const S = 400;
  const cx = S / 2;
  const cy = S / 2;
  const outerR = 160;
  const innerR = 100;
  const textR = 133;
  const orbitR = 190;

  function toXY(deg, radius) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  }

  function donutArc(startDeg, endDeg) {
    const [sx, sy] = toXY(startDeg, outerR);
    const [ex, ey] = toXY(endDeg, outerR);
    const [ix, iy] = toXY(endDeg, innerR);
    const [jx, jy] = toXY(startDeg, innerR);
    return `M${sx},${sy} A${outerR},${outerR} 0 0,1 ${ex},${ey} L${ix},${iy} A${innerR},${innerR} 0 0,0 ${jx},${jy} Z`;
  }

  function textArcPath(startDeg, endDeg) {
    const [sx, sy] = toXY(startDeg, textR);
    const [ex, ey] = toXY(endDeg, textR);
    return `M${sx},${sy} A${textR},${textR} 0 0,1 ${ex},${ey}`;
  }

  // Quadrant angles (clockwise from top)
  const quads = [[0, 90], [90, 180], [180, 270], [270, 360]];

  // Corner brackets
  const bLen = 16;
  const brackets = [
    `M${cx + orbitR - bLen},${cy - orbitR} L${cx + orbitR},${cy - orbitR} L${cx + orbitR},${cy - orbitR + bLen}`,
    `M${cx + orbitR},${cy + orbitR - bLen} L${cx + orbitR},${cy + orbitR} L${cx + orbitR - bLen},${cy + orbitR}`,
    `M${cx - orbitR + bLen},${cy + orbitR} L${cx - orbitR},${cy + orbitR} L${cx - orbitR},${cy + orbitR - bLen}`,
    `M${cx - orbitR},${cy - orbitR + bLen} L${cx - orbitR},${cy - orbitR} L${cx - orbitR + bLen},${cy - orbitR}`,
  ];

  // Divider endpoints (between quadrants)
  const dividerAngles = [0, 90, 180, 270];

  // Build SVG markup
  let svg = '';

  // Orbit circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${orbitR}" class="lw-orbit" />`;

  // Corner brackets
  brackets.forEach((d) => { svg += `<path d="${d}" class="lw-bracket" />`; });

  // Donut arcs
  quads.forEach(([s, e], i) => {
    svg += `<path d="${donutArc(s, e)}" class="lw-arc lw-arc-${i}" data-phase="${i}" fill="${colors[i]}" />`;
  });

  // Divider lines between quadrants
  dividerAngles.forEach((deg) => {
    const [x1, y1] = toXY(deg, outerR);
    const [x2, y2] = toXY(deg, innerR);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="lw-divider" />`;
  });

  // Center background circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${innerR}" class="lw-center-bg" />`;

  // Text path definitions
  svg += '<defs>';
  quads.forEach(([s, e], i) => {
    svg += `<path id="lwtp${i}" d="${textArcPath(s + 8, e - 8)}" />`;
  });
  svg += '</defs>';

  // Curved text labels
  phases.forEach((phase, i) => {
    svg += `<text class="lw-arc-label"><textPath href="#lwtp${i}" startOffset="50%" text-anchor="middle">${phase.name.toUpperCase()}</textPath></text>`;
  });

  // Create SVG element
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('viewBox', `0 0 ${S} ${S}`);
  svgEl.setAttribute('class', 'lw-svg');
  svgEl.innerHTML = svg;

  // Wheel container with SVG + center overlay
  const wheelWrap = document.createElement('div');
  wheelWrap.className = 'lw-wheel-wrap';
  wheelWrap.append(svgEl);

  const center = document.createElement('div');
  center.className = 'lw-center';
  center.innerHTML = `
    <div class="lw-logo">cvent</div>
    <h3 class="lw-phase-title">Event lifecycle</h3>
    <p class="lw-phase-tagline">Seamless event marketing and management, real results</p>
  `;
  wheelWrap.append(center);

  // Flyout panel
  const flyout = document.createElement('div');
  flyout.className = 'lw-flyout';

  const flyoutCard = document.createElement('div');
  flyoutCard.className = 'lw-flyout-card';
  flyout.append(flyoutCard);

  phases.forEach((phase, i) => {
    const panel = document.createElement('div');
    panel.className = 'lw-flyout-panel';
    panel.dataset.phase = i;

    if (phase.features) {
      const links = phase.features.querySelectorAll('a');
      links.forEach((link) => {
        const btn = document.createElement('a');
        btn.href = link.href;
        btn.className = 'lw-flyout-btn';
        btn.innerHTML = `<span>${link.textContent}</span><svg class="lw-chevron" viewBox="0 0 24 24" width="16" height="16"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        panel.append(btn);
      });
    }
    flyoutCard.append(panel);
  });

  // Main layout
  const layout = document.createElement('div');
  layout.className = 'lw-layout';
  layout.append(wheelWrap, flyout);

  // Interaction state
  let activeIdx = -1;

  function activate(idx) {
    if (activeIdx === idx) {
      activeIdx = -1;
      svgEl.querySelectorAll('.lw-arc').forEach((a) => a.classList.remove('is-active', 'is-dim'));
      flyout.classList.remove('is-open');
      flyoutCard.querySelectorAll('.lw-flyout-panel').forEach((p) => p.classList.remove('is-active'));
      center.querySelector('.lw-phase-title').textContent = 'Event lifecycle';
      center.querySelector('.lw-phase-tagline').textContent = 'Seamless event marketing and management, real results';
      return;
    }

    activeIdx = idx;

    svgEl.querySelectorAll('.lw-arc').forEach((a, i) => {
      a.classList.toggle('is-active', i === idx);
      a.classList.toggle('is-dim', i !== idx);
    });

    center.querySelector('.lw-phase-title').textContent = phases[idx].name;
    center.querySelector('.lw-phase-tagline').textContent = phases[idx].tagline;

    flyout.classList.add('is-open');
    flyoutCard.querySelectorAll('.lw-flyout-panel').forEach((p, i) => {
      p.classList.toggle('is-active', i === idx);
    });
  }

  svgEl.querySelectorAll('.lw-arc').forEach((arc) => {
    arc.addEventListener('click', () => activate(parseInt(arc.dataset.phase, 10)));
  });

  block.append(layout);
}
