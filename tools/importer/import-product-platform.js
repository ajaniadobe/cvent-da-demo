/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductFormParser from './parsers/hero-product-form.js';
import tabsIntegrationsParser from './parsers/tabs-integrations.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import formParser from './parsers/form.js';
import logoWallParser from './parsers/logo-wall.js';
import tabsHorizontalParser from './parsers/tabs-horizontal.js';
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product-form': heroProductFormParser,
  'tabs-integrations': tabsIntegrationsParser,
  'tabs-horizontal': tabsHorizontalParser,
  'columns-media': columnsMediaParser,
  'cards-testimonial': cardsTestimonialParser,
  'cards-feature': cardsFeatureParser,
  'form': formParser,
  'logo-wall': logoWallParser,
  'accordion': accordionParser,
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
        '.paragraph--type--header-banner-media',
        '.paragraph--type--compound-content-bar',
      ],
    },
    {
      name: 'cards-testimonial',
      instances: [
        '.paragraph--type--layout-content.column-count-3',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '.paragraph--type--layout-content.column-count-4',
      ],
    },
    {
      name: 'form',
      instances: [
        '.paragraph--type--compound-form',
      ],
    },
    {
      name: 'logo-wall',
      instances: [
        '.paragraph--type--logo-bar',
      ],
    },
    {
      name: 'tabs-horizontal',
      instances: [
        '.paragraph--type--layout-tabs-h',
      ],
    },
    {
      name: 'accordion',
      instances: [
        '.paragraph--type--layout-accordion',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: ['.paragraph--type--header-banner-media', '.paragraph--type--header-banner-modern-form'],
      style: null,
      blocks: ['columns-media', 'hero-product-form'],
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
      name: 'Feature Cards',
      selector: ['.paragraph--type--layout-content.column-count-3.bg-color-light-gray', '.paragraph--type--layout-content.column-count-2'],
      style: 'light-grey',
      blocks: ['cards-feature'],
      defaultContent: ['.paragraph-header h2', '.paragraph-header p'],
    },
    {
      id: 'section-4',
      name: 'Add-ons Grid',
      selector: '.paragraph--type--layout-content.column-count-4',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-5',
      name: 'CTA Banner',
      selector: '.paragraph--type--banner-basic',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: ['.banner-basic h2', '.banner-basic a'],
    },
    {
      id: 'section-6',
      name: 'Integrations Tabs',
      selector: '.paragraph--type--layout-tabs-v',
      style: null,
      blocks: ['tabs-integrations'],
      defaultContent: ['.paragraph-header h2', '.paragraph-header p'],
    },
    {
      id: 'section-7',
      name: 'Content Columns',
      selector: ['.paragraph--type--compound-media-bar', '.paragraph--type--compound-content-bar'],
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Testimonials',
      selector: '.paragraph--type--layout-content.column-count-3:not(.bg-color-light-gray)',
      style: 'light-grey',
      blocks: ['cards-testimonial'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-9',
      name: 'Logo Wall',
      selector: '.paragraph--type--logo-bar',
      style: null,
      blocks: ['logo-wall'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Form',
      selector: '.paragraph--type--compound-form',
      style: 'blue-purple-gradient',
      blocks: ['form'],
      defaultContent: [],
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
