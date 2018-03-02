'use strict';

(function () {

  var createMessage = function (classname, text) {
    var message = document.createElement('div');
    message.classList.add('notification');
    message.classList.add(classname);

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'Закрыть';
    closeBtn.classList.add('popup__close');

    message.textContent = text;
    message.appendChild(closeBtn);

    closeBtn.addEventListener('click', function (evt) {
      evt.target.parentNode.remove();
    });

    document.body.insertAdjacentElement('afterbegin', message);
  };

  var showError = function (errorMessage) {
    createMessage('error', errorMessage);
  };

  var showMessage = function () {
    createMessage('success', 'Форма отправлена успешно!');
  };

  var hideMessages = function () {
    var currentNotifications = document.querySelectorAll('.notification');
    currentNotifications.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  window.notification = {
    showError: showError,
    showInfo: showMessage,
    hideAll: hideMessages
  };
})();
