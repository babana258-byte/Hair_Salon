var modal = document.getElementById('id01');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    var imgModal = document.getElementById('imgModal');
    if (event.target == imgModal) {
        closeImageModal();
    }
}

function showImageModal(src) {
    var imgModal = document.getElementById('imgModal');
    var img = document.getElementById('imgModalPic');
    img.src = src;
    imgModal.style.display = 'flex';
}
function closeImageModal() {
    var imgModal = document.getElementById('imgModal');
    imgModal.style.display = 'none';
    document.getElementById('imgModalPic').src = '';
}
