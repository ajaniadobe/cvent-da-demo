export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Detect background image
  if (!block.querySelector(':scope > div:first-child picture, :scope > div:first-child img')) {
    block.classList.add('no-image');
  }

  // Detect notification card: 3+ rows means last row is notification
  const hasNotification = rows.length >= 3;
  const contentRow = hasNotification ? rows[1] : rows[rows.length - 1];

  // Style the first CTA link in the content row as a button
  if (contentRow) {
    const links = contentRow.querySelectorAll('a');
    if (links.length > 0) {
      links[0].classList.add('btn', 'btn-primary');
    }
  }

  // Build hero bottom wrapper with SVG curve + notification card
  if (hasNotification) {
    const notifRow = rows[rows.length - 1];
    block.classList.add('has-curve');

    const bottomWrapper = document.createElement('div');
    bottomWrapper.className = 'hero-bottom-wrapper';

    // SVG curve container (dark blue bg shows through transparent parts of SVG)
    const curveContainer = document.createElement('div');
    curveContainer.className = 'hero-curve-container';
    curveContainer.innerHTML = '<svg class="hero-curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1392 154" fill="none" preserveAspectRatio="none"><path d="M0 31.1227C75.4914 7.23563 220.557 -8.50255 309.106 4.94005C419.793 21.7434 577.169 108.97 684.014 131.943C794.001 155.591 1131.86 186.81 1387.92 61.774L1392 59.7975V153.624H0V31.1227Z" fill="white"/></svg>';

    // Notification card — extract content from all cells in the row
    const card = document.createElement('div');
    card.className = 'hero-notification-card';
    const notifCells = notifRow.querySelectorAll(':scope > div');
    notifCells.forEach((cell) => {
      while (cell.firstChild) {
        card.appendChild(cell.firstChild);
      }
    });
    const cardLink = card.querySelector('a');
    if (cardLink) {
      cardLink.classList.add('btn', 'btn-primary');
    }

    bottomWrapper.appendChild(curveContainer);
    bottomWrapper.appendChild(card);
    notifRow.remove();

    // Append after the block inside the wrapper
    block.parentElement.appendChild(bottomWrapper);
  }
}
