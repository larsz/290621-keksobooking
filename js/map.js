// Module for handling map events - show and hide pins and offer info

'use strict';

window.map = (function () {

  // Const
  var MAP_HORIZONT_LINE = 150;
  var MAIN_PIN_ARROW_CORRECTION = 50;

  // DOM elements
  var fragment = document.createDocumentFragment();
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElement = document.querySelector('.map__filters-container');
  var mainPinElement = document.querySelector('.map__pin--main');
  var isPageDisabled = true;

  var initialPinX = mainPinElement.offsetLeft;
  var initialPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;

  var mapLimits = {
    left: 0,
    right: mapElement.offsetWidth,
    top: MAP_HORIZONT_LINE - MAIN_PIN_ARROW_CORRECTION,
    bottom: mapFiltersElement.offsetTop - MAIN_PIN_ARROW_CORRECTION
  };


  // Handlers
  var mapClickHandler = function (evt) {
    var clickedElement = evt.target;
    if (!clickedElement.hasAttribute('data-pin')) {
      clickedElement = clickedElement.parentElement;
    }

    var clickedIndex = clickedElement.getAttribute('data-pin');
    if (clickedIndex) {
      window.map.showOfferInfo(clickedIndex);
    }
  };

  var popupCloseClickHandler = function () {
    window.map.hideOfferInfo();
  };

  var popupCloseKeyDownHandler = function (evt) {
    window.utils.isEnterEvent(evt, window.map.hideOfferInfo);
  };

  var popUpEscHandler = function (evt) {
    window.utils.isEscEvent(evt, window.map.hideOfferInfo);
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

      if (!isPageDisabled) {
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
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      if (isPageDisabled) {
        window.pageStates.activatePage();
        isPageDisabled = false;
      }

      var shiftedPinX = mainPinElement.offsetLeft;
      var shiftedPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;

      window.form.updateAddress(shiftedPinX, shiftedPinY);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  return {
    addressX: initialPinX,
    addressY: initialPinY,
    hideOffersOnMap: function () {
      var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (item) {
        item.parentNode.removeChild(item);
      });
      mapElement.removeEventListener('keydown', popUpEscHandler);
    },
    showOffersOnMap: function () {
      mapPinsElement.appendChild(window.pins);
    },
    hideOfferInfo: function () {
      var offerInfo = document.querySelector('.map__card');
      if (offerInfo) {
        offerInfo.parentNode.removeChild(offerInfo);
        mapElement.removeEventListener('keydown', popUpEscHandler);
      }
    },
    showOfferInfo: function (index) {
      window.map.hideOfferInfo();
      fragment.appendChild(window.renderOfferPopup(window.offersData[index]));
      mapElement.insertBefore(fragment, mapFiltersElement);
      var offerInfoCloseElement = document.querySelector('.popup__close');
      offerInfoCloseElement.addEventListener('click', popupCloseClickHandler);
      offerInfoCloseElement.addEventListener('keydown', popupCloseKeyDownHandler);
    }
  };
})();
