const currDisplay = document.querySelector('.curr-display');
const prevDisplay = document.querySelector('.prev-display');
const numbers = document.querySelectorAll('.number');
const operands = document.querySelectorAll('.operation');
const clearBtn = document.querySelector('.clear');
const delBtn = document.querySelector('.delete');
const equalBtn = document.querySelector('.equal');

const historyToggleBtn = document.querySelector('.history-toggle');
const historyPanel = document.querySelector('.history-panel');
const historyList = document.querySelector('.history-list');
const clearHistoryBtn = document.querySelector('.clear-history');

const themeToggle = document.getElementById('themeToggle');

let operation;
let history = JSON.parse(localStorage.getItem('calc-history')) || [];

function saveHistory() {
  localStorage.setItem('calc-history', JSON.stringify(history));
}

function appendNumber(number) {
  if (number === "." && currDisplay.innerText.includes(".")) return;
  currDisplay.innerText += number;
}

function chooseOperation(operand) {
  if (currDisplay.innerText === "") return;
  if (prevDisplay.innerText !== "") compute();
  operation = operand;
  prevDisplay.innerText = currDisplay.innerText + " " + operand;
  currDisplay.innerText = "";
}

function clearDisplay() {
  currDisplay.innerText = "";
  prevDisplay.innerText = "";
}

function compute() {
  let result;
  let currValue = parseFloat(currDisplay.innerText);
  let prevValue = parseFloat(prevDisplay.innerText);

  if (isNaN(currValue) || isNaN(prevValue)) return;

  switch (operation) {
    case '+':
      result = prevValue + currValue;
      break;
    case '-':
      result = prevValue - currValue;
      break;
    case '*':
      result = prevValue * currValue;
      break;
    case '/':
      if (currValue === 0) {
        alert("Cannot divide by zero");
        return;
      }
      result = prevValue / currValue;
      break;
    default:
      return;
  }

  const equation = `${prevDisplay.innerText} ${currDisplay.innerText} = ${result}`;
  history.push(equation);
  saveHistory();
  renderHistory();

  currDisplay.innerText = result;
  prevDisplay.innerText = "";
}

function renderHistory() {
  const isLight = document.body.classList.contains('light-mode');
  historyList.innerHTML = history.map(item =>
    `<li class="list-group-item bg-transparent" style="color:${isLight ? 'black' : 'white'}">${item}</li>`
  ).join('');
}

numbers.forEach(number => {
  number.addEventListener('click', () => appendNumber(number.innerText));
});

operands.forEach(operand => {
  operand.addEventListener('click', () => chooseOperation(operand.innerText));
});

clearBtn.addEventListener('click', () => clearDisplay());

equalBtn.addEventListener('click', () => compute());

delBtn.addEventListener('click', () => {
  currDisplay.innerText = currDisplay.innerText.slice(0, -1);
});

historyToggleBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('d-none');
  historyToggleBtn.innerText = historyPanel.classList.contains('d-none') ? 'Show History' : 'Hide History';
});

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  saveHistory();
  renderHistory();
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode');
  renderHistory(); // update history color
});


document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!isNaN(key) || key === '.') {
    appendNumber(key);
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperation(key);
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault(); // avoid form submit
    compute();
  }

  if (key === 'Backspace') {
    currDisplay.innerText = currDisplay.innerText.slice(0, -1);
  }

  if (key === 'Escape' || key.toLowerCase() === 'c') {
    clearDisplay();
  }

  if (key.toLowerCase() === 'h') {
    historyPanel.classList.toggle('d-none');
    historyToggleBtn.innerText = historyPanel.classList.contains('d-none') ? 'Show History' : 'Hide History';
  }

  if (key.toLowerCase() === 't') {
    themeToggle.checked = !themeToggle.checked;
    document.body.classList.toggle('light-mode');
    renderHistory();
  }
});

renderHistory();
