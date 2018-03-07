'use strict';

(function () {
  var FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

  var avatarElement = document.querySelector('.notice__photo');
  var avatarUploadElement = avatarElement.querySelector('#avatar');
  var avatarPreviewElement = avatarElement.querySelector('img');

  var photosUploadElement = document.querySelector('#images');
  //var photosUploadContainerElement = document.querySelector('.upload');
  var photosContainer = document.querySelector('.notice__form fieldset:nth-last-child(2)');
  var uploadedPhotos = [];
  //var draggedItem = null;

  /*
  var resetPhotos = function () {
    avatarPreviewElement.setAttribute('src', 'img/muffin.png');
    var uploadedPhotosElement = document.querySelectorAll('.form__photo');
    while (uploadedPhotosElement.firstChild) {
      uploadedPhotosElement.removeChild(uploadedPhotosElement.firstChild);
    }
  };
  */

  avatarUploadElement.addEventListener('change', function () {
    var file = avatarUploadElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_EXTENSIONS.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      window.notification.hideAll();
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewElement.setAttribute('src', reader.result);
      });

      reader.readAsDataURL(file);
    } else {
      window.notification.showError('Некорректный формат изображения - только .jpeg, .png или .gif');
    }
  });

  photosUploadElement.addEventListener('change', function (evt) {
    var uploadedFiles = evt.target.files;

    var uploadedPhotosFragment = document.createDocumentFragment();
    var uploadedPhotosContainer = document.createElement('div');
    uploadedPhotosContainer.classList.add('form__photos');

    [].forEach.call(uploadedFiles, function (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_EXTENSIONS.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {

        uploadedPhotos.push(file);

        var reader = new FileReader();
        var photoElement = document.createElement('div');
        photoElement.classList.add('form__photo');
        photoElement.setAttribute('draggable', true);

        var photoImgElement = document.createElement('img');
        photoImgElement.style.height = '60px';

        reader.addEventListener('load', function () {
          photoImgElement.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(file);
        photoElement.appendChild(photoImgElement);
        uploadedPhotosFragment.appendChild(photoElement);

      } else {
        window.notification.showError('Некорректный формат изображения - только .jpeg, .png или .gif');
      }

      uploadedPhotosContainer.appendChild(uploadedPhotosFragment);
    });

    photosContainer.appendChild(uploadedPhotosContainer);
    /*
    var dragStartHandler = function (evt) {
      if (evt.target.tagName.toLowerCase() === 'img') {
        draggedItem = evt.target;
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', evt.target.innerHTML);
      }
    };

    uploadedPhotosContainer.addEventListener('dragstart', dragStartHandler);
    */
  });

})();
