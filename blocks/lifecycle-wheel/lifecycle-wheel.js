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

  // Build the ring visual + tabs
  const ring = document.createElement('div');
  ring.className = 'lw-ring';

  const ringCircle = document.createElement('div');
  ringCircle.className = 'lw-ring-circle';

  // Create 4 arc segments inside the ring
  phases.forEach((phase, i) => {
    const seg = document.createElement('div');
    seg.className = `lw-segment lw-segment-${i}`;
    if (i === 0) seg.classList.add('is-active');
    ringCircle.append(seg);
  });

  // Center content inside ring
  const center = document.createElement('div');
  center.className = 'lw-center';
  center.innerHTML = `
    <h3 class="lw-phase-title">${phases[0].name}</h3>
    <p class="lw-phase-tagline">${phases[0].tagline}</p>
  `;
  ringCircle.append(center);
  ring.append(ringCircle);

  // Tab buttons around the ring
  const tabBar = document.createElement('div');
  tabBar.className = 'lw-tabs';
  tabBar.role = 'tablist';

  phases.forEach((phase, i) => {
    const btn = document.createElement('button');
    btn.role = 'tab';
    btn.className = `lw-tab lw-tab-${i}`;
    btn.textContent = phase.name;
    if (i === 0) btn.classList.add('is-active');
    btn.addEventListener('click', () => activatePhase(i));
    tabBar.append(btn);
  });

  // Feature panels
  const panelContainer = document.createElement('div');
  panelContainer.className = 'lw-panels';

  phases.forEach((phase, i) => {
    const panel = document.createElement('div');
    panel.className = 'lw-panel';
    panel.role = 'tabpanel';
    if (i === 0) panel.classList.add('is-active');

    if (phase.features) {
      const links = phase.features.querySelectorAll('a');
      links.forEach((link) => {
        const item = document.createElement('a');
        item.href = link.href;
        item.className = 'lw-feature';
        item.textContent = link.textContent;
        panel.append(item);
      });
    }
    panelContainer.append(panel);
  });

  function activatePhase(idx) {
    // Update tabs
    tabBar.querySelectorAll('.lw-tab').forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
    });

    // Update ring segments
    ringCircle.querySelectorAll('.lw-segment').forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
    });

    // Update center content
    center.querySelector('.lw-phase-title').textContent = phases[idx].name;
    center.querySelector('.lw-phase-tagline').textContent = phases[idx].tagline;

    // Update panels
    panelContainer.querySelectorAll('.lw-panel').forEach((p, i) => {
      p.classList.toggle('is-active', i === idx);
    });
  }

  block.append(ring, tabBar, panelContainer);
}
