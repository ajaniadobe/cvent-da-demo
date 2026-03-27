export default function decorate(block) {
  const rows = [...block.children];
  if (rows[0]) rows[0].classList.add('logo-wall-heading');
  if (rows[1]) rows[1].classList.add('logo-wall-logos');
}
