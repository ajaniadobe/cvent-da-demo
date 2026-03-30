/* eslint-disable */
/* global WebImporter */

import heroProductFormParser from './parsers/hero-product-form.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsQuoteParser from './parsers/cards-quote.js';
import tabsHorizontalParser from './parsers/tabs-horizontal.js';
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';
import fragmentReplacerTransformer from './transformers/fragment-replacer.js';

const parsers = {
  'hero-product-form': heroProductFormParser,
  'columns-media': columnsMediaParser,
  'cards-feature': cardsFeatureParser,
  'cards-quote': cardsQuoteParser,
  'tabs-horizontal': tabsHorizontalParser,
};

const PAGE_TEMPLATE = {
  name: 'training-certification',
  description: 'Training and certification pages for Cvent platform education and professional development',
  urls: [
    'https://www.cvent.com/en/academy',
    'https://www.cvent.com/en/cvent-certification',
  ],
  blocks: [
    {
      name: 'hero-product-form',
      instances: ['.paragraph--type--header-banner-modern-form .header-banner-modern-form'],
    },
    {
      name: 'columns-media',
      instances: ['.paragraph--type--compound-media-bar', '.paragraph--type--header-banner-media'],
    },
    {
      name: 'cards-feature',
      instances: ['.paragraph--type--layout-content.column-count-4'],
    },
    {
      name: 'cards-quote',
      instances: ['.paragraph--type--layout-content.column-count-2'],
    },
    {
      name: 'tabs-horizontal',
      instances: ['.paragraph--type--layout-tabs-h'],
    },
  ],
  fragments: [
    {
      path: '/content/fragments/why-cvent-social-proof',
      match: { sourceSelector: '.paragraph--type--compound-content-bar', contentText: '24/7 support' },
    },
  ],
};

const transformers = [
  cventCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cventSectionsTransformer] : []),
  fragmentReplacerTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((t) => { try { t.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed:`, e); } });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name}:`, e); } }
    });
    executeTransformers('afterTransform', main, payload);
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''));
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
