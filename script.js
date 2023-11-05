// 페이지별 고유 식별자 설정 - 각 스크립트에 맞게 변경해주세요.
const pageId = 'page4';

let clickOrder = 0;
let isSubmitted = false;

// Local Storage로부터 페이지 상태를 불러오는 함수
function loadFromLocalStorage() {
  clickOrder = parseInt(localStorage.getItem(pageId + '_clickOrder')) || 0;
  isSubmitted = localStorage.getItem(pageId + '_isSubmitted') === 'true';

  // 이미지 박스 상태를 복원합니다.
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

  // 제출 여부에 따라 버튼 상태를 설정합니다.
  if (isSubmitted) {
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;
  }
}

// 페이지 상태를 Local Storage에 저장하는 함수
function saveToLocalStorage() {
  localStorage.setItem(pageId + '_clickOrder', clickOrder.toString());
  localStorage.setItem(pageId + '_isSubmitted', isSubmitted.toString());

  const boxes = document.querySelectorAll('.image-box');
  boxes.forEach((box, index) => {
    localStorage.setItem(`${pageId}_box${index}`, box.getAttribute('data-order') || '');
  });
}

// 페이지가 로드될 때 상태를 불러옵니다.
window.addEventListener('load', loadFromLocalStorage);

// 이미지 박스 클릭 시 순서를 지정하는 함수
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

// 리셋 버튼 클릭 시 모든 설정을 초기화하는 함수
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

  // 버튼을 다시 활성화합니다.
  document.getElementById('reset-button').disabled = false;
  document.getElementById('submit-button').disabled = false;
}

// 제출 버튼 클릭 시, 모든 이미지에 순서가 지정되었는지 확인하고 제출하는 함수
function submit() {
  const boxes = document.querySelectorAll('.image-box');
  const isComplete = Array.from(boxes).every(box => box.getAttribute('data-order'));

  if (isComplete) {
    alert("제출되었습니다.");
    isSubmitted = true;
    document.getElementById('reset-button').disabled = true;
    document.getElementById('submit-button').disabled = true;
    saveToLocalStorage();
    checkAllSubmissions(); // 모든 페이지의 제출 상태를 확인합니다.
  } else {
    alert("모든 이미지에 순서를 할당해주세요.");
  }
}

// 모든 페이지의 제출 상태를 확인하는 함수
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

// 이벤트 리스너를 설정하는 부분입니다.
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