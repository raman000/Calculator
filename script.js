let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = null;

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '') return;

    if (operator !== null) {
        calculate();
    }

    operator = op;
    previousValue = currentInput;
    currentInput = '';
}

function calculate() {
    if (operator === null || currentInput === '' || previousValue === null) {
        return;
    }

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error: Division by 0';
                resetCalculator();
                return;
            }
            result = prev / current;
            break;
        case '.':
            return;
        default:
            return;
    }

    currentInput = result.toString();
    operator = null;
    previousValue = null;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    operator = null;
    previousValue = null;
    updateDisplay();
}

function deleteLastChar() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}

function resetCalculator() {
    currentInput = '';
    operator = null;
    previousValue = null;
}

// Allow keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === '.' || e.key === ',') {
        appendOperator('.');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLastChar();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});