// Module for render similar offer pins on map

'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGTH = 70;

  var renderOffers = function (offers) {
    var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    var pins = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
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
  window.pins = renderOffers(window.offersData);
})();


