// Variable Declarations
let audioContext;
let audioSources = {};
let analyser;
let isPlaying = false;
let visualizerAnimationId;

const soundItems = document.querySelectorAll('.sound-item');
const dropZones = document.querySelectorAll('.drop-zone');
const playBtn = document.querySelector('#play-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const visualizer = document.querySelector('#visualizer');
const visualizerCtx = visualizer.getContext('2d');
const audioContainer = document.querySelector('#audio-container');

const audioFiles = {
  drums: 'drums.mp3',
  bass: 'bass.mp3',
  melody: 'melody.mp3',
  vocals: 'vocals.mp3',
  effects: 'effects.mp3'
};

// Function Definitions

function createPlaceholderAudio() {
  for (const sound in audioFiles) {
    const audio = document.createElement('audio');
    audio.id = `audio-${sound}`;
    audio.loop = true;
    audio.src = `audio/${audioFiles[sound]}`;
    audioContainer.appendChild(audio);
  }
}

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(audioContext.destination);
  }
}

function playAllTracks() {
  if (!audioContext) initAudioContext();
  else if (audioContext.state === 'suspended') audioContext.resume();
  isPlaying = true;
  Object.values(audioSources).forEach(audio => audio.play());
  drawVisualizer(); // Assuming you will define this later
}

function stopAllTracks() {
  Object.values(audioSources).forEach(audio => audio.pause());
  isPlaying = false;
  cancelAnimationFrame(visualizerAnimationId);
}

function resetMixer() {
  stopAllTracks();
  dropZones.forEach(zone => {
    zone.textContent = 'Drop here';
    zone.classList.remove('has-sound');
    zone.removeAttribute('data-sound');
  });
  audioSources = {};
}

function playSound(sound) {
  if (!audioContext) initAudioContext();
  const audioElement = document.querySelector(`#audio-${sound}`);
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play();
    audioSources[sound] = audioElement;
  }
}

function handleDragStart(e) {
  const sound = e.target.getAttribute('data-sound');
  e.dataTransfer.setData('text/plain', sound);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const sound = e.dataTransfer.getData('text/plain');
  if (sound) {
    e.target.setAttribute('data-sound', sound);
    e.target.textContent = sound;
    e.target.classList.add('has-sound');
    playSound(sound);
  }
}

function initDragAndDrop() {
  soundItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
  });
}

// Event Listeners
playBtn.addEventListener('click', playAllTracks);
stopBtn.addEventListener('click', stopAllTracks);
resetBtn.addEventListener('click', resetMixer);

// Init
createPlaceholderAudio();
initDragAndDrop();

console.log('Music Mixer initialized successfully');
