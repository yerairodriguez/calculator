let currentNum = "";
let previousNum = "";
let operator = "";

let arrayOperators = ["+", "-", "*", "/", "=", "x", "÷"];

const currentDisplayNumber = document.querySelector(".currentNumber");

var multiplybutton = document.getElementById('multiply-btn');
var dividebutton = document.getElementById('divide-btn');
var plusminusbutton = document.getElementById('plusminus-btn');
var zero = document.getElementById('zero-btn');


window.addEventListener("keydown", handleKeyPress);

const equal = document.querySelector(".equal");

equal.addEventListener("click", () => {
  if (previousNum !== "" && currentNum === "") {
    currentDisplayNumber.textContent = "ERROR";
  } else {
    calculate();
  }
});

const decimal = document.querySelector(".decimal");

decimal.addEventListener("click", () => {
  addDecimal();
});

const clear = document.querySelector(".clear");
clear.addEventListener("click", clearCalculator);

const numberButtons = document.querySelectorAll(".number");

const operators = document.querySelectorAll(".operator");

numberButtons.forEach((btn) => {
  btn.addEventListener("click", (press) => {
    handleNumber(press.target.textContent);
  });
});

function handleNumber(number) {
  removeInitialDisable();
  if (previousNum !== "" && currentNum !== "" && operator === "") {
    previousNum = "";
    currentDisplayNumber.textContent = currentNum;
  }
  if (checkLength(currentDisplayNumber.textContent)) {
    currentNum += number;
    currentDisplayNumber.textContent = currentNum;
  }
  checkLength(currentDisplayNumber.textContent);
}

operators.forEach(operatorInput => {
  operatorInput.addEventListener('click', (event) => {
    let input = event.target.textContent;
    console.log(input);
    if (input === plusminusbutton.textContent) {
      inputPlusMinus(currentDisplayNumber.textContent);
    } else {
      arrayOperators.forEach(operator => {
        if (input === operator) {
          handleOperator(input);
        }
      })
    }
  });
});

function handleOperator(op) {
  if (previousNum === "") {
    previousNum = currentNum;
    operatorCheck(op);
  } else if (currentNum === "") {
    operatorCheck(op);
  } else {
    calculate();
    operator = op;
    currentDisplayNumber.textContent = "0";
  }
  highlightOperator(operator);
  disablePlusMinusBtn();
}

function operatorCheck(text) {
  operator = text;
  currentNum = "";
}


function calculate() {
  previousNum = Number(swapToDot(previousNum));
  currentNum = Number(swapToDot(currentNum));

  if (operator === "+") {
    previousNum += currentNum;
  } else if (operator === "-") {
    previousNum -= currentNum;
  } else if (operator === multiplybutton.textContent) {
    previousNum *= currentNum;
  } else if (operator === dividebutton.textContent) {
    if (currentNum === 0) {
      previousNum = "ERROR";
      displayResults();
      disableAllButtons();
      return;
    }
    previousNum /= currentNum;
  }
  else if (operator === plusminusbutton.textContent) {
    inputPlusMinus(currentDisplayNumber.textContent);
  }
  previousNum = roundNumber(previousNum);
  console.log(previousNum);
  previousNum = previousNum.toString().replace(".", ",");
  displayResults();
  unhighlightOperator();
}

function swapToDot(num) {
  return num.toString().replace(",", ".");
}

function roundNumber(num) {
  return Math.round((num + Number.EPSILON) * 100000000) / 100000000;
}

function displayResults() {
  if (previousNum.length <= 12) {
    currentDisplayNumber.textContent = previousNum;
  }

  operator = "";
  currentNum = "";
}

function inputPlusMinus(number) {
  let replaceComma;
  if (currentDisplayNumber.textContent[currentDisplayNumber.textContent.length - 1] == ',') {
    replaceComma = number.slice(0, currentDisplayNumber.textContent.length - 1) * -1;
    replaceComma += ',';
    previousNum = replaceComma;
  } else if (currentDisplayNumber.textContent.includes(',')) {
    replaceComma = number.replace(',', '.');
    replaceComma = replaceComma * -1;
    previousNum = replaceComma.toString().replace('.', ',');
  } else if (currentDisplayNumber.textContent !== '0') {
    (previousNum = (number * -1).toString())
  }

  displayResults();

}

function clearCalculator() {
  currentNum = "";
  previousNum = "";
  operator = "";
  currentDisplayNumber.textContent = "0";
  unhighlightOperator();
  reenableButtons();
}

function addDecimal() {
  if (currentDisplayNumber.textContent === "0") {
    currentNum = '0'.concat(",");
  } else if (!currentDisplayNumber.textContent.includes(",")) {
    currentNum = currentDisplayNumber.textContent.concat(",");
    disableCommaBtn();
  }
  currentDisplayNumber.textContent = currentNum;
}

function handleKeyPress(press) {
  press.preventDefault();
  if (press.key >= 0 && press.key <= 9) {
    handleNumber(press.key);
  }
  if (
    press.key === "Enter" ||
    (press.key === "=" && currentNum != "" && previousNum != "")
  ) {
    calculate();
  }
  if (press.key === "+" || press.key === "-") {
    handleOperator(press.key);
  }
  if (press.key === "*") {
    handleOperator(multiplybutton.textContent);
  }
  if (press.key === "/") {
    handleOperator(dividebutton.textContent);
  }
  if (press.key === "Control") {
    inputPlusMinus(currentDisplayNumber.textContent);
  }
  if (press.key === ",") {
    addDecimal();
  }
  if (press.key === "Backspace") {
    handleDelete();
  }
  if (press.key === "Delete" || press.key === "Escape") {
    clearCalculator();
  }

}

function handleDelete() {
  if (currentNum !== "") {
    currentNum = currentNum.slice(0, -1);
    currentDisplayNumber.textContent = currentNum;
    if (currentNum === "") {
      currentDisplayNumber.textContent = "0";
    }
  }
  if (currentNum === "" && previousNum !== "" && operator === "") {
    previousNum = previousNum.slice(0, -1);
    currentDisplayNumber.textContent = previousNum;
  }
}

function highlightOperator(operatorBtn) {
  unhighlightOperator();
  for (let i = 0; i < operators.length; i++) {
    if (operators[i].textContent === operatorBtn && operators[i].textContent !== '=') {
      operators[i].classList.add('operatorHighlighted');
    }
  }
  reenableButtons();

}

function unhighlightOperator() {
  for (let i = 0; i < operators.length; i++) {
    operators[i].classList.remove('operatorHighlighted');
  }
}

function checkLength(number) {
  if (number.length < 10) {
    return true;
  } else if (number.length < 11 && !number.includes(',') && number.includes('-')) {
    return true;
  } else if (number.length < 11 && number.includes(',') && !number.includes('-')) {
    return true;
  } else if (number.length < 12 && number.includes(',') && number.includes('-')) {
    return true;
  } else {
    disableNumericalButtons();
    return false;
  }
}

function disableNumericalButtons() {
  for (let i = 0; i < numberButtons.length; i++) {
    {
      numberButtons[i].setAttribute('disabled', true);
      numberButtons[i].classList.add('not-working-btn');
    }
    decimal.disabled = true;
    decimal.classList.add('not-working-btn')
  }
}

function reenableButtons() {
  for (let i = 0; i < numberButtons.length; i++) {
    {
      numberButtons[i].disabled = false;
      numberButtons[i].classList.remove('not-working-btn');
    }
    for (let i = 0; i < operators.length; i++) {
      operators[i].disabled = false;
      operators[i].classList.remove('not-working-btn');
    }
  }
  enableCommaBtn();

  equal.disabled = false;
  equal.classList.remove('not-working-btn');

  initialDisable();
}

function disableCommaBtn() {
  decimal.disabled = true;
  decimal.classList.add('not-working-btn');
}

function enableCommaBtn() {
  decimal.disabled = false;
  decimal.classList.remove('not-working-btn');
}

function disableAllButtons() {
  for (let i = 0; i < numberButtons.length; i++) {
    {
      numberButtons[i].setAttribute('disabled', true);
      numberButtons[i].classList.add('not-working-btn');
    }
  }
  for (let i = 0; i < operators.length; i++) {
    {
      operators[i].setAttribute('disabled', true);
      operators[i].classList.add('not-working-btn');
    }
  }
  decimal.disabled = true;
  decimal.classList.add('not-working-btn');
  equal.disabled = true;
  equal.classList.add('not-working-btn');
}

function disablePlusMinusBtn() {
  plusminusbutton.disabled = true;
  plusminusbutton.classList.add('not-working-btn');
}

function disableZero() {
  zero.disabled = true;
  zero.classList.add('not-working-btn');
}

function initialDisable() {
  if (currentDisplayNumber.textContent === '0') {
    disablePlusMinusBtn();
    disableZero();
  }
}
initialDisable();

function removeInitialDisable() {
  plusminusbutton.disabled = false;
  plusminusbutton.classList.remove('not-working-btn');
  zero.disabled = false;
  zero.classList.remove('not-working-btn');
}