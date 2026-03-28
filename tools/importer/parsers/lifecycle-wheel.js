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

    // Extract features from accordion items
    const featuresList = document.createElement('ul');
    const accordionItems = quadrant.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
      const tabBtn = item.querySelector('.desktop-accordion-tab span');
      const featureName = tabBtn ? tabBtn.textContent.trim() : '';
      const listItems = item.querySelectorAll('.accordion-list li');
      listItems.forEach((li) => {
        const desc = li.querySelector('p');
        const link = li.querySelector('a');
        const featureLi = document.createElement('li');
        if (featureName) {
          const strong = document.createElement('strong');
          strong.textContent = featureName;
          featureLi.append(strong);
        }
        if (desc) {
          featureLi.append(document.createTextNode(': '));
          featureLi.append(document.createTextNode(desc.textContent.trim()));
        }
        if (link) {
          featureLi.append(document.createTextNode(' '));
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          featureLi.append(a);
        }
        featuresList.append(featureLi);
      });
    });

    cells.push([name, tagline, featuresList]);
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'lifecycle-wheel',
      cells,
    });
    element.replaceWith(block);
  }
}
