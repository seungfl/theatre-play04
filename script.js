let clickOrder = 0;
let isSubmitted = false;

function loadFromLocalStorage() {
  clickOrder = parseInt(localStorage.getItem('clickOrder')) || 0;
  isSubmitted = localStorage.getItem('isSubmitted') === 'true';

  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach((box, index) => {
    const order = localStorage.getItem(`box${index}`);
    if (order) {
      box.setAttribute('data-order', order);
      const overlay = box.querySelector('.overlay');
      overlay.style.display = 'block';

      const overlayText = box.querySelector('.overlay-text');
      overlayText.style.display = 'block';
      overlayText.innerText = order;
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem('clickOrder', clickOrder);

  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach((box, index) => {
    localStorage.setItem(`box${index}`, box.getAttribute('data-order') || '');
  });
}

window.addEventListener('load', () => {
  loadFromLocalStorage();

  if (isSubmitted) {
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;
  }
});

function assignOrder(box) {
  if (!box.getAttribute('data-order') && !isSubmitted) {
    clickOrder++;
    box.setAttribute('data-order', clickOrder);

    const overlay = box.querySelector('.overlay');
    overlay.style.display = 'block';

    const overlayText = box.querySelector('.overlay-text');
    overlayText.style.display = 'block';
    overlayText.innerText = clickOrder;

    saveToLocalStorage();
  }
}

function reset() {
  clickOrder = 0;
  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach(box => {
    box.removeAttribute('data-order');
    box.querySelector('.overlay').style.display = 'none';
    box.querySelector('.overlay-text').style.display = 'none';
  });

  localStorage.clear();
}

function submit() {
  const boxes = document.querySelectorAll('.image-box');
  const isComplete = Array.from(boxes).every(box => box.getAttribute('data-order') !== null);

  if (isComplete) {
    alert("제출되었습니다.");
    isSubmitted = true;
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;

    localStorage.setItem('isSubmitted', 'true');
  } else {
    alert("모든 이미지에 순서를 할당해주세요.");
  }
}