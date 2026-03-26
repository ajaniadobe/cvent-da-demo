/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.cvent.com/',
  ],
  description: 'Cvent homepage — main landing page with hero, product features, social proof, and call-to-action sections',
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.paragraph--type--header-banner-hero .header-banner-hero'],
    },
    {
      name: 'columns-media',
      instances: [
        '#cvent-paragraph-compound_media_bar-1568076',
        '#cvent-paragraph-compound_media_bar-1458006',
        '#cvent-paragraph-compound_media_bar-619191',
        '#cvent-paragraph-compound_content_bar-1200576',
        '#cvent-paragraph-compound_media_bar-1461776',
        '#cvent-paragraph-compound_form-21226',
      ],
    },
    {
      name: 'cards-product',
      instances: ['#cvent-paragraph-layout_content-735741'],
    },
    {
      name: 'cards-news',
      instances: ['#cvent-paragraph-layout_content-735846'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '.paragraph--type--header-banner-hero', style: 'dark-blue', blocks: ['hero-homepage'], defaultContent: ['.header-banner-hero-horizontal-notification-card'] },
    { id: 'section-2', name: 'Meet CventIQ', selector: '#cvent-paragraph-compound_media_bar-1568076', style: 'blue-purple-gradient', blocks: ['columns-media'], defaultContent: [] },
    { id: 'section-3', name: 'All-in-one Solution Stats', selector: '#cvent-paragraph-compound_media_bar-1458006', style: null, blocks: ['columns-media'], defaultContent: [] },
    { id: 'section-4', name: 'Trusted By Logo Bar', selector: '#cvent-paragraph-logo_bar-1542431', style: null, blocks: [], defaultContent: ['#cvent-paragraph-logo_bar-1542431'] },
    { id: 'section-5', name: 'Event Lifecycle Wheel', selector: '#cvent-paragraph-reference_block-1267256', style: null, blocks: [], defaultContent: ['#cvent-paragraph-reference_block-1267256'] },
    { id: 'section-6', name: 'Product Cards Grid', selector: '#cvent-paragraph-layout_content-735741', style: null, blocks: ['cards-product'], defaultContent: ['.paragraph--type--layout-content.column-count-3 > .layout-content-header', '#cvent-paragraph-link_default-892976'] },
    { id: 'section-7', name: 'Venue Sourcing', selector: '#cvent-paragraph-compound_media_bar-619191', style: 'blue-green-gradient', blocks: ['columns-media'], defaultContent: [] },
    { id: 'section-8', name: 'Social Proof', selector: '#cvent-paragraph-compound_content_bar-1200576', style: null, blocks: ['columns-media'], defaultContent: ['#join-thousands-of-planners-and-marketers-who-love-our-software'] },
    { id: 'section-9', name: 'CTA How It Works', selector: '#cvent-paragraph-compound_media_bar-1461776', style: 'blue-purple-gradient', blocks: ['columns-media'], defaultContent: [] },
    { id: 'section-10', name: 'Whats New at Cvent', selector: '#cvent-paragraph-layout_content-735846', style: 'light-grey', blocks: ['cards-news'], defaultContent: ['#whats-new-at-cvent'] },
    { id: 'section-11', name: 'Platform CTA with Form', selector: '#cvent-paragraph-compound_form-21226', style: 'blue-purple-gradient', blocks: ['columns-media'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'columns-media': columnsMediaParser,
  'cards-product': cardsProductParser,
  'cards-news': cardsNewsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cventCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cventSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
