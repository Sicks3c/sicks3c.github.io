(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clock = document.querySelector('#console-clock');
  const updateClock = () => {
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Dubai' });
    clock.dateTime = now.toISOString();
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-navigation');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav?.classList.toggle('is-open', open);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  if (!reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--rx', `${-y * 2.5}deg`);
        card.style.setProperty('--ry', `${x * 3}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      const scope = button.closest('[data-filter-scope]');
      scope?.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('[data-category]').forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      document.querySelector('#case-grid')?.classList.toggle('list-view', button.dataset.view === 'list');
    });
  });

  const progress = document.querySelector('.reading-progress span');
  const updateProgress = () => {
    if (!progress) return;
    const maximum = root.scrollHeight - window.innerHeight;
    progress.style.width = `${maximum > 0 ? window.scrollY / maximum * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const tocLinks = [...document.querySelectorAll('.toc-sticky a[href^="#"]')];
  const contentHeadings = [...document.querySelectorAll('.article-content h2[id], .article-content h3[id]')];
  if (tocLinks.length && contentHeadings.length) {
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-18% 0px -72%' });
    contentHeadings.forEach((heading) => tocObserver.observe(heading));
  }

  document.querySelectorAll('[data-copy-code]').forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.closest('.code-block')?.querySelector('code');
      if (!code) return;
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    });
  });

  document.querySelector('[data-copy-url]')?.addEventListener('click', async (event) => {
    await navigator.clipboard.writeText(window.location.href);
    event.currentTarget.textContent = '✓';
    window.setTimeout(() => { event.currentTarget.textContent = '⌁'; }, 1500);
  });

  const searchDialog = document.querySelector('#search-dialog');
  const searchInput = document.querySelector('#search-input');
  const searchResults = document.querySelector('#search-results');
  const searchCount = document.querySelector('#search-count');
  let searchIndex = null;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  const loadIndex = async () => {
    if (searchIndex) return searchIndex;
    const response = await fetch(`${root.dataset.basePath || ''}/index.json`);
    if (!response.ok) throw new Error('Search index unavailable');
    searchIndex = (await response.json()).filter((item) => item.type === 'posts' || item.type === 'research');
    return searchIndex;
  };
  const renderSearch = async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) {
      searchCount.textContent = 'TYPE TO QUERY';
      searchResults.innerHTML = '<p>Enter at least two characters to search the archive.</p>';
      return;
    }
    try {
      const index = await loadIndex();
      const terms = query.split(/\s+/);
      const results = index.filter((item) => {
        const haystack = `${item.title} ${item.summary} ${item.content} ${item.section}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      }).slice(0, 8);
      searchCount.textContent = `${results.length} MATCH${results.length === 1 ? '' : 'ES'}`;
      searchResults.innerHTML = results.length ? results.map((item, indexPosition) => `<a href="${escapeHtml(item.permalink)}"><span>0${indexPosition + 1} / ${escapeHtml(item.section || item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary || '').slice(0, 180)}</p><b>OPEN ↗</b></a>`).join('') : '<p>No matching case files. Try a broader technique or vulnerability class.</p>';
    } catch (error) {
      searchCount.textContent = 'INDEX ERROR';
      searchResults.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    }
  };

  document.querySelectorAll('[data-open-search]').forEach((button) => button.addEventListener('click', async () => {
    searchDialog?.showModal();
    await loadIndex().catch(() => null);
    window.setTimeout(() => searchInput?.focus(), 50);
  }));
  document.querySelector('[data-close-search]')?.addEventListener('click', () => searchDialog?.close());
  searchDialog?.addEventListener('click', (event) => { if (event.target === searchDialog) searchDialog.close(); });
  searchInput?.addEventListener('input', renderSearch);
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.target.matches('input, textarea')) {
      event.preventDefault();
      searchDialog?.showModal();
      searchInput?.focus();
    }
  });
})();
