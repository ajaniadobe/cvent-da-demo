/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsResourceParser from './parsers/cards-resource.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-resource': cardsResourceParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'resource-listing',
  description: 'Resource listing and index pages including blog, case studies, webinars, and newsroom',
  urls: [
    'https://www.cvent.com/en/blog',
    'https://www.cvent.com/en/case-studies',
    'https://www.cvent.com/en/upcoming-webinars',
    'https://www.cvent.com/en/resources',
    'https://www.cvent.com/en/cvent-news-and-press-releases',
  ],
  blocks: [
    {
      name: 'cards-resource',
      instances: [
        '.paragraph--type--summary-resources',
        '.paragraph--type--reference-block.provider--views',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.paragraph--type--header-banner-modern-form',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: [
        '.header-banner-modern-form h1',
        '.header-banner-modern-form p',
        '.header-banner-modern-form a.button-blue',
      ],
    },
    {
      id: 'section-2',
      name: 'Featured Resources',
      selector: '.paragraph--type--summary-resources',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Resource Listing Grid',
      selector: '.paragraph--type--reference-block.provider--views',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: ['.view-resources > h2'],
    },
    {
      id: 'section-4',
      name: 'Newsletter CTA',
      selector: '.paragraph--type--compound-form',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: [
        '.paragraph--type--simple-content h3',
        '.paragraph--type--simple-content p',
        '.paragraph--type--simple-image img',
      ],
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
