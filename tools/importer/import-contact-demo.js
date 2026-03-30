/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductFormParser from './parsers/hero-product-form.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import logoWallParser from './parsers/logo-wall.js';
import formParser from './parsers/form.js';

// TRANSFORMER IMPORTS
import cventCleanupTransformer from './transformers/cvent-cleanup.js';
import cventSectionsTransformer from './transformers/cvent-sections.js';

const parsers = {
  'hero-product-form': heroProductFormParser,
  'columns-media': columnsMediaParser,
  'cards-testimonial': cardsTestimonialParser,
  'logo-wall': logoWallParser,
  'form': formParser,
};

const PAGE_TEMPLATE = {
  name: 'contact-demo',
  description: 'Contact and demo request pages with forms for sales, support, and demo inquiries',
  urls: [
    'https://www.cvent.com/en/request-demo',
    'https://www.cvent.com/en/contact-us',
    'https://www.cvent.com/en/contact/support',
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
      name: 'cards-testimonial',
      instances: ['.paragraph--type--layout-content.column-count-3'],
    },
    {
      name: 'logo-wall',
      instances: ['.paragraph--type--logo-bar'],
    },
    {
      name: 'form',
      instances: ['.paragraph--type--compound-form'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.paragraph--type--header-banner-modern-form',
      style: null,
      blocks: ['hero-product-form'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Testimonials',
      selector: '.paragraph--type--layout-content.column-count-3',
      style: 'light-grey',
      blocks: ['cards-testimonial'],
      defaultContent: ['.paragraph-header h2'],
    },
    {
      id: 'section-3',
      name: 'Logo Wall',
      selector: '.paragraph--type--logo-bar',
      style: null,
      blocks: ['logo-wall'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'CTA Banner',
      selector: '.paragraph--type--banner-basic',
      style: 'blue-purple-gradient',
      blocks: [],
      defaultContent: ['.banner-basic h3', '.banner-basic a'],
    },
    {
      id: 'section-5',
      name: 'Content Columns',
      selector: '.paragraph--type--compound-media-bar',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Form',
      selector: '.paragraph--type--compound-form',
      style: null,
      blocks: ['form'],
      defaultContent: [],
    },
  ],
};

const transformers = [
  cventCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [cventSectionsTransformer] : []),
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
