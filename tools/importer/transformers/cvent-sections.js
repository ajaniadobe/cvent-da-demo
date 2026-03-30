/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cvent section breaks, section-metadata, and default content.
 * - Adds <hr> section separators based on template sections
 * - Adds Section Metadata blocks for styled sections
 * - Extracts defaultContent elements from block containers before parsers
 *   destroy them via replaceWith()
 *
 * Selectors verified against captured DOM of https://www.cvent.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid position shifts
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      // Find the section element using its selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;

      // Add section-metadata block after section element if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Extract defaultContent elements from inside the section element.
      // Block parsers will later call element.replaceWith(block), destroying
      // all descendants. We need to move defaultContent out BEFORE that happens.
      let firstSectionNode = sectionEl;
      if (section.defaultContent && section.defaultContent.length > 0) {
        // Collect all descendants to determine position (before/after block content)
        const allDescendants = [...sectionEl.querySelectorAll('*')];
        const midpoint = allDescendants.length / 2;

        section.defaultContent.forEach((dcSelector) => {
          const dcEl = element.querySelector(dcSelector);
          if (!dcEl) {
            console.warn(`Default content not found: ${dcSelector}`);
            return;
          }

          // Only extract if inside the section element (otherwise it's already a sibling)
          if (!sectionEl.contains(dcEl)) return;

          // Determine position: elements in the first half of the DOM tree go BEFORE
          // the block; elements in the second half go AFTER
          const dcIndex = allDescendants.indexOf(dcEl);
          const isBefore = dcIndex >= 0 && dcIndex < midpoint;

          if (isBefore) {
            // Place before sectionEl — this puts it above the block in the output
            sectionEl.before(dcEl);
            // Track the first element for correct <hr> placement
            if (firstSectionNode === sectionEl) {
              firstSectionNode = dcEl;
            }
          } else {
            // Place after sectionEl but before section-metadata
            sectionEl.after(dcEl);
          }
        });
      }

      // Add <hr> before the first element of this section (except for section 1)
      const isFirst = section.id === sections[0].id;
      if (!isFirst) {
        const hr = document.createElement('hr');
        firstSectionNode.before(hr);
      }
    });
  }
}
