// Module for showing selected offer info in popup

'use strict';

(function () {
  var template = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersElement = document.querySelector('.map__filters-container');

  var OfferPhoto = {
    WIDTH: 70,
    HEIGHT: 70
  };

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
      case 0 :
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

  var getFeatures = function (data) {
    var features = document.createDocumentFragment();
    data.forEach(function (item) {
      var feature = document.createElement('li');
      feature.classList.add('feature', 'feature--' + item);
      features.appendChild(feature);
    });

    return features;
  };

  var getPhotos = function (data) {
    var photos = document.createDocumentFragment();
    data.forEach(function (item) {
      var newPhoto = document.createElement('li');
      var photo = document.createElement('img');

      photo.setAttribute('src', item);
      photo.width = OfferPhoto.WIDTH;
      photo.height = OfferPhoto.HEIGHT;

      newPhoto.appendChild(photo);
      photos.appendChild(newPhoto);
    });

    return photos;
  };

  var renderOfferPopup = function (ad) {

    closePopup();

    var offerPopup = template.cloneNode(true);
    offerPopup.querySelector('.popup__title').textContent = ad.offer.title;
    offerPopup.querySelector('.popup__address').textContent = ad.offer.address;
    offerPopup.querySelector('.popup__type').textContent = translateOfferType(ad.offer.type);
    offerPopup.querySelector('.popup__price').textContent = ad.offer.price + ' \u20BD/ночь';
    offerPopup.querySelectorAll('.popup__capacity').textContent = pluralizeRooms(ad.offer.rooms) + pluralizeGuests(ad.offer.guests);
    offerPopup.querySelectorAll('.popup__checkins').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    offerPopup.querySelectorAll('.popup__description').textContent = ad.offer.description;
    offerPopup.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);

    // Render features
    var featuresListElement = offerPopup.querySelector('.popup__features');
    while (featuresListElement.firstChild) {
      featuresListElement.removeChild(featuresListElement.firstChild);
    }
    featuresListElement.appendChild(getFeatures(ad.offer.features));

    // Render photos
    var photosElement = offerPopup.querySelector('.popup__pictures');
    while (photosElement.firstChild) {
      photosElement.removeChild(photosElement.firstChild);
    }
    photosElement.appendChild(getPhotos(ad.offer.photos));

    // inser card in DOM
    document.querySelector('.map').insertBefore(offerPopup, mapFiltersElement);

    // handle click or key event on popup close button
    var offerPopupCloseElement = document.querySelector('.popup__close');
    offerPopupCloseElement.addEventListener('click', popupCloseClickHandler);
    offerPopupCloseElement.addEventListener('keydown', popupCloseKeyDownHandler);

    // handle popup close with ESC key
    document.addEventListener('keydown', popUpEscHandler);
  };

  var closePopup = function () {
    var offerPopup = document.querySelector('.map__card');
    if (offerPopup) {
      offerPopup.parentNode.removeChild(offerPopup);
    }
    document.removeEventListener('keydown', popUpEscHandler);
  };

  var popupCloseClickHandler = function () {
    closePopup();
  };

  var popupCloseKeyDownHandler = function (evt) {
    window.utils.isEnterEvent(evt, closePopup);
  };

  var popUpEscHandler = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  window.offerPopup = {
    render: renderOfferPopup,
    close: closePopup
  };
})();
