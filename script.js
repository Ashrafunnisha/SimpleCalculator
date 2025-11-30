// Advanced Calculator + Converter (history removed)
const exprDisplay   = document.getElementById('exprDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const themeToggle   = document.getElementById('themeToggle');
const modeSelect    = document.getElementById('modeSelect');
const calcModeEl    = document.getElementById('calcMode');
const convertModeEl = document.getElementById('convertMode');

let expression = '';
let memory     = 0;

// Helper: safe evaluate expression
function safeEvaluate(expr) {
  let jsExpr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/−/g, '-')
    .replace(/%/g, '/100*'); // “x% of y” style

  if (!/^[0-9+\-*/().\s]+$/.test(jsExpr)) {
    throw new Error('Invalid characters');
  }

  return Function(`"use strict"; return (${jsExpr})`)();
}

// Update display
function updateDisplay() {
  exprDisplay.textContent = expression;
  if (expression === '') {
    resultDisplay.textContent = '0';
  } else {
    try {
      const res = safeEvaluate(expression);
      resultDisplay.textContent = res;
    } catch(e) {
      resultDisplay.textContent = 'Error';
    }
  }
}

// Memory operations
function memoryOperate(action) {
  try {
    const currentVal = safeEvaluate(expression) || 0;
    switch(action) {
      case 'MC': memory = 0;              break;
      case 'MR': expression = memory.toString(); break;
      case 'M+': memory += currentVal;    break;
      case 'M-': memory -= currentVal;    break;
    }
  } catch(e) {
    // ignore
  }
  updateDisplay();
}

// Button click & keyboard events
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-value');
    if (btn.classList.contains('number')) {
      expression += val;
    }
    else if (btn.classList.contains('operator')) {
      if (val === 'C') {
        expression = '';
      } else if (val === '=') {
        try {
          const res = safeEvaluate(expression);
          expression = res.toString();
        } catch(e) {
          expression = '';
          resultDisplay.textContent = 'Error';
        }
      } else {
        expression += val;
      }
    }
    else if (btn.classList.contains('memory')) {
      memoryOperate(val);
    }
    else if (btn.classList.contains('func')) {
      if (val === '√') {
        expression += '√(';
      } else if (val === '%') {
        expression += '%';
      }
    }
    updateDisplay();
  });
});

document.addEventListener('keydown', e => {
  const key = e.key;
  if ((/^[0-9.]$/).test(key)) {
    expression += key;
  } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
    expression += key;
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    try {
      const res = safeEvaluate(expression);
      expression = res.toString();
    } catch(err) {
      expression = '';
      resultDisplay.textContent = 'Error';
    }
  } else if (key === 'Backspace') {
    expression = expression.slice(0, -1);
  } else if (key.toUpperCase() === 'C') {
    expression = '';
  } else {
    return;
  }
  updateDisplay();
  e.preventDefault();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

// Converter logic
document.getElementById('convBtn').addEventListener('click', () => {
  const val  = parseFloat(document.getElementById('convInput').value);
  const from = document.getElementById('convFrom').value;
  const to   = document.getElementById('convTo').value;
  let result = val;

  if (from === 'kg' && to === 'lb') result = val * 2.20462;
  else if (from === 'lb' && to === 'kg') result = val / 2.20462;
  else if (from === 'm'  && to === 'ft') result = val * 3.28084;
  else if (from === 'ft' && to === 'm') result = val / 3.28084;
  else if (from === 'c'  && to === 'f') result = (val * 9/5) + 32;
  else if (from === 'f'  && to === 'c') result = (val - 32) * 5/9;

  document.getElementById('convResult').textContent = result;
});

// Mode change
modeSelect.addEventListener('change', () => {
  if (modeSelect.value === 'convert') {
    calcModeEl.style.display    = 'none';
    convertModeEl.style.display = 'block';
  } else {
    calcModeEl.style.display    = 'block';
    convertModeEl.style.display = 'none';
  }
});

// Initialize
updateDisplay();
