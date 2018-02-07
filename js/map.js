'use strict';

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
var OFFER_TYPES = [
  'flat',
  'house',
  'bungalo'
];
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
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGTH = 70;
var AVATAR_PATH = 'img/avatars/user';


var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomIndex = function (arr) {
  return Math.floor(Math.random() * arr.length);
};

var getRandomElement = function (arr) {
  return arr[getRandomIndex(arr)];
};

var getRandomCollection = function (arr, N) {

  var generatedArr = [];
  var originalArr = arr.slice();

  for (var i = 0; i <= N; i++) {
    var randomIndex = getRandomIndex(originalArr);
    generatedArr.push(originalArr[randomIndex]);
    originalArr.splice(randomIndex, 1);
  }

  return generatedArr;
};

var getUserAvatar = function () {
  return AVATAR_PATH + '0' + getRandomNumber(1, 8) + '.png';
};

var getOfferTitle = function () {
  return getRandomElement(OFFER_TITLES);
};

var getOfferPrice = function () {
  return getRandomNumber(PRICE_MIN, PRICE_MAX);
};

var getOfferType = function () {
  return getRandomElement(OFFER_TYPES);
};

var getOfferRooms = function () {
  return getRandomNumber(ROOMS_MIN, ROOMS_MAX);
};

var getOfferGuests = function () {
  return Math.floor(Math.random() * 10) + 1;
};

var getOfferFeatures = function () {
  return getRandomCollection(OFFER_FEATURES, getRandomIndex(OFFER_FEATURES));
};

var getOfferPhotos = function () {
  return getRandomCollection(OFFER_PHOTOS, OFFER_PHOTOS.length - 1);
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var fragment = document.createDocumentFragment();
var offerTemplate = document.querySelector('template').content;

var mapPinsList = document.querySelector('.map__pins');
var mapPin = offerTemplate.querySelector('.map__pin');

var offers = [];
var offersCount = 8;

for (var i = 0; i < offersCount; i++) {
  offers.push({
    'author': {
      'avatar': getUserAvatar()
    },
    'offer': {
      'title': getOfferTitle(),
      'address': getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX) + ',' + getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX),
      'price': getOfferPrice(),
      'type': getOfferType(),
      'rooms': getOfferRooms(),
      'guests': getOfferGuests(),
      'checkin': getRandomElement(OFFER_CHECKINS),
      'checkout': getRandomElement(OFFER_CHECKOUTS),
      'features': getOfferFeatures(),
      'description': '',
      'photos': getOfferPhotos()
    },
    'location': {
      'x': getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX),
      'y': getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX)
    }
  });
}

for (i = 0; i < offers.length; i++) {
  var adPin = mapPin.cloneNode(true);
  var adPinLeft = offers[i].location.x - MAP_PIN_WIDTH + 'px';
  var adPinTop = offers[i].location.y - MAP_PIN_HEIGTH + 'px';

  adPin.setAttribute('style', 'left: ' + adPinLeft + '; top: ' + adPinTop);
  adPin.querySelector('img').setAttribute('src', offers[i].author.avatar);
  fragment.appendChild(adPin);
}

mapPinsList.appendChild(fragment);


