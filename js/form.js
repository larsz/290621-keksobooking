// Module for form handling and validation

'use strict';

(function () {

})();

var OFFER_ROOMS_CAPACITY = {
  1: ['1'],
  2: ['2', '1'],
  3: ['3', '2', '1'],
  100: ['0']
};


var noticeForm = document.querySelector('.notice__form');
var noticeFormSubmit = noticeForm.querySelector('.form__submit');
var noticeFormReset = noticeForm.querySelector('.form__reset');
var noticeFieldset = noticeForm.querySelectorAll('fieldset');
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

var fillDefaultAddress = function () {
  var addressFieldElement = document.getElementById('address');
  var mainPinRect = mainPinElement.getBoundingClientRect();
  addressFieldElement.value = mainPinRect.x + ', ' + mainPinRect.y;
};

var resetForm = function () {
  noticeForm.reset();
  updatePrice();
  hideOfferInfo();
};


var offerTypeChangeHandler = function () {
  updatePrice();
};

var offerRoomsChangeHandler = function () {
  updateCapacity();
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

noticeFormTitle.addEventListener('blur', function () {
  validateTitle();
});

noticeFormPrice.addEventListener('blur', function () {
  validatePrice();
});

noticeFormSubmit.addEventListener('click', function () {
  validateTitle();
  validatePrice();
});
