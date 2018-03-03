// Module for form handling and validation

'use strict';

(function () {

  var OfferRoomsCapacity = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };

  var OfferTypes = {
    BUNGALO: {minPrice: 0},
    FLAT: {minPrice: 1000},
    HOUSE: {minPrice: 5000},
    PALACE: {minPrice: 10000}
  };

  var NO_GUESTS_ALLOWED = 100;

  var noticeFormElement = document.querySelector('.notice__form');
  var noticeFormResetElement = noticeFormElement.querySelector('.form__reset');
  var noticeFieldsetsElement = noticeFormElement.querySelectorAll('fieldset');
  var noticeFormAddressElement = document.querySelector('#address');
  var noticeFormTitleElement = noticeFormElement.querySelector('#title');
  var noticeFormTypeElement = noticeFormElement.querySelector('#type');
  var noticeFormPriceElement = noticeFormElement.querySelector('#price');
  var noticeFormTimeinElement = noticeFormElement.querySelector('#timein');
  var noticeFormTimeoutElement = noticeFormElement.querySelector('#timeout');
  var noticeFormRoomsElement = noticeFormElement.querySelector('#room_number');
  var noticeFormCapacityElement = noticeFormElement.querySelector('#capacity');
  var capacityOptionsElement = noticeFormCapacityElement.querySelectorAll('option');

  var noticeFormControlDefaultStyle = 'd9d9d3';

  var enableFormFields = function () {
    noticeFieldsetsElement.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
  };

  var disableFormFields = function () {
    noticeFieldsetsElement.forEach(function (fieldset) {
      fieldset.disabled = true;
    });
  };

  // validation & sync fields
  var updatePrice = function () {
    var minPrice = OfferTypes[noticeFormTypeElement.value.toUpperCase()].minPrice;
    noticeFormPriceElement.min = minPrice;
    noticeFormPriceElement.placeholder = minPrice;
  };

  var updateCapacity = function () {
    var selectedRooms = parseInt(noticeFormRoomsElement.options[noticeFormRoomsElement.selectedIndex].value, 10);
    var allowedGuests = OfferRoomsCapacity[selectedRooms];

    noticeFormCapacityElement.value = selectedRooms;

    // sync initial settings
    noticeFormCapacityElement.value = selectedRooms;

    if (selectedRooms === NO_GUESTS_ALLOWED) {
      noticeFormCapacityElement.value = 0;
    }

    capacityOptionsElement.forEach(function (item) {
      item.disabled = true;

      if (allowedGuests.indexOf(item.value) !== -1) {
        item.disabled = false;
      }
    });
  };

  var resetForm = function () {
    noticeFormElement.reset();
    updatePrice();
    noticeFormTitleElement.style.borderColor = noticeFormControlDefaultStyle;
    noticeFormPriceElement.style.borderColor = noticeFormControlDefaultStyle;
  };

  var succesSubmitFormHandler = function () {
    window.notification.showInfo();
    window.map.disablePage();
  };

  var offerTypeChangeHandler = function () {
    updatePrice();
  };

  var offerRoomsChangeHandler = function () {
    updateCapacity();
  };

  noticeFormTimeinElement.addEventListener('change', function () {
    noticeFormTimeoutElement.value = noticeFormTimeinElement.value;
  });

  noticeFormTimeoutElement.addEventListener('change', function () {
    noticeFormTimeinElement.value = noticeFormTimeoutElement.value;
  });

  var validateTitle = function () {
    if (noticeFormTitleElement.validity.valueMissing) {
      noticeFormTitleElement.setCustomValidity('Введите заголовок!');
      noticeFormTitleElement.style.borderColor = 'red';
    } else if (noticeFormTitleElement.validity.tooShort) {
      noticeFormTitleElement.setCustomValidity('Слишком короткий заголовок - минимум 30 символов!');
      noticeFormTitleElement.style.borderColor = 'red';
    } else if (noticeFormTitleElement.validity.tooLong) {
      noticeFormTitleElement.setCustomValidity('Слишком длинный заголовок - не больше 100 символов!');
      noticeFormTitleElement.style.borderColor = 'red';
    } else {
      noticeFormTitleElement.setCustomValidity('');
      noticeFormTitleElement.style.borderColor = '#d9d9d3';
    }

    noticeFormTitleElement.addEventListener('input', function () {
      noticeFormTitleElement.setCustomValidity('');
      noticeFormTitleElement.style.borderColor = '#d9d9d3';
    });

  };

  var validatePrice = function () {
    if (noticeFormPriceElement.validity.valueMissing) {
      noticeFormPriceElement.setCustomValidity('Укажите цену');
      noticeFormPriceElement.style.borderColor = 'red';
    } else if (noticeFormPriceElement.validity.rangeOverflow) {
      noticeFormPriceElement.setCustomValidity('Слишком много! Цена не должна быть выше 1 млн');
      noticeFormPriceElement.style.borderColor = 'red';
    } else if (noticeFormPriceElement.validity.rangeUnderflow) {
      noticeFormPriceElement.setCustomValidity('Маловато! Минимальная цена: ' + noticeFormPriceElement.min);
      noticeFormPriceElement.style.borderColor = 'red';
    } else {
      noticeFormTitleElement.setCustomValidity('');
      noticeFormTitleElement.style.borderColor = '#d9d9d3';
    }

    noticeFormPriceElement.addEventListener('input', function () {
      noticeFormPriceElement.setCustomValidity('');
      noticeFormPriceElement.style.borderColor = '#d9d9d3';
    });

  };

  noticeFormTitleElement.addEventListener('keyup', function () {
    validateTitle();
  });

  noticeFormPriceElement.addEventListener('keyup', function () {
    validatePrice();
  });

  noticeFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(noticeFormElement);
    window.backend.save(formData, succesSubmitFormHandler, window.notification.showError);
  });

  noticeFormResetElement.addEventListener('click', function () {
    window.map.disablePage();
    window.filter.reset();
  });

  var updateAddress = function (x, y) {
    noticeFormAddressElement.value = x + ', ' + y;
  };

  var disableForm = function () {
    noticeFormElement.classList.add('notice__form--disabled');
    noticeFormTypeElement.removeEventListener('change', offerTypeChangeHandler);
    noticeFormRoomsElement.removeEventListener('change', offerRoomsChangeHandler);
    disableFormFields();
    resetForm();
  };

  var enableForm = function () {
    noticeFormElement.classList.remove('notice__form--disabled');
    noticeFormTypeElement.addEventListener('change', offerTypeChangeHandler);
    noticeFormRoomsElement.addEventListener('change', offerRoomsChangeHandler);
    enableFormFields();
  };

  window.form = {
    updateAddress: updateAddress,
    disableForm: disableForm,
    enableForm: enableForm
  };
})();
