export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // Row 1: heading
  const heading = rows[0]?.textContent.trim();

  // Remaining rows: field definitions
  // Format: Label | type | required | options (comma-separated for select)
  // A row with only 1 cell is treated as a submit button label
  const fields = rows.slice(1).map((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim();
    const singleCell = cols.length === 1;
    const type = singleCell ? 'submit' : (cols[1]?.textContent.trim() || 'text');
    const required = cols[2]?.textContent.trim() === '*';
    const options = cols[3]?.textContent.trim();
    return { label, type, required, options };
  });

  // Check if last "field" is a submit button
  let submitLabel = 'Submit';
  const lastField = fields[fields.length - 1];
  if (lastField && lastField.type === 'submit') {
    submitLabel = lastField.label;
    fields.pop();
  }

  // Build form HTML
  const form = document.createElement('form');
  form.className = 'form-block-form';
  form.noValidate = true;

  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading;
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

      const optionValues = field.options.split(',').map((o) => o.trim());
      optionValues.forEach((opt, i) => {
        const option = document.createElement('option');
        option.value = i === 0 ? '' : opt;
        option.textContent = opt;
        if (i === 0) option.disabled = true;
        if (i === 0) option.selected = true;
        select.append(option);
      });

      group.append(label, select);
    } else if (field.type === 'textarea') {
      const textarea = document.createElement('textarea');
      textarea.required = field.required;
      textarea.name = field.label.toLowerCase().replace(/\s+/g, '_');
      textarea.placeholder = field.label;
      group.append(label, textarea);
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

  // Handle form submission — redirect to demo request page
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    window.location.href = '/en/request-demo';
  });

  block.append(form);
}
