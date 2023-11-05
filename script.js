const pageId = 'page4';

let clickOrder = 0;
let isSubmitted = false;

function loadFromLocalStorage() {
  clickOrder = parseInt(localStorage.getItem(pageId + '_clickOrder')) || 0;
  isSubmitted = localStorage.getItem(pageId + '_isSubmitted') === 'true';

  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach((box, index) => {
    const order = localStorage.getItem(`${pageId}_box${index}`);
    if (order) {
      box.setAttribute('data-order', order);
      const overlay = box.querySelector('.overlay');
      overlay.style.display = 'block';
      const overlayText = box.querySelector('.overlay-text');
      overlayText.style.display = 'block';
      overlayText.innerText = order;
    }
  });

  if (isSubmitted) {
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;
  }
}

function saveToLocalStorage() {
  localStorage.setItem(pageId + '_clickOrder', clickOrder.toString());
  localStorage.setItem(pageId + '_isSubmitted', isSubmitted.toString());

  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach((box, index) => {
    localStorage.setItem(`${pageId}_box${index}`, box.getAttribute('data-order') || '');
  });
}

window.addEventListener('load', loadFromLocalStorage);

function assignOrder(box) {
  if (!box.getAttribute('data-order') && !isSubmitted) {
    clickOrder++;
    box.setAttribute('data-order', clickOrder.toString());
    const overlay = box.querySelector('.overlay');
    overlay.style.display = 'block';
    const overlayText = box.querySelector('.overlay-text');
    overlayText.style.display = 'block';
    overlayText.innerText = clickOrder.toString();
    saveToLocalStorage();
  }
}

function reset() {
  clickOrder = 0;
  isSubmitted = false;
  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach(box => {
    box.removeAttribute('data-order');
    box.querySelector('.overlay').style.display = 'none';
    box.querySelector('.overlay-text').style.display = 'none';
  });

  // 해당 페이지의 모든 Local Storage 항목을 삭제합니다.
  localStorage.removeItem(pageId + '_clickOrder');
  localStorage.removeItem(pageId + '_isSubmitted');
  for (let i = 0; i < boxes.length; i++) {
    localStorage.removeItem(`${pageId}_box${i}`);
  }

  document.getElementById('reset-button').disabled = false;
  document.getElementById('submit-button').disabled = false;
}

function submit() {
  const boxes = document.querySelectorAll('.image-box');
  const isComplete = Array.from(boxes).every(box => box.getAttribute('data-order'));

  if (isComplete) {
    alert("제출되었습니다.");
    isSubmitted = true;
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;
    saveToLocalStorage();
    checkAllSubmissions();
  } else {
    alert("모든 이미지에 순서를 할당해주세요.");
  }
}

function checkAllSubmissions() {
  const totalPages = 4;
  let allSubmitted = true;

  for (let i = 1; i <= totalPages; i++) {
    if (localStorage.getItem(`page${i}_isSubmitted`) !== 'true') {
      allSubmitted = false;
      break;
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach(box => {
    box.addEventListener('click', () => assignOrder(box));
  });

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', reset);

  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', submit);
});