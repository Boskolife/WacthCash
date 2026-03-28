const VIEWPORT_ACTIVE_BREAKPOINT = 768;

/**
 * Adds is-active class when element is fully in viewport.
 * Disabled when viewport width is below VIEWPORT_ACTIVE_BREAKPOINT.
 */
export function initViewportActiveSections() {
  const sections = document.querySelectorAll('[data-viewport-active]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => { 
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { threshold: 0.85 },
  );

  function update() {
    const isEnabled = window.innerWidth > VIEWPORT_ACTIVE_BREAKPOINT;
    if (isEnabled) {
      sections.forEach((section) => observer.observe(section));
    } else {
      sections.forEach((section) => {
        observer.unobserve(section);
        section.classList.remove('is-active');
      });
    }
  }

  update();
  window.addEventListener('resize', update);
}

export function updateCurrentYear() {
  const year = new Date().getFullYear();
  const yearElement = document.querySelector('.year-current');
  if (!yearElement) return;
  yearElement.textContent = year;
}

const HERO_BANNER_GAP_PX = 24;

/**
 * Keeps the hero banner (fixed) from overlapping the footer:
 * when the footer enters the viewport, the banner stops and sits just above it with a gap.
 */
export function initHeroBannerAboveFooter() {
  const banner = document.querySelector('.hero__banner');
  const footer = document.getElementById('footer');
  if (!banner || !footer) return;

  let rafId = null;

  function updateBannerPosition() {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (footerRect.top < viewportHeight - HERO_BANNER_GAP_PX) {
      const bottomPx = viewportHeight - footerRect.top + HERO_BANNER_GAP_PX;
      banner.style.bottom = `${bottomPx}px`;
      banner.style.transform = `translateX(110%)`;
    } else {
      banner.style.bottom = '';
      banner.style.transform = '';
    }
  }

  function onScrollOrResize() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      updateBannerPosition();
      rafId = null;
    });
  }

  updateBannerPosition();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
}

const THANKS_PAYMENT_COPY_DONE_MS = 2000;

/**
 * Profile area: mark active sidebar item from body[data-profile-nav] vs link[data-profile-nav-target].
 * Also marks the header profile icon when any profile page is open (body[data-profile-nav]).
 */
export function initProfileSidebarNav() {
  const navKey = document.body?.dataset?.profileNav;
  if (!navKey) return;

  document.querySelectorAll('[data-profile-nav-target]').forEach((el) => {
    if (el.dataset.profileNavTarget === navKey) {
      el.closest('.section-profile__sidebar-menu-item')?.classList.add('active');
    }
  });

  const profileHeaderLink = document.querySelector('.header__action-button--profile');
  if (profileHeaderLink) {
    profileHeaderLink.classList.add('is-active');
    profileHeaderLink.setAttribute('aria-current', 'page');
  }
}

/**
 * Thanks payment page: copy order ID from visible text (button text content) to clipboard.
 */
export function initThanksPaymentCopyOrderId() {
  const btn = document.querySelector('[data-thanks-payment-copy-order-id]');
  if (!btn || !(btn instanceof HTMLButtonElement)) return;

  const defaultLabel = btn.getAttribute('aria-label') || 'Copy order ID to clipboard';
  let revertTimer = null;

  async function copy() {
    const text = btn.textContent?.trim() ?? '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    btn.classList.add('is-copied');
    btn.setAttribute('aria-label', 'Copied to clipboard');

    if (revertTimer) window.clearTimeout(revertTimer);
    revertTimer = window.setTimeout(() => {
      btn.classList.remove('is-copied');
      btn.setAttribute('aria-label', defaultLabel);
      revertTimer = null;
    }, THANKS_PAYMENT_COPY_DONE_MS);
  }

  btn.addEventListener('click', copy);
}

/**
 * Generic copy-to-clipboard for buttons with [data-copy-to-clipboard].
 * Uses data-copy-text when set; otherwise falls back to trimmed textContent.
 */
export function initCopyToClipboard() {
  const buttons = document.querySelectorAll('[data-copy-to-clipboard]');
  if (!buttons.length) return;

  buttons.forEach((el) => {
    if (!(el instanceof HTMLButtonElement)) return;

    const defaultLabel = el.getAttribute('aria-label') || 'Copy to clipboard';
    let revertTimer = null;

    async function copy() {
      const text =
        el.dataset.copyText?.trim() ?? el.textContent?.trim() ?? '';
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }

      el.classList.add('is-copied');
      el.setAttribute('aria-label', 'Copied to clipboard');

      if (revertTimer) window.clearTimeout(revertTimer);
      revertTimer = window.setTimeout(() => {
        el.classList.remove('is-copied');
        el.setAttribute('aria-label', defaultLabel);
        revertTimer = null;
      }, THANKS_PAYMENT_COPY_DONE_MS);
    }

    el.addEventListener('click', copy);
  });
}

/**
 * Shipping tracking list: expand/collapse per-item tracking timeline panel.
 */
export function initShippingTrackingDropdowns() {
  const items = document.querySelectorAll('[data-shipping-tracking-item]');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('[data-shipping-tracking-toggle]');
    const panel = item.querySelector('[data-shipping-tracking-panel]');
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    });
  });
}
