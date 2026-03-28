/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-testimonial
 * Base block: cards
 * Variant: cards-testimonial
 *
 * Source: Cvent product feature pages
 * Selector: .paragraph--type--layout-content.column-count-3:not(.bg-color-light-gray)
 *
 * Source DOM structure:
 *   .layout-content
 *     .layout-content__container
 *       .paragraph-header > h2  (section heading - extracted as default content)
 *       .field--name-field-p-content-items
 *         .field__item (repeated, 3 items)
 *           .paragraph--type--simple-card
 *             .simple-card
 *               .innerlink > .field--name-field-p-media-item  (video thumbnail)
 *               .simple-card__content
 *                 h4  (company name)
 *                 .field--name-field-description  (quote text + ul metrics)
 *
 * Target block structure (cards):
 *   Row per card: [video image | company heading + quote + metrics]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract each testimonial card
  const cards = element.querySelectorAll('.paragraph--type--simple-card');

  cards.forEach((card) => {
    const imageCell = [];
    const textCell = [];

    // Get video thumbnail image from innerlink
    const img = card.querySelector('.innerlink img');
    if (img) {
      imageCell.push(img.cloneNode(true));
    }

    // Get card content: company name heading
    const companyHeading = card.querySelector('.simple-card__content h4');
    if (companyHeading) {
      textCell.push(companyHeading.cloneNode(true));
    }

    // Get card content: description (quote + metrics list)
    const description = card.querySelector('.simple-card__content .field--name-field-description');
    if (description) {
      [...description.children].forEach((child) => {
        textCell.push(child.cloneNode(true));
      });
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-testimonial',
    cells,
  });
  element.replaceWith(block);
}
