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

document.querySelectorAll('.key').forEach(function(key) {
  key.addEventListener('click', function (event) {
    var character = this.getAttribute('data-character');
    var input = document.getElementById('textInput');
    var currentValue = input.value;
    if (character === 'return') {
      // console.log('new line');
      input.value = currentValue + '\n';
    } else {
      var combinedValue = Hangul.assemble(currentValue + character);
      input.value = combinedValue;
    }
    document.getElementById('textToSelect').textContent = input.value;
    selectText('textToSelect');
    isShiftActive = false;
    doShiftKey();
    event.stopPropagation();
  });
});

var isShiftActive = false;

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
      doShiftKey();
    } else if (character === '🗑️') {
      input.value = '';
      document.getElementById('textToSelect').textContent = input.value;
    }
    selectText('textToSelect');
    event.stopPropagation();
  });
});

function doShiftKey() {
  console.log("what?");
  document.querySelectorAll('.key').forEach(function(key) {
    if (isShiftActive) {
      // Shift 모드일 때
      if (key.getAttribute('data-shift') != undefined) {
        key.textContent = key.getAttribute('data-shift');
        key.setAttribute('data-character', key.textContent);
      }
    } else {
      // 기본 모드일 때
      if (key.getAttribute('data-normal')) {
        key.textContent = key.getAttribute('data-normal');
        key.setAttribute('data-character', key.textContent);
      }
    }
  });
}

document.documentElement.addEventListener('touchstart', function (event) {
     if (event.touches.length > 1) {
          event.preventDefault();
        }
    }, false);

var lastTouchEnd = 0;

document.documentElement.addEventListener('touchend', function (event) {
     var now = (new Date()).getTime();
     if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        } lastTouchEnd = now;
}, false);

document.getElementById('textInput').addEventListener('input', function () {
  var text = this.value;
  document.getElementById('textToSelect').textContent = text;
});

document.getElementById('select-all-btn').addEventListener('click', function () {
  selectText('textToSelect');
});


document.body.addEventListener('click', function(event) {
  if (event.target.tagName !== 'DIV') {
  }
});