'use strict';

(function () {

  // DOM elements
  var fragment = document.createDocumentFragment();
  var mapElement = document.querySelector('.map');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapFiltersElement = document.querySelector('.map__filters-container');

  // Generate 8 test offers
  var testOffers = generateOffers(8);

  // Show generated pins on map
  var showOffersOnMap = function () {
    mapPinsElement.appendChild(renderOffers(testOffers));
  };

  // Hide generated pins when page is inactive
  var hideOffersOnMap = function () {
    var pins = mapPinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  // Show popup with offer details
  var showOfferInfo = function (index) {
    hideOfferInfo();
    fragment.appendChild(renderOfferPopup(testOffers[index]));
    mapElement.insertBefore(fragment, mapFiltersElement);
  };

  var hideOfferInfo = function () {
    var offerInfo = document.querySelector('.map__card');
    if (offerInfo) {
      offerInfo.parentNode.removeChild(offerInfo);
    }
  };

  // Event handlers
  // Map Click Handler
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

  var resetClickHandler = function () {
    disablePage();
  };

  mainPinElement.addEventListener('mouseup', function () {
    activatePage();
  });

  // page active & inactive states
  var activatePage = function () {
    noticeForm.classList.remove('notice__form--disabled');
    mapElement.classList.remove('map--faded');
    mapElement.addEventListener('click', mapClickHandler, true);
    noticeFormType.addEventListener('change', offerTypeChangeHandler);
    noticeFormRooms.addEventListener('change', offerRoomsChangeHandler);
    noticeFormReset.addEventListener('click', resetClickHandler);
    showOffersOnMap();
    enableFormFields();
    fillDefaultAddress();
  };

  var disablePage = function () {
    noticeForm.classList.add('notice__form--disabled');
    mapElement.classList.add('map--faded');
    mapElement.removeEventListener('click', mapClickHandler, true);
    noticeFormType.removeEventListener('change', offerTypeChangeHandler);
    noticeFormRooms.removeEventListener('change', offerRoomsChangeHandler);
    noticeFormReset.removeEventListener('click', resetClickHandler);
    fillDefaultAddress();
    hideOffersOnMap();
    disableFormFields();
    resetForm();
  };

  // turn page to inactive state on load
  disablePage();

})();
