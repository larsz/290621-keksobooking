'use strict';

window.map = (function () {

  // DOM elements
  var fragment = document.createDocumentFragment();
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElement = document.querySelector('.map__filters-container');

  // Map Click Handler
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

  // Close button handlers
  var popupCloseClickHandler = function () {
    window.map.hideOfferInfo();
  };

  var popupCloseKeyDownHandler = function (evt) {
    window.utils.isEnterEvent(evt, window.map.hideOfferInfo);
  };

  var popUpEscHandler = function (evt) {
    window.utils.isEscEvent(evt, window.map.hideOfferInfo);
  };

  // Show Offer Popup
  mapElement.addEventListener('click', mapClickHandler, true);

  // Hide Offer Popup on ESC
  mapElement.addEventListener('keydown', popUpEscHandler, true);

  return {
    hideOffersOnMap: function () {
      var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (item) {
        item.parentNode.removeChild(item);
      });
      mapElement.removeEventListener('keydown', popUpEscHandler, true);
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
