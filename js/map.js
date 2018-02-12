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
var GUESTS_MIN = 1;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGTH = 70;
var AVATAR_PATH = 'img/avatars/user';

var ENTER_KEYCODE = 13;


// common functions
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomIndex = function (arr) {
  return getRandomNumber(0, arr.length - 1);
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

// specific functions
var getUserAvatar = function (avatarId) {
  var avatarIndex = avatarId + 1;

  if (avatarIndex < 10) {
    avatarIndex = '0' + avatarIndex;
  }

  return AVATAR_PATH + avatarIndex + '.png';
};

var localizeOfferType = function (offerType) {
  switch (offerType) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    default: return '';
  }
};

// generate data
var generateOffers = function (number) {
  var data = [];

  for (var i = 0; i < number; i++) {
    var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

    data.push({
      'author': {
        'avatar': getUserAvatar(i)
      },
      'offer': {
        'title': getRandomElement(OFFER_TITLES),
        'address': locationX + ',' + locationY,
        'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
        'type': getRandomElement(OFFER_TYPES),
        'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
        'guests': getRandomNumber(GUESTS_MIN, getRandomNumber(ROOMS_MIN, ROOMS_MAX)),
        'checkin': getRandomElement(OFFER_CHECKINS),
        'checkout': getRandomElement(OFFER_CHECKOUTS),
        'features': getRandomCollection(OFFER_FEATURES, getRandomIndex(OFFER_FEATURES)),
        'description': '',
        'photos': getRandomCollection(OFFER_PHOTOS, OFFER_PHOTOS.length - 1)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    });
  }
  return data;
};

var ads = generateOffers(8);

// DOM elements
var mapElement = document.querySelector('.map');
var mainPinElement = document.querySelector('.map__pin--main');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinElement = document.querySelector('template').content.querySelector('.map__pin');
var mapFiltersElement = document.querySelector('.map__filters-container');
var fragment = document.createDocumentFragment();

// Generate pins with data
var pinContainer = document.createDocumentFragment();
var generatePins = function (container, offers) {
  for (var i = 0; i < offers.length; i++) {
    var pinElement = container.cloneNode(true);
    var pinLeft = offers[i].location.x - MAP_PIN_WIDTH + 'px';
    var pinTop = offers[i].location.y - MAP_PIN_HEIGTH + 'px';

    pinElement.setAttribute('style', 'left: ' + pinLeft + '; top: ' + pinTop);
    pinElement.querySelector('img').setAttribute('src', offers[i].author.avatar);
    pinElement.setAttribute('data-pin', i);
    pinContainer.appendChild(pinElement);

    pinElement.addEventListener('click', function (evt) {
      var clickedElementIndex = evt.target.parentNode.getAttribute('data-pin');
      showOfferInfo(clickedElementIndex);
    });

    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        evt.preventDefault();
        var clickedElementIndex = evt.target.getAttribute('data-pin');
        showOfferInfo(clickedElementIndex);
      }
    });

  }
};

// Add generated pins on map
var showSimilarOffers = function () {
  generatePins(mapPinElement, ads);
  mapPinsElement.appendChild(pinContainer);
};

// Add generated data to template
var mapCardElement = document.querySelector('template').content.querySelector('.map__card');

var renderAd = function (ad) {
  var adElement = mapCardElement.cloneNode(true);
  adElement.querySelector('h3').textContent = ad.offer.title;
  adElement.querySelector('small').textContent = ad.offer.address;
  adElement.querySelector('h4').textContent = localizeOfferType(ad.offer.type);
  adElement.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
  adElement.querySelectorAll('p')[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelectorAll('p')[4].textContent = ad.offer.description;
  adElement.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);

  // Render features
  var featuresListElement = adElement.querySelector('.popup__features');
  while (featuresListElement.firstChild) {
    featuresListElement.removeChild(featuresListElement.firstChild);
  }

  for (var i = 0; i < ad.offer.features.length; i++) {
    var featuresListItem = document.createElement('li');
    featuresListItem.classList.add('feature', 'feature--' + ad.offer.features[i]);
    fragment.appendChild(featuresListItem);
  }

  featuresListElement.appendChild(fragment);

  // Render photos
  var photosElement = adElement.querySelector('.popup__pictures');
  var photoElement = photosElement.querySelector('li');

  for (i = 0; i < ad.offer.photos.length; i++) {
    var clonePhotoElement = photoElement.cloneNode(true);
    var photo = clonePhotoElement.querySelector('img');

    photo.setAttribute('src', ad.offer.photos[i]);
    photo.width = '70';
    photo.height = '70';

    fragment.appendChild(clonePhotoElement);
  }

  photosElement.insertBefore(fragment, photoElement);
  photosElement.removeChild(photoElement);

  return adElement;
};

// Show popup with offer details
var showOfferInfo = function (index) {
  fragment.appendChild(renderAd(ads[index]));
  mapElement.insertBefore(fragment, mapFiltersElement);
};

var noticeFormElement = document.querySelector('.notice__form');
var noticeFieldsetElement = noticeFormElement.querySelectorAll('fieldset');

var fillDefaultAddress = function () {
  var addressFieldElement = document.getElementById('address');
  var mainPinRect = mainPinElement.getBoundingClientRect();
  addressFieldElement.value = mainPinRect.x + ', ' + mainPinRect.y;
};


// inactive state
var disableFormFields = function () {
  for (var i = 0; i < noticeFieldsetElement.length; i++) {
    noticeFieldsetElement[i].setAttribute('disabled', true);
  }
};

var enableFormFields = function () {
  for (var i = 0; i < noticeFieldsetElement.length; i++) {
    noticeFieldsetElement[i].setAttribute('disabled', false);
  }
};

var activatePage = function () {
  noticeFormElement.classList.remove('notice__form--disabled');
  mapElement.classList.remove('map--faded');
  enableFormFields();
  showSimilarOffers();
};

var disablePage = function () {
  disableFormFields();
  fillDefaultAddress();
};


mainPinElement.addEventListener('mouseup', function () {
  activatePage();
});

// turn page to inactive state on load
disablePage();
