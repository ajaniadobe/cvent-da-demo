/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';

/**
 * Fragment import script.
 * Processes 3 source URLs and extracts shared "Why Cvent" content fragments.
 *
 * URL → Fragment mapping:
 *   cvent.com/en/supplier-venue            → /fragments/why-cvent-cards
 *   cvent.com/en/.../cvent-essentials      → /fragments/why-cvent-stats
 *   cvent.com/en/become-partner            → /fragments/why-cvent-social-proof
 */

const FRAGMENT_CONFIGS = [
  {
    urlMatch: '/en/supplier-venue',
    urlExclude: '/supplier-venue/',
    outputPath: '/fragments/why-cvent-cards',
    extractor: 'cards',
  },
  {
    urlMatch: '/cvent-essentials',
    outputPath: '/fragments/why-cvent-stats',
    extractor: 'stats',
  },
  {
    urlMatch: '/become-partner',
    outputPath: '/fragments/why-cvent-social-proof',
    extractor: 'social-proof',
  },
];

function extractCardsFragment(document) {
  // Find the trust bar compound-content-bar on supplier-venue
  const trustBar = document.querySelector('.trust-bar .paragraph--type--compound-content-bar');
  if (!trustBar) {
    console.warn('Trust bar not found for why-cvent-cards fragment');
    return null;
  }

  const fragment = document.createElement('div');

  // Extract heading
  const heading = trustBar.querySelector('.compound-content-bar .paragraph-header h2');
  if (heading) fragment.append(heading.cloneNode(true));

  // Build cards-feature block directly from source DOM
  const cells = [];
  const items = trustBar.querySelectorAll('.paragraph--type--simple-icon-content');
  items.forEach((item) => {
    const icon = item.querySelector('.simple-icon-content__icon img');
    const label = item.querySelector('.simple-icon-content__content h3');
    const description = item.querySelector('.simple-icon-content__content .field--name-field-description');

    const imageCell = [];
    const textCell = [];

    if (icon) imageCell.push(icon.cloneNode(true));
    if (label) textCell.push(label.cloneNode(true));
    if (description) {
      Array.from(description.children).forEach((child) => textCell.push(child.cloneNode(true)));
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-feature',
      cells,
    });
    fragment.append(block);
  }

  return fragment;
}

function buildStatColumn(item, document) {
  // Extract icon + text from a simple-icon-content item into column content
  const col = [];
  const iconContent = item.querySelector('.simple-icon-content');
  if (iconContent) {
    const icon = iconContent.querySelector('.simple-icon-content__icon img');
    const textEl = iconContent.querySelector('.simple-icon-content__content .field--name-field-description');

    if (icon) {
      const p = document.createElement('p');
      p.append(icon.cloneNode(true));
      col.push(p);
    }
    if (textEl) {
      const paras = textEl.querySelectorAll('p');
      if (paras.length > 0) {
        paras.forEach((p) => col.push(p.cloneNode(true)));
      } else {
        const p = document.createElement('p');
        p.innerHTML = textEl.innerHTML;
        col.push(p);
      }
    }
  }
  return col;
}

function extractStatsFragment(document) {
  // Find compound-content-bar with stats on product-feature pages
  const contentBars = document.querySelectorAll('.paragraph--type--compound-content-bar');
  let targetBar = null;
  for (const bar of contentBars) {
    if (bar.textContent.includes('24/7') || bar.textContent.includes('support')) {
      targetBar = bar;
      break;
    }
  }
  if (!targetBar) {
    console.warn('Stats content bar not found for why-cvent-stats fragment');
    return null;
  }

  const fragment = document.createElement('div');

  // Build columns-media block from stat items
  const contentItems = targetBar.querySelectorAll('.field--name-field-p-content-bar-items > .field__item');
  const cells = [];

  if (contentItems.length >= 2) {
    const leftCol = buildStatColumn(contentItems[0], document);
    const rightCol = buildStatColumn(contentItems[1], document);
    cells.push([leftCol, rightCol]);
  } else if (contentItems.length === 1) {
    const col = buildStatColumn(contentItems[0], document);
    cells.push([col]);
  }

  if (cells.length > 0 && cells[0].some((col) => col.length > 0)) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-media',
      cells,
    });
    fragment.append(block);
  }

  return fragment;
}

function extractSocialProofFragment(document) {
  // Find compound-content-bar with stat items on become-partner
  const contentBar = document.querySelector('.paragraph--type--compound-content-bar');
  if (!contentBar) {
    console.warn('Content bar not found for why-cvent-social-proof fragment');
    return null;
  }

  const fragment = document.createElement('div');

  // Extract heading
  const heading = contentBar.querySelector('.compound-content-bar .paragraph-header h2');
  if (heading) fragment.append(heading.cloneNode(true));

  // Extract stat items as default content (icon img + text paragraphs)
  const items = contentBar.querySelectorAll('.field--name-field-p-content-bar-items > .field__item');
  items.forEach((item) => {
    const iconContent = item.querySelector('.simple-icon-content');
    if (iconContent) {
      const icon = iconContent.querySelector('.simple-icon-content__icon img');
      const textEl = iconContent.querySelector('.simple-icon-content__content .field--name-field-description');

      if (icon) {
        const p = document.createElement('p');
        p.append(icon.cloneNode(true));
        fragment.append(p);
      }
      if (textEl) {
        const paras = textEl.querySelectorAll('p');
        if (paras.length > 0) {
          paras.forEach((p) => fragment.append(p.cloneNode(true)));
        } else {
          const p = document.createElement('p');
          p.innerHTML = textEl.innerHTML;
          fragment.append(p);
        }
      }
    }
  });

  return fragment;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;
    const originalURL = params.originalURL;

    // Run cleanup to remove overlays, tracking, etc.
    const cleanupPayload = { ...payload, template: { sections: [] } };
    try {
      cventCleanupTransformer.call(null, 'beforeTransform', main, cleanupPayload);
    } catch (e) {
      console.error('Cleanup beforeTransform failed:', e);
    }

    // Determine which fragment to extract based on URL
    let config = null;
    for (const cfg of FRAGMENT_CONFIGS) {
      if (originalURL.includes(cfg.urlMatch)) {
        if (cfg.urlExclude && originalURL.includes(cfg.urlExclude)) continue;
        config = cfg;
        break;
      }
    }

    if (!config) {
      console.error(`No fragment config matches URL: ${originalURL}`);
      return [];
    }

    console.log(`Extracting fragment: ${config.outputPath} from ${originalURL}`);

    let fragmentContent = null;
    if (config.extractor === 'cards') {
      fragmentContent = extractCardsFragment(document);
    } else if (config.extractor === 'stats') {
      fragmentContent = extractStatsFragment(document);
    } else if (config.extractor === 'social-proof') {
      fragmentContent = extractSocialProofFragment(document);
    }

    if (!fragmentContent || fragmentContent.children.length === 0) {
      console.error(`Fragment extraction produced no content for: ${config.outputPath}`);
      return [];
    }

    // Replace body content with just the fragment
    main.innerHTML = '';
    main.append(fragmentContent);

    // Fix image URLs
    WebImporter.rules.adjustImageUrls(main, url, originalURL);

    return [{
      element: main,
      path: config.outputPath,
      report: {
        title: `Fragment: ${config.outputPath.split('/').pop()}`,
        template: 'fragment',
        blocks: [config.extractor],
      },
    }];
  },
};
