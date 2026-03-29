/* eslint-disable */
/* global WebImporter */

/**
 * Parser: logo-wall
 * Base block: logo-wall
 *
 * Source: Cvent pages with logo bar sections
 * Selector: .paragraph--type--logo-bar
 *
 * Source DOM structure:
 *   .logo-bar
 *     .paragraph-header > h2  (section heading)
 *     .field--name-field-p-logo-items
 *       .media--logo img  (repeated, logo images)
 *
 * Target block structure (logo-wall):
 *   Row 1: [heading]
 *   Row 2: [all logo images wrapped in <p> tags]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: heading
  const heading = element.querySelector('.paragraph-header h2, h2');
  if (heading) {
    cells.push([heading.cloneNode(true)]);
  }

  // Row 2: all logo images in a single cell, each wrapped in <p>
  const imgs = element.querySelectorAll('img');
  const logoContainer = document.createElement('div');
  let logoCount = 0;

  imgs.forEach((img) => {
    const src = img.getAttribute('src') || '';
    // Skip tracking pixels and tiny images
    if (src.includes('pixel') || src.includes('tracking')) return;
    const p = document.createElement('p');
    p.appendChild(img.cloneNode(true));
    logoContainer.appendChild(p);
    logoCount++;
  });

  if (logoCount > 0) {
    cells.push([logoContainer]);
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'logo-wall',
    cells,
  });
  element.replaceWith(block);
}
