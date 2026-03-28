/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductFormParser from './parsers/hero-product-form.js';
import tabsIntegrationsParser from './parsers/tabs-integrations.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product-form': heroProductFormParser,
  'tabs-integrations': tabsIntegrationsParser,
  'columns-media': columnsMediaParser,
  'cards-testimonial': cardsTestimonialParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product-platform',
  description: 'Product platform and overview pages including pricing, integrations, and product catalog',
  urls: [
    'https://www.cvent.com/en/event-management-software',
    'https://www.cvent.com/en/event-management-software/cvent-integrations',
    'https://www.cvent.com/en/event-management-software/cvent-pricing',
    'https://www.cvent.com/en/products',
    'https://www.cvent.com/en/event-types',
    'https://www.cvent.com/en/cventiq',
  ],
  blocks: [
    {
      name: 'hero-product-form',
      instances: [
        '.paragraph--type--header-banner-modern-form .header-banner-modern-form',
      ],
    },
    {
      name: 'tabs-integrations',
      instances: [
        '.paragraph--type--layout-tabs-v',
      ],
    },
    {
      name: 'columns-media',
      instances: [
        '.paragraph--type--compound-media-bar',
      ],
    },
    {
      name: 'cards-testimonial',
      instances: [
        '.paragraph--type--layout-content.column-count-3',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero with Form',
      selector: '.paragraph--type--header-banner-modern-form',
      style: null,
      blocks: ['hero-product-form'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Platform Tour',
      selector: '.paragraph--type--simple-content.alignment--center',
      style: null,
      blocks: [],
      defaultContent: ['.paragraph--type--simple-content h2', '.paragraph--type--simple-content img', '.paragraph--type--simple-content a'],
    },
    {
      id: 'section-3',
      name: 'Free Trial CTA',
      selector: '.paragraph--type--banner-basic',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: ['.banner-basic h2', '.banner-basic a'],
    },
    {
      id: 'section-4',
      name: 'Integrations Tabs',
      selector: '.paragraph--type--layout-tabs-v',
      style: null,
      blocks: ['tabs-integrations'],
      defaultContent: ['.paragraph-header h2', '.paragraph-header p'],
    },
    {
      id: 'section-5',
      name: 'Built for Any Event',
      selector: '.paragraph--type--compound-media-bar',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Customer Testimonials',
      selector: '.paragraph--type--layout-content.column-count-3',
      style: 'light-grey',
      blocks: ['cards-testimonial'],
      defaultContent: ['.paragraph-header h2'],
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
