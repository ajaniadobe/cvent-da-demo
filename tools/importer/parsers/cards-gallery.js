/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-gallery
 * Base block: cards
 * Variant: cards-gallery
 *
 * Source: Cvent product feature pages
 * Selector: .paragraph--type--showcase-gallery
 *
 * Source DOM structure:
 *   .showcase-gallery
 *     .showcase-gallery__container
 *       h2 (gallery heading - extracted as default content)
 *       .gallery-lightbox-direct
 *         .views-view-grid
 *           .views-row
 *             .views-col (repeated)
 *               a.elem > picture > img  (gallery thumbnail image)
 *
 * Target block structure (cards):
 *   Row per image: [image]  (single-column, image-only cards)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the heading as default content before the block
  const heading = element.querySelector('h2');
  if (heading) {
    element.before(heading.cloneNode(true));
  }

  // Extract each gallery image as a card row
  const images = element.querySelectorAll('.views-col img');

  images.forEach((img) => {
    if (img.src) {
      cells.push([[img.cloneNode(true)]]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-gallery',
    cells,
  });
  element.replaceWith(block);
}
