var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-company-info.js
  var import_company_info_exports = {};
  __export(import_company_info_exports, {
    default: () => import_company_info_default
  });

  // tools/importer/parsers/columns-media.js
  function parse(element, { document }) {
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
        const statItems = contentSource.querySelectorAll(".paragraph--type--simple-stat");
        statItems.forEach((stat) => {
          const numEl = stat.querySelector(".field--name-field-stat");
          const descEl = stat.querySelector(".field--name-field-description p");
          if (numEl) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = numEl.textContent.trim();
            p.append(strong);
            contentCol.push(p);
          }
          if (descEl) {
            contentCol.push(descEl);
          }
        });
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
    const bannerMedia = element.querySelector(".header-banner-media");
    if (bannerMedia) {
      const contentSide = bannerMedia.querySelector(".header-banner-media--content");
      const mediaSide = bannerMedia.querySelector(".header-banner-media--media");
      const contentCol = [];
      const mediaCol = [];
      if (contentSide) {
        const wysiwyg = contentSide.querySelector(".field--name-field-wysiwyg");
        const contentSource = wysiwyg || contentSide;
        Array.from(contentSource.querySelectorAll("h1, h2, h3, h4, p, ul, ol, a")).forEach((el) => {
          if (el.tagName === "A" && el.parentElement && el.parentElement.tagName === "P") return;
          contentCol.push(el);
        });
      }
      if (mediaSide) {
        const pic = mediaSide.querySelector("picture, img");
        if (pic) mediaCol.push(pic);
      }
      cells.push([contentCol, mediaCol]);
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

  // tools/importer/parsers/logo-wall.js
  function parse2(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2, h2");
    if (heading) {
      cells.push([heading.cloneNode(true)]);
    }
    const imgs = element.querySelectorAll("img");
    const logoContainer = document.createElement("div");
    let logoCount = 0;
    imgs.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (src.includes("pixel") || src.includes("tracking")) return;
      const p = document.createElement("p");
      p.appendChild(img.cloneNode(true));
      logoContainer.appendChild(p);
      logoCount++;
    });
    if (logoCount > 0) {
      cells.push([logoContainer]);
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "logo-wall",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cvent-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      element.querySelectorAll("a").forEach((a) => {
        if (a.textContent.trim() === "___" && a.getAttribute("href") === "#") {
          const parent = a.closest("p") || a.parentElement;
          if (parent && parent.textContent.trim() === "___") {
            parent.remove();
          } else {
            a.remove();
          }
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "#block-exitoverlaysblock",
        ".exit-overlays-wrapper",
        ".notifications-ajax-wrapper",
        "#skip-to-content"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter",
        '[class*="optanon"]',
        '[id*="optanon"]'
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("cdn.bizible.com") || src.includes("cdn.bizibly.com") || src.includes("googleadservices.com") || src.includes("googleads.g.doubleclick.net") || src.includes("cdn.cookielaw.org") || src.includes("facebook.com/tr") || src.includes("analytics.twitter.com") || src.includes("?") && img.getAttribute("alt") === "" && img.width <= 1) {
          img.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        ".a2a_kit",
        ".addtoany_share",
        '[class*="addtoany"]'
      ]);
      element.querySelectorAll('button .inactive, button [hidden], [role="button"] .inactive').forEach((el) => {
        el.remove();
      });
      element.querySelectorAll('button, [role="button"], .ui-dialog-titlebar-close').forEach((btn) => {
        const text = btn.textContent.trim();
        if (text === "Close" || text === "\xD7" || text === "\u2715" || text === "X") {
          btn.remove();
        }
      });
      element.querySelectorAll("div, span, p").forEach((el) => {
        if (el.children.length === 0) {
          const text = el.textContent.trim();
          if (text === "Thanks for sharing!" || text === "\u2713" || text === "More\u2026") {
            el.remove();
          }
        }
      });
      element.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (href && (href.startsWith("https://www.cvent.com/") || href.startsWith("http://www.cvent.com/"))) {
          try {
            const url = new URL(href);
            const path = url.pathname.replace(/\/$/, "") || "/";
            if (path.startsWith("/en/") || path === "/en") {
              a.setAttribute("href", path);
            }
          } catch (e) {
          }
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".region-featured",
        ".region-header-top",
        ".region-header",
        ".sticky-placeholer",
        ".region-highlighted",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("img, a").forEach((el) => {
        const src = el.getAttribute("src") || el.getAttribute("href") || "";
        if (src.includes("cookielaw.org") || src.includes("onetrust.com") || src.includes("cookiepedia.co.uk")) {
          const parent = el.closest("p");
          if (parent && parent.querySelectorAll("img, a").length <= 2) {
            parent.remove();
          } else {
            el.remove();
          }
        }
      });
      const headings = element.querySelectorAll("h2, h3, h4");
      headings.forEach((heading) => {
        const text = heading.textContent.trim();
        if (text === "Privacy Preference Center" || text === "Manage Consent Preferences" || text === "Cookie List" || text === "Functional Cookies" || text === "Targeting Cookies" || text === "Strictly Necessary Cookies" || text === "Performance Cookies") {
          let sibling = heading.nextElementSibling;
          while (sibling) {
            const next = sibling.nextElementSibling;
            const sibText = sibling.textContent.trim();
            if ((sibling.tagName === "H2" || sibling.tagName === "H3") && sibText !== "Manage Consent Preferences" && sibText !== "Cookie List" && sibText !== "Functional Cookies" && sibText !== "Targeting Cookies" && sibText !== "Strictly Necessary Cookies" && sibText !== "Performance Cookies") {
              break;
            }
            sibling.remove();
            sibling = next;
          }
          heading.remove();
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (text === "Allow All" || text === "Reject All Confirm My Choices" || text === "Always Active" || text === "Apply Cancel" || text === "Consent Leg.Interest" || text === "Search\u2026" || text === "Clear" || text.match(/^\[[\sx]\] checkbox label/) || text.match(/^\[[\sx]\] (Functional|Targeting|Performance) Cookies$/)) {
          p.remove();
        }
      });
      element.querySelectorAll('img[alt=""]').forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("bizible.com") || src.includes("bizibly.com") || src.includes("googleadservices.com") || src.includes("cookielaw.org")) {
          const parent = img.closest("p");
          if (parent && parent.textContent.trim() === "") {
            parent.remove();
          } else {
            img.remove();
          }
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (text.endsWith("Close") && text.length > 5) {
          const fixed = text.replace(/Close$/, "");
          if (fixed !== text) {
            p.textContent = fixed;
          }
        }
      });
      element.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href") || "";
        const text = a.textContent.trim();
        if (href.includes("addtoany.com") || href === "#addtoany" || text === "AddToAny" || text === "More\u2026") {
          const parent = a.closest("p");
          if (parent && parent.querySelectorAll("a").length <= 1) {
            parent.remove();
          } else {
            a.remove();
          }
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (text === "Thanks for sharing!" || text === "\u2713") {
          p.remove();
        }
      });
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
    if (hookName === TransformHook2.beforeTransform) {
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
        let firstSectionNode = sectionEl;
        if (section.defaultContent && section.defaultContent.length > 0) {
          const allDescendants = [...sectionEl.querySelectorAll("*")];
          const midpoint = allDescendants.length / 2;
          section.defaultContent.forEach((dcSelector) => {
            const dcEl = element.querySelector(dcSelector);
            if (!dcEl) {
              console.warn(`Default content not found: ${dcSelector}`);
              return;
            }
            if (!sectionEl.contains(dcEl)) return;
            const dcIndex = allDescendants.indexOf(dcEl);
            const isBefore = dcIndex >= 0 && dcIndex < midpoint;
            if (isBefore) {
              sectionEl.before(dcEl);
              if (firstSectionNode === sectionEl) {
                firstSectionNode = dcEl;
              }
            } else {
              sectionEl.after(dcEl);
            }
          });
        }
        const isFirst = section.id === sections[0].id;
        if (!isFirst) {
          const hr = document.createElement("hr");
          firstSectionNode.before(hr);
        }
      });
    }
  }

  // tools/importer/transformers/fragment-replacer.js
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const fragments = payload.template && payload.template.fragments;
    if (!fragments || fragments.length === 0) return;
    fragments.forEach((frag) => {
      const { path, match } = frag;
      if (!path || !match) return;
      const toReplace = findMatchingElements(element, match);
      if (toReplace.length === 0) return;
      const link = document.createElement("a");
      link.href = path;
      link.textContent = path;
      const block = WebImporter.Blocks.createBlock(document, { name: "fragment", cells: [[link]] });
      toReplace[0].replaceWith(block);
      for (let i = 1; i < toReplace.length; i++) toReplace[i].remove();
      console.log("[fragment-replacer] Replaced with fragment: " + path);
    });
  }
  function normalizeBlockName(name) {
    return name.toLowerCase().replace(/[-\s]+/g, "");
  }
  function isBlockTable(el, blockName) {
    if (!el || el.tagName !== "TABLE") return false;
    const th = el.querySelector("tr:first-child th");
    if (!th) return false;
    return normalizeBlockName(th.textContent.trim()) === normalizeBlockName(blockName);
  }
  function findBlockTables(root, blockName) {
    const tables = root.querySelectorAll("table");
    const results = [];
    for (const table of tables) {
      if (isBlockTable(table, blockName)) results.push(table);
    }
    return results;
  }
  function findMatchingElements(root, match) {
    if (match.heading && match.blockClass) {
      const headings = root.querySelectorAll("h2");
      for (const h2 of headings) {
        if (!h2.textContent.trim().toLowerCase().startsWith(match.heading.toLowerCase())) continue;
        let sibling = h2.nextElementSibling;
        let steps = 0;
        while (sibling && steps < 5) {
          if (isBlockTable(sibling, match.blockClass)) {
            const elements = [h2];
            let walker = h2.nextElementSibling;
            while (walker && walker !== sibling) {
              elements.push(walker);
              walker = walker.nextElementSibling;
            }
            elements.push(sibling);
            return elements;
          }
          if (sibling.tagName === "HR") break;
          sibling = sibling.nextElementSibling;
          steps++;
        }
      }
      return [];
    }
    if (match.blockClass && match.contentText) {
      const tables = findBlockTables(root, match.blockClass);
      for (const table of tables) {
        if (!table.textContent.includes(match.contentText)) continue;
        const elements = [table];
        const prev = table.previousElementSibling;
        if (prev && prev.tagName === "H2" && prev.textContent.trim().toLowerCase().startsWith("why cvent")) {
          elements.unshift(prev);
        }
        return elements;
      }
      return [];
    }
    if (match.heading && match.followingCount) {
      const headings = root.querySelectorAll("h2");
      for (const h2 of headings) {
        if (!h2.textContent.trim().toLowerCase().startsWith(match.heading.toLowerCase())) continue;
        const elements = [h2];
        let next = h2.nextElementSibling;
        let count = 0;
        while (next && count < match.followingCount) {
          if (next.tagName === "HR" || next.tagName === "H2") break;
          if (isBlockTable(next, "Section Metadata")) break;
          elements.push(next);
          next = next.nextElementSibling;
          count++;
        }
        if (count > 0) return elements;
      }
      return [];
    }
    if (match.sourceSelector) {
      const candidates = root.querySelectorAll(match.sourceSelector);
      for (const el of candidates) {
        if (match.contentText && !el.textContent.includes(match.contentText)) continue;
        return [el];
      }
      return [];
    }
    return [];
  }

  // tools/importer/import-company-info.js
  var parsers = {
    "columns-media": parse,
    "logo-wall": parse2
  };
  var PAGE_TEMPLATE = {
    name: "company-info",
    description: "Company information pages including about, leadership, awards, partners, and security",
    urls: [
      "https://www.cvent.com/en/company",
      "https://www.cvent.com/en/awards",
      "https://www.cvent.com/en/management-team",
      "https://www.cvent.com/en/become-partner",
      "https://www.cvent.com/en/security"
    ],
    blocks: [
      {
        name: "columns-media",
        instances: [
          ".paragraph--type--compound-media-bar",
          ".paragraph--type--header-banner-media"
        ]
      },
      {
        name: "logo-wall",
        instances: [
          ".paragraph--type--logo-bar"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".paragraph--type--header-banner-media",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Content Sections",
        selector: ".paragraph--type--compound-media-bar",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      }
    ],
    fragments: [
      {
        path: "/content/fragments/why-cvent-social-proof",
        match: { sourceSelector: ".paragraph--type--compound-content-bar", contentText: "24/7 support" }
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : [],
    transform3
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_company_info_default = {
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
  return __toCommonJS(import_company_info_exports);
})();
