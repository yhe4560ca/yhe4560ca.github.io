/* Highlights the section being read in a document's contents (.doc-toc).
   Include at the end of the page: <script src="../assets/doc-toc.js"></script> */
(function () {
  const toc = document.querySelector('.doc-toc');
  if (!toc) return;

  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map(link => ({ link, heading: document.getElementById(link.getAttribute('href').slice(1)) }))
    .filter(s => s.heading);
  if (!sections.length) return;

  const navHeight = () => document.querySelector('.site-nav')?.offsetHeight || 0;
  let current = null;
  // A section chosen from the contents (or the URL) stays highlighted until the reader scrolls
  // themselves, since near the bottom of the page the heading may never reach the top
  let pinned = null;

  function update() {
    if (pinned) return setCurrent(pinned);
    // The current section is the last heading that has scrolled past the line just below the navigator
    const line = navHeight() + 24;
    let active = sections[0];
    for (const s of sections) {
      if (s.heading.getBoundingClientRect().top <= line) active = s;
    }
    // At the very bottom, short final sections can never reach the line; pick the last one
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
      active = sections[sections.length - 1];
    }
    setCurrent(active);
  }

  function setCurrent(active) {
    if (active === current) return;
    if (current) {
      current.link.classList.remove('is-current');
      current.link.removeAttribute('aria-current');
    }
    active.link.classList.add('is-current');
    active.link.setAttribute('aria-current', 'location');
    current = active;

    // Keep the highlighted entry visible when the contents box scrolls on its own
    if (toc.scrollHeight > toc.clientHeight) {
      const linkTop = active.link.offsetTop - toc.offsetTop;
      if (linkTop < toc.scrollTop || linkTop > toc.scrollTop + toc.clientHeight - 40) {
        toc.scrollTop = linkTop - toc.clientHeight / 3;
      }
    }
  }

  let queued = false;
  function queueUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  }

  const pin = id => { pinned = sections.find(s => s.heading.id === id) || null; queueUpdate(); };
  links.forEach(link => link.addEventListener('click', () => pin(link.getAttribute('href').slice(1))));
  addEventListener('hashchange', () => pin(location.hash.slice(1)));
  const unpin = () => { if (pinned) { pinned = null; queueUpdate(); } };
  ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(type =>
    addEventListener(type, e => { if (!toc.contains(e.target)) unpin(); }, { passive: true }));
  if (location.hash) pin(location.hash.slice(1));

  addEventListener('scroll', queueUpdate, { passive: true });
  addEventListener('resize', queueUpdate);
  update();
})();
