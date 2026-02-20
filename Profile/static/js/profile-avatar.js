(function () {
    'use strict';

    var avatarTrigger = document.getElementById('avatarTrigger');
    var avatarModalEl = document.getElementById('avatarModal');
    var avatarFileInput = document.getElementById('avatarFileInput');
    var avatarPickBtn = document.getElementById('avatarPickBtn');
    var avatarCropWrap = document.getElementById('avatarCropWrap');
    var avatarModalPick = document.getElementById('avatarModalPick');
    var avatarCropImg = document.getElementById('avatarCropImg');
    var avatarCropContainer = document.getElementById('avatarCropContainer');
    var avatarZoom = document.getElementById('avatarZoom');
    var avatarZoomValue = document.getElementById('avatarZoomValue');
    var avatarApplyBtn = document.getElementById('avatarApplyBtn');
    var profileForm = document.getElementById('profileForm');
    var avatarFormInput = profileForm ? profileForm.querySelector('input[name="avatar"]') : null;
    var avatarFormCropWrap = document.getElementById('avatarFormCropWrap');
    var avatarFormCropBtn = document.getElementById('avatarFormCropBtn');

    if (!avatarModalEl) return;

    var avatarModal = null;
    var cropper = null;
    var currentFileName = 'avatar.png';
    var currentObjectURL = null;
    /** 'avatar' = from avatar click -> Apply uploads via fetch. 'form' = from form crop button -> Apply sets form input */
    var applyMode = 'avatar';

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function getCsrfToken() {
        var input = document.querySelector('[name=csrfmiddlewaretoken]');
        if (input && input.value) return input.value;
        return getCookie('csrftoken') || '';
    }

    function getUpdateAvatarUrl() {
        return avatarModalEl.getAttribute('data-update-url') || '';
    }

    function initModal() {
        if (!avatarModal && typeof bootstrap !== 'undefined') {
            avatarModal = new bootstrap.Modal(avatarModalEl);
        }
    }

    function resetModal() {
        avatarModalPick.classList.remove('d-none');
        avatarCropWrap.classList.add('d-none');
        avatarApplyBtn.disabled = true;
        avatarZoom.value = '100';
        if (avatarZoomValue) avatarZoomValue.textContent = '100%';
        avatarFileInput.value = '';
        avatarCropImg.src = '';
        avatarCropImg.removeAttribute('src');
        if (currentObjectURL) {
            URL.revokeObjectURL(currentObjectURL);
            currentObjectURL = null;
        }
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    function loadImageInCropper(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFileName = file.name ? file.name.replace(/\.[^.]+$/, '.png') : 'avatar.png';
        if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
        currentObjectURL = URL.createObjectURL(file);
        avatarCropImg.src = currentObjectURL;
        avatarModalPick.classList.add('d-none');
        avatarCropWrap.classList.remove('d-none');
        avatarApplyBtn.disabled = false;
    }

    function initCropper() {
        if (cropper) cropper.destroy();
        cropper = new Cropper(avatarCropImg, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            minContainerWidth: 280,
            minContainerHeight: 280
        });
        avatarZoom.value = '100';
        if (avatarZoomValue) avatarZoomValue.textContent = '100%';
        try {
            cropper.zoomTo(1);
        } catch (e) {}
    }

    function setFormAvatarFile(file) {
        if (!avatarFormInput) return;
        var dt = new DataTransfer();
        dt.items.add(file);
        avatarFormInput.files = dt.files;
    }

    function doApply() {
        if (!cropper) return;
        var canvas = cropper.getCroppedCanvas({
            width: 512,
            height: 512,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });
        if (!canvas) return;

        canvas.toBlob(function (blob) {
            if (!blob) return;
            var file = new File([blob], currentFileName, { type: 'image/png' });

            if (applyMode === 'form') {
                setFormAvatarFile(file);
                avatarModal.hide();
                return;
            }

            var url = getUpdateAvatarUrl();
            if (!url) {
                setFormAvatarFile(file);
                avatarModal.hide();
                profileForm.submit();
                return;
            }
            var formData = new FormData();
            formData.append('avatar', file);
            formData.append('csrfmiddlewaretoken', getCsrfToken());
            avatarApplyBtn.disabled = true;
            avatarApplyBtn.textContent = '…';
            fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                redirect: 'follow'
            })
                .then(function (res) {
                    if (res.redirected && res.url) {
                        window.location.href = res.url;
                    } else {
                        window.location.reload();
                    }
                })
                .catch(function () {
                    avatarApplyBtn.disabled = false;
                    avatarApplyBtn.textContent = 'Застосувати';
                    setFormAvatarFile(file);
                    avatarModal.hide();
                    profileForm.submit();
                });
        }, 'image/png', 0.92);
    }

    // —— Open from avatar image click
    if (avatarTrigger) {
        avatarTrigger.addEventListener('click', function () {
            initModal();
            resetModal();
            applyMode = 'avatar';
            avatarModal.show();
        });
    }

    avatarModalEl.addEventListener('hidden.bs.modal', resetModal);

    avatarPickBtn.addEventListener('click', function () {
        avatarFileInput.click();
    });

    avatarFileInput.addEventListener('change', function () {
        var file = this.files && this.files[0];
        if (!file) return;
        avatarCropImg.onload = function () {
            initCropper();
        };
        loadImageInCropper(file);
    });

    // —— Open from form "Обрізати" (when user already selected a file)
    if (avatarFormInput && avatarFormCropBtn) {
        avatarFormInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                avatarFormCropWrap.classList.remove('d-none');
            } else {
                avatarFormCropWrap.classList.add('d-none');
            }
        });
        avatarFormCropBtn.addEventListener('click', function () {
            var file = avatarFormInput.files && avatarFormInput.files[0];
            if (!file || !file.type.startsWith('image/')) return;
            initModal();
            resetModal();
            applyMode = 'form';
            avatarCropImg.onload = function () {
                initCropper();
            };
            loadImageInCropper(file);
            avatarModal.show();
        });
    }

    // —— Zoom slider: map 10–300% to cropper zoom
    avatarZoom.addEventListener('input', function () {
        if (!cropper) return;
        var pct = parseFloat(this.value);
        if (avatarZoomValue) avatarZoomValue.textContent = pct + '%';
        var ratio = pct / 100;
        try {
            cropper.zoomTo(ratio);
        } catch (e) {}
    });

    avatarApplyBtn.addEventListener('click', doApply);
})();
