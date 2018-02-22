// Module for handling active and inactive page states

'use strict';

window.pageStates = (function () {
  var mapElement = document.querySelector('.map');
  var mainPinElement = document.querySelector('.map__pin--main');

  window.form.updateAddress(window.map.addressX, window.map.addressY);

  return {
    disablePage: function () {
      mapElement.classList.add('map--faded');
      window.map.hideOffersOnMap();
      window.map.hideOfferInfo();
      window.form.disableForm();
      window.form.updateAddress(window.map.addressX, window.map.addressY);
      mainPinElement.style.top = '';
      mainPinElement.style.left = '';
    },
    activatePage: function () {
      mapElement.classList.remove('map--faded');
      window.map.showOffersOnMap();
      window.form.enableForm();
    }
  };
})();
