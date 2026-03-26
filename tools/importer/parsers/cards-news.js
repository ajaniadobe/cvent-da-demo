/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-news
 * Base block: cards
 * Source: https://www.cvent.com/
 * Selector: #cvent-paragraph-layout_content-735846
 *
 * Block library structure (cards, no images variant):
 *   N rows, 1 column per row: [text content]
 *   Text content cell: heading + description + optional CTA
 *
 * Source DOM structure:
 *   #cvent-paragraph-layout_content-735846
 *     .field--name-field-p-content-items > .field__item (repeated)
 *       .paragraph--type--simple-card
 *         .simple-card
 *           .innerlink (empty - no images)
 *           .simple-card__content
 *             .field--name-field-description
 *               p           -> category label (e.g., "CVENT CONNECT")
 *               h4          -> card title
 *               p           -> subtitle/date (optional)
 *               p > a.cta-link -> CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all simple-card instances within this layout container
  const cards = element.querySelectorAll('.paragraph--type--simple-card');

  cards.forEach((card) => {
    const simpleCard = card.querySelector('.simple-card') || card;

    // Single column: Text content (category + heading + subtitle + CTA)
    const contentCol = [];
    const contentDiv = simpleCard.querySelector('.simple-card__content .field--name-field-description, .simple-card__content .text-formatted');

    if (contentDiv) {
      Array.from(contentDiv.children).forEach((child) => {
        contentCol.push(child);
      });
    }

    if (contentCol.length > 0) {
      cells.push(contentCol);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-news',
    cells,
  });
  element.replaceWith(block);
}
