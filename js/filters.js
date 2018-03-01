'use strict';

(function () {
  var mapFiltersElement = document.querySelector('.map__filters');
  var housingTypeElement = document.querySelector('#housing-type');
  var housingPriceElement = document.querySelector('#housing-price');
  var housingRoomsElement = document.querySelector('#housing-rooms');
  var housingGuestsElement = document.querySelector('#housing-guests');
  var housingFeatures = mapFiltersElement.features;
  var wifiFilterElement =document.querySelector('#filter-wifi');
  var dishwasherFilterElement =document.querySelector('#filter-dishwasher');

  var loadedOffers;

  var updateOffersOnMap = function () {
    console.log('update pins');

    if (housingTypeElement.value !== 'any') {
      console.log('housingTypeElement changed');
    }

    if (housingPriceElement.value !== 'any') {
      console.log('housingPriceElement changed');
    }

    if (housingRoomsElement.value !== 'any') {
      console.log('housingRoomsElement changed');
    }

    if (housingGuestsElement.value !== 'any') {
      console.log('housingGuestsElement changed');
    }
  };

  mapFiltersElement.addEventListener('change', function (evt) {
    updateOffersOnMap();
  });

})();
