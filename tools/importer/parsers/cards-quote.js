/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-quote
 * Base block: cards-testimonial (reuses existing block)
 *
 * Source: Cvent pages with testimonial quotes (icon-layout-top-center pattern)
 * Selector: .paragraph--type--layout-content (containing .icon-layout-top-center items)
 *
 * Source DOM structure:
 *   .layout-content
 *     .layout-content__container
 *       .paragraph-header > h2 (section heading - extracted as default content)
 *       .field--name-field-p-content-items
 *         .field__item (repeated)
 *           .paragraph--type--simple-icon-content.icon-layout-top-center
 *             .simple-icon-content
 *               .simple-icon-content__icon > ... > img (company logo)
 *               .simple-icon-content__content
 *                 .field--name-field-description
 *                   p > em ("Quote text")
 *                   p > strong (Person Name) + br + Title, Company
 *
 * Target block structure (cards-testimonial):
 *   Row per card: [logo image | quote text + attribution]
 */
export default function parse(element, { document }) {
  // Only handle layouts with icon-layout-top-center items (testimonial quotes)
  const quoteItems = element.querySelectorAll('.paragraph--type--simple-icon-content.icon-layout-top-center');
  if (quoteItems.length === 0) return;

  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  quoteItems.forEach((item) => {
    const imageCell = [];
    const textCell = [];

    // Get company logo image
    const img = item.querySelector('.simple-icon-content__icon img');
    if (img) {
      imageCell.push(img.cloneNode(true));
    }

    // Get quote and attribution from description
    const description = item.querySelector('.simple-icon-content__content .field--name-field-description');
    if (description) {
      [...description.children].forEach((child) => {
        textCell.push(child.cloneNode(true));
      });
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-testimonial',
    cells,
  });
  element.replaceWith(block);
}
