'use strict';

(function () {
  var formFiltersElement = document.querySelector('.map__filters');
  var formFilterElement = document.querySelectorAll('.map__filter');
  var formFiltersFeaturesElement = document.querySelector('#housing-features');
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

  var onFilterChangeExternal = null;

  var setCallback = function (cb) {
    onFilterChangeExternal = cb;
  };

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

  var enableFilters = function () {
    formFiltersFeaturesElement.disabled = false;
    formFilterElement.forEach(function (filter) {
      filter.disabled = false;
    });
  };

  var disableFilters = function () {
    formFiltersFeaturesElement.disabled = true;
    formFilterElement.forEach(function (filter) {
      filter.disabled = true;
    });
  };

  var resetFilters = function () {
    formFiltersElement.reset();
    disableFilters();
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

    if (typeof onFilterChangeExternal === 'function') {
      window.utils.debounce(onFilterChangeExternal);
    }

  });

  window.filter = {
    apply: applyFilter,
    reset: resetFilters,
    disable: disableFilters,
    enable: enableFilters,
    setCallback: setCallback
  };

})();
