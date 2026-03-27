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
        // Check for a column that only has an img (no text), including imgs inside links
        const imgs = col.querySelectorAll(':scope > img, :scope > p > img, :scope > a > img, :scope > p > a > img, :scope > a > picture');
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

  // Vidyard video support — detect links to play.vidyard.com wrapping images
  block.querySelectorAll('.columns-media-img-col a[href*="vidyard"]').forEach((link) => {
    const img = link.querySelector('img, picture');
    if (!img) return;

    link.classList.add('video-link');
    const playBtn = document.createElement('span');
    playBtn.className = 'video-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    link.style.position = 'relative';
    link.style.display = 'block';
    link.append(playBtn);

    // Extract Vidyard video ID from URL
    const match = link.href.match(/vidyard\.com\/(?:watch\/)?([a-zA-Z0-9]+)/);
    if (!match) return;
    const videoId = match[1];

    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Create lightbox modal with Vidyard iframe
      const overlay = document.createElement('div');
      overlay.className = 'video-lightbox';
      overlay.innerHTML = `
        <div class="video-lightbox-inner">
          <button class="video-lightbox-close" aria-label="Close video">&times;</button>
          <iframe src="https://play.vidyard.com/${videoId}"
            allowfullscreen allow="autoplay"
            style="width:100%;height:100%;border:none;"></iframe>
        </div>
      `;
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.classList.contains('video-lightbox-close')) {
          overlay.remove();
        }
      });
      document.body.append(overlay);
    });
  });

  // Style CTA links as buttons inside gradient variants
  if (block.classList.contains('blue-purple-gradient') || block.classList.contains('blue-green-gradient')) {
    const links = block.querySelectorAll('a');
    links.forEach((link, i) => {
      if (!link.closest('.columns-media-img-col') && !link.classList.contains('video-link')) {
        link.classList.add('btn');
        link.classList.add(i === 0 ? 'btn-outline-light' : 'btn-secondary-light');
      }
    });
  }
}
