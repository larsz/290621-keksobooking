'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getRandomIndex = function (arr) {
    return getRandomNumber(0, arr.length - 1);
  };

  var getRandomElement = function (arr) {
    return arr[getRandomIndex(arr)];
  };

  var getRandomCollection = function (arr, itemsNumber) {
    var generatedArr = [];
    var originalArr = arr.slice();

    for (var i = 0; i <= itemsNumber; i++) {
      var randomIndex = window.utils.getRandomIndex(originalArr);
      generatedArr.push(originalArr[randomIndex]);
      originalArr.splice(randomIndex, 1);
    }
    return generatedArr;
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomIndex: getRandomIndex,
    getRandomElement: getRandomElement,
    getRandomCollection: getRandomCollection,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent
  };

})();
