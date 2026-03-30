export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Check if the sidebar (second column) contains form field definitions
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const sidebar = row.querySelector(':scope > div:last-child');
  if (!sidebar || sidebar === row.querySelector(':scope > div:first-child')) return;

  // Detect field definitions: paragraphs with pipe-delimited text (e.g. "Label|type|*|options")
  const paragraphs = [...sidebar.querySelectorAll('p')];
  const fieldParagraphs = paragraphs.filter((p) => p.textContent.includes('|'));
  if (fieldParagraphs.length === 0) return;

  // Extract heading (h3/h4 before the fields)
  const heading = sidebar.querySelector('h3, h4, h2');

  // Parse field definitions
  const fields = fieldParagraphs.map((p) => {
    const parts = p.textContent.split('|').map((s) => s.trim());
    return {
      label: parts[0],
      type: parts[1] || 'text',
      required: parts[2] === '*',
      options: parts[3] || '',
    };
  });

  // Find submit button (last paragraph without pipes)
  const nonFieldParagraphs = paragraphs.filter((p) => !p.textContent.includes('|'));
  const submitLabel = nonFieldParagraphs.pop()?.textContent.trim() || 'Submit';

  // Clear sidebar and build form
  sidebar.textContent = '';

  const form = document.createElement('form');
  form.className = 'hero-form';
  form.noValidate = true;

  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent;
    form.append(h3);
  }

  const grid = document.createElement('div');
  grid.className = 'form-grid';

  fields.forEach((field) => {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = field.label + (field.required ? ' *' : '');

    if (field.type === 'select' && field.options) {
      const select = document.createElement('select');
      select.required = field.required;
      select.name = field.label.toLowerCase().replace(/\s+/g, '_');
      field.options.split(',').map((o) => o.trim()).forEach((opt, i) => {
        const option = document.createElement('option');
        option.value = i === 0 ? '' : opt;
        option.textContent = opt;
        if (i === 0) {
          option.disabled = true;
          option.selected = true;
        }
        select.append(option);
      });
      group.append(label, select);
    } else {
      const input = document.createElement('input');
      input.type = field.type || 'text';
      input.required = field.required;
      input.name = field.label.toLowerCase().replace(/\s+/g, '_');
      input.placeholder = field.label;
      group.append(label, input);
    }

    grid.append(group);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary form-submit';
  submitBtn.textContent = submitLabel;

  form.append(grid, submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    window.location.href = '/en/request-demo';
  });

  sidebar.append(form);
}
