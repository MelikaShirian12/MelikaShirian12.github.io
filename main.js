/*
  Melika Shirian Academic Homepage
  Vanilla JS only

  Features:
  - Theme toggle with localStorage + prefers-color-scheme
  - Mobile nav toggle
  - Scroll reveal via IntersectionObserver
  - Publications filtering + year grouping + live dashboard and bar chart
  - Animated constellation background (canvas) with reduced motion support
  - Contact form validation + mailto builder
*/

(function () {
  'use strict';

  const THEME_KEY = 'melika_theme';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // -----------------
  // Theme
  // -----------------
  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const label = $('#themeLabel');
    const btn = $('#themeToggle');
    if (label) label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#050814' : '#F7F9FF');
  }

  function initTheme() {
    applyTheme(getInitialTheme());

    const toggle = $('#themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });

    // If user hasn't chosen, keep synced with OS changes.
    prefersDark.addEventListener?.('change', () => {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) return;
      applyTheme(prefersDark.matches ? 'dark' : 'light');
    });
  }

  // -----------------
  // Mobile nav
  // -----------------
  function initNav() {
    const toggle = $('.nav__toggle');
    const links = $('#navLinks');
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', () => {
      setOpen(!links.classList.contains('is-open'));
    });

    // Close on link click.
    links.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      setOpen(false);
    });

    // Close on Escape.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // -----------------
  // Scroll reveal
  // -----------------
  function initReveal() {
    const items = $$('.reveal');
    if (items.length === 0) return;
    if (prefersReducedMotion.matches) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    items.forEach((el) => io.observe(el));
  }

  // -----------------
  // Publications data (placeholder until CV extraction)
  // -----------------
  // From CV (single source of truth).
  const publications = [
    {
      id: 'p1',
      year: 2025,
      title: 'From Scenes to Semantics: PersianCLEVR for Bilingual 3D Visual Reasoning',
      venue: 'NeurIPS 2025 (VLM4RWD Workshop, Spotlight)',
      authors: 'K. Vadaei, M. Shirian (Co-First Author), A. Hemmat, MH. Heydari, A. Mamanpoosh, A. Fatemi',
      status: 'published',
      links: {
        pdf: null,
        arxiv: null,
        openreview: null,
        project: null
      },
      bibtex:
        '@inproceedings{vadaei2025persianclevr,\n' +
        '  title={From Scenes to Semantics: PersianCLEVR for Bilingual 3D Visual Reasoning},\n' +
        '  author={Vadaei, K. and Shirian, Melika and Hemmat, A. and Heydari, M.H. and Mamanpoosh, A. and Fatemi, A.},\n' +
        '  booktitle={NeurIPS 2025 Workshops (VLM4RWD)},\n' +
        '  year={2025},\n' +
        '  note={Spotlight}\n' +
        '}'
    },
    {
      id: 'p2',
      year: 2025,
      title: 'Adaptive Chunking for VideoRAG Pipelines with a Newly Gathered Bilingual Educational Dataset',
      venue: 'CSICC 2025 (Oral)',
      authors: 'M. Shirian (Co-First Author), A. Hemmat, K. Vadaei, MH. Heydari, A. Fatemi',
      status: 'published',
      links: {
        pdf: null,
        arxiv: null,
        openreview: null,
        project: null
      },
      bibtex:
        '@inproceedings{shirian2025adaptivechunking,\n' +
        '  title={Adaptive Chunking for VideoRAG Pipelines with a Newly Gathered Bilingual Educational Dataset},\n' +
        '  author={Shirian, Melika and Hemmat, A. and Vadaei, K. and Heydari, M.H. and Fatemi, A.},\n' +
        '  booktitle={CSICC 2025},\n' +
        '  year={2025},\n' +
        '  note={Oral}\n' +
        '}'
    },
    {
      id: 'p3',
      year: 2026,
      title: 'When 1+1 ≠ 2: Benchmarking Civil-Time Reasoning in Large Language Models',
      venue: 'Under review (ACL 2026)',
      authors:
        'K. Vadaei, M. Shirian (Co-First Author), MH. Shaker Ardakani, A. Mamanpoosh, M. Moqadas, A. Rismanchian, A. Fatemi, A. Hemmat',
      status: 'under-review',
      links: {
        pdf: null,
        arxiv: null,
        openreview: null,
        project: null
      },
      bibtex:
        '@misc{vadaei2026civiltimereasoning,\n' +
        '  title={When 1+1 \\u2260 2: Benchmarking Civil-Time Reasoning in Large Language Models},\n' +
        '  author={Vadaei, K. and Shirian, Melika and Shaker Ardakani, M.H. and Mamanpoosh, A. and Moqadas, M. and Rismanchian, A. and Fatemi, A. and Hemmat, A.},\n' +
        '  year={2026},\n' +
        '  note={Under review (ACL 2026)}\n' +
        '}'
    },
    {
      id: 'p4',
      year: 2025,
      title: 'PrismSSL: One Interface, Many Modalities; A Single-Interface Library for Multimodal Self-Supervised Learning',
      venue: 'Preprint (arXiv:2511.17776)',
      authors: 'M. Shirian (Co-First Author), K. Vadaei, K. Majlessi, A. Ebrahimi, A. Hemmat, P. Adibi, H. Karshenas',
      status: 'preprint',
      links: {
        pdf: null,
        arxiv: 'https://arxiv.org/abs/2511.17776',
        openreview: null,
        project: null
      },
      bibtex:
        '@misc{shirian2025prismssl,\n' +
        '  title={PrismSSL: One Interface, Many Modalities; A Single-Interface Library for Multimodal Self-Supervised Learning},\n' +
        '  author={Shirian, Melika and Vadaei, K. and Majlessi, K. and Ebrahimi, A. and Hemmat, A. and Adibi, P. and Karshenas, H.},\n' +
        '  year={2025},\n' +
        '  eprint={2511.17776},\n' +
        '  archivePrefix={arXiv},\n' +
        '  primaryClass={cs.LG}\n' +
        '}'
    }
  ];

  function normalizeStatus(s) {
    const v = String(s || '').toLowerCase();
    if (v === 'published') return 'published';
    if (v === 'under-review' || v === 'under review' || v === 'review') return 'under-review';
    if (v === 'preprint') return 'preprint';
    return 'preprint';
  }

  function statusLabel(status) {
    if (status === 'published') return 'Published';
    if (status === 'under-review') return 'Submitted';
    return 'Preprint';
  }

  function statusBadgeClass(status) {
    if (status === 'published') return 'badge--published';
    if (status === 'under-review') return 'badge--under-review';
    return 'badge--preprint';
  }

  function renderPublications(filtered) {
    const list = $('#pubList');
    const timeline = $('#pubTimeline');
    if (!list || !timeline) return;

    const statusRank = (s) => {
      const st = normalizeStatus(s);
      if (st === 'published') return 0;
      if (st === 'under-review') return 1;
      return 2; // preprint
    };

    const sorted = filtered
      .slice()
      .sort(
        (a, b) =>
          statusRank(a.status) - statusRank(b.status) ||
          (b.year || 0) - (a.year || 0) ||
          String(a.title).localeCompare(String(b.title))
      );

    // Year grouping pills
    const years = Array.from(new Set(sorted.map((p) => p.year).filter(Boolean)));
    years.sort((a, b) => b - a);
    timeline.innerHTML = years.map((y) => `<span class="yearPill">${escapeHtml(y)}</span>`).join('');

    if (sorted.length === 0) {
      list.innerHTML = `<div class="card"><p class="muted">No publications match this filter.</p></div>`;
      return;
    }

    list.innerHTML = sorted
      .map((p) => {
        const st = normalizeStatus(p.status);
        const pdfHref = p.links?.pdf || '#';
        const arxivHref = p.links?.arxiv || '#';
        const orHref = p.links?.openreview || '#';
        const projHref = p.links?.project || '#';

        const pdfIsPlaceholder = !p.links?.pdf;
        const arxivIsPlaceholder = !p.links?.arxiv;
        const orIsPlaceholder = !p.links?.openreview;
        const projIsPlaceholder = !p.links?.project;

        const bibId = `bib_${p.id}`;

        return `
<article class="pub" data-status="${escapeHtml(st)}" data-year="${escapeHtml(p.year)}">
  <div class="pub__top">
    <div>
      <h3 class="pub__title">${escapeHtml(p.title)}</h3>
      <p class="pub__meta"><strong>${escapeHtml(p.venue)}</strong> • ${escapeHtml(p.authors)} • ${escapeHtml(p.year)}</p>
    </div>
    <span class="badge ${statusBadgeClass(st)}">${escapeHtml(statusLabel(st))}</span>
  </div>



  <pre class="bib" id="${escapeHtml(bibId)}" hidden>${escapeHtml(p.bibtex || '')}</pre>
</article>`;
      })
      .join('');

    // BibTeX toggles
    list.addEventListener(
      'click',
      (e) => {
        const btn = e.target.closest('button[data-bib-toggle]');
        if (!btn) return;
        const id = btn.getAttribute('data-bib-toggle');
        const pre = id ? document.getElementById(id) : null;
        if (!pre) return;
        const isHidden = pre.hasAttribute('hidden');
        if (isHidden) pre.removeAttribute('hidden');
        else pre.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      },
      { once: false }
    );
  }

  function updateDashboard(filtered, all) {
    const total = filtered.length;
    const published = filtered.filter((p) => normalizeStatus(p.status) === 'published').length;
    const underReview = filtered.filter((p) => normalizeStatus(p.status) === 'under-review').length;
    const preprint = filtered.filter((p) => normalizeStatus(p.status) === 'preprint').length;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value);
    };

    setText('statTotal', total);
    setText('statPublished', published);
    setText('statUnderReview', underReview);
    setText('statPreprint', preprint);

    // Bars are computed relative to max in current view for legibility.
    const max = Math.max(1, published, underReview, preprint);

    const setBar = (fillId, valId, value) => {
      const fill = document.getElementById(fillId);
      const val = document.getElementById(valId);
      if (fill) fill.style.width = `${Math.round((value / max) * 100)}%`;
      if (val) val.textContent = String(value);
    };

    setBar('barPublished', 'barPublishedVal', published);
    setBar('barUnderReview', 'barUnderReviewVal', underReview);
    setBar('barPreprint', 'barPreprintVal', preprint);

    // Update JSON-LD knowsAbout if interest chips exist (keeps identity data consistent)
    // (Still placeholder until CV extraction.)
    void all;
  }

  function initPublications() {
    const filters = $$('.filter');
    if (filters.length === 0) return;

    let active = 'all';

    function getFiltered() {
      if (active === 'all') return publications;
      return publications.filter((p) => normalizeStatus(p.status) === active);
    }

    function render() {
      const filtered = getFiltered();
      updateDashboard(filtered, publications);
      renderPublications(filtered);
    }

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const raw = btn.getAttribute('data-filter') || 'all';
        if (raw === 'published' || raw === 'under-review' || raw === 'preprint') active = raw;
        else active = 'all';

        render();
      });
    });

    render();
  }

  // -----------------
  // Background constellation canvas
  // -----------------
  function initBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const nodeCount = prefersReducedMotion.matches ? 18 : 46;
    const nodes = [];

    function colorVars() {
      const style = getComputedStyle(document.documentElement);
      return {
        text: style.getPropertyValue('--text').trim() || '#EAF0FF',
        primary: style.getPropertyValue('--primary').trim() || '#7AA2FF',
        secondary: style.getPropertyValue('--secondary').trim() || '#B38CFF',
        accent: style.getPropertyValue('--accent').trim() || '#22D3EE'
      };
    }

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function seed() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const r = rand(1.0, 2.2);
        nodes.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.18, 0.18),
          vy: rand(-0.16, 0.16),
          r,
          tw: rand(0.3, 1.0),
          phase: rand(0, Math.PI * 2)
        });
      }
    }

    function step(t) {
      const { primary, secondary, accent } = colorVars();

      ctx.clearRect(0, 0, w, h);

      // Subtle vignette
      const vignette = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, document.documentElement.dataset.theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(11,16,32,0.10)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Edges
      const maxDist = prefersReducedMotion.matches ? 120 : 170;
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist) continue;
          const alpha = (1 - dist / maxDist) * (prefersReducedMotion.matches ? 0.22 : 0.35);
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(34,211,238,${alpha})`);
          grad.addColorStop(0.5, `rgba(179,140,255,${alpha})`);
          grad.addColorStop(1, `rgba(122,162,255,${alpha})`);
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(n.phase + t / 900) * n.tw;
        const rr = n.r + tw * 0.8;
        ctx.fillStyle = `rgba(34,211,238,${0.25 + tw * 0.35})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
        ctx.fill();

        // Tiny halo
        ctx.strokeStyle = `rgba(179,140,255,${0.16 + tw * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr * 2.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Motion
      if (!prefersReducedMotion.matches) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
        raf = requestAnimationFrame(step);
      }

      // If reduced motion: render once.
      void primary;
      void secondary;
      void accent;
    }

    function start() {
      cancelAnimationFrame(raf);
      resize();
      seed();
      if (prefersReducedMotion.matches) {
        step(performance.now());
        return;
      }
      raf = requestAnimationFrame(step);
    }

    window.addEventListener('resize', () => start(), { passive: true });

    // Repaint on theme changes.
    const themeBtn = $('#themeToggle');
    themeBtn?.addEventListener('click', () => {
      if (prefersReducedMotion.matches) step(performance.now());
    });

    prefersReducedMotion.addEventListener?.('change', () => start());

    start();
  }

  // -----------------
  // Contact form validation + mailto
  // -----------------
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const name = $('#name');
    const email = $('#email');
    const subject = $('#subject');
    const message = $('#message');

    const errName = $('#errName');
    const errEmail = $('#errEmail');
    const errSubject = $('#errSubject');
    const errMessage = $('#errMessage');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setErr(el, msg) {
      if (!el) return;
      el.textContent = msg || '';
    }

    function validate() {
      let ok = true;

      const n = (name?.value || '').trim();
      const e = (email?.value || '').trim();
      const s = (subject?.value || '').trim();
      const m = (message?.value || '').trim();

      if (!n) {
        setErr(errName, 'Please enter your name.');
        ok = false;
      } else {
        setErr(errName, '');
      }

      if (!e) {
        setErr(errEmail, 'Please enter your email.');
        ok = false;
      } else if (!emailRe.test(e)) {
        setErr(errEmail, 'Please enter a valid email address.');
        ok = false;
      } else {
        setErr(errEmail, '');
      }

      if (!s) {
        setErr(errSubject, 'Please add a subject.');
        ok = false;
      } else {
        setErr(errSubject, '');
      }

      if (!m) {
        setErr(errMessage, 'Please write a short message.');
        ok = false;
      } else if (m.length < 10) {
        setErr(errMessage, 'Could you add a bit more detail (10+ characters)?');
        ok = false;
      } else {
        setErr(errMessage, '');
      }

      return { ok, n, e, s, m };
    }

    function buildMailto({ n, e, s, m }) {
      const to = 'mel.shirian@gmail.com';
      const subj = s;
      const bodyLines = [
        `Name: ${n}`,
        `Email: ${e}`,
        '',
        m,
        '',
        '---',
        'Sent from Melika Shirian homepage contact form (mailto).'
      ];
      const body = bodyLines.join('\n');

      const params = new URLSearchParams({
        subject: subj,
        body
      });
      return `mailto:${to}?${params.toString()}`;
    }

    // Friendly inline validation
    ['input', 'blur'].forEach((evt) => {
      form.addEventListener(evt, (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (!['name', 'email', 'subject', 'message'].includes(e.target.id)) return;
        validate();
      }, true);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = validate();
      if (!res.ok) {
        // Focus first field with an error
        if (errName?.textContent) name?.focus();
        else if (errEmail?.textContent) email?.focus();
        else if (errSubject?.textContent) subject?.focus();
        else if (errMessage?.textContent) message?.focus();
        return;
      }
      window.location.href = buildMailto(res);
    });
  }

  // -----------------
  // Init
  // -----------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initReveal();
    initPublications();
    initBackground();
    initContactForm();
  });
})();
