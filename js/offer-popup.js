// Module for showing selected offer info in popup

'use strict';

(function () {
  var template = document.querySelector('template').content.querySelector('.map__card');
  var offerPopup = template.cloneNode(true);
  var fragment = document.createDocumentFragment();

  var translateOfferType = function (offerType) {
    switch (offerType) {
      case 'flat': return 'Квартира';
      case 'bungalo': return 'Бунгало';
      case 'house': return 'Дом';
      case 'palace': return 'Дворец';
      default: return '';
    }
  };
  var pluralizeRooms = function (roomsNumber) {
    switch (roomsNumber) {
      case 1 : return roomsNumber + ' комната для ';
      case 5 : return roomsNumber + ' комнат для ';
      default: return roomsNumber + ' комнаты для ';
    }
  };
  var pluralizeGuests = function (guestsNumber) {
    switch (guestsNumber) {
      case 1 : return guestsNumber + ' гостя';
      default: return guestsNumber + ' гостей';
    }
  };

  window.renderOfferPopup = function (ad) {
    offerPopup.querySelector('h3').textContent = ad.offer.title;
    offerPopup.querySelector('small').textContent = ad.offer.address;
    offerPopup.querySelector('h4').textContent = translateOfferType(ad.offer.type);
    offerPopup.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
    offerPopup.querySelectorAll('p')[2].textContent = pluralizeRooms(ad.offer.rooms) + pluralizeGuests(ad.offer.guests);
    offerPopup.querySelectorAll('p')[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    offerPopup.querySelectorAll('p')[4].textContent = ad.offer.description;
    offerPopup.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);

    // Render features
    var featuresListElement = offerPopup.querySelector('.popup__features');
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
    var photos = offerPopup.querySelector('.popup__pictures');
    while (photos.firstChild) {
      photos.removeChild(photos.firstChild);
    }

    for (i = 0; i < ad.offer.photos.length; i++) {
      var newPhotos = document.createElement('li');
      var photo = document.createElement('img');

      photo.setAttribute('src', ad.offer.photos[i]);
      photo.width = '70';
      photo.height = '70';

      newPhotos.appendChild(photo);
      fragment.appendChild(newPhotos);
    }

    photos.appendChild(fragment);

    return offerPopup;
  };
})();
