/* eslint-disable */
/* global WebImporter */

/**
 * Parser: form-standalone
 * Base block: form
 *
 * Source: Cvent pages with standalone Marketo forms (not in compound-form wrapper)
 * Selector: .paragraph--type--cvent-marketo-form
 *
 * Source DOM structure:
 *   .paragraph--type--cvent-marketo-form.marketo-form-wrapper
 *     form#cvent_mrkto_form.cvent-form-type-custom-form
 *       h3.field--name-field-heading (form heading)
 *       div.contact-us.form-item (repeated per field)
 *         label.contact-label (field label)
 *         input / select / textarea (field input)
 *       div.button.form-item > input[type="submit"]
 *
 * Target block structure (Form):
 *   Row 0 (heading): [Form heading text]
 *   Rows 1..N (fields): [Label | type | required-marker | options]
 *   Row last (submit): [Submit button text]
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form');
  if (!form) return;

  const cells = [];

  // Row 0: Form heading
  const heading = form.querySelector('h3.field--name-field-heading, h3, h2');
  const headingText = heading ? heading.textContent.trim() : 'Contact Us';
  cells.push([headingText]);

  // Build field rows from labels
  const processedInputs = new Set();
  const labels = form.querySelectorAll('label');

  labels.forEach((label) => {
    const labelText = label.textContent.trim().replace(/\s*\*\s*$/, '').trim();
    if (!labelText) return;
    // Skip opt-in labels (long consent text)
    if (labelText.length > 100) return;

    // Find associated input
    const forAttr = label.getAttribute('for');
    let input = null;
    if (forAttr) {
      try {
        input = form.querySelector(`[id="${forAttr}"]`);
      } catch (e) { /* invalid selector */ }
    }
    if (!input) {
      input = label.parentElement.querySelector('input, select, textarea');
    }
    if (!input || processedInputs.has(input)) return;
    processedInputs.add(input);

    const tagName = input.tagName.toLowerCase();
    const inputType = input.getAttribute('type') || 'text';

    // Skip hidden, submit, and honeypot fields
    if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') return;

    let edsType = 'text';
    if (tagName === 'select') {
      edsType = 'select';
    } else if (tagName === 'textarea') {
      edsType = 'textarea';
    } else if (inputType === 'email' || (input.id && input.id.includes('email'))) {
      edsType = 'email';
    } else if (inputType === 'tel' || (input.id && input.id.includes('phone'))) {
      edsType = 'tel';
    } else if (inputType === 'checkbox') {
      edsType = 'checkbox';
    } else if (inputType === 'radio') {
      edsType = 'radio';
    }

    const isRequired = input.required
      || input.classList.contains('required')
      || label.textContent.includes('*');
    const requiredMarker = isRequired ? '*' : '';

    const row = [labelText, edsType, requiredMarker];

    if (tagName === 'select') {
      const options = Array.from(input.options)
        .map((o) => o.textContent.trim())
        .filter((o) => o && !o.startsWith('---') && !o.startsWith('Select'));
      if (options.length > 0) row.push(options.slice(0, 20).join(', '));
    }

    cells.push(row);
  });

  // Handle radio groups (fieldsets with legend)
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    const legend = fieldset.querySelector('legend');
    if (!legend) return;
    const legendText = legend.textContent.trim().replace(/\s*\*\s*$/, '').trim();
    const radios = fieldset.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return;
    const options = [];
    radios.forEach((radio) => {
      const radioLabel = fieldset.querySelector(`label[for="${radio.id}"]`);
      if (radioLabel) options.push(radioLabel.textContent.trim());
    });
    const isRequired = legend.textContent.includes('*');
    cells.push([legendText, 'radio', isRequired ? '*' : '', options.join(', ')]);
  });

  // Fallback: standard contact form if no fields extracted
  if (cells.length === 1) {
    cells.push(['First name', 'text', '*']);
    cells.push(['Last name', 'text', '*']);
    cells.push(['Work email', 'email', '*']);
    cells.push(['Phone', 'tel', '*']);
    cells.push(['Organization', 'text', '*']);
    cells.push(['Job function', 'select', '*', 'Select one, Administration, Business Owner, Event Planning, Executive, Marketing, Operations, Sales, Technology, Other']);
    cells.push(['Country', 'select', '*', 'Select Country, USA, Canada, United Kingdom, Germany, Australia']);
  }

  // Submit button
  const submitBtn = form.querySelector('input[type="submit"], button[type="submit"], .mktoButton');
  let submitText = submitBtn ? (submitBtn.value || submitBtn.textContent || '').trim() : '';
  if (!submitText || submitText === 'Submit') submitText = 'Contact us';
  cells.push([submitText]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Form',
    cells,
  });
  element.replaceWith(block);
}
