'use strict';

(function () {
  var MapLimits = {
    TOP: 100,
    RIGHT: 1200,
    BOTTOM: 450,
    LEFT: 0,
  };
  var MAIN_PIN_ARROW_CORRECTION = 50;
  var mainPinElement = document.querySelector('.map__pin--main');

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
      if (shiftedPinPosition.top > MapLimits.BOTTOM) {
        mainPinElement.style.top = MapLimits.BOTTOM + 'px';
      } else if (shiftedPinPosition.top < MapLimits.TOP) {
        mainPinElement.style.top = MapLimits.TOP + 'px';
      } else {
        mainPinElement.style.top = shiftedPinPosition.top + 'px';
      }

      // horizontal move
      if (shiftedPinPosition.left > MapLimits.RIGHT) {
        mainPinElement.style.left = MapLimits.RIGHT + 'px';
      } else if (shiftedPinPosition.left < MapLimits.LEFT) {
        mainPinElement.style.left = MapLimits.LEFT + 'px';
      } else {
        mainPinElement.style.left = shiftedPinPosition.left + 'px';
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      var isPageDisabled = window.map.checkPageState();

      if (isPageDisabled) {
        window.map.activatePage();
      }

      var shiftedPinX = mainPinElement.offsetLeft;
      var shiftedPinY = mainPinElement.offsetTop + MAIN_PIN_ARROW_CORRECTION;

      window.form.updateAddress(shiftedPinX, shiftedPinY);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

})();
