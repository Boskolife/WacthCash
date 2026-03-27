// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// intl-tel-input styles
import 'intl-tel-input/build/css/intlTelInput.css';

// Modules
import { initContactModal, initForgotPasswordPopup, initMobileMenu } from './modules/modals.js';
import {
  initVideoControls,
  removeVideoControls,
  initResponsiveVideoSources,
} from './modules/video.js';
import {
  initAboutBrandsSlider,
  initProductGallery,
  initShopSlider,
  initSliderVideo,
  initAboutShippingSlider,
} from './modules/sliders.js';
import {
  initSellFormDragDrop,
  initSellFormPhone,
  initCustomSelect,
  initSellFormSubmit,
  initSellFormProgressiveReveal,
  initFindForm,
  initYearProductionFormSteps,
} from './modules/forms.js';
import {
  updateCurrentYear,
  initViewportActiveSections,
  initHeroBannerAboveFooter,
  initThanksPaymentCopyOrderId,
} from './modules/utils.js';
import { initFaqAccordion, initProductFaqTabs } from './modules/faq.js';
import { initCheckoutTabs } from './modules/checkout.js';
import {
  initCheckoutStepsNavigation,
  initCheckoutPaymentMethodPanels,
  initCheckoutSavedCardButtons,
} from './modules/checkout-steps.js';

// Initialize all modules
initMobileMenu();
initContactModal();
initForgotPasswordPopup();
updateCurrentYear();
removeVideoControls();
initResponsiveVideoSources();
initVideoControls();
initAboutBrandsSlider();
initProductGallery();
initShopSlider();
initSliderVideo();
initAboutShippingSlider();
initSellFormDragDrop();
initSellFormPhone();
initCustomSelect();
initSellFormSubmit();
initSellFormProgressiveReveal();
initFindForm();
initYearProductionFormSteps();
initFaqAccordion();
initProductFaqTabs();
initCheckoutTabs();
initCheckoutPaymentMethodPanels();
initCheckoutSavedCardButtons();
initCheckoutStepsNavigation();
initViewportActiveSections();
initHeroBannerAboveFooter();
initThanksPaymentCopyOrderId();