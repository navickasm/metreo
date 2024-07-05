const playStopButton = document.getElementById('play-stop-button');
const voiceSelect = document.getElementById('voice-select');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentVoice = {};
let isPlaying = false;
let nextNoteTime = 0.0;
let currentNote = 0;
const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)
let timerID;

function loadSound(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer));
}

function getAudioObjects(voiceNumber) {
    return Promise.all([
        loadSound(`sounds/${voiceNumber}_2.wav`),
        loadSound(`sounds/${voiceNumber}_1.wav`)
    ]).then(([upbeat, downbeat]) => ({ upbeat, downbeat }));
}

function playSound(buffer, time) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(time);
}

function nextNote() {
    const secondsPerBeat = 60.0 / BPM;
    nextNoteTime += secondsPerBeat;
    currentNote = (currentNote + 1) % 2;
}

function scheduleNote() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        const beatNumber = currentNote;
        const time = nextNoteTime;

        if (beatNumber % 2 === 0) {
            playSound(currentVoice.downbeat, time);
        } else {
            playSound(currentVoice.upbeat, time);
        }

        nextNote();
    }
    timerID = setTimeout(scheduleNote, lookahead);
}

async function startMetronome() {
    if (isPlaying) return;
    isPlaying = true;
    nextNoteTime = audioContext.currentTime;
    currentVoice = await getAudioObjects(voiceSelect.value);
    scheduleNote();
    playStopButton.innerHTML = '&#9632;';
}

function stopMetronome() {
    isPlaying = false;
    clearTimeout(timerID);
    playStopButton.innerHTML = '&#9658;';
}

playStopButton.addEventListener('click', () => {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

voiceSelect.addEventListener('change', async () => {
    if (isPlaying) {
        currentVoice = await getAudioObjects(voiceSelect.value);
    }
});