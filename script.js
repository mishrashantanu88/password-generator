const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
// const readValue = document.querySelector("[readonly]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("#generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_+?<][/?";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// Set Strength circle color to grey
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const random = getRandomInteger(0, symbols.length);
  return symbols[random];
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) {
    hasUpper = true;
  }
  if (lowercaseCheck.checked) {
    hasLower = true;
  }
  if (numbersCheck.checked) {
    hasNum = true;
  }
  if (symbolsCheck.checked) {
    hasSym = true;
  }

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#0ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
    setTimeout(() => {
      copyMsg.innerText = "";
    }, 2000);
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // Special Conditions
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  let funArr = [];

  if (uppercaseCheck.checked) {
    funArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funArr.push(generateSymbol);
  }

  // Compulsory addition
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  // Remaining addition
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRandomInteger(0, funArr.length);
    password += funArr[randIndex]();
  }

  // Show the Password
  passwordDisplay.value = password;

  // Calculate strength
  calcStrength();
});
