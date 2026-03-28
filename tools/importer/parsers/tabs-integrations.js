/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-integrations
 * Base block: tabs
 * Variant: tabs-integrations
 *
 * Source: Cvent product platform pages
 * Selector: .paragraph--type--layout-tabs-v
 *
 * Source DOM structure:
 *   .layout-tabs-v
 *     .paragraph-header > h2 (section heading - extracted as default content)
 *     .paragraph-header > p (description - extracted as default content)
 *     .tabs-wrapper
 *       ul.vertical.tabs
 *         li.tabs-title > a > .v-title > .v-text (tab label)
 *       .tabs-content
 *         .field__item (repeated per tab)
 *           .compound-tab-v
 *             .logo-bar
 *               .paragraph-header > h2 (tab content heading)
 *               .summary-output
 *                 .media--logo (repeated)
 *                   a > .field--name-field-image > img (logo with link)
 *
 * Target block structure (tabs-integrations):
 *   Row per tab: [tab label | tab content (heading + logo images)]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract heading and description as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  const description = element.querySelector('.paragraph-header .field--name-field-description');
  if (description) {
    const p = description.querySelector('p');
    if (p) {
      element.before(p.cloneNode(true));
    }
  }

  // Get tab labels from the tab navigation
  const tabLabels = element.querySelectorAll('ul.vertical.tabs .tabs-title');

  // Get tab content panels
  const tabPanels = element.querySelectorAll('.tabs-content .paragraph--type--compound-tab-v');

  // Build rows: one per tab
  const count = Math.min(tabLabels.length, tabPanels.length);
  for (let i = 0; i < count; i++) {
    const label = tabLabels[i].querySelector('.v-text');
    const panel = tabPanels[i];

    // Tab label cell
    const labelText = label ? label.textContent.trim() : `Tab ${i + 1}`;

    // Tab content cell - heading + logos
    const contentCell = [];

    const panelHeading = panel.querySelector('.paragraph-header h2');
    if (panelHeading) {
      contentCell.push(panelHeading.cloneNode(true));
    }

    // Get all logo images with their links
    const logos = panel.querySelectorAll('.media--logo');
    logos.forEach((logo) => {
      const link = logo.querySelector('a');
      const img = logo.querySelector('img');
      if (img) {
        if (link && link.href) {
          const a = document.createElement('a');
          a.href = link.href;
          a.append(img.cloneNode(true));
          contentCell.push(a);
        } else {
          contentCell.push(img.cloneNode(true));
        }
      }
    });

    if (contentCell.length > 0) {
      cells.push([labelText, contentCell]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-integrations',
    cells,
  });
  element.replaceWith(block);
}
