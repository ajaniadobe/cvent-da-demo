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

  // tools/importer/import-training-certification.js
  var import_training_certification_exports = {};
  __export(import_training_certification_exports, {
    default: () => import_training_certification_default
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
      let hasRealFields = false;
      if (form) {
        const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea');
        hasRealFields = inputs.length > 0;
      }
      if (hasRealFields) {
        sidebarCell.push(form.cloneNode(true));
      } else {
        const fields = [
          "First name|text|*",
          "Last name|text|*",
          "Work email|email|*",
          "Phone|tel|*",
          "Organization|text|*",
          "Job function|select|*|Select one, Administration, Business Owner, Event Planning, Executive, Marketing, Operations, Sales, Technology, Other",
          "Country|select|*|Select Country, USA, Canada, United Kingdom, Germany, Australia"
        ];
        fields.forEach((f) => {
          const p = document.createElement("p");
          p.textContent = f;
          sidebarCell.push(p);
        });
        const submitP = document.createElement("p");
        submitP.textContent = formHeading ? "Submit" : "Request a demo";
        sidebarCell.push(submitP);
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

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    const items = element.querySelectorAll(".paragraph--type--simple-icon-content");
    items.forEach((item) => {
      const icon = item.querySelector(".simple-icon-content__icon img");
      const label = item.querySelector(".simple-icon-content__content h3");
      const description = item.querySelector(".simple-icon-content__content .field--name-field-description");
      const imageCell = [];
      const textCell = [];
      if (icon) {
        imageCell.push(icon.cloneNode(true));
      }
      if (label) {
        textCell.push(label.cloneNode(true));
      }
      if (description) {
        Array.from(description.children).forEach((child) => textCell.push(child.cloneNode(true)));
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

  // tools/importer/parsers/cards-quote.js
  function parse4(element, { document }) {
    const quoteItems = element.querySelectorAll(".paragraph--type--simple-icon-content.icon-layout-top-center");
    if (quoteItems.length === 0) return;
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    quoteItems.forEach((item) => {
      const imageCell = [];
      const textCell = [];
      const img = item.querySelector(".simple-icon-content__icon img");
      if (img) {
        imageCell.push(img.cloneNode(true));
      }
      const description = item.querySelector(".simple-icon-content__content .field--name-field-description");
      if (description) {
        [...description.children].forEach((child) => {
          textCell.push(child.cloneNode(true));
        });
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-testimonial",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-horizontal.js
  function parse5(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2, .paragraph-header .field--name-field-heading");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    const description = element.querySelector(".paragraph-header .field--name-field-description p");
    if (description) {
      element.before(description.cloneNode(true));
    }
    const tabLinks = element.querySelectorAll('ul[role="tablist"] a[role="tab"], ul.tabs a.tab-link');
    const tabPanels = element.querySelectorAll('.paragraph--type--compound-tab-h[role="tabpanel"], .paragraph--type--compound-tab-h');
    const count = Math.min(tabLinks.length, tabPanels.length);
    for (let i = 0; i < count; i++) {
      const labelText = tabLinks[i].textContent.trim();
      const panel = tabPanels[i];
      const contentCell = [];
      const panelHeadings = panel.querySelectorAll("h2, h3, h4");
      panelHeadings.forEach((h) => contentCell.push(h.cloneNode(true)));
      const panelDescriptions = panel.querySelectorAll(".field--name-field-description p, .simple-content p");
      panelDescriptions.forEach((p) => {
        if (p.textContent.trim()) contentCell.push(p.cloneNode(true));
      });
      const panelImages = panel.querySelectorAll(".field--name-field-image img, .field--name-field-p-media-item img");
      panelImages.forEach((img) => contentCell.push(img.cloneNode(true)));
      const panelLinks = panel.querySelectorAll("a.cta-link, .field--name-field-link a");
      panelLinks.forEach((a) => contentCell.push(a.cloneNode(true)));
      if (contentCell.length > 0) {
        cells.push([labelText, contentCell]);
      }
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "tabs-integrations",
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

  // tools/importer/import-training-certification.js
  var parsers = {
    "hero-product-form": parse,
    "columns-media": parse2,
    "cards-feature": parse3,
    "cards-quote": parse4,
    "tabs-horizontal": parse5
  };
  var PAGE_TEMPLATE = {
    name: "training-certification",
    description: "Training and certification pages for Cvent platform education and professional development",
    urls: [
      "https://www.cvent.com/en/academy",
      "https://www.cvent.com/en/cvent-certification"
    ],
    blocks: [
      {
        name: "hero-product-form",
        instances: [".paragraph--type--header-banner-modern-form .header-banner-modern-form"]
      },
      {
        name: "columns-media",
        instances: [".paragraph--type--compound-media-bar", ".paragraph--type--header-banner-media"]
      },
      {
        name: "cards-feature",
        instances: [".paragraph--type--layout-content.column-count-4"]
      },
      {
        name: "cards-quote",
        instances: [".paragraph--type--layout-content.column-count-2"]
      },
      {
        name: "tabs-horizontal",
        instances: [".paragraph--type--layout-tabs-h"]
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
    transformers.forEach((t) => {
      try {
        t.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed:`, e);
      }
    });
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
  var import_training_certification_default = {
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
            console.error(`Failed to parse ${block.name}:`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, ""));
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_training_certification_exports);
})();
