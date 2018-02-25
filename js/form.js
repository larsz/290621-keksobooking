// Module for form handling and validation

'use strict';

window.form = (function () {

  var OFFER_ROOMS_CAPACITY = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };
  var OFFER_TYPES = {
    bungalo: {minPrice: 0},
    flat: {minPrice: 1000},
    house: {minPrice: 5000},
    palace: {minPrice: 10000}
  };

  var noticeForm = document.querySelector('.notice__form');
  var noticeFormReset = noticeForm.querySelector('.form__reset');
  var noticeFieldset = noticeForm.querySelectorAll('fieldset');
  var noticeFormAddress = document.querySelector('#address');
  var noticeFormTitle = noticeForm.querySelector('#title');
  var noticeFormType = noticeForm.querySelector('#type');
  var noticeFormPrice = noticeForm.querySelector('#price');
  var noticeFormTimein = noticeForm.querySelector('#timein');
  var noticeFormTimeout = noticeForm.querySelector('#timeout');
  var noticeFormRooms = noticeForm.querySelector('#room_number');
  var noticeFormCapacity = noticeForm.querySelector('#capacity');
  var capacityOptions = noticeFormCapacity.querySelectorAll('option');

  var enableFormFields = function () {
    for (var i = 0; i < noticeFieldset.length; i++) {
      noticeFieldset[i].disabled = false;
    }
  };

  var disableFormFields = function () {
    for (var i = 0; i < noticeFieldset.length; i++) {
      noticeFieldset[i].disabled = true;
    }
  };

  // validation & sync fields
  var updatePrice = function () {
    var minPrice = OFFER_TYPES[noticeFormType.value].minPrice;
    noticeFormPrice.min = minPrice;
    noticeFormPrice.placeholder = minPrice;
  };

  var updateCapacity = function () {
    var selectedRooms = parseInt(noticeFormRooms.options[noticeFormRooms.selectedIndex].value, 10);
    var allowedGuests = OFFER_ROOMS_CAPACITY[selectedRooms];

    // sync initial settings
    noticeFormCapacity.value = selectedRooms;

    if (selectedRooms === 100) {
      noticeFormCapacity.value = 0;
    }

    capacityOptions.forEach(function (item) {
      item.disabled = true;

      if (allowedGuests.indexOf(item.value) !== -1) {
        item.disabled = false;
      }
    });
  };

  var resetForm = function () {
    noticeForm.reset();
    updatePrice();
    noticeFormTitle.style.borderColor = '#d9d9d3';
    noticeFormPrice.style.borderColor = '#d9d9d3';
  };

  var succesSubmitFormHandler = function () {
    window.notification.showMessage();
    window.map.disablePage();
  };

  var offerTypeChangeHandler = function () {
    updatePrice();
  };

  var offerRoomsChangeHandler = function () {
    updateCapacity();
  };

  noticeFormTimein.addEventListener('change', function () {
    noticeFormTimeout.value = noticeFormTimein.value;
  });

  noticeFormTimeout.addEventListener('change', function () {
    noticeFormTimein.value = noticeFormTimeout.value;
  });

  var validateTitle = function () {
    if (noticeFormTitle.validity.valueMissing) {
      noticeFormTitle.setCustomValidity('Введите заголовок!');
      noticeFormTitle.style.borderColor = 'red';
    } else if (noticeFormTitle.validity.tooShort) {
      noticeFormTitle.setCustomValidity('Слишком короткий заголовок - минимум 30 символов!');
      noticeFormTitle.style.borderColor = 'red';
    } else if (noticeFormTitle.validity.tooLong) {
      noticeFormTitle.setCustomValidity('Слишком длинный заголовок - не больше 100 символов!');
      noticeFormTitle.style.borderColor = 'red';
    } else {
      noticeFormTitle.setCustomValidity('');
      noticeFormTitle.style.borderColor = '#d9d9d3';
    }

    noticeFormTitle.addEventListener('input', function () {
      noticeFormTitle.setCustomValidity('');
      noticeFormTitle.style.borderColor = '#d9d9d3';
    });

  };

  var validatePrice = function () {
    if (noticeFormPrice.validity.valueMissing) {
      noticeFormPrice.setCustomValidity('Укажите цену');
      noticeFormPrice.style.borderColor = 'red';
    } else if (noticeFormPrice.validity.rangeOverflow) {
      noticeFormPrice.setCustomValidity('Слишком много! Цена не должна быть выше 1 млн');
      noticeFormPrice.style.borderColor = 'red';
    } else if (noticeFormPrice.validity.rangeUnderflow) {
      noticeFormPrice.setCustomValidity('Маловато! Минимальная цена: ' + noticeFormPrice.min);
      noticeFormPrice.style.borderColor = 'red';
    } else {
      noticeFormTitle.setCustomValidity('');
      noticeFormTitle.style.borderColor = '#d9d9d3';
    }

    noticeFormPrice.addEventListener('input', function () {
      noticeFormPrice.setCustomValidity('');
      noticeFormPrice.style.borderColor = '#d9d9d3';
    });

  };

  noticeFormTitle.addEventListener('keyup', function () {
    validateTitle();
  });

  noticeFormPrice.addEventListener('keyup', function () {
    validatePrice();
  });

  noticeForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(noticeForm);
    window.backend.save(formData, succesSubmitFormHandler, window.notification.throwError);
  });

  noticeFormReset.addEventListener('click', function () {
    window.map.disablePage();
  });

  return {
    updateAddress: function (x, y) {
      noticeFormAddress.value = x + ', ' + y;
    },
    disableForm: function () {
      noticeForm.classList.add('notice__form--disabled');
      noticeFormType.removeEventListener('change', offerTypeChangeHandler);
      noticeFormRooms.removeEventListener('change', offerRoomsChangeHandler);
      disableFormFields();
      resetForm();
    },
    enableForm: function () {
      noticeForm.classList.remove('notice__form--disabled');
      noticeFormType.addEventListener('change', offerTypeChangeHandler);
      noticeFormRooms.addEventListener('change', offerRoomsChangeHandler);
      enableFormFields();
    }
  };
})();
