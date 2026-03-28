/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-product-form
 * Base block: hero
 * Variant: hero-product-form
 *
 * Source: Cvent product feature pages
 * Selector: .paragraph--type--header-banner-modern-form .header-banner-modern-form
 *
 * Source DOM structure:
 *   .header-banner-modern-form
 *     .header-banner-feature__content
 *       .header-banner-feature__main-content  (h1 eyebrow, h2 heading, p description)
 *       .header-banner-feature__extra-content  (video thumbnail / media)
 *       .header-banner-feature__side  (form sidebar)
 *
 * Target block structure (hero):
 *   Row 1: [image]
 *   Row 2: [heading + text + CTA content]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract main content (eyebrow, heading, description)
  const mainContent = element.querySelector('.header-banner-feature__main-content');
  const contentCell = [];

  if (mainContent) {
    // Get all child elements from the WYSIWYG field
    const wysiwyg = mainContent.querySelector('.field--name-field-wysiwyg');
    if (wysiwyg) {
      [...wysiwyg.children].forEach((child) => {
        contentCell.push(child.cloneNode(true));
      });
    }
  }

  // Extract video/media thumbnail from extra content
  const extraContent = element.querySelector('.header-banner-feature__extra-content');
  if (extraContent) {
    const img = extraContent.querySelector('img');
    if (img) {
      contentCell.push(img.cloneNode(true));
    }
  }

  // Extract sidebar form content
  const sidebar = element.querySelector('.header-banner-feature__side');
  const sidebarCell = [];

  if (sidebar) {
    // Get the form heading if present
    const formHeading = sidebar.querySelector('h2, h3, h4');
    if (formHeading) {
      sidebarCell.push(formHeading.cloneNode(true));
    }

    // Get form element
    const form = sidebar.querySelector('form');
    if (form) {
      sidebarCell.push(form.cloneNode(true));
    }
  }

  // Build cells: two-column layout [content | form sidebar]
  if (contentCell.length > 0 || sidebarCell.length > 0) {
    cells.push([contentCell, sidebarCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-product-form',
    cells,
  });
  element.replaceWith(block);
}
