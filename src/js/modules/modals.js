import {
  MOBILE_MENU_OPEN_CLASS,
  BODY_MENU_OPEN_CLASS,
  CONTACT_MODAL_OPEN_CLASS,
  FORGOT_PASSWORD_POPUP_OPEN_CLASS,
  BODY_MODAL_OPEN_CLASS,
} from './constants.js';

export function initContactModal() {
  const modal = document.querySelector('.contact-modal');
  const openBtns = document.querySelectorAll('[data-open-contact-modal]');
  const closeBtn = document.querySelector('.contact-modal__close');
  const overlay = document.querySelector('.contact-modal__overlay');

  if (!modal || !openBtns.length) return;

  let lastFocusedElement = null;
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return Array.from(modal.querySelectorAll(focusableElements)).filter(
      (el) => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'),
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableEls = getFocusableElements();
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  function openModal(e) {
    // Store the element that triggered the modal opening
    lastFocusedElement = e?.target || document.activeElement;
    
    modal.classList.add(CONTACT_MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'false');
    openBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
    document.body.classList.add(BODY_MODAL_OPEN_CLASS);
    
    // Focus close button after modal is opened
    setTimeout(() => {
      closeBtn?.focus();
    }, 0);

    // Add focus trap
    modal.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    // Remove focus from close button before hiding modal
    if (closeBtn && document.activeElement === closeBtn) {
      closeBtn.blur();
    }
    
    modal.classList.remove(CONTACT_MODAL_OPEN_CLASS);
    modal.setAttribute('aria-hidden', 'true');
    openBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove(BODY_MODAL_OPEN_CLASS);
    
    // Remove focus trap
    modal.removeEventListener('keydown', trapFocus);
    
    // Return focus to the element that opened the modal
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 0);
    }
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      modal.classList.contains(CONTACT_MODAL_OPEN_CLASS)
    ) {
      closeModal();
    }
  });
}

export function initForgotPasswordPopup() {
  const popup = document.querySelector('.forgot-password-popup');
  const form = document.getElementById('forgot-password-request-form');
  const emailTarget = document.getElementById('forgot-password-popup-email');
  const emailInput = document.getElementById('forgot-password-form-email');
  const closeBtn = document.querySelector('.forgot-password-popup__close');
  const overlay = document.querySelector('.forgot-password-popup__overlay');

  if (!popup || !form) return;

  let lastFocusedElement = null;
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return Array.from(popup.querySelectorAll(focusableElements)).filter(
      (el) => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'),
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusableEls = getFocusableElements();
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable?.focus();
    }
  }

  function removeBodyModalOpenIfIdle() {
    const contactOpen = document
      .querySelector('.contact-modal')
      ?.classList.contains(CONTACT_MODAL_OPEN_CLASS);
    if (!contactOpen) {
      document.body.classList.remove(BODY_MODAL_OPEN_CLASS);
    }
  }

  function openPopup() {
    lastFocusedElement = document.activeElement;
    const rawEmail = emailInput?.value?.trim() || '';
    if (emailTarget) {
      emailTarget.textContent = rawEmail;
    }

    popup.classList.add(FORGOT_PASSWORD_POPUP_OPEN_CLASS);
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add(BODY_MODAL_OPEN_CLASS);
    setTimeout(() => {
      closeBtn?.focus();
    }, 0);
    popup.addEventListener('keydown', trapFocus);
  }

  function closePopup() {
    if (closeBtn && document.activeElement === closeBtn) {
      closeBtn.blur();
    }
    popup.classList.remove(FORGOT_PASSWORD_POPUP_OPEN_CLASS);
    popup.setAttribute('aria-hidden', 'true');
    removeBodyModalOpenIfIdle();
    popup.removeEventListener('keydown', trapFocus);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      setTimeout(() => lastFocusedElement.focus(), 0);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    openPopup();
  });

  closeBtn?.addEventListener('click', closePopup);
  overlay?.addEventListener('click', closePopup);

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      popup.classList.contains(FORGOT_PASSWORD_POPUP_OPEN_CLASS)
    ) {
      closePopup();
    }
  });
}

export function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const burger = document.querySelector('.header__burger-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const overlay = document.querySelector('.mobile-menu__overlay');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!menu || !burger) return;

  let lastFocusedElement = null;
  const focusableElements = 'a, button, [href], [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return Array.from(menu.querySelectorAll(focusableElements)).filter(
      (el) => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'),
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableEls = getFocusableElements();
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  function openMenu() {
    lastFocusedElement = document.activeElement;
    
    menu.classList.add(MOBILE_MENU_OPEN_CLASS);
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('header__burger-menu--active');
    document.body.classList.add(BODY_MENU_OPEN_CLASS);
    
    // Focus close button after menu is opened
    setTimeout(() => {
      closeBtn?.focus();
    }, 0);

    // Add focus trap
    menu.addEventListener('keydown', trapFocus);
  }

  function closeMenu() {
    // Remove focus from close button before hiding menu
    if (closeBtn && document.activeElement === closeBtn) {
      closeBtn.blur();
    }
    
    menu.classList.remove(MOBILE_MENU_OPEN_CLASS);
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('header__burger-menu--active');
    document.body.classList.remove(BODY_MENU_OPEN_CLASS);
    
    // Remove focus trap
    menu.removeEventListener('keydown', trapFocus);
    
    // Return focus to the element that opened the menu
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      setTimeout(() => {
        lastFocusedElement.focus();
      }, 0);
    }
  }

  burger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains(MOBILE_MENU_OPEN_CLASS)) {
      closeMenu();
    }
  });
}
