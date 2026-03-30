/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductFormParser from './parsers/hero-product-form.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';
import fragmentReplacerTransformer from './transformers/fragment-replacer.js';

// PARSER REGISTRY
const parsers = {
  'hero-product-form': heroProductFormParser,
  'cards-feature': cardsFeatureParser,
  'cards-gallery': cardsGalleryParser,
  'columns-media': columnsMediaParser,
  'cards-testimonial': cardsTestimonialParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product-feature',
  description: 'Product feature detail pages showcasing individual Cvent products and capabilities',
  urls: [
    'https://www.cvent.com/en/event-marketing-management/event-registration-software',
    'https://www.cvent.com/en/event-marketing-management/mobile-event-apps',
    'https://www.cvent.com/en/event-marketing-management/webinar-platform',
    'https://www.cvent.com/en/event-marketing-management/cvent-essentials',
    'https://www.cvent.com/en/event-marketing-management/onarrival-event-check-in-software',
    'https://www.cvent.com/en/event-marketing-management/cvent-supplier-network',
    'https://www.cvent.com/en/event-marketing-management/accessibility',
  ],
  blocks: [
    {
      name: 'hero-product-form',
      instances: [
        '.paragraph--type--header-banner-modern-form .header-banner-modern-form',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '.paragraph--type--layout-content.column-count-3.bg-color-light-gray',
      ],
    },
    {
      name: 'cards-gallery',
      instances: [
        '.paragraph--type--showcase-gallery',
      ],
    },
    {
      name: 'columns-media',
      instances: [
        '.paragraph--type--compound-media-bar:not(.bg-color-gradient)',
        '.paragraph--type--compound-content-bar',
      ],
    },
    {
      name: 'cards-testimonial',
      instances: [
        '.paragraph--type--layout-content.column-count-3:not(.bg-color-light-gray)',
      ],
    },
    {
      name: 'columns',
      instances: [
        '.paragraph--type--layout-content.column-count-2',
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
      name: 'Features Grid',
      selector: '.paragraph--type--layout-content.column-count-3.bg-color-light-gray',
      style: 'light-grey',
      blocks: ['cards-feature'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-3',
      name: 'Brand Gallery',
      selector: '.paragraph--type--showcase-gallery',
      style: null,
      blocks: ['cards-gallery'],
      defaultContent: ['.showcase-gallery h2'],
    },
    {
      id: 'section-4',
      name: 'Feature Details',
      selector: '.paragraph--type--compound-media-bar:not(.bg-color-gradient)',
      style: null,
      blocks: ['columns-media'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-5',
      name: 'AI CTA',
      selector: '.paragraph--type--compound-media-bar.bg-color-gradient',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: ['.compound-media-bar__content h2', '.compound-media-bar__content p', '.compound-media-bar__content a'],
    },
    {
      id: 'section-6',
      name: 'Testimonials',
      selector: '.paragraph--type--layout-content.column-count-3:not(.bg-color-light-gray)',
      style: null,
      blocks: ['cards-testimonial'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-7',
      name: 'CRM Integration',
      selector: '.paragraph--type--compound-media-bar:last-of-type',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'CTA with Form',
      selector: '.paragraph--type--compound-form',
      style: 'blue-purple-gradient',
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Solutions Links',
      selector: '.paragraph--type--layout-content.column-count-2',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-10',
      name: 'Why Cvent',
      selector: '.paragraph--type--compound-content-bar',
      style: null,
      blocks: ['columns-media'],
      defaultContent: ['.compound-content-bar h2', '.compound-content-bar .stat-item'],
    },
  ],
  fragments: [
    {
      path: '/content/fragments/why-cvent-stats',
      match: { blockClass: 'columns-media', contentText: '24/7 support' },
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cventCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cventSectionsTransformer] : []),
  fragmentReplacerTransformer,
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
