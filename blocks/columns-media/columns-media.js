export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // setup image columns — detect picture or standalone img
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-media-img-col');
        }
      } else {
        // Check for a column that only has an img (no text)
        const imgs = col.querySelectorAll(':scope > img, :scope > p > img');
        const textNodes = [...col.childNodes].filter(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
        );
        const hasHeading = col.querySelector('h1, h2, h3, h4, h5, h6');
        if (imgs.length > 0 && textNodes.length === 0 && !hasHeading && col.querySelectorAll('p').length <= imgs.length) {
          col.classList.add('columns-media-img-col');
        }
      }
    });
  });

  // Style CTA links as buttons inside gradient variants
  if (block.classList.contains('blue-purple-gradient') || block.classList.contains('blue-green-gradient')) {
    const links = block.querySelectorAll('a');
    links.forEach((link, i) => {
      if (!link.closest('.columns-media-img-col')) {
        link.classList.add('btn');
        link.classList.add(i === 0 ? 'btn-outline-light' : 'btn-secondary-light');
      }
    });
  }
}
