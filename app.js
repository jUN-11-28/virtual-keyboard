const koreanKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ',
  'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ',
  'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', ' ', '\n'];

const koreanShiftKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅒ', 'ㅖ',
  'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ',
  'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', ' ', '\n'];

const englishKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm', ' ', '\n'];

const englishCapitalKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ' ', '\n'];

const specialSymbolKey = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"',
  '[', ']', '{', '}', '#', '%', '^', '*', '+', '=',
  '_', '\\', '|', '~', '<', '>', '₩', '£', '¥',
  '.', ',', '?', '!', '\'', ':)', ':(', ' ', '\n'];


function selectText(elementId) {
  var text = document.getElementById(elementId);
  if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Browser does not support text-selection!");
  }
}

window.onload = function() {
  selectText('textToSelect');
};

var currentLanguage = 'Korean';
var isShiftActive = false;
var isSpecialSymbol = false;

function keyidToChar(keyId) {
  if (isSpecialSymbol) {
    return specialSymbolKey[Number(keyId)];
  } else if (currentLanguage === 'Korean') {
    if (isShiftActive) {
      return koreanShiftKey[Number(keyId)];
    } else {
      return koreanKey[Number(keyId)];
    }
  } else if (currentLanguage === 'English') {
    if (isShiftActive) {
      return englishCapitalKey[Number(keyId)];
    } else {
      return englishKey[Number(keyId)];
    }
  }
}

// TODO:
function changeKeylabel() {
  console.log("changeKeyLabel");
  document.querySelectorAll('.key').forEach(key => key.textContent = keyidToChar(key.getAttribute('key-id')));
  document.getElementById('space-key').textContent = 'space';
  document.getElementById('return-key').textContent = 'return';
}

document.querySelectorAll('.key').forEach(function(key) {
  key.addEventListener('click', function (event) {
    var keyId = this.getAttribute('key-id');
    var input = document.getElementById('textInput');
    var currentValue = input.value;
    var combinedValue = Hangul.assemble(currentValue + keyidToChar(keyId));
    input.value = combinedValue;
    document.getElementById('textToSelect').textContent = input.value;
    isShiftActive = false;
    changeKeylabel();
    selectText('textToSelect');
    event.stopPropagation();
  });
});

document.querySelectorAll('.special-key').forEach(function(key) {
  key.addEventListener('click', function(event) {
    var character = this.getAttribute('data-character');
    var input = document.getElementById('textInput');
    var currentValue = input.value;
    if (character === '⬅') {
      if (currentValue.length > 0) {
        currentValue = Hangul.disassemble(currentValue);
        currentValue = currentValue.slice(0, -1);
        currentValue = Hangul.assemble(currentValue);
        input.value = currentValue;
        document.getElementById('textToSelect').textContent = input.value;
      }
    } else if (character === '⬆') {
      isShiftActive = !isShiftActive;
      changeKeylabel();
    } else if (character === '🌏') {
      if (currentLanguage === 'Korean') {
        currentLanguage = 'English';
      } else if (currentLanguage === 'English') {
        currentLanguage = 'Korean';
      }
      changeKeylabel();
    } else if (character === '💱') {
      isSpecialSymbol = !isSpecialSymbol;
      changeKeylabel();
    }else if (character === '🗑️') {
      input.value = '';
      document.getElementById('textToSelect').textContent = input.value;
    }
    selectText('textToSelect');
    event.stopPropagation();
  });
});

document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);

var lastTouchEnd = 0;

document.documentElement.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 100) {
    event.preventDefault();
  } lastTouchEnd = now;
}, false);

document.getElementById('textInput').addEventListener('input', function () {
  var text = this.value;
  document.getElementById('textToSelect').textContent = text;
});

// document.getElementById('select-all-btn').addEventListener('click', function () {
//   selectText('textToSelect');
// });

// document.body.addEventListener('click', function(event) {
//   if (event.target.tagName !== 'DIV') {
//   }
// });