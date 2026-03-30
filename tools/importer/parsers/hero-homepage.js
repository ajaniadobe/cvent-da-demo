/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-homepage
 * Base block: hero
 * Source: https://www.cvent.com/
 * Selector: .paragraph--type--header-banner-hero .header-banner-hero
 *
 * Block library structure (hero):
 *   Row 1: Background image (optional)
 *   Row 2: Title + subheading + CTA
 *
 * Source DOM structure:
 *   .header-banner-hero
 *     .header-banner-hero__main-content  -> h1, description (p, ul, CTAs)
 *     #header-banner-hero-sidebar        -> picture (hero image)
 */
export default function parse(element, { document }) {
  // Extract hero image from sidebar
  const sidebar = element.querySelector('#header-banner-hero-sidebar, .header-banner-hero__sidebar');
  const heroImage = sidebar ? sidebar.querySelector('picture, img') : null;

  // Extract heading
  const heading = element.querySelector('.header-banner-hero__main-content h1, .header-banner-hero__main-content h2');

  // Extract description content (paragraphs, lists)
  const mainContent = element.querySelector('.header-banner-hero__main-content');
  const description = mainContent ? mainContent.querySelector('.field--name-field-description, .text-formatted') : null;

  // Build cells matching hero block structure
  const cells = [];

  // Row 1: Hero image (background)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Content (heading + description with CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) {
    // Get all child elements from description
    const children = Array.from(description.children);
    children.forEach((child) => contentCell.push(child));
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Row 3: Notification card (from sibling .hero-bottom-wrapper in parent)
  const parent = element.closest('.paragraph--type--header-banner-hero') || element.parentElement;
  const notifCard = parent ? parent.querySelector('.header-banner-hero-horizontal-notification-card') : null;
  if (notifCard) {
    const notifContent = [];
    const notifText = notifCard.querySelector('.field--name-field-description, .text-formatted, p');
    const notifLink = notifCard.querySelector('a');
    if (notifText) {
      const p = document.createElement('p');
      p.textContent = notifText.textContent.trim();
      notifContent.push(p);
    }
    if (notifLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', notifLink.getAttribute('href') || '');
      a.textContent = notifLink.textContent.trim();
      p.append(a);
      notifContent.push(p);
    }
    if (notifContent.length > 0) {
      cells.push(notifContent);
    }
    notifCard.remove();
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-homepage',
    cells,
  });
  element.replaceWith(block);
}
