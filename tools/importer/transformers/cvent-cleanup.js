/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Cvent site cleanup.
 * Removes non-authorable content (header, footer, nav, overlays, skip links).
 * Selectors verified against captured DOM of https://www.cvent.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove overlays and notification wrappers that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#block-exitoverlaysblock',
      '.exit-overlays-wrapper',
      '.notifications-ajax-wrapper',
      '#skip-to-content',
    ]);

    // Remove OneTrust cookie consent banner and preference center
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
      '[class*="optanon"]',
      '[id*="optanon"]',
    ]);

    // Remove tracking pixel images (Bing, Bizible, Google Ads, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('bat.bing.com') ||
        src.includes('cdn.bizible.com') ||
        src.includes('cdn.bizibly.com') ||
        src.includes('googleadservices.com') ||
        src.includes('googleads.g.doubleclick.net') ||
        src.includes('cdn.cookielaw.org') ||
        src.includes('facebook.com/tr') ||
        src.includes('analytics.twitter.com') ||
        (src.includes('?') && img.getAttribute('alt') === '' && img.width <= 1)
      ) {
        img.remove();
      }
    });

    // Remove AddToAny sharing widget elements
    WebImporter.DOMUtils.remove(element, [
      '.a2a_kit',
      '.addtoany_share',
      '[class*="addtoany"]',
    ]);

    // Remove hidden "inactive" spans inside buttons that cause text concatenation
    // (e.g., <button><span class="active">Download the eBook</span><span class="inactive">Close</span></button>
    //  → serialized as "Download the eBookClose")
    element.querySelectorAll('button .inactive, button [hidden], [role="button"] .inactive').forEach((el) => {
      el.remove();
    });

    // Remove standalone close buttons (modals, dialogs)
    element.querySelectorAll('button, [role="button"], .ui-dialog-titlebar-close').forEach((btn) => {
      const text = btn.textContent.trim();
      if (text === 'Close' || text === '×' || text === '✕' || text === 'X') {
        btn.remove();
      }
    });

    // Remove sharing feedback text nodes that survive AddToAny widget removal
    element.querySelectorAll('div, span, p').forEach((el) => {
      if (el.children.length === 0) {
        const text = el.textContent.trim();
        if (text === 'Thanks for sharing!' || text === '✓' || text === 'More…') {
          el.remove();
        }
      }
    });
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Note: Do NOT remove .homepage-header-container — it contains the hero block
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.region-featured',
      '.region-header-top',
      '.region-header',
      '.sticky-placeholer',
      '.region-highlighted',
      'iframe',
      'link',
      'noscript',
    ]);

    // Final pass: remove any remaining cookielaw/onetrust images and links
    element.querySelectorAll('img, a').forEach((el) => {
      const src = el.getAttribute('src') || el.getAttribute('href') || '';
      if (src.includes('cookielaw.org') || src.includes('onetrust.com') || src.includes('cookiepedia.co.uk')) {
        // Remove the parent paragraph if it only contains this element
        const parent = el.closest('p');
        if (parent && parent.querySelectorAll('img, a').length <= 2) {
          parent.remove();
        } else {
          el.remove();
        }
      }
    });

    // Remove any remaining "Privacy Preference Center" content block
    // This catches cases where the consent UI was rendered as inline HTML
    const headings = element.querySelectorAll('h2, h3, h4');
    headings.forEach((heading) => {
      const text = heading.textContent.trim();
      if (
        text === 'Privacy Preference Center' ||
        text === 'Manage Consent Preferences' ||
        text === 'Cookie List' ||
        text === 'Functional Cookies' ||
        text === 'Targeting Cookies' ||
        text === 'Strictly Necessary Cookies' ||
        text === 'Performance Cookies'
      ) {
        // Remove heading and all following siblings until next non-cookie heading
        let sibling = heading.nextElementSibling;
        while (sibling) {
          const next = sibling.nextElementSibling;
          const sibText = sibling.textContent.trim();
          // Stop if we hit a heading that's not cookie-related
          if (
            (sibling.tagName === 'H2' || sibling.tagName === 'H3') &&
            sibText !== 'Manage Consent Preferences' &&
            sibText !== 'Cookie List' &&
            sibText !== 'Functional Cookies' &&
            sibText !== 'Targeting Cookies' &&
            sibText !== 'Strictly Necessary Cookies' &&
            sibText !== 'Performance Cookies'
          ) {
            break;
          }
          sibling.remove();
          sibling = next;
        }
        heading.remove();
      }
    });

    // Remove paragraphs that contain only cookie consent text
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (
        text === 'Allow All' ||
        text === 'Reject All Confirm My Choices' ||
        text === 'Always Active' ||
        text === 'Apply Cancel' ||
        text === 'Consent Leg.Interest' ||
        text === 'Search…' ||
        text === 'Clear' ||
        text.match(/^\[[\sx]\] checkbox label/) ||
        text.match(/^\[[\sx]\] (Functional|Targeting|Performance) Cookies$/)
      ) {
        p.remove();
      }
    });

    // Remove empty alt tracking pixel images that survived
    element.querySelectorAll('img[alt=""]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('bat.bing.com') ||
        src.includes('bizible.com') ||
        src.includes('bizibly.com') ||
        src.includes('googleadservices.com') ||
        src.includes('cookielaw.org')
      ) {
        const parent = img.closest('p');
        if (parent && parent.textContent.trim() === '') {
          parent.remove();
        } else {
          img.remove();
        }
      }
    });

    // Fix modal close button text concatenation (e.g., "Download the eBookClose")
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text.endsWith('Close') && text.length > 5) {
        const fixed = text.replace(/Close$/, '');
        if (fixed !== text) {
          p.textContent = fixed;
        }
      }
    });

    // Remove AddToAny sharing remnants that survived beforeTransform
    element.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent.trim();
      if (
        href.includes('addtoany.com') ||
        href === '#addtoany' ||
        text === 'AddToAny' ||
        text === 'More…'
      ) {
        const parent = a.closest('p');
        if (parent && parent.querySelectorAll('a').length <= 1) {
          parent.remove();
        } else {
          a.remove();
        }
      }
    });

    // Remove "Thanks for sharing!" and share feedback paragraphs
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text === 'Thanks for sharing!' || text === '✓') {
        p.remove();
      }
    });

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-once');
      el.removeAttribute('data-drupal-selector');
      el.removeAttribute('onclick');
    });
  }
}
