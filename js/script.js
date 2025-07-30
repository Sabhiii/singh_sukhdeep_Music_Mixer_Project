// variables
let soundItems = document.querySelectorAll('.sound-item'),
    dropZones = document.querySelectorAll('.drop-zone'),
    playBtn = document.querySelector('#play-btn'),
    stopBtn = document.querySelector('#stop-btn'),
    resetBtn = document.querySelector('#reset-btn'),
    audioContainer = document.querySelector('#audio-container');

let audioFiles = {
    drums: 'drum.mp3',
    bass: 'bass.mp3',
    melody: 'melody.mp3',
    vocals: 'vocals.mp3',
    effects: 'effects.mp3'
};

let audioElements = {}; // to store audio tags by ID

// functions
function createAudioElements() {
    for (let key in audioFiles) {
        let audio = document.createElement('audio');
        audio.id = `audio-${key}`;
        audio.src = `audio/${audioFiles[key]}`;
        audio.loop = true;
        audio.preload = 'auto';
        audioContainer.appendChild(audio);
        audioElements[key] = audio;
    }
}

function allowDrag(event) {
    event.dataTransfer.setData('text/plain', this.dataset.sound);
}

function allowDragOver(event) {
    event.preventDefault();
}

function allowDrop(event) {
    event.preventDefault();
    let soundKey = event.dataTransfer.getData('text/plain');

    if (this.children.length === 0) {
        let dragged = document.querySelector(`[data-sound="${soundKey}"]`);
        this.appendChild(dragged.cloneNode(true)); // clone so original stays
        console.log(`Playing: ${soundKey}`);
        audioElements[soundKey].play();
    } else {
        console.log('Drop zone already occupied');
    }
}

function playAll() {
    for (let key in audioElements) {
        audioElements[key].play();
    }
}

function stopAll() {
    for (let key in audioElements) {
        audioElements[key].pause();
        audioElements[key].currentTime = 0;
    }
}

function resetMixer() {
    soundItems.forEach(item => {
        document.querySelector('.sound-items').appendChild(item);
    });

    dropZones.forEach(zone => {
        zone.innerHTML = 'Drop here';
    });

    stopAll();
}

// event listeners
window.addEventListener('DOMContentLoaded', () => {
    createAudioElements();

    soundItems.forEach(item => item.addEventListener('dragstart', allowDrag));
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', allowDragOver);
        zone.addEventListener('drop', allowDrop);
    });

    playBtn.addEventListener('click', playAll);
    stopBtn.addEventListener('click', stopAll);
    resetBtn.addEventListener('click', resetMixer);
});
