// Module for test data generation

'use strict';

(function () {

  var OFFER_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var OFFER_TYPES = {
    bungalo: {minPrice: 0},
    flat: {minPrice: 1000},
    house: {minPrice: 5000},
    palace: {minPrice: 10000}
  };
  var OFFER_CHECKINS = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var OFFER_CHECKOUTS = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var OFFER_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var OFFER_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;
  var GUESTS_MIN = 1;
  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGTH = 70;
  var AVATAR_PATH = 'img/avatars/user';

  // specific functions
  var getUserAvatar = function (avatarId) {
    var avatarIndex = avatarId + 1;

    if (avatarIndex < 10) {
      avatarIndex = '0' + avatarIndex;
    }

    return AVATAR_PATH + avatarIndex + '.png';
  };

  // Generate data
  var generateOffers = function (number) {
    var data = [];

    for (var i = 0; i < number; i++) {
      var locationX = window.utils.getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
      var locationY = window.utils.getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

      data.push({
        'author': {
          'avatar': getUserAvatar(i)
        },
        'offer': {
          'title': window.utils.getRandomElement(OFFER_TITLES),
          'address': locationX + ',' + locationY,
          'price': window.utils.getRandomNumber(PRICE_MIN, PRICE_MAX),
          'type': window.utils.getRandomElement(Object.keys(OFFER_TYPES)),
          'rooms': window.utils.getRandomNumber(ROOMS_MIN, ROOMS_MAX),
          'guests': window.utils.getRandomNumber(GUESTS_MIN, window.utils.getRandomNumber(ROOMS_MIN, ROOMS_MAX)),
          'checkin': window.utils.getRandomElement(OFFER_CHECKINS),
          'checkout': window.utils.getRandomElement(OFFER_CHECKOUTS),
          'features': window.utils.getRandomCollection(OFFER_FEATURES, window.utils.getRandomIndex(OFFER_FEATURES)),
          'description': '',
          'photos': window.utils.getRandomCollection(OFFER_PHOTOS, OFFER_PHOTOS.length - 1)
        },
        'location': {
          'x': locationX,
          'y': locationY
        }
      });
    }
    return data;
  };
})();
