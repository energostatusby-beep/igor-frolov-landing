// sticky nav state + reveal-on-scroll + smooth anchors
(() => {
  'use strict';

  const nav = document.getElementById('nav');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // nav scrolled state
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // reveal on intersect
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // smooth anchor click — accounting for sticky nav offset
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // subtle parallax on hero art (mouse)
  const stage = document.querySelector('.art-stage');
  if (stage && window.matchMedia('(pointer:fine)').matches) {
    const rect = () => stage.getBoundingClientRect();
    let raf = 0;
    stage.addEventListener('mousemove', (e) => {
      const r = rect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.transform = `perspective(1000px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
      });
    });
    stage.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      stage.style.transform = '';
    });
  }
})();
