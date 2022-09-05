let currentNum = "";
let previousNum = "";
let operator = "";

const currentDisplayNumber = document.querySelector(".currentNumber");

var multiplybutton = document.getElementById('multiply-btn');
var dividebutton = document.getElementById('divide-btn');
var plusminusbutton = document.getElementById('plusminus-btn');


window.addEventListener("keydown", handleKeyPress);

const equal = document.querySelector(".equal");
equal.addEventListener("click", () => {
  if (currentNum != "" && previousNum != "") {
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
  btn.addEventListener("click", (e) => {
    handleNumber(e.target.textContent);
  });
});

function handleNumber(number) {
  if (previousNum !== "" && currentNum !== "" && operator === "") {
    previousNum = "";
    currentDisplayNumber.textContent = currentNum;
  }
  if (currentNum.length <= 11) {
    currentNum += number;
    currentDisplayNumber.textContent = currentNum;
  }
}

operators.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    handleOperator(e.target.textContent);
  });
});

plusminusbutton.addEventListener("click", () => {
  currentNum = currentNum * (-1);
  displayResults();
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
}

function operatorCheck(text) {
  operator = text;
  currentNum = "";
}


function calculate() {
  previousNum = Number(previousNum);
  currentNum = Number(currentNum);

  if (operator === "+") {
    previousNum += currentNum;
  } else if (operator === "-") {
    previousNum -= currentNum;
  } else if (operator === multiplybutton.textContent) {
    previousNum *= currentNum;
  } else if (operator === dividebutton.textContent) {
    if (currentNum <= 0) {
      previousNum = "Error";
      displayResults();
      return;
    }
    previousNum /= currentNum;
  }
  else if (operator === plusminusbutton.textContent) {
    inputPlusMinus(resultScreen.textContent);
  } 
  previousNum = roundNumber(previousNum);
  previousNum = previousNum.toString();
  displayResults();
}

function roundNumber(num) {
  return Math.round(num * 100000) / 100000;
}

function displayResults() {
  if (previousNum.length <= 11) {
    currentDisplayNumber.textContent = previousNum;
  } else {
    currentDisplayNumber.textContent = previousNum.slice(0, 11) + "...";
  }

  operator = "";
  currentNum = "";
}

function inputPlusMinus(number) {
  let replaceComma;
  if (currentNum[currentNum.length - 1] == ',') {
      replaceComma = number.slice(0, currentNum.length-1)*-1;
      replaceComma += ',';
      currentNum = replaceComma;
  } else {
      if (resultScreen.textContent.includes(',')) {
          replaceComma = number.replace(',', '.');
          replaceComma = replaceComma * -1;
          currentNum = replaceComma.toString().replace('.', ',');
      } else {
          currentNum = (number * -1);
      }
  }

}

function clearCalculator() {
  currentNum = "";
  previousNum = "";
  operator = "";
  currentDisplayNumber.textContent = "0";
}

function addDecimal() {
  if (!currentNum.includes(".")) {
    currentNum += ".";
    currentDisplayNumber.textContent = currentNum;
  } else if (currentNum.includes(".")) {
    return;
  }
}

function handleKeyPress(e) {
  e.preventDefault();
  if (e.key >= 0 && e.key <= 9) {
    handleNumber(e.key);
  }
  if (
    e.key === "Enter" ||
    (e.key === "=" && currentNum != "" && previousNum != "")
  ) {
    calculate();
  }
  if (e.key === "+" || e.key === "-") {
    handleOperator(e.key);
  }
  if (e.key === "*") {
    handleOperator(multiplybutton.textContent);
  }
  if (e.key === "/") {
    handleOperator(dividebutton.textContent);
  }
  if (e.key === ",") {
    addDecimal();
  }
  if (e.key === "Backspace") {
    handleDelete();
  }
  if (e.key === "Delete" || e.key === "Escape") {
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

function highlightOperator(){

}