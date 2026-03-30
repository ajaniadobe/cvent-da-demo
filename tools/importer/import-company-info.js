/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsMediaParser from './parsers/columns-media.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';
import fragmentReplacerTransformer from './transformers/fragment-replacer.js';

// PARSER REGISTRY
const parsers = {
  'columns-media': columnsMediaParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'company-info',
  description: 'Company information pages including about, leadership, awards, partners, and security',
  urls: [
    'https://www.cvent.com/en/company',
    'https://www.cvent.com/en/awards',
    'https://www.cvent.com/en/management-team',
    'https://www.cvent.com/en/become-partner',
    'https://www.cvent.com/en/security',
  ],
  blocks: [
    {
      name: 'columns-media',
      instances: [
        '.paragraph--type--compound-media-bar',
        '.paragraph--type--header-banner-media',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.paragraph--type--header-banner-media',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Content Sections',
      selector: '.paragraph--type--compound-media-bar',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
  ],
  fragments: [
    {
      path: '/content/fragments/why-cvent-social-proof',
      match: { sourceSelector: '.paragraph--type--compound-content-bar', contentText: '24/7 support' },
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cventCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cventSectionsTransformer] : []),
  fragmentReplacerTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
