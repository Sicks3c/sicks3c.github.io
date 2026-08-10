const ARTICLES = {
  mcp: { file: '../content/research/ATO-via-Open-MCP-DCR.md', section: 'Research', caseId: 'Case 007', fallbackTitle: 'Hunting Account Takeovers in the Wild West of MCP OAuth Servers' },
  'facebook-oauth': { file: '../content/research/ATO-via-Facebook-OAuth-due-unsanitized-Schema-allows-to-Steal-OAuth-Token.md', section: 'Research', caseId: 'Case 006', fallbackTitle: 'ATO via Facebook OAuth Due to an Unsanitized Scheme' },
  'url-shorteners': { file: '../content/research/abusing-url-shortners-for-fun-and-profit.md', section: 'Research', caseId: 'Case 005', fallbackTitle: 'Abusing URL Shorteners for Fun and Profit' },
  'idor-2k': { file: '../content/posts/how-i-scored-2k-bounty-via-an-idor.md', section: 'Writeup', caseId: 'Case 004', fallbackTitle: 'How I Scored $2K via an Easy IDOR' },
  'rce-mailru': { file: '../content/posts/how-i-got-rce-in-the-world-largest-russian-company.md', section: 'Writeup', caseId: 'Case 003', fallbackTitle: "How I RCE'd the Largest Russian Internet Company" },
  waybackurls: { file: '../content/posts/how-i-scored-1k-bounty-using-waybackurls.md', section: 'Writeup', caseId: 'Case 002', fallbackTitle: 'How I Scored $1K Using Waybackurls' },
  'angular-xss': { file: '../content/posts/tale-of-xss-in-angular.md', section: 'Writeup', caseId: 'Case 001', fallbackTitle: 'Tale of XSS in Angular' }
};

const THEMES = {
  signal: { home: '01-signal/', label: 'Signal' },
  editorial: { home: '02-editorial/', label: 'Editorial' },
  console: { home: '03-console/', label: 'Console' },
  atlas: { home: '04-atlas/', label: 'Atlas' }
};

const params = new URLSearchParams(location.search);
const slug = ARTICLES[params.get('slug')] ? params.get('slug') : 'mcp';
const theme = THEMES[params.get('theme')] ? params.get('theme') : 'signal';
const config = ARTICLES[slug];

document.documentElement.dataset.theme = theme;
document.body.id = 'top';

function setThemeLinks() {
  const home = THEMES[theme].home;
  ['back-link', 'home-link', 'mobile-home-link', 'breadcrumb-home', 'index-link', 'footer-home'].forEach((id) => {
    document.querySelector(`#${id}`).href = home;
  });
  document.querySelectorAll('[data-reader-theme]').forEach((link) => {
    const nextTheme = link.dataset.readerTheme;
    link.href = `article.html?theme=${nextTheme}&slug=${slug}`;
    link.classList.toggle('active', nextTheme === theme);
  });
}

function parseFrontmatter(source) {
  if (!source.startsWith('---')) return [{}, source];
  const end = source.indexOf('\n---', 3);
  if (end < 0) return [{}, source];
  const raw = source.slice(4, end).trim();
  const meta = {};
  raw.split('\n').forEach((line) => {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    if (!match) return;
    let value = match[2].trim().replace(/^['"]|['"]$/g, '');
    if (value.startsWith('[')) {
      try { value = JSON.parse(value.replace(/'/g, '"')); } catch { value = value.slice(1, -1).split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')); }
    }
    meta[match[1]] = value;
  });
  return [meta, source.slice(end + 4).trim()];
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMarkdown(value) {
  const code = [];
  let output = escapeHtml(value).replace(/`([^`]+)`/g, (_, text) => {
    code.push(`<code>${text}</code>`);
    return `%%CODE${code.length - 1}%%`;
  });
  output = output
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure><img src="$2" alt="$1" loading="lazy"><figcaption>$1</figcaption></figure>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  code.forEach((fragment, index) => { output = output.replace(`%%CODE${index}%%`, fragment); });
  return output;
}

function slugify(value) {
  return value.toLowerCase().replace(/<[^>]+>/g, '').replace(/&\w+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const html = [];
  const headings = [];
  let paragraph = [];
  let listType = null;
  let code = null;
  let language = '';
  let indentedCode = null;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };
  const closeIndentedCode = () => {
    if (indentedCode === null) return;
    while (indentedCode.length && !indentedCode[indentedCode.length - 1].trim()) indentedCode.pop();
    html.push(`<div class="code-block"><div><span>code</span><button data-copy-code>Copy</button></div><pre><code>${escapeHtml(indentedCode.join('\n'))}</code></pre></div>`);
    indentedCode = null;
  };

  lines.forEach((line, lineIndex) => {
    if (indentedCode !== null && !/^    /.test(line)) {
      if (!line.trim()) { indentedCode.push(''); return; }
      closeIndentedCode();
    }
    if (/^    /.test(line)) {
      closeParagraph(); closeList();
      if (indentedCode === null) indentedCode = [];
      indentedCode.push(line.slice(4));
      return;
    }
    const fence = line.match(/^```\s*([\w-]*)/);
    if (fence) {
      closeParagraph(); closeList();
      if (code === null) { code = []; language = fence[1] || 'text'; }
      else { html.push(`<div class="code-block"><div><span>${language}</span><button data-copy-code>Copy</button></div><pre><code>${escapeHtml(code.join('\n'))}</code></pre></div>`); code = null; language = ''; }
      return;
    }
    if (code !== null) { code.push(line); return; }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeParagraph(); closeList();
      const level = Math.min(Math.max(heading[1].length, 2), 4);
      const text = inlineMarkdown(heading[2]);
      const id = slugify(heading[2]) || `section-${headings.length + 1}`;
      headings.push({ level, text: heading[2].replace(/[*`]/g, ''), id });
      html.push(`<h${level} id="${id}">${text}<a class="heading-anchor" href="#${id}">#</a></h${level}>`);
      return;
    }
    if (/^---+$/.test(line.trim())) { closeParagraph(); closeList(); html.push('<hr>'); return; }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) { closeParagraph(); closeList(); html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`); return; }
    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      closeParagraph();
      const desired = unordered ? 'ul' : 'ol';
      if (listType !== desired) { closeList(); listType = desired; html.push(`<${desired}>`); }
      html.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      return;
    }
    if (!line.trim()) { closeParagraph(); closeList(); return; }
    if (/^!\[[^\]]*\]\([^)]+\)$/.test(line.trim())) { closeParagraph(); closeList(); html.push(inlineMarkdown(line.trim())); return; }
    paragraph.push(line.trim());
  });
  closeIndentedCode(); closeParagraph(); closeList();
  if (code !== null) html.push(`<div class="code-block"><div><span>${language}</span></div><pre><code>${escapeHtml(code.join('\n'))}</code></pre></div>`);
  return { html: html.join('\n'), headings };
}

function formatDate(value) {
  if (!value) return 'Archive record';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function renderToc(headings) {
  const toc = document.querySelector('#table-of-contents');
  toc.innerHTML = headings.filter((heading) => heading.level <= 3).map((heading) => `<a class="toc-level-${heading.level}" href="#${heading.id}"><i></i>${heading.text}</a>`).join('');
  const links = [...toc.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-20% 0px -70%' });
  headings.forEach((heading) => { const element = document.getElementById(heading.id); if (element) sectionObserver.observe(element); });
}

function renderRelated() {
  const entries = Object.entries(ARTICLES).filter(([key]) => key !== slug).slice(0, 3);
  document.querySelector('#related-grid').innerHTML = entries.map(([key, article], index) => `<a href="article.html?theme=${theme}&slug=${key}"><span>0${index + 1} / ${article.section}</span><h3>${article.fallbackTitle}</h3><b>Read case ↗</b></a>`).join('');
}

async function loadArticle() {
  setThemeLinks();
  try {
    const response = await fetch(config.file);
    if (!response.ok) throw new Error(`Article source returned ${response.status}`);
    const source = await response.text();
    const [meta, markdown] = parseFrontmatter(source);
    const title = meta.title || config.fallbackTitle;
    const description = meta.description || markdown.replace(/[#*`_\[\]()]/g, '').split(/\n\s*\n/).find((part) => part.trim().length > 80)?.trim().slice(0, 230) || 'Independent offensive security research from SickSec.';
    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const firstHeading = markdown.match(/^#\s+(.+)$/m);
    const normalizeTitle = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const articleMarkdown = firstHeading && normalizeTitle(firstHeading[1]) === normalizeTitle(title)
      ? markdown.replace(/^#\s+.+\n+/, '')
      : markdown;
    const words = articleMarkdown.replace(/```[\s\S]*?```/g, '').trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 210));
    const rendered = markdownToHtml(articleMarkdown);
    const date = formatDate(meta.date);

    document.title = `${title} — SickSec`;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('#article-title').textContent = title;
    document.querySelector('#article-description').textContent = description;
    document.querySelector('#article-section').textContent = config.section;
    document.querySelector('#rail-section').textContent = config.section === 'Research' ? 'Security research' : 'Bug bounty writeup';
    document.querySelector('#case-id').textContent = config.caseId;
    document.querySelector('#classification').textContent = config.section === 'Research' ? 'Independent research' : 'Field dispatch';
    document.querySelector('#published-date').textContent = date;
    document.querySelector('#rail-date').textContent = date;
    document.querySelector('#reading-time').textContent = `${readingTime} min`;
    document.querySelector('#word-count').textContent = words.toLocaleString('en');
    document.querySelector('#article-tags').innerHTML = (tags.length ? tags : [config.section, 'security']).map((tag) => `<span>${tag}</span>`).join('');
    document.querySelector('#article-body').innerHTML = rendered.html;
    renderToc(rendered.headings);
    renderRelated();

    const shareUrl = encodeURIComponent(location.href);
    const shareTitle = encodeURIComponent(title);
    document.querySelector('#share-x').href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
    document.querySelector('#share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    document.querySelectorAll('[data-copy-code]').forEach((button) => button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.closest('.code-block').querySelector('code').textContent);
      button.textContent = 'Copied'; setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    }));
  } catch (error) {
    document.querySelector('#article-title').textContent = config.fallbackTitle;
    document.querySelector('#article-body').innerHTML = `<div class="article-error"><span>READER ERROR</span><h2>The research file could not be loaded.</h2><p>${escapeHtml(error.message)}. Preview the prototype through the local web server described in the README rather than opening this file directly.</p></div>`;
  }
}

document.querySelector('#copy-link').addEventListener('click', async (event) => {
  await navigator.clipboard.writeText(location.href);
  event.currentTarget.textContent = '✓'; setTimeout(() => { event.currentTarget.textContent = '⌁'; }, 1500);
});

addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress span').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
}, { passive: true });

loadArticle();
