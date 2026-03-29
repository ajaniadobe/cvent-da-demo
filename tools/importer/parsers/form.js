/* eslint-disable */
/* global WebImporter */

/**
 * Parser: form
 * Base block: form
 *
 * Source: Cvent pages with Marketo/custom forms
 * Selector: .paragraph--type--compound-form (when containing a form element)
 *
 * Source DOM structure:
 *   .compound-form
 *     .field--name-field-p-content-item  (optional: left-side content)
 *     .field--name-field-p-sidebar-item
 *       form (with labeled inputs, selects, checkboxes)
 *
 * Target block structure (Form):
 *   Row 0 (heading): [Form heading text]
 *   Rows 1..N (fields): [Label | type | required-marker | options]
 *   Row last (submit): [Submit button text]  (single cell = submit)
 */
export default function parse(element, { document }) {
  // Find the form element
  const form = element.querySelector('form');
  if (!form) return; // No form found, let default handling take over

  // Extract any content column as default content before the block
  const contentWrap = element.querySelector('.field--name-field-p-content-item');
  if (contentWrap) {
    const contentEls = contentWrap.querySelectorAll('h2, h3, h4, p, ul, ol, img, a');
    const frag = document.createDocumentFragment();
    contentEls.forEach((el) => frag.appendChild(el.cloneNode(true)));
    element.before(frag);
  }

  const cells = [];

  // Row 0: Form heading
  const heading = element.querySelector('.field--name-field-p-sidebar-item h2, .field--name-field-p-sidebar-item h3, h3, h2');
  const headingText = heading ? heading.textContent.trim() : 'Contact Us';
  cells.push([headingText]);

  // Build field rows from form labels
  const processedInputs = new Set();
  const labels = form.querySelectorAll('label');

  labels.forEach((label) => {
    const labelText = label.textContent.trim().replace(/\s*\*\s*$/, '').trim();
    if (!labelText) return;

    // Find associated input
    const forAttr = label.getAttribute('for');
    let input = null;
    if (forAttr) {
      try {
        input = form.querySelector(`[id="${forAttr}"]`);
      } catch (e) {
        // Invalid selector, skip
      }
    }
    if (!input) {
      // Try next sibling or parent's input
      input = label.parentElement.querySelector('input, select, textarea');
    }
    if (!input || processedInputs.has(input)) return;
    processedInputs.add(input);

    const tagName = input.tagName.toLowerCase();
    const inputType = input.getAttribute('type') || 'text';

    // Skip hidden fields, honeypots, and submit buttons
    if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') return;
    if (input.name === 'cpt' || input.name === 'honeypot') return;

    // Determine EDS field type
    let edsType = 'text';
    if (tagName === 'select') {
      edsType = 'select';
    } else if (tagName === 'textarea') {
      edsType = 'textarea';
    } else if (inputType === 'email' || (input.name && input.name.toLowerCase().includes('email'))) {
      edsType = 'email';
    } else if (inputType === 'tel' || (input.name && input.name.toLowerCase().includes('phone'))) {
      edsType = 'tel';
    } else if (inputType === 'checkbox') {
      edsType = 'checkbox';
    }

    const isRequired = input.required
      || input.getAttribute('aria-required') === 'true'
      || label.textContent.includes('*');
    const requiredMarker = isRequired ? '*' : '';

    const row = [labelText, edsType, requiredMarker];

    // For selects, extract representative options
    if (tagName === 'select') {
      const options = Array.from(input.options)
        .map((o) => o.textContent.trim())
        .filter((o) => o && !o.startsWith('---'));
      row.push(options.slice(0, 20).join(', '));
    }

    cells.push(row);
  });

  // If we couldn't extract fields from labels, create a minimal form
  if (cells.length === 1) {
    // Fallback: create standard contact form fields
    cells.push(['First name', 'text', '*']);
    cells.push(['Last name', 'text', '*']);
    cells.push(['Work email', 'email', '*']);
    cells.push(['Phone', 'tel', '*']);
    cells.push(['Organization', 'text', '*']);
    cells.push(['Job function', 'select', '*', 'Select one, Administration, Business Owner, Event Planning, Executive, Marketing, Operations, Sales, Technology, Other']);
    cells.push(['Country', 'select', '*', 'Select Country, USA, Canada, United Kingdom, Germany, Australia']);
  }

  // Submit button row (single cell)
  const submitBtn = form.querySelector('button[type="submit"], .mktoButton, input[type="submit"]');
  const submitText = submitBtn ? submitBtn.textContent.trim() : 'Contact us';
  cells.push([submitText || 'Contact us']);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Form',
    cells,
  });
  element.replaceWith(block);
}
