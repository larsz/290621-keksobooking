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

  mapElement.addEventListener('click', mapClickHandler, true);


  return {
    hideOffersOnMap: function () {
      var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (item) {
        item.parentNode.removeChild(item);
      });
    },
    showOffersOnMap: function () {
      mapPinsElement.appendChild(window.pins);
    },
    hideOfferInfo: function () {
      var offerInfo = document.querySelector('.map__card');
      if (offerInfo) {
        offerInfo.parentNode.removeChild(offerInfo);
      }
    },
    showOfferInfo: function (index) {
      window.map.hideOfferInfo();
      fragment.appendChild(window.renderOfferPopup(window.offersData[index]));
      mapElement.insertBefore(fragment, mapFiltersElement);
    }
  };
})();
