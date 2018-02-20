'use strict';

(function () {
  var mainPinElement = document.querySelector('.map__pin--main');
  var mapElement = document.querySelector('.map');
  var noticeFormReset = document.querySelector('.form__reset');

  var disablePage = function () {
    mapElement.classList.add('map--faded');
    window.map.hideOffersOnMap();
    window.form.disableForm();
  };

  // page active & inactive states
  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    window.map.showOffersOnMap();
    window.form.enableForm();
  };

  mainPinElement.addEventListener('mouseup', function () {
    activatePage();
  });

  noticeFormReset.addEventListener('click', function () {
    disablePage();
  });

})();
