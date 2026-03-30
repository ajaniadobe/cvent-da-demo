/* global WebImporter */

/**
 * Parser for lifecycle-wheel block.
 * Extracts quadrant data from the Cvent product wheel (reference-block with wheel_section).
 * Content model: rows of [phase-name | tagline | features-list]
 *
 * Source selectors:
 *   - .paragraph--type--reference-block.cvent-main-wheel
 *   - .wheel_section .mobile-spoke-container (mobile accordion structure)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Use desktop spoke containers for quadrant data
  const quadrants = element.querySelectorAll('.desktop-spoke-container');

  // Map of quadrant names to taglines from mobile structure
  const taglines = {};
  const mobileContainer = element.querySelector('.mobile-spoke-container');
  if (mobileContainer) {
    const outerTabs = mobileContainer.querySelectorAll('.outer-tab');
    outerTabs.forEach((tab) => {
      const name = tab.textContent.trim();
      taglines[name] = '';
    });
  }

  // Also try to get the active quadrant tagline from the center
  const centerDesc = element.querySelector('.wheel-product-desc');
  const centerName = element.querySelector('.wheel-center-content h3');
  if (centerName && centerDesc) {
    taglines[centerName.textContent.trim()] = centerDesc.textContent.trim();
  }

  quadrants.forEach((quadrant) => {
    // Get quadrant name from ID attribute: "quadrant-{Name}"
    const quadrantId = quadrant.id || '';
    const name = quadrantId.replace('quadrant-', '');
    if (!name) return;

    const tagline = taglines[name] || '';

    // Extract features from accordion items as <p><a>…</p><p>desc</p> pairs
    // (the lifecycle-wheel block decorator expects this format)
    const featuresDiv = document.createElement('div');
    const accordionItems = quadrant.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
      // Feature name lives in .inner-category button span (e.g. "Venue sourcing")
      const featureName = item.querySelector('.inner-category span, .desktop-accordion-tab span');
      const listItems = item.querySelectorAll('.accordion-list li');
      listItems.forEach((li) => {
        const link = li.querySelector('a');
        const desc = li.querySelector('p');
        if (link) {
          const linkP = document.createElement('p');
          const a = document.createElement('a');
          a.setAttribute('href', link.getAttribute('href') || '');
          // Use the feature name from .inner-category if available;
          // fall back to the link text only if no category heading exists
          a.textContent = (featureName && featureName.textContent.trim()) || link.textContent.trim();
          linkP.append(a);
          featuresDiv.append(linkP);
        }
        if (desc) {
          const descP = document.createElement('p');
          descP.textContent = desc.textContent.trim();
          featuresDiv.append(descP);
        }
      });
    });

    cells.push([name, tagline, featuresDiv]);
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'lifecycle-wheel',
      cells,
    });
    element.replaceWith(block);
  }
}
