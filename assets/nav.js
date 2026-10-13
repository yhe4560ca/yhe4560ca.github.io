/* Site navigator. Include as the first element inside <body>:
   <script src="assets/nav.js"></script>  (or ../assets/nav.js from a subfolder)
   A section is highlighted on every page inside its folder (tools/, docs/).
   Paths are relative to the site root. */
(function () {
  const SECTIONS = [
    {
      title: 'Documentation',
      href: 'docs/index.html'
    },
    {
      title: 'Label Creator',
      href: 'tools/index.html'
    }
  ];

  const script = document.currentScript;
  const root = new URL('..', script.src);
  const here = location.pathname.replace(/\/$/, '/index.html');
  const url = path => new URL(path, root).href;

  const inFolder = path => here.startsWith(new URL('.', url(path)).pathname);
  const current = SECTIONS.find(s => inFolder(s.href));

  const sectionLinks = SECTIONS.map(s => {
    const active = s === current ? ' aria-current="true" class="is-active"' : '';
    return `<a href="${url(s.href)}"${active}>${s.title}</a>`;
  }).join('');

  // Same ship icon in the browser tab, so no page needs its own <link rel="icon">
  if (!document.querySelector('link[rel="icon"]')) {
    document.head.insertAdjacentHTML('beforeend', `<link rel="icon" type="image/svg+xml" href="${url('assets/icon.svg')}">`);
  }

  script.insertAdjacentHTML('afterend', `
    <header class="site-nav">
      <div class="site-nav-bar">
        <a class="site-brand" href="${url('index.html')}"><img class="site-brand-icon" src="${url('assets/icon.svg')}" alt="" width="28" height="28">YHECA</a>
        <nav class="site-sections" aria-label="Sections">${sectionLinks}</nav>
      </div>
    </header>`);
})();
