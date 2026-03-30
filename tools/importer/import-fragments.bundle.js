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

  // tools/importer/import-fragments.js
  var import_fragments_exports = {};
  __export(import_fragments_exports, {
    default: () => import_fragments_default
  });

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

  // tools/importer/import-fragments.js
  var FRAGMENT_CONFIGS = [
    {
      urlMatch: "/en/supplier-venue",
      urlExclude: "/supplier-venue/",
      outputPath: "/fragments/why-cvent-cards",
      extractor: "cards"
    },
    {
      urlMatch: "/cvent-essentials",
      outputPath: "/fragments/why-cvent-stats",
      extractor: "stats"
    },
    {
      urlMatch: "/become-partner",
      outputPath: "/fragments/why-cvent-social-proof",
      extractor: "social-proof"
    }
  ];
  function extractCardsFragment(document) {
    const trustBar = document.querySelector(".trust-bar .paragraph--type--compound-content-bar");
    if (!trustBar) {
      console.warn("Trust bar not found for why-cvent-cards fragment");
      return null;
    }
    const fragment = document.createElement("div");
    const heading = trustBar.querySelector(".compound-content-bar .paragraph-header h2");
    if (heading) fragment.append(heading.cloneNode(true));
    const cells = [];
    const items = trustBar.querySelectorAll(".paragraph--type--simple-icon-content");
    items.forEach((item) => {
      const icon = item.querySelector(".simple-icon-content__icon img");
      const label = item.querySelector(".simple-icon-content__content h3");
      const description = item.querySelector(".simple-icon-content__content .field--name-field-description");
      const imageCell = [];
      const textCell = [];
      if (icon) imageCell.push(icon.cloneNode(true));
      if (label) textCell.push(label.cloneNode(true));
      if (description) {
        Array.from(description.children).forEach((child) => textCell.push(child.cloneNode(true)));
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "cards-feature",
        cells
      });
      fragment.append(block);
    }
    return fragment;
  }
  function buildStatColumn(item, document) {
    const col = [];
    const iconContent = item.querySelector(".simple-icon-content");
    if (iconContent) {
      const icon = iconContent.querySelector(".simple-icon-content__icon img");
      const textEl = iconContent.querySelector(".simple-icon-content__content .field--name-field-description");
      if (icon) {
        const p = document.createElement("p");
        p.append(icon.cloneNode(true));
        col.push(p);
      }
      if (textEl) {
        const paras = textEl.querySelectorAll("p");
        if (paras.length > 0) {
          paras.forEach((p) => col.push(p.cloneNode(true)));
        } else {
          const p = document.createElement("p");
          p.innerHTML = textEl.innerHTML;
          col.push(p);
        }
      }
    }
    return col;
  }
  function extractStatsFragment(document) {
    const contentBars = document.querySelectorAll(".paragraph--type--compound-content-bar");
    let targetBar = null;
    for (const bar of contentBars) {
      if (bar.textContent.includes("24/7") || bar.textContent.includes("support")) {
        targetBar = bar;
        break;
      }
    }
    if (!targetBar) {
      console.warn("Stats content bar not found for why-cvent-stats fragment");
      return null;
    }
    const fragment = document.createElement("div");
    const contentItems = targetBar.querySelectorAll(".field--name-field-p-content-bar-items > .field__item");
    const cells = [];
    if (contentItems.length >= 2) {
      const leftCol = buildStatColumn(contentItems[0], document);
      const rightCol = buildStatColumn(contentItems[1], document);
      cells.push([leftCol, rightCol]);
    } else if (contentItems.length === 1) {
      const col = buildStatColumn(contentItems[0], document);
      cells.push([col]);
    }
    if (cells.length > 0 && cells[0].some((col) => col.length > 0)) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: "columns-media",
        cells
      });
      fragment.append(block);
    }
    return fragment;
  }
  function extractSocialProofFragment(document) {
    const contentBar = document.querySelector(".paragraph--type--compound-content-bar");
    if (!contentBar) {
      console.warn("Content bar not found for why-cvent-social-proof fragment");
      return null;
    }
    const fragment = document.createElement("div");
    const heading = contentBar.querySelector(".compound-content-bar .paragraph-header h2");
    if (heading) fragment.append(heading.cloneNode(true));
    const items = contentBar.querySelectorAll(".field--name-field-p-content-bar-items > .field__item");
    items.forEach((item) => {
      const iconContent = item.querySelector(".simple-icon-content");
      if (iconContent) {
        const icon = iconContent.querySelector(".simple-icon-content__icon img");
        const textEl = iconContent.querySelector(".simple-icon-content__content .field--name-field-description");
        if (icon) {
          const p = document.createElement("p");
          p.append(icon.cloneNode(true));
          fragment.append(p);
        }
        if (textEl) {
          const paras = textEl.querySelectorAll("p");
          if (paras.length > 0) {
            paras.forEach((p) => fragment.append(p.cloneNode(true)));
          } else {
            const p = document.createElement("p");
            p.innerHTML = textEl.innerHTML;
            fragment.append(p);
          }
        }
      }
    });
    return fragment;
  }
  var import_fragments_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      const originalURL = params.originalURL;
      const cleanupPayload = { ...payload, template: { sections: [] } };
      try {
        transform.call(null, "beforeTransform", main, cleanupPayload);
      } catch (e) {
        console.error("Cleanup beforeTransform failed:", e);
      }
      let config = null;
      for (const cfg of FRAGMENT_CONFIGS) {
        if (originalURL.includes(cfg.urlMatch)) {
          if (cfg.urlExclude && originalURL.includes(cfg.urlExclude)) continue;
          config = cfg;
          break;
        }
      }
      if (!config) {
        console.error(`No fragment config matches URL: ${originalURL}`);
        return [];
      }
      console.log(`Extracting fragment: ${config.outputPath} from ${originalURL}`);
      let fragmentContent = null;
      if (config.extractor === "cards") {
        fragmentContent = extractCardsFragment(document);
      } else if (config.extractor === "stats") {
        fragmentContent = extractStatsFragment(document);
      } else if (config.extractor === "social-proof") {
        fragmentContent = extractSocialProofFragment(document);
      }
      if (!fragmentContent || fragmentContent.children.length === 0) {
        console.error(`Fragment extraction produced no content for: ${config.outputPath}`);
        return [];
      }
      main.innerHTML = "";
      main.append(fragmentContent);
      WebImporter.rules.adjustImageUrls(main, url, originalURL);
      return [{
        element: main,
        path: config.outputPath,
        report: {
          title: `Fragment: ${config.outputPath.split("/").pop()}`,
          template: "fragment",
          blocks: [config.extractor]
        }
      }];
    }
  };
  return __toCommonJS(import_fragments_exports);
})();
