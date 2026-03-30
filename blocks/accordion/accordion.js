export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const list = document.createElement('div');
  list.className = 'accordion-list';

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length < 2) return;

    const question = cols[0].textContent.trim();
    const answer = cols[1];

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-question';
    summary.textContent = question;

    const content = document.createElement('div');
    content.className = 'accordion-answer';
    content.append(...answer.childNodes);

    details.append(summary, content);
    list.append(details);
  });

  el.textContent = '';
  el.append(list);
}
