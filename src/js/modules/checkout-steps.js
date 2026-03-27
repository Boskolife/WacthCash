/**
 * Temporary checkout step navigation.
 * Buttons in forms only switch visible steps.
 * Last step action buttons are intentionally passive for now.
 *
 * TODO: Remove click-only step switching after validation flow is implemented.
 */
export function initCheckoutStepsNavigation() {
  const section = document.querySelector('.checkout');
  if (!section) return;

  const stepOrder = ['details', 'shipping', 'payment'];
  const stepElements = stepOrder
    .map((key) => section.querySelector(`#checkout-tab-${key}`))
    .filter(Boolean);
  const panelElements = stepOrder
    .map((key) => section.querySelector(`#checkout-panel-${key}`))
    .filter(Boolean);

  if (stepElements.length !== stepOrder.length || panelElements.length !== stepOrder.length) {
    return;
  }

  function setActiveStep(stepKey) {
    stepOrder.forEach((key) => {
      const isActive = key === stepKey;
      const step = section.querySelector(`#checkout-tab-${key}`);
      const panel = section.querySelector(`#checkout-panel-${key}`);
      if (!step || !panel) return;

      step.classList.toggle('active', isActive);
      step.setAttribute('aria-current', isActive ? 'step' : 'false');

      if (isActive) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  }

  setActiveStep('details');

  const detailsPanel = section.querySelector('#checkout-panel-details');
  const shippingPanel = section.querySelector('#checkout-panel-shipping');

  if (detailsPanel) {
    const detailsButtons = detailsPanel.querySelectorAll('.checkout__form-submit');
    detailsButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveStep('shipping');
      });
    });
  }

  if (shippingPanel) {
    const shippingButtons = shippingPanel.querySelectorAll('.checkout__form-submit');
    shippingButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveStep('payment');
      });
    });
  }
}

function resetCheckoutCreditCardSavedSelection(root) {
  const creditPanel = root.querySelector('[data-checkout-payment-panel="credit-card"]');
  if (!creditPanel) return;
  const cards = creditPanel.querySelectorAll('.checkout__panel-inner-tab-saved-card');
  const form = creditPanel.querySelector('.credit-card__form');
  cards.forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  if (form) form.removeAttribute('hidden');
}

/**
 * Payment method radios toggle bank-transfer vs credit-card blocks under #checkout-panel-payment.
 * (Radios live outside the credit-card-only form, so scope by panel root, not .checkout__form_payment.)
 */
export function initCheckoutPaymentMethodPanels() {
  const root = document.querySelector('#checkout-panel-payment');
  if (!root) return;

  const radios = root.querySelectorAll('input[name="checkout-form-payment-method"]');
  const panels = root.querySelectorAll('[data-checkout-payment-panel]');
  if (!radios.length || !panels.length) return;

  function sync() {
    const selected = root.querySelector(
      'input[name="checkout-form-payment-method"]:checked',
    )?.value;
    if (!selected) return;
    panels.forEach((panel) => {
      const show = panel.dataset.checkoutPaymentPanel === selected;
      if (show) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
    if (selected === 'credit-card') {
      resetCheckoutCreditCardSavedSelection(root);
    }
  }

  radios.forEach((radio) => radio.addEventListener('change', sync));
  sync();
}

/**
 * Saved card tiles: pick one -> active state + hide manual card form. Selecting payment method
 * "credit card" again resets to form visible (see resetCheckoutCreditCardSavedSelection).
 */
export function initCheckoutSavedCardButtons() {
  const creditPanel = document.querySelector('[data-checkout-payment-panel="credit-card"]');
  if (!creditPanel) return;

  const list = creditPanel.querySelector('.checkout__panel-inner-tab-saved-cards');
  const form = creditPanel.querySelector('.credit-card__form');
  if (!list || !form) return;

  const cards = list.querySelectorAll('.checkout__panel-inner-tab-saved-card');
  if (!cards.length) return;

  cards.forEach((btn) => {
    btn.addEventListener('click', () => {
      cards.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      form.setAttribute('hidden', '');
    });
  });
}
