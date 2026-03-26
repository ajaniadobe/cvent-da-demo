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
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.homepage-header-container',
      '.region-featured',
      '.region-header-top',
      '.region-header',
      'iframe',
      'link',
      'noscript',
    ]);
    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-once');
      el.removeAttribute('data-drupal-selector');
      el.removeAttribute('onclick');
    });
  }
}
