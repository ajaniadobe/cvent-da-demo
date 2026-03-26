export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture, :scope > div:first-child img')) {
    block.classList.add('no-image');
  }

  // Style the first CTA link as a button
  const contentDiv = block.querySelector(':scope > div:last-child');
  if (contentDiv) {
    const links = contentDiv.querySelectorAll('a');
    if (links.length > 0) {
      links[0].classList.add('btn', 'btn-primary');
    }
  }
}
