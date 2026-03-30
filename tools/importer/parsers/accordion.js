/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion
 * Base block: accordion
 *
 * Source: Cvent pages with FAQ / accordion content
 * Selector: .paragraph--type--layout-accordion
 *
 * Source DOM structure:
 *   .layout-accordion
 *     .paragraph-header > h2 (section heading - extracted as default content)
 *     .accordion[data-accordion]
 *       .field__item.accordion-item[data-accordion-item] (repeated)
 *         a.accordion-title (question text)
 *         div.accordion-content
 *           .paragraph--type--simple-content
 *             .field--name-field-description (answer rich text)
 *
 * Target block structure (accordion):
 *   Row per item: [question text | answer rich text]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract each accordion item
  const items = element.querySelectorAll('.accordion-item[data-accordion-item], .field__item.accordion-item');

  items.forEach((item) => {
    // Question: the accordion title link
    const titleEl = item.querySelector('a.accordion-title, .field--name-field-accordion-label');
    const question = titleEl ? titleEl.textContent.trim() : '';
    if (!question) return;

    // Answer: rich text content inside accordion-content
    const contentEl = item.querySelector('.accordion-content .field--name-field-description');
    const answerCell = [];
    if (contentEl) {
      [...contentEl.children].forEach((child) => {
        answerCell.push(child.cloneNode(true));
      });
    }

    if (answerCell.length === 0) {
      // Fallback: grab all text from accordion-content
      const fallback = item.querySelector('.accordion-content');
      if (fallback) {
        const p = document.createElement('p');
        p.textContent = fallback.textContent.trim();
        answerCell.push(p);
      }
    }

    cells.push([question, answerCell]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion',
    cells,
  });
  element.replaceWith(block);
}
