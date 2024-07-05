let BPM = 120;
let numberBuffer = ['1','2','0'];
let decimalBuffer = [];
let onDecimals = false;
const timeoutTime = 5000;
let inputComplete = true;
let inputTimeout = null;

const segmentMap = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'd', 'e', 'g'],
    '3': ['a', 'b', 'c', 'd', 'g'],
    '4': ['b', 'c', 'f', 'g'],
    '5': ['a', 'c', 'd', 'f', 'g'],
    '6': ['a', 'c', 'd', 'e', 'f', 'g'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'c', 'd', 'f', 'g']
};

function handleKeyboardInput(event) {
    const key = event.key;

    if (inputComplete) {
        numberBuffer = [];
        decimalBuffer = [];
        onDecimals = false;
    }

    if (key === '.' || !isNaN(key)) {
        inputComplete = false;
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }
        inputTimeout = setTimeout(() => {
            inputComplete = true;
        }, timeoutTime);
    }

    if (key === '.') {
        onDecimals = true;
    } else if (!isNaN(key)) {
        if (!onDecimals) {
            if (numberBuffer.length === 3) {
                numberBuffer.shift();
            }
            numberBuffer.push(key);
        } else {
            if (decimalBuffer.length === 1) {
                onDecimals = false;
                inputComplete = true;
            }
            decimalBuffer.push(key);
        }
    }

    displayNumber();
    updateBPM();
}

function clearSegments(digit) {
    const segments = digit.querySelectorAll('.segment');
    segments.forEach(segment => segment.classList.remove('on'));
}

function lightSegments(digit, number) {
    const segmentsToLight = segmentMap[number];
    segmentsToLight.forEach(segment => {
        digit.querySelector(`.segment.${segment}`).classList.add('on');
    });
}

function displayNumber() {
    const numberStr = numberBuffer.join('').padStart(3, '0');

    for (let i = 0; i < 3; i++) {
        const digitElement = document.getElementById(`d01-digit-${i}`);
        clearSegments(digitElement);
        lightSegments(digitElement, numberStr[i]);
    }


    if (decimalBuffer.length !== 0) {
        const decimalStr = decimalBuffer.join('').padEnd(2, '0');
        for (let i = 0; i < 2; i++) {
            const digitElement = document.getElementById(`d02-digit-${i}`);
            clearSegments(digitElement);
            if (i < decimalStr.length) {
                lightSegments(digitElement, decimalStr[i]);
            }
        }
    } else {
        clearSegments(document.getElementById("d02-dot"));
        clearSegments(document.getElementById("d02-digit-0"));
        clearSegments(document.getElementById("d02-digit-1"));
    }

    if (onDecimals) document.getElementById("d02-dot").querySelector(`.segment.dot`).classList.add('on');

    BPM = parseFloat(numberBuffer.join('') + '.' + decimalBuffer.join(''));
}

function updateBPM() {
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

window.onload = function() {
    document.addEventListener('keypress', handleKeyboardInput);
}

displayNumber();