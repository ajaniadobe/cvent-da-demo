/* global WebImporter */

/**
 * Parser for cards-resource block.
 * Extracts resource cards from summary-resources sections ("You may also like").
 * Content model: rows of [image | category + title + link]
 *
 * Source selectors:
 *   - .paragraph--type--summary-resources
 *   - .summary-resources .resource-card__column article
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract heading as default content before the block
  const heading = element.querySelector('.paragraph-header h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract resource cards
  const cards = element.querySelectorAll('.resource-card__column article');
  cards.forEach((card) => {
    // Get image
    const img = card.querySelector('.resource__thumb img');

    // Get category tag (eBook, Webinar, etc.)
    const category = card.querySelector('.field--name-field-resource-type');
    const categoryText = category ? category.textContent.trim() : '';

    // Get title
    const title = card.querySelector('.field--name-node-title h2, .field--name-node-title h3');
    const titleText = title ? title.textContent.trim() : '';

    // Get link
    const link = card.querySelector('a.resource-card-link');
    const href = link ? link.href : '';

    // Build content cell
    const contentCell = [];

    if (categoryText) {
      const em = document.createElement('em');
      em.textContent = categoryText;
      contentCell.push(em);
    }

    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      contentCell.push(h3);
    }

    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Read more';
      const p = document.createElement('p');
      p.append(a);
      contentCell.push(p);
    }

    // Image cell
    const imageCell = [];
    if (img) {
      imageCell.push(img.cloneNode(true));
    }

    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-resource',
      cells,
    });
    element.replaceWith(block);
  }
}
