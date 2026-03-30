/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-horizontal
 * Base block: tabs-integrations (reuses existing block)
 *
 * Source: Cvent pages with horizontal tab layouts
 * Selector: .paragraph--type--layout-tabs-h
 *
 * Source DOM structure:
 *   .layout-tabs-h
 *     .paragraph-header > h2 (section heading - extracted as default content)
 *     .tabs-wrapper
 *       ul.tabs[data-tabs][role="tablist"]
 *         li.tabs-title > a.tab-link[role="tab"] (tab label text)
 *       .tabs-content[data-tabs-content]
 *         .field__item (repeated per tab)
 *           .tab-title-mobile (mobile label - ignored, use ul labels)
 *           .paragraph--type--compound-tab-h[role="tabpanel"]
 *             .field--name-field-p-tab-content-h
 *               (nested paragraphs: compound-media-bar, layout-content, etc.)
 *
 * Target block structure (tabs-integrations):
 *   Row per tab: [tab label | tab content (heading + description + image + links)]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract heading and description as default content before the block
  const heading = element.querySelector('.paragraph-header h2, .paragraph-header .field--name-field-heading');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  const description = element.querySelector('.paragraph-header .field--name-field-description p');
  if (description) {
    element.before(description.cloneNode(true));
  }

  // Get tab labels from the tab navigation
  const tabLinks = element.querySelectorAll('ul[role="tablist"] a[role="tab"], ul.tabs a.tab-link');

  // Get tab content panels
  const tabPanels = element.querySelectorAll('.paragraph--type--compound-tab-h[role="tabpanel"], .paragraph--type--compound-tab-h');

  // Build rows: one per tab
  const count = Math.min(tabLinks.length, tabPanels.length);
  for (let i = 0; i < count; i++) {
    const labelText = tabLinks[i].textContent.trim();
    const panel = tabPanels[i];

    // Extract content from the tab panel
    const contentCell = [];

    // Get headings
    const panelHeadings = panel.querySelectorAll('h2, h3, h4');
    panelHeadings.forEach((h) => contentCell.push(h.cloneNode(true)));

    // Get description paragraphs
    const panelDescriptions = panel.querySelectorAll('.field--name-field-description p, .simple-content p');
    panelDescriptions.forEach((p) => {
      if (p.textContent.trim()) contentCell.push(p.cloneNode(true));
    });

    // Get images
    const panelImages = panel.querySelectorAll('.field--name-field-image img, .field--name-field-p-media-item img');
    panelImages.forEach((img) => contentCell.push(img.cloneNode(true)));

    // Get CTA links
    const panelLinks = panel.querySelectorAll('a.cta-link, .field--name-field-link a');
    panelLinks.forEach((a) => contentCell.push(a.cloneNode(true)));

    if (contentCell.length > 0) {
      cells.push([labelText, contentCell]);
    }
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-integrations',
    cells,
  });
  element.replaceWith(block);
}
