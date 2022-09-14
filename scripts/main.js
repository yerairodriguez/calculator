// consts
// lets
// code without functions (enter code)
// functions
/**
 * Consts and lets well defined and ordered
 * All events definied in functions
 * Functions rename done
 * const currentNumberDisplay to -> display
 * let currentNum & previousNum to -> let currentDisplay & previousDisplay
 */
const MAX_DIGITS_IN_DISPLAY = 10;
const display = document.querySelector(".currentNumber");
const equal = document.querySelector(".equal");
const decimal = document.querySelector(".decimal");
const clear = document.querySelector(".clear");
const numberButtons = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");

let currentDisplay = "";
let previousDisplay = "";
let operator = "";
let arrayOperators = ["+", "-", "*", "/", "=", "x", "÷"];
let plusminusbutton = document.getElementById('plusminus-btn');
let zero = document.getElementById('zero-btn');


setMouseEvents();
setKeyboardEvents();
disablePlusMinusAndZero();
//calculatorReset(); ?


function setMouseEvents() {
  setClearEvent();
  setNumberEvents()
  setOperatorsEvent()
  setEqualEvent()
  setCommaEvent()

}

function setNumberEvents() {
  for (let i = 0; i < numberButtons.length; i++) {
    numberButtons[i].addEventListener("click", function () {
      handleNumber(numberButtons[i].textContent);
    });
  }
}

function setClearEvent() {
  clear.addEventListener("click", clearCalculator)
}

function setEqualEvent() {
  equal.addEventListener("click", () => {
    if (previousDisplay !== "" && currentDisplay === "") {
      display.textContent = "ERROR";
    } else
      calculate();
    if (currentDisplay != "" && previousDisplay != "") {
      calculate();
    }
  });
}

function setCommaEvent() {
  decimal.addEventListener("click", addDecimal)
}

function setOperatorsEvent() {
  for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener('click', (event) => {
      let input = event.target.textContent;
      console.log(input);
      if (input === plusminusbutton.textContent) {
        inputPlusMinus(display.textContent);
      }
      else {
        arrayOperators.forEach(operator => {
          if (input === operator) {
            handleOperator(input);
          }
        })
      }
    });
  }
}


function setKeyboardEvents() {
  window.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(press) {
  press.preventDefault();
  if (press.key === "Escape") {
    clearCalculator();
  }
  if (display.textContent != 'ERROR') {
    if (press.key >= 0 && press.key <= 9) {
      handleNumber(press.key);
    }
    if (press.key === "Enter") {
      calculate();
    }
    if (press.key === "+" || press.key === "-") {
      handleOperator(press.key);
    }
    if (press.key === "*") {
      handleOperator('x');
    }
    if (press.key === "/") {
      handleOperator('/');
    }
    if (press.key === "Control") {
      inputPlusMinus(display.textContent);
    }
    if (press.key === ",") {
      addDecimal();
    }
    if (press.key === "Backspace") {
      handleDelete();
    }
  }

}

function handleNumber(number) {
  enablePlusMinusAndZero();
  if (previousDisplay !== "" && currentDisplay !== "" && operator === "") {
    previousDisplay = "";
    display.textContent = currentDisplay;
  }
  if (checkLength(display.textContent)) {
    currentDisplay += number;
    display.textContent = currentDisplay;
  }
  checkLength(display.textContent); // isNewDigitAllowed
}

function handleOperator(op) {
  if (previousDisplay === "") {
    previousDisplay = currentDisplay;
    checkOperator(op);
  } else if (currentDisplay === "") {
    checkOperator(op);
  } else {
    calculate();
    operator = op;
    // display.textContent = "0";  //setDisplay
    //setButtonsEnabledStatus
  }
  highlightOperator(operator);
  disablePlusMinusBtn();  //disableButtonsBy???
}

function handleDelete() {
  if (currentDisplay !== "") {
    currentDisplay = currentDisplay.slice(0, -1);
    display.textContent = currentDisplay;
    if (currentDisplay === "") {
      display.textContent = "0";
    }
  }
  if (currentDisplay === "" && previousDisplay !== "" && operator === "") {
    previousDisplay = previousDisplay.slice(0, -1);
    display.textContent = previousDisplay;
  }
}

function checkOperator(text) {
  operator = text;
  currentDisplay = "";
}

function calculate() {
  previousDisplay = Number(swapToDot(previousDisplay));
  currentDisplay = Number(swapToDot(currentDisplay));

  if (operator === "+") {
    previousDisplay += currentDisplay;
  } else if (operator === "-") {
    previousDisplay -= currentDisplay;
  } else if (operator === 'x') {
    previousDisplay *= currentDisplay;
  } else if (operator === '/') {
    if (currentDisplay === 0) {
      previousDisplay = "ERROR";
      displayResults();
      disableAllButtons();
      return;
    }
    previousDisplay /= currentDisplay;
  }
  previousDisplay = roundNumber(previousDisplay);
  console.log(currentDisplay, '- ', previousDisplay);
  previousDisplay = previousDisplay.toString().replace(".", ",");
  displayResults();
  unhighlightOperators();
}

function swapToDot(num) {
  return num.toString().replace(",", ".");
}

function roundNumber(num) {
  return Math.round((num + Number.EPSILON) * 100000000) / 100000000;  //CoPilot is too smart for me
}

function displayResults() {
  if (previousDisplay.length <= MAX_DIGITS_IN_DISPLAY + 2) {
    display.textContent = previousDisplay;
  }

  operator = "";
  currentDisplay = "";
}

function inputPlusMinus(number) {
  let replaceComma;
  if (display.textContent[display.textContent.length - 1] == ',') {
    replaceComma = number.slice(0, display.textContent.length - 1) * -1;
    replaceComma += ',';
    previousDisplay = replaceComma;
  } else if (display.textContent.includes(',')) {
    replaceComma = number.replace(',', '.');
    replaceComma = replaceComma * -1;
    previousDisplay = replaceComma.toString().replace('.', ',');
  } else if (display.textContent !== '0') {
    (previousDisplay = (number * -1).toString())
  }
  displayResults();
}

function clearCalculator() {
  currentDisplay = "";
  previousDisplay = "";
  operator = "";
  display.textContent = "0";
  unhighlightOperators();
  reenableButtons();
}

function addDecimal() {
  if (display.textContent === "0") {
    currentDisplay = '0'.concat(",");
  } else if (!display.textContent.includes(",")) {
    currentDisplay = display.textContent.concat(",");
    disableCommaBtn();
  }
  display.textContent = currentDisplay;
}




function highlightOperator(operatorBtn) {
  unhighlightOperators(); // unhighlightOperators
  for (let i = 0; i < operators.length; i++) {
    if (operators[i].textContent === operatorBtn && operators[i].textContent !== '=') {
      operators[i].classList.add('operatorHighlighted');
    }
  }
  reenableButtons();

}

function unhighlightOperators() {
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

  disablePlusMinusAndZero();
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

function disablePlusMinusAndZero() {
  if (display.textContent === '0') {
    disablePlusMinusBtn();
    disableZero();
  }
}


function enablePlusMinusAndZero() {
  plusminusbutton.disabled = false;
  plusminusbutton.classList.remove('not-working-btn');
  zero.disabled = false;
  zero.classList.remove('not-working-btn');
}