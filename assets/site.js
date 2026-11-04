// Language: ?lang= wins, then the visitor's earlier choice, then the browser's languages.
(function () {
  const root = document.documentElement;
  const KEY = 'hohoside-lang';

  function detect() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'zh' || q === 'en') return q;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch {}
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (const l of langs) {
      const s = String(l).toLowerCase();
      if (s.startsWith('zh')) return 'zh';
      if (s.startsWith('en')) return 'en';
    }
    return 'en';
  }

  function apply(lang) {
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('img[data-src-zh]').forEach((img) => {
      img.src = lang === 'zh' ? img.dataset.srcZh : img.dataset.srcEn;
    });
    const t = document.querySelector('meta[name="title-' + lang + '"]');
    if (t) document.title = t.content;
    const d = document.querySelector('meta[name="description"]');
    const dl = document.querySelector('meta[name="description-' + lang + '"]');
    if (d && dl) d.content = dl.content;
    document.querySelectorAll('.lang button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
  }

  apply(detect());

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.lang button');
    if (!b) return;
    try {
      localStorage.setItem(KEY, b.dataset.lang);
    } catch {}
    apply(b.dataset.lang);
  });

  const top = document.querySelector('.top');
  if (top) {
    const onScroll = () => top.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }
})();
