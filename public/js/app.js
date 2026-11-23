import {
  MAX_TEXT_LENGTH,
  UI_TEXT,
  INPUT_ERRORS,
  CLIENT_ERRORS,
  PRIORITY_CLASS,
  EXAMPLES,
} from './config.js';
import { classifyMail } from './api.js';

// DOM 요소 참조
const form = document.getElementById('classify-form');
const textInput = document.getElementById('text-input');
const inputError = document.getElementById('input-error');
const charCount = document.getElementById('char-count');
const exampleList = document.getElementById('example-list');
const clearButton = document.getElementById('clear-button');
const classifyButton = document.getElementById('classify-button');

const resultSection = document.getElementById('result-section');
const resultEmpty = document.getElementById('result-empty');
const resultLoading = document.getElementById('result-loading');
const resultCard = document.getElementById('result-card');
const resultLabel = document.getElementById('result-label');
const confidenceValue = document.getElementById('confidence-value');
const confidenceBar = document.getElementById('confidence-bar');
const confidenceFill = document.getElementById('confidence-fill');
const resultReason = document.getElementById('result-reason');

const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const retryButton = document.getElementById('retry-button');

let currentStatus = 'idle';

// 앞뒤 공백을 제외하고 이모지도 1자로 계산합니다.
const countChars = (value) => Array.from(value.trim()).length;

function updateCharCount() {
  const count = countChars(textInput.value);
  charCount.textContent = `${count} / ${MAX_TEXT_LENGTH}`;

  if (count > MAX_TEXT_LENGTH) {
    charCount.classList.add('is-over');
    textInput.classList.add('is-invalid');
    inputError.textContent = INPUT_ERRORS.TOO_LONG;
  } else {
    charCount.classList.remove('is-over');
    textInput.classList.remove('is-invalid');
    if (inputError.textContent === INPUT_ERRORS.TOO_LONG) {
      inputError.textContent = '';
    }
  }
}

function clearInputValidation() {
  inputError.textContent = '';
  textInput.classList.remove('is-invalid');
}

function setState(state) {
  currentStatus = state.status;

  // 모든 결과 블록 숨김 처리
  resultEmpty.hidden = true;
  resultLoading.hidden = true;
  resultCard.hidden = true;
  errorBox.hidden = true;

  const exampleButtons = exampleList.querySelectorAll('.btn-chip');

  if (currentStatus === 'idle') {
    resultEmpty.hidden = false;
    classifyButton.disabled = false;
    classifyButton.textContent = UI_TEXT.submit;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
    resultSection.setAttribute('aria-busy', 'false');
  } else if (currentStatus === 'loading') {
    resultLoading.hidden = false;
    classifyButton.disabled = true;
    classifyButton.textContent = UI_TEXT.submitting;
    clearButton.disabled = true;
    exampleButtons.forEach((btn) => { btn.disabled = true; });
    textInput.readOnly = true;
    resultSection.setAttribute('aria-busy', 'true');
  } else if (currentStatus === 'success') {
    resultCard.hidden = false;
    classifyButton.disabled = false;
    classifyButton.textContent = UI_TEXT.submit;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
    resultSection.setAttribute('aria-busy', 'false');

    renderSuccess(state.data);
  } else if (currentStatus === 'error') {
    errorBox.hidden = false;
    classifyButton.disabled = false;
    classifyButton.textContent = UI_TEXT.submit;
    clearButton.disabled = false;
    exampleButtons.forEach((btn) => { btn.disabled = false; });
    textInput.readOnly = false;
    resultSection.setAttribute('aria-busy', 'false');

    renderError(state.error);
  }
}

function renderSuccess(data) {
  if (!data || !PRIORITY_CLASS[data.priority]) {
    setState({
      status: 'error',
      error: { code: 'UNKNOWN_ERROR', ...CLIENT_ERRORS.UNKNOWN_ERROR },
    });
    return;
  }

  resultCard.classList.remove('is-urgent', 'is-today', 'is-later');
  resultCard.classList.add(PRIORITY_CLASS[data.priority]);

  resultLabel.textContent = data.label;
  confidenceValue.textContent = `${data.confidence}%`;
  confidenceBar.setAttribute('aria-valuenow', String(data.confidence));

  confidenceFill.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      confidenceFill.style.width = `${data.confidence}%`;
    });
  });

  resultReason.textContent = data.reason;
}

function renderError(error) {
  errorMessage.textContent = error.message;
  retryButton.hidden = !error.retryable;
}

async function submitClassification() {
  if (currentStatus === 'loading') return;

  const text = textInput.value.trim();

  if (text.length === 0) {
    inputError.textContent = INPUT_ERRORS.EMPTY_INPUT;
    textInput.classList.add('is-invalid');
    textInput.focus();
    return;
  }

  if (countChars(text) > MAX_TEXT_LENGTH) {
    inputError.textContent = INPUT_ERRORS.TOO_LONG;
    textInput.classList.add('is-invalid');
    textInput.focus();
    return;
  }

  clearInputValidation();
  setState({ status: 'loading' });

  const result = await classifyMail(text);
  if (result.ok) {
    setState({ status: 'success', data: result.data });
  } else {
    setState({ status: 'error', error: result.error });
  }
}

// E-01: 초기화 및 예시 버튼 렌더링
function initExamples() {
  EXAMPLES.forEach((example) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-chip';
    btn.textContent = example.label;

    btn.addEventListener('click', () => {
      textInput.value = example.text;
      updateCharCount();
      clearInputValidation();
      textInput.focus();
    });

    exampleList.appendChild(btn);
  });
}

// 이벤트 리스너 등록
textInput.addEventListener('input', () => {
  updateCharCount();
});

textInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    submitClassification();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitClassification();
});

clearButton.addEventListener('click', () => {
  textInput.value = '';
  clearInputValidation();
  updateCharCount();
  setState({ status: 'idle' });
  textInput.focus();
});

retryButton.addEventListener('click', () => {
  submitClassification();
});

// 초기 실행
initExamples();
updateCharCount();
setState({ status: 'idle' });
