'use strict';

window.utils = (function () {

  return {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getRandomIndex: function (arr) {
      return window.utils.getRandomNumber(0, arr.length - 1);
    },
    getRandomElement: function (arr) {
      return arr[window.utils.getRandomIndex(arr)];
    },
    getRandomCollection: function (arr, itemsNumber) {
      var generatedArr = [];
      var originalArr = arr.slice();
      for (var i = 0; i <= itemsNumber; i++) {
        var randomIndex = window.utils.getRandomIndex(originalArr);
        generatedArr.push(originalArr[randomIndex]);
        originalArr.splice(randomIndex, 1);
      }
      return generatedArr;
    }
  };
})();
