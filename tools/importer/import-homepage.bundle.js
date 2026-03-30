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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const sidebar = element.querySelector("#header-banner-hero-sidebar, .header-banner-hero__sidebar");
    const heroImage = sidebar ? sidebar.querySelector("picture, img") : null;
    const heading = element.querySelector(".header-banner-hero__main-content h1, .header-banner-hero__main-content h2");
    const mainContent = element.querySelector(".header-banner-hero__main-content");
    const description = mainContent ? mainContent.querySelector(".field--name-field-description, .text-formatted") : null;
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) {
      const children = Array.from(description.children);
      children.forEach((child) => contentCell.push(child));
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const parent = element.closest(".paragraph--type--header-banner-hero") || element.parentElement;
    const notifCard = parent ? parent.querySelector(".header-banner-hero-horizontal-notification-card") : null;
    if (notifCard) {
      const notifContent = [];
      const notifText = notifCard.querySelector(".field--name-field-description, .text-formatted, p");
      const notifLink = notifCard.querySelector("a");
      if (notifText) {
        const p = document.createElement("p");
        p.textContent = notifText.textContent.trim();
        notifContent.push(p);
      }
      if (notifLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", notifLink.getAttribute("href") || "");
        a.textContent = notifLink.textContent.trim();
        p.append(a);
        notifContent.push(p);
      }
      if (notifContent.length > 0) {
        cells.push(notifContent);
      }
      notifCard.remove();
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-homepage",
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

  // tools/importer/parsers/cards-product.js
  function parse3(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".paragraph--type--simple-card");
    cards.forEach((card) => {
      const simpleCard = card.querySelector(".simple-card") || card;
      const imageContainer = simpleCard.querySelector(".innerlink");
      const image = imageContainer ? imageContainer.querySelector("picture, img") : null;
      const imageCol = image ? [image] : [];
      const contentCol = [];
      const contentDiv = simpleCard.querySelector(".simple-card__content .field--name-field-description, .simple-card__content .text-formatted");
      if (contentDiv) {
        Array.from(contentDiv.children).forEach((child) => {
          contentCol.push(child);
        });
      }
      if (imageCol.length > 0) {
        cells.push([imageCol, contentCol]);
      } else {
        cells.push(contentCol);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-product",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".paragraph--type--simple-card");
    cards.forEach((card) => {
      const simpleCard = card.querySelector(".simple-card") || card;
      const contentCol = [];
      const contentDiv = simpleCard.querySelector(".simple-card__content .field--name-field-description, .simple-card__content .text-formatted");
      if (contentDiv) {
        Array.from(contentDiv.children).forEach((child) => {
          contentCol.push(child);
        });
      }
      if (contentCol.length > 0) {
        cells.push(contentCol);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-news",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/lifecycle-wheel.js
  function parse5(element, { document }) {
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
      const featuresDiv = document.createElement("div");
      const accordionItems = quadrant.querySelectorAll(".accordion-item");
      accordionItems.forEach((item) => {
        const featureName = item.querySelector(".inner-category span, .desktop-accordion-tab span");
        const listItems = item.querySelectorAll(".accordion-list li");
        listItems.forEach((li) => {
          const link = li.querySelector("a");
          const desc = li.querySelector("p");
          if (link) {
            const linkP = document.createElement("p");
            const a = document.createElement("a");
            a.setAttribute("href", link.getAttribute("href") || "");
            a.textContent = featureName && featureName.textContent.trim() || link.textContent.trim();
            linkP.append(a);
            featuresDiv.append(linkP);
          }
          if (desc) {
            const descP = document.createElement("p");
            descP.textContent = desc.textContent.trim();
            featuresDiv.append(descP);
          }
        });
      });
      cells.push([name, tagline, featuresDiv]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "lifecycle-wheel",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/logo-wall.js
  function parse6(element, { document }) {
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
  function parse7(element, { document }) {
    const form = element.querySelector("form");
    if (!form) return;
    const contentWrap = element.querySelector(".field--name-field-p-content-item");
    if (contentWrap) {
      const contentEls = contentWrap.querySelectorAll("h2, h3, h4, p, ul, ol, img");
      const frag = document.createDocumentFragment();
      contentEls.forEach((el) => frag.appendChild(el.cloneNode(true)));
      element.before(frag);
    }
    const cells = [];
    const heading = element.querySelector(".field--name-field-p-sidebar-item h3") || element.querySelector(".field--name-field-p-sidebar-item h2") || element.querySelector("h3") || element.querySelector("h2");
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
    let submitText = submitBtn ? submitBtn.textContent.trim() : "";
    if (!submitText || submitText === "Submit") submitText = "Request a demo";
    cells.push([submitText]);
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.cvent.com/"
    ],
    description: "Cvent homepage \u2014 main landing page with hero, product features, social proof, and call-to-action sections",
    blocks: [
      {
        name: "hero-homepage",
        instances: [".paragraph--type--header-banner-hero .header-banner-hero"]
      },
      {
        name: "columns-media",
        instances: [
          "#cvent-paragraph-compound_media_bar-1568076",
          "#cvent-paragraph-compound_media_bar-1458006",
          "#cvent-paragraph-compound_media_bar-619191",
          "#cvent-paragraph-compound_content_bar-1200576",
          "#cvent-paragraph-compound_media_bar-1461776"
        ]
      },
      {
        name: "cards-product",
        instances: ["#cvent-paragraph-layout_content-735741"]
      },
      {
        name: "cards-news",
        instances: ["#cvent-paragraph-layout_content-735846"]
      },
      {
        name: "logo-wall",
        instances: ["#cvent-paragraph-logo_bar-1542431"]
      },
      {
        name: "lifecycle-wheel",
        instances: ["#cvent-paragraph-reference_block-1267256"]
      },
      {
        name: "form",
        instances: ["#cvent-paragraph-compound_form-21226"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero", selector: ".paragraph--type--header-banner-hero", style: "dark-blue", blocks: ["hero-homepage"], defaultContent: [] },
      { id: "section-2", name: "Meet CventIQ", selector: "#cvent-paragraph-compound_media_bar-1568076", style: "blue-purple-gradient", blocks: ["columns-media"], defaultContent: [] },
      { id: "section-3", name: "All-in-one Solution Stats", selector: "#cvent-paragraph-compound_media_bar-1458006", style: null, blocks: ["columns-media"], defaultContent: [] },
      { id: "section-4", name: "Trusted By Logo Bar", selector: "#cvent-paragraph-logo_bar-1542431", style: null, blocks: ["logo-wall"], defaultContent: [] },
      { id: "section-5", name: "Event Lifecycle Wheel", selector: "#cvent-paragraph-reference_block-1267256", style: null, blocks: ["lifecycle-wheel"], defaultContent: ["#cvent-paragraph-reference_block-1267256 .wheel--optional-wysiwyg"] },
      { id: "section-6", name: "Product Cards Grid", selector: "#cvent-paragraph-layout_content-735741", style: null, blocks: ["cards-product"], defaultContent: ["#cvent-paragraph-layout_content-735741 .paragraph-header", "#cvent-paragraph-link_default-892976"] },
      { id: "section-7", name: "Venue Sourcing", selector: "#cvent-paragraph-compound_media_bar-619191", style: "blue-green-gradient", blocks: ["columns-media"], defaultContent: [] },
      { id: "section-8", name: "Social Proof", selector: "#cvent-paragraph-compound_content_bar-1200576", style: null, blocks: ["columns-media"], defaultContent: ["#join-thousands-of-planners-and-marketers-who-love-our-software"] },
      { id: "section-9", name: "CTA How It Works", selector: "#cvent-paragraph-compound_media_bar-1461776", style: "blue-purple-gradient", blocks: ["columns-media"], defaultContent: [] },
      { id: "section-10", name: "Whats New at Cvent", selector: "#cvent-paragraph-layout_content-735846", style: "light-grey", blocks: ["cards-news"], defaultContent: ["#whats-new-at-cvent"] },
      { id: "section-11", name: "Platform CTA with Form", selector: "#cvent-paragraph-compound_form-21226", style: "blue-purple-gradient", blocks: ["form"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-homepage": parse,
    "columns-media": parse2,
    "cards-product": parse3,
    "cards-news": parse4,
    "lifecycle-wheel": parse5,
    "logo-wall": parse6,
    "form": parse7
  };
  function homepageContentFreshness(hookName, element) {
    if (hookName !== "beforeTransform") return;
    const venueH3 = element.querySelector("#cvent-paragraph-compound_media_bar-619191 h3");
    if (venueH3 && venueH3.textContent.trim() === "Venue sourcing made easy") {
      venueH3.textContent = "Find the right venue faster with AI";
      venueH3.id = "find-the-right-venue-faster-with-ai";
      const desc = venueH3.closest(".compound-media-bar__content, .paragraph--type--simple-content");
      if (desc) {
        const descField = desc.querySelector(".field--name-field-description, .text-formatted");
        if (descField) {
          descField.innerHTML = '<p>Source the perfect venue for your next event with the\xA0<strong>Cvent Supplier Network</strong>. Let AI refine results from nearly 340K venues and quickly build strong RFPs.</p><p><a href="https://www.cvent.com/venues">Find venues for free</a></p>';
        }
      }
    }
    const socialProof = element.querySelector("#cvent-paragraph-compound_content_bar-1200576");
    if (socialProof) {
      const g2Img = socialProof.querySelector('img[alt*="G2"]');
      if (g2Img && g2Img.alt.includes("2025")) {
        g2Img.src = "https://www.cvent.com/sites/default/files/styles/column_content_width/public/image/2026-03/G2%20Badges%20Spring%202026%20Large.png.webp?itok=mXPFonFP";
        g2Img.alt = "Three G2 awards for Users Love Us, Fall 2026 grid leader, and Easiest admin, all for Spring 2026.";
      }
    }
    const featureNames = {
      "/en/event-management-software/cvent-integrations": "Integrations",
      "/en/event-management-software/event-reporting": "Event & attendee insights",
      "/en/event-marketing-management/online-survey-software": "Surveys",
      "/en/event-marketing-management/lead-capture": "Lead management",
      "/en/event-marketing-management/engagement-score": "Engagement scoring",
      "/en/event-marketing-management/spend-workflow": "Meeting approval & budgeting",
      "/en/event-marketing-management/cvent-supplier-network": "Venue sourcing",
      "/en/event-marketing-management/vendor-marketplace": "Vendor sourcing",
      "/en/event-management-software/passkey-room-block-management": "Room block & travel",
      "/en/event-marketing-management/cvent-event-design-software": "Venue diagramming",
      "/en/event-marketing-management/appointments": "Networking",
      "/en/event-marketing-management/mobile-event-apps": "Event app",
      "/en/event-marketing-management/onarrival-event-check-in-software": "Onsite check-in & badging",
      "/en/event-marketing-management/virtual-event-platform": "Virtual experience",
      "/en/event-marketing-management/webinar-platform": "Webinar",
      "/event-marketing-management/event-registration-software": "Registration",
      "/en/event-marketing-management/custom-event-websites": "Event website",
      "/en/event-marketing-platform": "Marketing",
      "/en/event-marketing-management/content-management": "Speaker management",
      "/en/event-marketing-management/exhibitor-management": "Exhibitor management"
    };
    const wheelEl = element.querySelector("#cvent-paragraph-reference_block-1267256");
    if (wheelEl) {
      wheelEl.querySelectorAll(".accordion-list a").forEach((a) => {
        const href = (a.getAttribute("href") || "").replace(/^https:\/\/www\.cvent\.com/, "").replace(/\s+$/, "");
        const name = featureNames[href];
        if (name && a.textContent.trim() === "Explore") {
          a.textContent = name;
        }
      });
    }
  }
  var transformers = [
    homepageContentFreshness,
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
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
  var import_homepage_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_homepage_exports);
})();
