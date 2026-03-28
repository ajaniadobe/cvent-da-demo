var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-resource-listing.js
  var import_resource_listing_exports = {};
  __export(import_resource_listing_exports, {
    default: () => import_resource_listing_default
  });

  // tools/importer/parsers/cards-resource.js
  function parse(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    const cards = element.querySelectorAll(".resource-card__column article");
    cards.forEach((card) => {
      const img = card.querySelector(".resource__thumb img");
      const category = card.querySelector(".field--name-field-resource-type");
      const categoryText = category ? category.textContent.trim() : "";
      const title = card.querySelector(".field--name-node-title h2, .field--name-node-title h3");
      const titleText = title ? title.textContent.trim() : "";
      const link = card.querySelector("a.resource-card-link");
      const href = link ? link.href : "";
      const contentCell = [];
      if (categoryText) {
        const em = document.createElement("em");
        em.textContent = categoryText;
        contentCell.push(em);
      }
      if (titleText) {
        const h3 = document.createElement("h3");
        h3.textContent = titleText;
        contentCell.push(h3);
      }
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = "Read more";
        const p = document.createElement("p");
        p.append(a);
        contentCell.push(p);
      }
      const imageCell = [];
      if (img) {
        imageCell.push(img.cloneNode(true));
      }
      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "cards-resource",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/cvent-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#block-exitoverlaysblock",
        ".exit-overlays-wrapper",
        ".notifications-ajax-wrapper",
        "#skip-to-content"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".homepage-header-container",
        ".region-featured",
        ".region-header-top",
        ".region-header",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-once");
        el.removeAttribute("data-drupal-selector");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/cvent-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        const isFirst = section.id === sections[0].id;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-resource-listing.js
  var parsers = {
    "cards-resource": parse
  };
  var PAGE_TEMPLATE = {
    name: "resource-listing",
    description: "Resource listing and index pages including blog, case studies, webinars, and newsroom",
    urls: [
      "https://www.cvent.com/en/blog",
      "https://www.cvent.com/en/case-studies",
      "https://www.cvent.com/en/upcoming-webinars",
      "https://www.cvent.com/en/resources",
      "https://www.cvent.com/en/cvent-news-and-press-releases"
    ],
    blocks: [
      {
        name: "cards-resource",
        instances: [
          ".paragraph--type--summary-resources",
          ".paragraph--type--reference-block.provider--views"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".paragraph--type--header-banner-modern-form",
        style: "blue-purple-gradient",
        blocks: [],
        defaultContent: [
          ".header-banner-modern-form h1",
          ".header-banner-modern-form p",
          ".header-banner-modern-form a.button-blue"
        ]
      },
      {
        id: "section-2",
        name: "Featured Resources",
        selector: ".paragraph--type--summary-resources",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Resource Listing Grid",
        selector: ".paragraph--type--reference-block.provider--views",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: [".view-resources > h2"]
      },
      {
        id: "section-4",
        name: "Newsletter CTA",
        selector: ".paragraph--type--compound-form",
        style: "blue-purple-gradient",
        blocks: [],
        defaultContent: [
          ".paragraph--type--simple-content h3",
          ".paragraph--type--simple-content p",
          ".paragraph--type--simple-image img"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_resource_listing_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_resource_listing_exports);
})();
