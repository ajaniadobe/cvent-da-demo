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

  // tools/importer/import-contact-demo.js
  var import_contact_demo_exports = {};
  __export(import_contact_demo_exports, {
    default: () => import_contact_demo_default
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

  // tools/importer/parsers/cards-testimonial.js
  function parse3(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".paragraph-header h2");
    if (heading) {
      element.before(heading.cloneNode(true));
    }
    const cards = element.querySelectorAll(".paragraph--type--simple-card");
    cards.forEach((card) => {
      const imageCell = [];
      const textCell = [];
      const img = card.querySelector(".innerlink img");
      if (img) {
        imageCell.push(img.cloneNode(true));
      }
      const companyHeading = card.querySelector(".simple-card__content h4");
      if (companyHeading) {
        textCell.push(companyHeading.cloneNode(true));
      }
      const description = card.querySelector(".simple-card__content .field--name-field-description");
      if (description) {
        [...description.children].forEach((child) => {
          textCell.push(child.cloneNode(true));
        });
      }
      const ctaLink = card.querySelector(".field--name-field-p-link a");
      if (ctaLink) {
        textCell.push(ctaLink.cloneNode(true));
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-testimonial",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/logo-wall.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/form.js
  function parse5(element, { document }) {
    const form = element.querySelector("form");
    if (!form) return;
    const contentWrap = element.querySelector(".field--name-field-p-content-item");
    if (contentWrap) {
      const contentEls = contentWrap.querySelectorAll("h2, h3, h4, p, ul, ol, img, a");
      const frag = document.createDocumentFragment();
      contentEls.forEach((el) => frag.appendChild(el.cloneNode(true)));
      element.before(frag);
    }
    const cells = [];
    const heading = element.querySelector(".field--name-field-p-sidebar-item h2, .field--name-field-p-sidebar-item h3, h3, h2");
    const headingText = heading ? heading.textContent.trim() : "Contact Us";
    cells.push([headingText]);
    const processedInputs = /* @__PURE__ */ new Set();
    const labels = form.querySelectorAll("label");
    labels.forEach((label) => {
      const labelText = label.textContent.trim().replace(/\s*\*\s*$/, "").trim();
      if (!labelText) return;
      const forAttr = label.getAttribute("for");
      let input = null;
      if (forAttr) {
        try {
          input = form.querySelector(`[id="${forAttr}"]`);
        } catch (e) {
        }
      }
      if (!input) {
        input = label.parentElement.querySelector("input, select, textarea");
      }
      if (!input || processedInputs.has(input)) return;
      processedInputs.add(input);
      const tagName = input.tagName.toLowerCase();
      const inputType = input.getAttribute("type") || "text";
      if (inputType === "hidden" || inputType === "submit" || inputType === "button") return;
      if (input.name === "cpt" || input.name === "honeypot") return;
      let edsType = "text";
      if (tagName === "select") {
        edsType = "select";
      } else if (tagName === "textarea") {
        edsType = "textarea";
      } else if (inputType === "email" || input.name && input.name.toLowerCase().includes("email")) {
        edsType = "email";
      } else if (inputType === "tel" || input.name && input.name.toLowerCase().includes("phone")) {
        edsType = "tel";
      } else if (inputType === "checkbox") {
        edsType = "checkbox";
      }
      const isRequired = input.required || input.getAttribute("aria-required") === "true" || label.textContent.includes("*");
      const requiredMarker = isRequired ? "*" : "";
      const row = [labelText, edsType, requiredMarker];
      if (tagName === "select") {
        const options = Array.from(input.options).map((o) => o.textContent.trim()).filter((o) => o && !o.startsWith("---"));
        row.push(options.slice(0, 20).join(", "));
      }
      cells.push(row);
    });
    if (cells.length === 1) {
      cells.push(["First name", "text", "*"]);
      cells.push(["Last name", "text", "*"]);
      cells.push(["Work email", "email", "*"]);
      cells.push(["Phone", "tel", "*"]);
      cells.push(["Organization", "text", "*"]);
      cells.push(["Job function", "select", "*", "Select one, Administration, Business Owner, Event Planning, Executive, Marketing, Operations, Sales, Technology, Other"]);
      cells.push(["Country", "select", "*", "Select Country, USA, Canada, United Kingdom, Germany, Australia"]);
    }
    const submitBtn = form.querySelector('button[type="submit"], .mktoButton, input[type="submit"]');
    const submitText = submitBtn ? submitBtn.textContent.trim() : "Contact us";
    cells.push([submitText || "Contact us"]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Form",
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
        const isFirst = section.id === sections[0].id;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-contact-demo.js
  var parsers = {
    "hero-product-form": parse,
    "columns-media": parse2,
    "cards-testimonial": parse3,
    "logo-wall": parse4,
    "form": parse5
  };
  var PAGE_TEMPLATE = {
    name: "contact-demo",
    description: "Contact and demo request pages with forms for sales, support, and demo inquiries",
    urls: [
      "https://www.cvent.com/en/request-demo",
      "https://www.cvent.com/en/contact-us",
      "https://www.cvent.com/en/contact/support"
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
        name: "cards-testimonial",
        instances: [".paragraph--type--layout-content.column-count-3"]
      },
      {
        name: "logo-wall",
        instances: [".paragraph--type--logo-bar"]
      },
      {
        name: "form",
        instances: [".paragraph--type--compound-form"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".paragraph--type--header-banner-modern-form",
        style: null,
        blocks: ["hero-product-form"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Testimonials",
        selector: ".paragraph--type--layout-content.column-count-3",
        style: "light-grey",
        blocks: ["cards-testimonial"],
        defaultContent: [".paragraph-header h2"]
      },
      {
        id: "section-3",
        name: "Logo Wall",
        selector: ".paragraph--type--logo-bar",
        style: null,
        blocks: ["logo-wall"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "CTA Banner",
        selector: ".paragraph--type--banner-basic",
        style: "blue-purple-gradient",
        blocks: [],
        defaultContent: [".banner-basic h3", ".banner-basic a"]
      },
      {
        id: "section-5",
        name: "Content Columns",
        selector: ".paragraph--type--compound-media-bar",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Form",
        selector: ".paragraph--type--compound-form",
        style: null,
        blocks: ["form"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_contact_demo_default = {
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
  return __toCommonJS(import_contact_demo_exports);
})();
