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
