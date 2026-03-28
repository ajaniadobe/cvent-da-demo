/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns
 * Base block: columns
 * Variant: columns (generic)
 *
 * Source: Cvent product feature pages
 * Selector: .paragraph--type--layout-content.column-count-2,
 *           .paragraph--type--layout-content.column-count-3 (solutions links)
 *
 * Source DOM structure:
 *   .layout-content
 *     .layout-content__container
 *       .paragraph-header > h2  (section heading - extracted as default content)
 *       .field--name-field-p-content-items
 *         .field__item (repeated)
 *           .paragraph--type--simple-card
 *             .simple-card
 *               .simple-card__content
 *                 h4  (group heading)
 *                 .field--name-field-p-link  (link items)
 *
 * Target block structure (columns):
 *   Row: [col1 content | col2 content]
 *   Each column contains one or more card groups with headings and links
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract card items
  const cards = element.querySelectorAll('.paragraph--type--simple-card');

  if (cards.length > 0) {
    // Split cards into two columns (half and half)
    const midpoint = Math.ceil(cards.length / 2);
    const col1Cards = [...cards].slice(0, midpoint);
    const col2Cards = [...cards].slice(midpoint);

    const col1 = [];
    const col2 = [];

    // Extract content from each card group
    const extractCardContent = (card, targetCol) => {
      const cardContent = card.querySelector('.simple-card__content');
      if (!cardContent) return;

      const h4 = cardContent.querySelector('h4');
      if (h4) {
        targetCol.push(h4.cloneNode(true));
      }

      // Get all links from the card
      const links = cardContent.querySelectorAll('.field--name-field-link a');
      if (links.length > 0) {
        const list = document.createElement('ul');
        links.forEach((link) => {
          const li = document.createElement('li');
          li.append(link.cloneNode(true));
          list.append(li);
        });
        targetCol.push(list);
      }
    };

    col1Cards.forEach((card) => extractCardContent(card, col1));
    col2Cards.forEach((card) => extractCardContent(card, col2));

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  } else {
    // Fallback: generic two-column split based on direct children
    const container = element.querySelector('.layout-content__container') || element;
    const children = [...container.children].filter((c) => !c.classList.contains('paragraph-header'));

    if (children.length >= 2) {
      const mid = Math.ceil(children.length / 2);
      const col1 = children.slice(0, mid).map((c) => c.cloneNode(true));
      const col2 = children.slice(mid).map((c) => c.cloneNode(true));
      cells.push([col1, col2]);
    } else if (children.length === 1) {
      cells.push([[children[0].cloneNode(true)]]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns',
    cells,
  });
  element.replaceWith(block);
}
