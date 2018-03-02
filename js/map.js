// Module for handling map events - show and hide pins and offer info

'use strict';

(function () {
  // Const
  var MAIN_PIN_ARROW_CORRECTION = 50;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGTH = 70;
  var PINS_QUANTITY = 5;

  // DOM elements
  var fragment = document.createDocumentFragment();
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var mainPinElement = document.querySelector('.map__pin--main');

  var initialPinX = mainPinElement.offsetLeft;
  var initialPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;
  var isPageDisabled = true;

  var loadedOffers = [];
  var filteredOffers = [];

  var renderOffers = function (offers) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pins = document.createDocumentFragment();

    var pinsNumber = offers.length > PINS_QUANTITY ? PINS_QUANTITY : offers.length;
    for (var i = 0; i < pinsNumber; i++) {
      var pin = pinTemplate.cloneNode(true);
      var pinLeft = (offers[i].location.x - MAP_PIN_WIDTH / 2) + 'px';
      var pinTop = (offers[i].location.y - MAP_PIN_HEIGTH) + 'px';

      pin.setAttribute('style', 'left: ' + pinLeft + '; top: ' + pinTop);
      pin.querySelector('img').setAttribute('src', offers[i].author.avatar);
      pin.setAttribute('data-pin', i);
      pins.appendChild(pin);
    }

    return pins;
  };

  var showOffersOnMap = function (data) {
    mapPinsElement.appendChild(data);
  };

  var hideOffersOnMap = function () {
    var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    mapElement.removeEventListener('keydown', popUpEscHandler);
  };

  var showOfferInfo = function (index) {
    hideOfferInfo();

    fragment.appendChild(window.offerPopup.render(filteredOffers[index]));
    mapElement.insertBefore(fragment, mapFiltersElement);

    var offerInfoCloseElement = document.querySelector('.popup__close');
    offerInfoCloseElement.addEventListener('click', popupCloseClickHandler);
    offerInfoCloseElement.addEventListener('keydown', popupCloseKeyDownHandler);
  };

  var hideOfferInfo = function () {
    var offerInfo = document.querySelector('.map__card');
    if (offerInfo) {
      offerInfo.parentNode.removeChild(offerInfo);
      mapElement.removeEventListener('keydown', popUpEscHandler);
    }
  };

  // Handlers
  var mapClickHandler = function (evt) {
    var clickedElement = evt.target;
    if (!clickedElement.hasAttribute('data-pin')) {
      clickedElement = clickedElement.parentElement;
    }

    var clickedIndex = clickedElement.getAttribute('data-pin');
    if (clickedIndex) {
      showOfferInfo(clickedIndex);
    }
  };

  var popupCloseClickHandler = function () {
    hideOfferInfo();
  };

  var popupCloseKeyDownHandler = function (evt) {
    window.utils.isEnterEvent(evt, hideOfferInfo);
  };

  var popUpEscHandler = function (evt) {
    window.utils.isEscEvent(evt, hideOfferInfo);
  };

  var succesLoadDataHandler = function (loadedData) {
    loadedOffers = loadedData.slice(0);
    filteredOffers = window.filter.apply(loadedOffers);
  };

  // Event Listeners
  mapElement.addEventListener('click', mapClickHandler, true);
  mapElement.addEventListener('keydown', popUpEscHandler, true);

  var disablePage = function () {
    mapElement.classList.add('map--faded');
    hideOffersOnMap();
    hideOfferInfo();
    mainPinElement.style.top = '';
    mainPinElement.style.left = '';
    window.form.disableForm();
    window.form.updateAddress(initialPinX, initialPinY);
    isPageDisabled = true;
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.form.enableForm();
    window.notification.hideAll();

    var renderedPins = renderOffers(filteredOffers);
    showOffersOnMap(renderedPins);

    isPageDisabled = false;
  };

  var checkPageState = function () {
    return isPageDisabled;
  };

  // set default address on page load
  window.form.updateAddress(initialPinX, initialPinY);

  // disable fieldsets on page load
  window.form.disableForm();

  window.backend.load(succesLoadDataHandler, window.notification.showError);

  window.filter.setCallback(function () {
    hideOffersOnMap();
    hideOfferInfo();

    filteredOffers = (window.filter.apply(loadedOffers));
    var updatedPins = renderOffers(filteredOffers);

    showOffersOnMap(updatedPins);
  });

  window.map = {
    disablePage: disablePage,
    activatePage: activatePage,
    checkPageState: checkPageState
  };
})();
