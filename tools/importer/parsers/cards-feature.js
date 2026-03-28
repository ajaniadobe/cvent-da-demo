/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Base block: cards
 * Variant: cards-feature
 *
 * Source: Cvent product feature pages
 * Selector: .paragraph--type--layout-content.column-count-3.bg-color-light-gray
 *
 * Source DOM structure:
 *   .layout-content
 *     .layout-content__container
 *       .paragraph-header > h2  (section heading - extracted as default content before block)
 *       .field--name-field-p-content-items
 *         .field__item (repeated)
 *           .paragraph--type--simple-icon-content
 *             .simple-icon-content
 *               .simple-icon-content__icon > ... > img  (icon image)
 *               .simple-icon-content__content > h3  (feature label)
 *
 * Target block structure (cards):
 *   Row per card: [icon image | heading text]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract each icon-content item as a card row
  const items = element.querySelectorAll('.paragraph--type--simple-icon-content');

  items.forEach((item) => {
    const icon = item.querySelector('.simple-icon-content__icon img');
    const label = item.querySelector('.simple-icon-content__content h3');
    const description = item.querySelector('.simple-icon-content__content .field--name-field-description');

    const imageCell = [];
    const textCell = [];

    if (icon) {
      imageCell.push(icon.cloneNode(true));
    }

    if (label) {
      textCell.push(label.cloneNode(true));
    }
    if (description) {
      Array.from(description.children).forEach((child) => textCell.push(child.cloneNode(true)));
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-feature',
    cells,
  });
  element.replaceWith(block);
}
