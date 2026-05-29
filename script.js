// ============================================
//   ANA MADE STUDIOS — script.js — Luxe Edition
// ============================================

// ── Page Loader ───────────────────────────────
const loader = document.getElementById('pageLoader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2000);
});

// ── Custom Cursor ─────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

document.addEventListener('mousemove', (e) => {
  cursor.style.left     = e.clientX + 'px';
  cursor.style.top      = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

// ── Mobile Menu ──────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Word-by-word reveal on headings ──────────
function splitIntoWords(el) {
  // Preserve <em> tags by working with child nodes
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (part.trim()) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = part;
          el.appendChild(span);
          el.appendChild(document.createTextNode(' '));
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // For <em> tags, wrap the whole thing as one word
      const span = document.createElement('span');
      span.className = 'word';
      span.appendChild(node.cloneNode(true));
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    }
  });
}

document.querySelectorAll('.reveal-text').forEach(el => splitIntoWords(el));

// ── Scroll Fade-Up + Reveal Animations ───────
const fadeEls = document.querySelectorAll(
  '.hero-content, .hero-img-wrap, .about-img-col, .about-text-col, .gallery-card, .cta-band-inner, .gallery-header, .scroll-hint'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.index ? parseInt(entry.target.dataset.index) * 80 : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// Reveal text headings
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-text').forEach(el => revealObserver.observe(el));

// ── Parallax Hero Image ───────────────────────
const parallaxEl = document.querySelector('.hero-parallax');
if (parallaxEl) {
  let ticking = false;
  let currentY = 0;
  let targetY = 0;

  window.addEventListener('scroll', () => {
    targetY = window.scrollY * 0.08;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Lerp (smooth interpolation) toward target
        currentY += (targetY - currentY) * 0.12;
        parallaxEl.style.transform = `translateY(${currentY}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Horizontal Scroll — drag to scroll ───────
const galleryScroll = document.getElementById('galleryScroll');
if (galleryScroll) {
  let isDown = false, startX, scrollLeft;

  galleryScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    galleryScroll.style.cursor = 'grabbing';
    startX = e.pageX - galleryScroll.offsetLeft;
    scrollLeft = galleryScroll.scrollLeft;
  });
  galleryScroll.addEventListener('mouseleave', () => { isDown = false; galleryScroll.style.cursor = 'grab'; });
  galleryScroll.addEventListener('mouseup',    () => { isDown = false; galleryScroll.style.cursor = 'grab'; });
  galleryScroll.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - galleryScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryScroll.scrollLeft = scrollLeft - walk;
  });
}

// ── Nav background on scroll ──────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 60
    ? '0 4px 20px rgba(30,42,110,0.08)'
    : 'none';
}, { passive: true });

// ── Smooth Nav Active State ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--pink)';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));