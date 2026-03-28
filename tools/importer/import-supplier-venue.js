/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductFormParser from './parsers/hero-product-form.js';
import lifecycleWheelParser from './parsers/lifecycle-wheel.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsResourceParser from './parsers/cards-resource.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product-form': heroProductFormParser,
  'lifecycle-wheel': lifecycleWheelParser,
  'columns-media': columnsMediaParser,
  'cards-resource': cardsResourceParser,
  'cards-feature': cardsFeatureParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'supplier-venue',
  description: 'Supplier and venue solution pages for hoteliers and venue operators',
  urls: [
    'https://www.cvent.com/en/supplier-venue',
    'https://www.cvent.com/en/supplier-venue/group-marketing-solutions',
    'https://www.cvent.com/en/supplier-venue/group-sales-solutions',
    'https://www.cvent.com/en/supplier-venue/group-operations-solutions',
    'https://www.cvent.com/en/supplier-venue/hotel-business-intelligence',
    'https://www.cvent.com/en/supplier-venue/business-travel-solutions',
  ],
  blocks: [
    {
      name: 'hero-product-form',
      instances: [
        '.paragraph--type--header-banner-modern-form .header-banner-modern-form',
      ],
    },
    {
      name: 'lifecycle-wheel',
      instances: [
        '.paragraph--type--reference-block.cvent-main-wheel',
      ],
    },
    {
      name: 'columns-media',
      instances: [
        '.paragraph--type--compound-media-bar',
      ],
    },
    {
      name: 'cards-resource',
      instances: [
        '.paragraph--type--summary-resources',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '.paragraph--type--compound-content-bar',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero with Form',
      selector: '.paragraph--type--header-banner-modern-form',
      style: 'blue-green-gradient',
      blocks: ['hero-product-form'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Group Business Wheel',
      selector: '.paragraph--type--reference-block.cvent-main-wheel',
      style: null,
      blocks: ['lifecycle-wheel'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Feature Media Bars',
      selector: '.paragraph--type--compound-media-bar',
      style: null,
      blocks: ['columns-media'],
      defaultContent: ['.paragraph-header h2', '.paragraph-header .field--name-field-description p'],
    },
    {
      id: 'section-4',
      name: 'CVB/DMO CTA Banner',
      selector: '.paragraph--type--banner-basic:first-of-type',
      style: 'blue-green-gradient',
      blocks: [],
      defaultContent: ['.banner-basic h3', '.banner-basic a'],
    },
    {
      id: 'section-5',
      name: 'Cvent CONNECT Banner',
      selector: '.paragraph--type--banner-basic:last-of-type',
      style: 'blue-green-gradient',
      blocks: [],
      defaultContent: ['.banner-basic h3', '.banner-basic p', '.banner-basic a'],
    },
    {
      id: 'section-6',
      name: 'Related Resources',
      selector: '.paragraph--type--summary-resources',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-7',
      name: 'Why Cvent Trust Bar',
      selector: '.trust-bar .paragraph--type--compound-content-bar',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['.compound-content-bar .paragraph-header h2'],
    },
  ],
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
