/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-media
 * Base block: columns
 * Source: https://www.cvent.com/
 * Selectors: .paragraph--type--compound-media-bar, .paragraph--type--compound-content-bar,
 *            .paragraph--type--compound-form
 *
 * Block library structure (columns):
 *   1 row with N columns. Each cell = one column of content.
 *
 * Source DOM structure (compound-media-bar):
 *   .compound-media-bar
 *     .compound-media-bar__media   -> picture/img (media column)
 *     .compound-media-bar__content -> heading, paragraphs, CTAs (text column)
 *   Classes: media-position-left / media-position-right control order
 *
 * Source DOM structure (compound-content-bar):
 *   .compound-content-bar
 *     .compound-content-bar__container
 *       .paragraph-header -> heading (h2)
 *       .field--name-field-p-content-bar-items -> .field__item children (one per column)
 *
 * Source DOM structure (compound-form):
 *   .compound-form
 *     .field--name-field-p-content-item -> text column (h2, paragraphs, list, CTA)
 *     .field--name-field-p-sidebar-item -> form column (Marketo form)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: compound-media-bar (most common)
  const mediaBar = element.querySelector('.compound-media-bar');
  if (mediaBar) {
    const mediaSide = mediaBar.querySelector('.compound-media-bar__media');
    const contentSide = mediaBar.querySelector('.compound-media-bar__content');

    const mediaCol = [];
    const contentCol = [];

    // Extract media (image/picture)
    if (mediaSide) {
      const pic = mediaSide.querySelector('picture, img, video');
      if (pic) mediaCol.push(pic);
    }

    // Extract content (headings, paragraphs, links)
    if (contentSide) {
      const wrapper = contentSide.querySelector('.compound-media-bar__content-wrapper');
      const contentSource = wrapper || contentSide;
      const simpleContent = contentSource.querySelector('.paragraph--type--simple-content');
      if (simpleContent) {
        const heading = simpleContent.querySelector('h2, h3, h4');
        if (heading) contentCol.push(heading);
        const desc = simpleContent.querySelector('.field--name-field-description, .text-formatted');
        if (desc) {
          Array.from(desc.children).forEach((child) => contentCol.push(child));
        }
      } else {
        // Fallback: grab direct content
        Array.from(contentSource.querySelectorAll('h2, h3, h4, p, ul, ol, a')).forEach((el) => {
          contentCol.push(el);
        });
      }
    }

    // Determine column order based on media position class
    const isMediaFirst = element.classList.contains('media-position-left') ||
                         element.classList.contains('media-order-first');
    if (isMediaFirst) {
      cells.push([mediaCol, contentCol]);
    } else {
      cells.push([contentCol, mediaCol]);
    }

    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-media',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Pattern 1b: header-banner-media (hero with media — used on pricing, legal, etc.)
  const bannerMedia = element.querySelector('.header-banner-media');
  if (bannerMedia) {
    const contentSide = bannerMedia.querySelector('.header-banner-media--content');
    const mediaSide = bannerMedia.querySelector('.header-banner-media--media');

    const contentCol = [];
    const mediaCol = [];

    if (contentSide) {
      const wysiwyg = contentSide.querySelector('.field--name-field-wysiwyg');
      const contentSource = wysiwyg || contentSide;
      Array.from(contentSource.querySelectorAll('h1, h2, h3, h4, p, ul, ol, a')).forEach((el) => {
        // Skip links already inside a paragraph
        if (el.tagName === 'A' && el.parentElement && el.parentElement.tagName === 'P') return;
        contentCol.push(el);
      });
    }

    if (mediaSide) {
      const pic = mediaSide.querySelector('picture, img');
      if (pic) mediaCol.push(pic);
    }

    cells.push([contentCol, mediaCol]);

    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-media',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: compound-content-bar
  // Structure: .compound-content-bar__container > .field--name-field-p-content-bar-items > .field__item (one per column)
  const contentBar = element.querySelector('.compound-content-bar');
  if (contentBar) {
    const contentItems = contentBar.querySelectorAll('.field--name-field-p-content-bar-items > .field__item');
    if (contentItems.length >= 2) {
      const leftCol = [];
      const rightCol = [];
      // First item = left column
      Array.from(contentItems[0].querySelectorAll('picture, img, h2, h3, h4, p, ul, ol, a')).forEach((el) => {
        leftCol.push(el);
      });
      // Second item = right column
      Array.from(contentItems[1].querySelectorAll('picture, img, h2, h3, h4, p, ul, ol, a')).forEach((el) => {
        rightCol.push(el);
      });
      cells.push([leftCol, rightCol]);
    } else {
      // Fallback: treat all content as single column
      const allContent = [];
      contentBar.querySelectorAll('picture, img, h2, h3, h4, p, ul, ol, a').forEach((el) => {
        allContent.push(el);
      });
      cells.push([allContent]);
    }

    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-media',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: compound-form
  // Structure: .compound-form > .field--name-field-p-content-item (text) + .field--name-field-p-sidebar-item (form)
  const formEl = element.querySelector('.compound-form');
  if (formEl) {
    const formContentWrap = formEl.querySelector('.field--name-field-p-content-item');
    const formSideWrap = formEl.querySelector('.field--name-field-p-sidebar-item');

    const contentCol = [];
    const formCol = [];

    if (formContentWrap) {
      const simpleContent = formContentWrap.querySelector('.paragraph--type--simple-content');
      const descSource = simpleContent || formContentWrap;
      const desc = descSource.querySelector('.field--name-field-description, .text-formatted');
      if (desc) {
        Array.from(desc.children).forEach((child) => contentCol.push(child));
      } else {
        Array.from(descSource.querySelectorAll('h2, h3, h4, p, ul, ol, a')).forEach((el) => {
          contentCol.push(el);
        });
      }
    }
    if (formSideWrap) {
      const form = formSideWrap.querySelector('form');
      if (form) {
        formCol.push(form);
      } else {
        formCol.push(formSideWrap);
      }
    }

    cells.push([contentCol, formCol]);

    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-media',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Fallback: treat as generic two-column split
  const children = Array.from(element.children);
  if (children.length >= 2) {
    cells.push([children[0], children[1]]);
  } else if (children.length === 1) {
    cells.push([children[0]]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-media',
    cells,
  });
  element.replaceWith(block);
}
