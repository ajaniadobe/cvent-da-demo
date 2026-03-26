/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source: https://www.cvent.com/
 * Selector: #cvent-paragraph-layout_content-735741
 *
 * Block library structure (cards with images):
 *   N rows, 2 columns per row: [image | text content]
 *   Text content cell: heading + description + optional CTA
 *
 * Source DOM structure:
 *   #cvent-paragraph-layout_content-735741
 *     .field--name-field-p-content-items > .field__item (repeated)
 *       .paragraph--type--simple-card
 *         .simple-card
 *           .innerlink -> picture/img (card image)
 *           .simple-card__content
 *             .field--name-field-description
 *               p           -> category label (e.g., "REGISTRATION")
 *               h4          -> card title
 *               p > a.cta-link -> CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all simple-card instances within this layout container
  const cards = element.querySelectorAll('.paragraph--type--simple-card');

  cards.forEach((card) => {
    const simpleCard = card.querySelector('.simple-card') || card;

    // Column 1: Card image
    const imageContainer = simpleCard.querySelector('.innerlink');
    const image = imageContainer ? imageContainer.querySelector('picture, img') : null;
    const imageCol = image ? [image] : [];

    // Column 2: Text content (category + heading + description + CTA)
    const contentCol = [];
    const contentDiv = simpleCard.querySelector('.simple-card__content .field--name-field-description, .simple-card__content .text-formatted');

    if (contentDiv) {
      Array.from(contentDiv.children).forEach((child) => {
        contentCol.push(child);
      });
    }

    // Build row: [image | content]
    if (imageCol.length > 0) {
      cells.push([imageCol, contentCol]);
    } else {
      // No image variant: single column
      cells.push(contentCol);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-product',
    cells,
  });
  element.replaceWith(block);
}
