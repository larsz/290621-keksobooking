// Module for handling map events - show and hide pins and offer info

'use strict';

(function () {
  // Const
  var MAIN_PIN_ARROW_CORRECTION = 50;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGTH = 70;
  var PINS_QUANTITY = 5;

  var MAP_DISABLED_CLASS = 'map--faded';

  // DOM elements
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mainPinElement = document.querySelector('.map__pin--main');

  var initialPinX = mainPinElement.offsetLeft;
  var initialPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;

  var loadedOffers = [];
  var filteredOffers = [];

  var renderOffers = function (data) {
    var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
    var pins = document.createDocumentFragment();

    var pinsNumber = data.length > PINS_QUANTITY ? PINS_QUANTITY : data.length;
    data.forEach(function (offer, i) {
      if (i < pinsNumber) {
        var pin = pinTemplateElement.cloneNode(true);
        var pinLeft = (offer.location.x - MAP_PIN_WIDTH / 2) + 'px';
        var pinTop = (offer.location.y - MAP_PIN_HEIGTH) + 'px';

        pin.setAttribute('style', 'left: ' + pinLeft + '; top: ' + pinTop);
        pin.querySelector('img').setAttribute('src', offer.author.avatar);
        pin.setAttribute('data-pin', i);
        pins.appendChild(pin);
      }
    });

    return pins;
  };

  var showOffersOnMap = function (data) {
    mapPinsElement.appendChild(data);
  };

  var hideOffersOnMap = function () {
    var pinsElement = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsElement.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  // Handlers
  var mapClickHandler = function (evt) {
    var clickedElement = evt.target;
    if (!clickedElement.hasAttribute('data-pin')) {
      clickedElement = clickedElement.parentElement;
    }

    var clickedIndex = clickedElement.getAttribute('data-pin');
    if (clickedIndex) {
      window.offerPopup.render(filteredOffers[clickedIndex]);
    }
  };

  var succesLoadDataHandler = function (loadedData) {
    loadedOffers = loadedData.slice(0);
    filteredOffers = window.filter.apply(loadedOffers);
  };

  var disablePage = function () {
    mapElement.classList.add('map--faded');
    hideOffersOnMap();
    window.offerPopup.close();

    mainPinElement.style.top = '';
    mainPinElement.style.left = '';

    window.form.disableForm();
    window.form.updateAddress(initialPinX, initialPinY);
    window.scrollTo(0, 0);

    mapElement.removeEventListener('click', mapClickHandler);
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.notification.hideAll();
    window.form.enableForm();
    window.filter.enable();

    // console.log('activatePage', filteredOffers);
    var renderedPins = renderOffers(filteredOffers);
    showOffersOnMap(renderedPins);

    mapElement.addEventListener('click', mapClickHandler, true);
  };

  var checkPageState = function () {
    return mapElement.classList.contains(MAP_DISABLED_CLASS);
  };

  // Page load - initial settings
  // set default address
  window.form.updateAddress(initialPinX, initialPinY);

  // disable fieldsets in form
  window.form.disableForm();

  // disable fieldsets in form
  window.filter.disable();

  // load offers
  window.backend.load(succesLoadDataHandler, window.notification.showError);

  window.filter.setCallback(function () {
    hideOffersOnMap();
    window.offerPopup.close();

    filteredOffers = (window.filter.apply(loadedOffers));
    var updatedPins = renderOffers(filteredOffers);

    // console.log('filter ', filteredOffers);
    showOffersOnMap(updatedPins);
  });

  window.map = {
    disablePage: disablePage,
    activatePage: activatePage,
    checkPageState: checkPageState
  };
})();
