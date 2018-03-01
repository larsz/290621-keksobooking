// Module for handling map events - show and hide pins and offer info

'use strict';

(function () {

  // Const
  var MAP_HORIZONT_TOP = 150;
  var MAP_HORIZONT_BOTTOM = 500;
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

  var mapLimits = {
    left: 0,
    right: mapElement.offsetWidth,
    top: MAP_HORIZONT_TOP - MAIN_PIN_ARROW_CORRECTION,
    bottom: MAP_HORIZONT_BOTTOM - MAIN_PIN_ARROW_CORRECTION
  };

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
    fragment.appendChild(window.renderOfferPopup(loadedOffers[index]));
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
    loadedOffers = loadedData;
  };

  // Event Listeners
  mapElement.addEventListener('click', mapClickHandler, true);
  mapElement.addEventListener('keydown', popUpEscHandler, true);

  mainPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startPinCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startPinCoords.x - moveEvt.clientX,
        y: startPinCoords.y - moveEvt.clientY
      };

      startPinCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var shiftedPinPosition = {
        top: mainPinElement.offsetTop - shift.y,
        left: mainPinElement.offsetLeft - shift.x
      };

      // vertical move
      if (shiftedPinPosition.top > mapLimits.bottom) {
        mainPinElement.style.top = mapLimits.bottom + 'px';
      } else if (shiftedPinPosition.top < mapLimits.top) {
        mainPinElement.style.top = mapLimits.top + 'px';
      } else {
        mainPinElement.style.top = shiftedPinPosition.top + 'px';
      }

      // horizontal move
      if (shiftedPinPosition.left > mapLimits.right) {
        mainPinElement.style.left = mapLimits.right + 'px';
      } else if (shiftedPinPosition.left < mapLimits.left) {
        mainPinElement.style.left = mapLimits.left + 'px';
      } else {
        mainPinElement.style.left = shiftedPinPosition.left + 'px';
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      if (isPageDisabled) {
        activatePage();
      }

      var shiftedPinX = mainPinElement.offsetLeft;
      var shiftedPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;

      window.form.updateAddress(shiftedPinX, shiftedPinY);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

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
    window.notification.hideAll();
    var renderedPins = renderOffers(loadedOffers);
    showOffersOnMap(renderedPins);
    window.form.enableForm();
    isPageDisabled = false;
  };

  // set default address on page load
  window.form.updateAddress(initialPinX, initialPinY);
  window.backend.load(succesLoadDataHandler, window.notification.showError);

  // filters
  var formFiltersElement = document.querySelector('.map__filters');
  var typeFilterValue = 'any';
  var priceFilterValue = 'any';
  var roomsFilterValue = 'any';
  var guestsFilterValue = 'any';
  var wifiFilterValue = false;
  var dishwasherFilterValue = false;
  var parkingFilterValue = false;
  var washerFilterValue = false;
  var elevatorFilterValue = false;
  var conditionerFilterValue = false;

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  formFiltersElement.addEventListener('change', function (evt) {
    var selectedFilter = evt.target;

    switch (selectedFilter.getAttribute('id')) {
      case 'housing-type':
        typeFilterValue = selectedFilter.value;
        break;
      case 'housing-price':
        priceFilterValue = selectedFilter.value;
        break;
      case 'housing-rooms':
        roomsFilterValue = selectedFilter.value;
        break;
      case 'housing-guests':
        guestsFilterValue = selectedFilter.value;
        break;
      case 'filter-wifi':
        wifiFilterValue = selectedFilter.checked;
        break;
      case 'filter-dishwasher':
        dishwasherFilterValue = selectedFilter.checked;
        break;
      case 'filter-parking':
        parkingFilterValue = selectedFilter.checked;
        break;
      case 'filter-washer':
        washerFilterValue = selectedFilter.checked;
        break;
      case 'filter-elevator':
        elevatorFilterValue = selectedFilter.checked;
        break;
      case 'filter-conditioner':
        conditionerFilterValue = selectedFilter.checked;
        break;
    }

    var applyFilter = function (offers) {
      return offers.filter(function (offer) {

        var hasAppropiatePrice;
        switch (priceFilterValue) {
          case 'any':
            hasAppropiatePrice = true;
            break;
          case 'low':
            hasAppropiatePrice = offer.offer.price < Price.LOW;
            break;
          case 'middle':
            hasAppropiatePrice = offer.offer.price >= Price.LOW && offer.offer.price <= Price.HIGH;
            break;
          case 'high':
            hasAppropiatePrice = offer.offer.price > Price.HIGH;
            break;
        }

        var hasAppropiateType = typeFilterValue === 'any' || offer.offer.type.toString() === typeFilterValue;
        var hasAppropiateRooms = roomsFilterValue === 'any' || offer.offer.rooms.toString() === roomsFilterValue;
        var hasAppropiateGuests = guestsFilterValue === 'any' || offer.offer.guests.toString() === guestsFilterValue;
        var hasWiFi = wifiFilterValue === false || offer.offer.features.indexOf('wifi') !== -1;
        var hasDishWasher = dishwasherFilterValue === false || offer.offer.features.indexOf('dishwasher') !== -1;
        var hasParking = parkingFilterValue === false || offer.offer.features.indexOf('parking') !== -1;
        var hasWasher = washerFilterValue === false || offer.offer.features.indexOf('washer') !== -1;
        var hasElevator = elevatorFilterValue === false || offer.offer.features.indexOf('elevator') !== -1;
        var hasConditioner = conditionerFilterValue === false || offer.offer.features.indexOf('conditioner') !== -1;

        return hasAppropiateType && hasAppropiatePrice && hasAppropiateRooms && hasAppropiateGuests && hasWiFi && hasDishWasher && hasParking && hasWasher && hasElevator && hasConditioner;

      });
    };

    var filtered = applyFilter(loadedOffers);
    console.log(filtered);

  });

  window.map = {
    disablePage: disablePage,
    activatePage: activatePage,
  };
})();
