/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Fragment replacer.
 * Runs in afterTransform to find duplicate content and replace with fragment references.
 *
 * Match types:
 *   { heading, blockClass }              — h2 with text + nearby WebImporter block table
 *   { blockClass, contentText }          — block table containing specific text
 *   { heading, followingCount }          — h2 with text + N following sibling elements
 *   { sourceSelector, contentText }      — raw source DOM element by CSS selector + text
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;
  const fragments = payload.template && payload.template.fragments;
  if (!fragments || fragments.length === 0) return;

  fragments.forEach((frag) => {
    const { path, match } = frag;
    if (!path || !match) return;

    const toReplace = findMatchingElements(element, match);
    if (toReplace.length === 0) return;

    // Create fragment block reference
    const link = document.createElement('a');
    link.href = path;
    link.textContent = path;
    const block = WebImporter.Blocks.createBlock(document, { name: 'fragment', cells: [[link]] });

    toReplace[0].replaceWith(block);
    for (let i = 1; i < toReplace.length; i++) toReplace[i].remove();

    console.log('[fragment-replacer] Replaced with fragment: ' + path);
  });
}

function normalizeBlockName(name) {
  return name.toLowerCase().replace(/[-\s]+/g, '');
}

function isBlockTable(el, blockName) {
  if (!el || el.tagName !== 'TABLE') return false;
  const th = el.querySelector('tr:first-child th');
  if (!th) return false;
  return normalizeBlockName(th.textContent.trim()) === normalizeBlockName(blockName);
}

function findBlockTables(root, blockName) {
  const tables = root.querySelectorAll('table');
  const results = [];
  for (const table of tables) {
    if (isBlockTable(table, blockName)) results.push(table);
  }
  return results;
}

function findMatchingElements(root, match) {
  // Type 1: heading + sibling block table
  if (match.heading && match.blockClass) {
    const headings = root.querySelectorAll('h2');
    for (const h2 of headings) {
      if (!h2.textContent.trim().toLowerCase().startsWith(match.heading.toLowerCase())) continue;
      let sibling = h2.nextElementSibling;
      let steps = 0;
      while (sibling && steps < 5) {
        if (isBlockTable(sibling, match.blockClass)) {
          const elements = [h2];
          let walker = h2.nextElementSibling;
          while (walker && walker !== sibling) { elements.push(walker); walker = walker.nextElementSibling; }
          elements.push(sibling);
          return elements;
        }
        if (sibling.tagName === 'HR') break;
        sibling = sibling.nextElementSibling;
        steps++;
      }
    }
    return [];
  }

  // Type 2: block table containing specific text
  if (match.blockClass && match.contentText) {
    const tables = findBlockTables(root, match.blockClass);
    for (const table of tables) {
      if (!table.textContent.includes(match.contentText)) continue;
      const elements = [table];
      const prev = table.previousElementSibling;
      if (prev && prev.tagName === 'H2' && prev.textContent.trim().toLowerCase().startsWith('why cvent')) {
        elements.unshift(prev);
      }
      return elements;
    }
    return [];
  }

  // Type 3: heading + N following siblings (for flat content)
  if (match.heading && match.followingCount) {
    const headings = root.querySelectorAll('h2');
    for (const h2 of headings) {
      if (!h2.textContent.trim().toLowerCase().startsWith(match.heading.toLowerCase())) continue;
      const elements = [h2];
      let next = h2.nextElementSibling;
      let count = 0;
      while (next && count < match.followingCount) {
        if (next.tagName === 'HR' || next.tagName === 'H2') break;
        if (isBlockTable(next, 'Section Metadata')) break;
        elements.push(next);
        next = next.nextElementSibling;
        count++;
      }
      if (count > 0) return elements;
    }
    return [];
  }

  // Type 4: raw source DOM element by CSS selector + content text
  // Used for unparsed content that's still in Drupal DOM structure
  if (match.sourceSelector) {
    const candidates = root.querySelectorAll(match.sourceSelector);
    for (const el of candidates) {
      if (match.contentText && !el.textContent.includes(match.contentText)) continue;
      return [el];
    }
    return [];
  }

  return [];
}
