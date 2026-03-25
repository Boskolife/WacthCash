/**
 * Initializes FAQ accordion: when one item opens, all others close (per list).
 */
export function initFaqAccordion() {
  document.querySelectorAll('.faq__list').forEach((faqList) => {
    const items = faqList.querySelectorAll('.faq__item');

    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  });
}

/**
 * Tabbed FAQ on product page: switches panels and updates ARIA / focus.
 */
export function initProductFaqTabs() {
  const section = document.querySelector('.product-faq');
  if (!section) return;

  const tablist = section.querySelector('[role="tablist"]');
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  const panels = [...section.querySelectorAll('[role="tabpanel"]')];

  if (!tablist || tabs.length === 0 || panels.length === 0) return;
  if (tabs.length !== panels.length) return;

  function activateTab(index) {
    const safeIndex = Math.max(0, Math.min(index, tabs.length - 1));

    tabs.forEach((tab, i) => {
      const selected = i === safeIndex;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.classList.toggle('active', selected);
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel, i) => {
      if (i === safeIndex) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(index);
    });
  });

  tablist.addEventListener('keydown', (e) => {
    const current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let next = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (current + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    }

    if (next >= 0) {
      e.preventDefault();
      activateTab(next);
      tabs[next].focus();
    }
  });
}
