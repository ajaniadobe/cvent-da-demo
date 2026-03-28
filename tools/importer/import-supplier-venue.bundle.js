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

  // tools/importer/import-supplier-venue.js
  var import_supplier_venue_exports = {};
  __export(import_supplier_venue_exports, {
    default: () => import_supplier_venue_default
  });

  // tools/importer/parsers/hero-product-form.js
  function parse(element, { document }) {
    const cells = [];
    const mainContent = element.querySelector(".header-banner-feature__main-content");
    const contentCell = [];
    if (mainContent) {
      const wysiwyg = mainContent.querySelector(".field--name-field-wysiwyg");
      if (wysiwyg) {
        [...wysiwyg.children].forEach((child) => {
          contentCell.push(child.cloneNode(true));
        });
      }
    }
    const extraContent = element.querySelector(".header-banner-feature__extra-content");
    if (extraContent) {
      const img = extraContent.querySelector("img");
      if (img) {
        contentCell.push(img.cloneNode(true));
      }
    }
    const sidebar = element.querySelector(".header-banner-feature__side");
    const sidebarCell = [];
    if (sidebar) {
      const formHeading = sidebar.querySelector("h2, h3, h4");
      if (formHeading) {
        sidebarCell.push(formHeading.cloneNode(true));
      }
      const form = sidebar.querySelector("form");
      if (form) {
        sidebarCell.push(form.cloneNode(true));
      }
    }
    if (contentCell.length > 0 || sidebarCell.length > 0) {
      cells.push([contentCell, sidebarCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-product-form",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/lifecycle-wheel.js
  function parse2(element, { document }) {
    const cells = [];
    const quadrants = element.querySelectorAll(".desktop-spoke-container");
    const taglines = {};
    const mobileContainer = element.querySelector(".mobile-spoke-container");
    if (mobileContainer) {
      const outerTabs = mobileContainer.querySelectorAll(".outer-tab");
      outerTabs.forEach((tab) => {
        const name = tab.textContent.trim();
        taglines[name] = "";
      });
    }
    const centerDesc = element.querySelector(".wheel-product-desc");
    const centerName = element.querySelector(".wheel-center-content h3");
    if (centerName && centerDesc) {
      taglines[centerName.textContent.trim()] = centerDesc.textContent.trim();
    }
    quadrants.forEach((quadrant) => {
      const quadrantId = quadrant.id || "";
      const name = quadrantId.replace("quadrant-", "");
      if (!name) return;
      const tagline = taglines[name] || "";
      const featuresList = document.createElement("ul");
      const accordionItems = quadrant.querySelectorAll(".accordion-item");
      accordionItems.forEach((item) => {
        const tabBtn = item.querySelector(".desktop-accordion-tab span");
        const featureName = tabBtn ? tabBtn.textContent.trim() : "";
        const listItems = item.querySelectorAll(".accordion-list li");
        listItems.forEach((li) => {
          const desc = li.querySelector("p");
          const link = li.querySelector("a");
          const featureLi = document.createElement("li");
          if (featureName) {
            const strong = document.createElement("strong");
            strong.textContent = featureName;
            featureLi.append(strong);
          }
          if (desc) {
            featureLi.append(document.createTextNode(": "));
            featureLi.append(document.createTextNode(desc.textContent.trim()));
          }
          if (link) {
            featureLi.append(document.createTextNode(" "));
            const a = document.createElement("a");
            a.href = link.href;
            a.textContent = link.textContent.trim();
            featureLi.append(a);
          }
          featuresList.append(featureLi);
        });
      });
      cells.push([name, tagline, featuresList]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "lifecycle-wheel",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const cells = [];
    const mediaBar = element.querySelector(".compound-media-bar");
    if (mediaBar) {
      const mediaSide = mediaBar.querySelector(".compound-media-bar__media");
      const contentSide = mediaBar.querySelector(".compound-media-bar__content");
      const mediaCol = [];
      const contentCol = [];
      if (mediaSide) {
        const pic = mediaSide.querySelector("picture, img, video");
        if (pic) mediaCol.push(pic);
      }
      if (contentSide) {
        const wrapper = contentSide.querySelector(".compound-media-bar__content-wrapper");
        const contentSource = wrapper || contentSide;
        const simpleContent = contentSource.querySelector(".paragraph--type--simple-content");
        if (simpleContent) {
          const heading = simpleContent.querySelector("h2, h3, h4");
          if (heading) contentCol.push(heading);
          const desc = simpleContent.querySelector(".field--name-field-description, .text-formatted");
          if (desc) {
            Array.from(desc.children).forEach((child) => contentCol.push(child));
          }
        } else {
          Array.from(contentSource.querySelectorAll("h2, h3, h4, p, ul, ol, a")).forEach((el) => {
            contentCol.push(el);
          });
        }
      }
      const isMediaFirst = element.classList.contains("media-position-left") || element.classList.contains("media-order-first");
      if (isMediaFirst) {
        cells.push([mediaCol, contentCol]);
      } else {
        cells.push([contentCol, mediaCol]);
      }
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "columns-media",
        cells
      });
      element.replaceWith(block2);
      return;
    }
    const contentBar = element.querySelector(".compound-content-bar");
    if (contentBar) {
      const contentItems = contentBar.querySelectorAll(".field--name-field-p-content-bar-items > .field__item");
      if (contentItems.length >= 2) {
        const leftCol = [];
        const rightCol = [];
        Array.from(contentItems[0].querySelectorAll("picture, img, h2, h3, h4, p, ul, ol, a")).forEach((el) => {
          leftCol.push(el);
        });
        Array.from(contentItems[1].querySelectorAll("picture, img, h2, h3, h4, p, ul, ol, a")).forEach((el) => {
          rightCol.push(el);
        });
        cells.push([leftCol, rightCol]);
      } else {
        const allContent = [];
        contentBar.querySelectorAll("picture, img, h2, h3, h4, p, ul, ol, a").forEach((el) => {
          allContent.push(el);
        });
        cells.push([allContent]);
      }
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "columns-media",
        cells
      });
      element.replaceWith(block2);
      return;
    }
    const formEl = element.querySelector(".compound-form");
    if (formEl) {
      const formContentWrap = formEl.querySelector(".field--name-field-p-content-item");
      const formSideWrap = formEl.querySelector(".field--name-field-p-sidebar-item");
      const contentCol = [];
      const formCol = [];
      if (formContentWrap) {
        const simpleContent = formContentWrap.querySelector(".paragraph--type--simple-content");
        const descSource = simpleContent || formContentWrap;
        const desc = descSource.querySelector(".field--name-field-description, .text-formatted");
        if (desc) {
          Array.from(desc.children).forEach((child) => contentCol.push(child));
        } else {
          Array.from(descSource.querySelectorAll("h2, h3, h4, p, ul, ol, a")).forEach((el) => {
            contentCol.push(el);
          });
        }
      }
      if (formSideWrap) {
        const form = formSideWrap.querySelector("form");
        if (form) {
          formCol.push(form);
        } else {
          formCol.push(formSideWrap);
        }
      }
      cells.push([contentCol, formCol]);
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "columns-media",
        cells
      });
      element.replaceWith(block2);
      return;
    }
    const children = Array.from(element.children);
    if (children.length >= 2) {
      cells.push([children[0], children[1]]);
    } else if (children.length === 1) {
      cells.push([children[0]]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-media",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/cards-feature.js
  function parse5(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    const items = element.querySelectorAll(".paragraph--type--simple-icon-content");
    items.forEach((item) => {
      const icon = item.querySelector(".simple-icon-content__icon img");
      const label = item.querySelector(".simple-icon-content__content h3");
      const imageCell = [];
      const textCell = [];
      if (icon) {
        imageCell.push(icon.cloneNode(true));
      }
      if (label) {
        textCell.push(label.cloneNode(true));
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-feature",
      cells
    });
    element.replaceWith(block);
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

  // tools/importer/import-supplier-venue.js
  var parsers = {
    "hero-product-form": parse,
    "lifecycle-wheel": parse2,
    "columns-media": parse3,
    "cards-resource": parse4,
    "cards-feature": parse5
  };
  var PAGE_TEMPLATE = {
    name: "supplier-venue",
    description: "Supplier and venue solution pages for hoteliers and venue operators",
    urls: [
      "https://www.cvent.com/en/supplier-venue",
      "https://www.cvent.com/en/supplier-venue/group-marketing-solutions",
      "https://www.cvent.com/en/supplier-venue/group-sales-solutions",
      "https://www.cvent.com/en/supplier-venue/group-operations-solutions",
      "https://www.cvent.com/en/supplier-venue/hotel-business-intelligence",
      "https://www.cvent.com/en/supplier-venue/business-travel-solutions"
    ],
    blocks: [
      {
        name: "hero-product-form",
        instances: [
          ".paragraph--type--header-banner-modern-form .header-banner-modern-form"
        ]
      },
      {
        name: "lifecycle-wheel",
        instances: [
          ".paragraph--type--reference-block.cvent-main-wheel"
        ]
      },
      {
        name: "columns-media",
        instances: [
          ".paragraph--type--compound-media-bar"
        ]
      },
      {
        name: "cards-resource",
        instances: [
          ".paragraph--type--summary-resources"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          ".paragraph--type--compound-content-bar"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero with Form",
        selector: ".paragraph--type--header-banner-modern-form",
        style: "blue-green-gradient",
        blocks: ["hero-product-form"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Group Business Wheel",
        selector: ".paragraph--type--reference-block.cvent-main-wheel",
        style: null,
        blocks: ["lifecycle-wheel"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Feature Media Bars",
        selector: ".paragraph--type--compound-media-bar",
        style: null,
        blocks: ["columns-media"],
        defaultContent: [".paragraph-header h2", ".paragraph-header .field--name-field-description p"]
      },
      {
        id: "section-4",
        name: "CVB/DMO CTA Banner",
        selector: ".paragraph--type--banner-basic:first-of-type",
        style: "blue-green-gradient",
        blocks: [],
        defaultContent: [".banner-basic h3", ".banner-basic a"]
      },
      {
        id: "section-5",
        name: "Cvent CONNECT Banner",
        selector: ".paragraph--type--banner-basic:last-of-type",
        style: "blue-green-gradient",
        blocks: [],
        defaultContent: [".banner-basic h3", ".banner-basic p", ".banner-basic a"]
      },
      {
        id: "section-6",
        name: "Related Resources",
        selector: ".paragraph--type--summary-resources",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: [".paragraph-header h2"]
      },
      {
        id: "section-7",
        name: "Why Cvent Trust Bar",
        selector: ".trust-bar .paragraph--type--compound-content-bar",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: [".compound-content-bar .paragraph-header h2"]
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
  var import_supplier_venue_default = {
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
  return __toCommonJS(import_supplier_venue_exports);
})();
