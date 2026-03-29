export default function decorate(block) {
  const rows = [...block.children];

  // First row with an empty/missing 3rd column is the center config row.
  // Content model: | logo text | default title | default tagline |
  // If omitted, sensible empty defaults are used.
  let centerLogo = '';
  let centerTitle = '';
  let centerTagline = '';
  let phaseRows = rows;

  const firstCols = [...rows[0]?.children || []];
  const hasConfigRow = firstCols.length < 3
    || !firstCols[2]?.querySelector('a');
  if (hasConfigRow && rows.length > 1) {
    centerLogo = firstCols[0]?.textContent.trim() || '';
    centerTitle = firstCols[1]?.textContent.trim() || '';
    centerTagline = firstCols[2]?.textContent.trim() || '';
    phaseRows = rows.slice(1);
  }

  const phases = phaseRows.map((row) => {
    const cols = [...row.children];
    return {
      name: cols[0]?.textContent.trim(),
      tagline: cols[1]?.textContent.trim(),
      features: cols[2] ? cols[2] : null,
    };
  });

  block.textContent = '';

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

  // Donut arcs — colors now come from CSS custom properties
  quads.forEach(([s, e], i) => {
    svg += `<path d="${donutArc(s, e)}" class="lw-arc lw-arc-${i}" data-phase="${i}" />`;
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
  if (centerLogo) {
    const logoEl = document.createElement('div');
    logoEl.className = 'lw-logo';
    logoEl.textContent = centerLogo;
    center.append(logoEl);
  }
  const titleEl = document.createElement('h3');
  titleEl.className = 'lw-phase-title';
  titleEl.textContent = centerTitle;
  center.append(titleEl);
  const taglineEl = document.createElement('p');
  taglineEl.className = 'lw-phase-tagline';
  taglineEl.textContent = centerTagline;
  center.append(taglineEl);
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
      const paragraphs = [...phase.features.querySelectorAll('p')];
      for (let j = 0; j < paragraphs.length; j += 1) {
        const link = paragraphs[j].querySelector('a');
        if (link) {
          // Next <p> without a link is the description
          const nextP = paragraphs[j + 1];
          const desc = (nextP && !nextP.querySelector('a')) ? nextP.textContent.trim() : '';
          if (desc) j += 1; // skip the description paragraph

          const item = document.createElement('div');
          item.className = 'lw-flyout-item';

          const btn = document.createElement('button');
          btn.className = 'lw-flyout-btn';
          btn.type = 'button';
          btn.innerHTML = `<span>${link.textContent}</span><svg class="lw-chevron" viewBox="0 0 24 24" width="16" height="16"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

          const detail = document.createElement('div');
          detail.className = 'lw-flyout-detail';
          // Use the authored link text instead of hardcoding "Explore"
          const linkText = link.textContent;
          detail.innerHTML = `<p>${desc}</p><a href="${link.href}" class="lw-explore-link">${linkText} <svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;

          btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            panel.querySelectorAll('.lw-flyout-item.is-open').forEach((el) => el.classList.remove('is-open'));
            if (!isOpen) item.classList.add('is-open');
          });

          item.append(btn, detail);
          panel.append(item);
        }
      }
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
      titleEl.textContent = centerTitle;
      taglineEl.textContent = centerTagline;
      return;
    }

    activeIdx = idx;

    svgEl.querySelectorAll('.lw-arc').forEach((a, i) => {
      a.classList.toggle('is-active', i === idx);
      a.classList.toggle('is-dim', i !== idx);
    });

    titleEl.textContent = phases[idx].name;
    taglineEl.textContent = phases[idx].tagline;

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
