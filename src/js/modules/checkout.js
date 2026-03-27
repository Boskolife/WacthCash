/**
 * Initializes checkout sub-tabs (e.g. "New Customer" / "I have an account",
 * "Paying From Canada" / "Paying From Another Country").
 * Each tablist only toggles panels within the same parent container.
 */
export function initCheckoutTabs() {
  const section = document.querySelector('.checkout');
  if (!section) return;

  const tablists = [...section.querySelectorAll('.checkout__panel-buttons[role="tablist"]')];
  if (!tablists.length) return;

  tablists.forEach((tablist) => {
    const scope = tablist.parentElement;
    if (!scope) return;

    const tabs = [...tablist.querySelectorAll('[data-checkout-tab]')];
    const panels = [...scope.querySelectorAll('[data-checkout-panel]')];
    if (tabs.length === 0 || panels.length === 0) return;

    function setActive(key) {
      tabs.forEach((tab) => {
        const isActive = tab.dataset.checkoutTab === key;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.checkoutPanel === key;
        if (isActive) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    }

    const initial =
      tabs.find((t) => t.classList.contains('active'))?.dataset.checkoutTab ||
      tabs[0]?.dataset.checkoutTab;
    if (initial) setActive(initial);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.checkoutTab;
        if (!key) return;
        setActive(key);
      });
    });

    tablist.addEventListener('keydown', (e) => {
      const current = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      if (current < 0) return;

      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        next = (current - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;

      if (next >= 0) {
        e.preventDefault();
        const key = tabs[next]?.dataset.checkoutTab;
        if (key) setActive(key);
        tabs[next]?.focus();
      }
    });
  });
}

