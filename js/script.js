const soundItems = document.querySelectorAll('.sound-item');
const dropZones = document.querySelectorAll('.drop-zone');
const playBtn = document.querySelector('#play-btn');
const stopBtn = document.querySelector('#stop-btn');
const resetBtn = document.querySelector('#reset-btn');
const audioContainer = document.querySelector('#audio-container');

const audioFiles = {
  drums: 'drum.mp3',
  bass: 'bass.mp3',
  melody: 'melody.mp3',
  vocals: 'vocals.mp3',
  effects: 'effects.mp3'
};

const audioElements = {}; 



function createAudioElements() {
  for (const key in audioFiles) {
    const audio = document.createElement('audio');
    audio.id = 'audio-' + key;
    audio.src = 'audio/' + audioFiles[key];
    audio.loop = true;
    audio.preload = 'auto';
    audioContainer.appendChild(audio);
    audioElements[key] = audio;
  }
}

function allowDrag(event) {
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.sound);
}

function allowDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function clearDragStyle(event) {
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  clearDragStyle(event);

  const soundKey = event.dataTransfer.getData('text/plain');

  if (
    event.currentTarget.children.length === 0 ||
    event.currentTarget.innerText === 'Drop here'
  ) {
    const dragged = document.querySelector('[data-sound="' + soundKey + '"]');
    event.currentTarget.innerHTML = ''; // remove "Drop here" text
    event.currentTarget.appendChild(dragged.cloneNode(true));
    event.currentTarget.classList.add('has-sound');
    audioElements[soundKey].play();
  }
}

function playAllSounds() {
  for (const key in audioElements) {
    audioElements[key].play();
  }
}

function stopAllSounds() {
  for (const key in audioElements) {
    audioElements[key].pause();
    audioElements[key].currentTime = 0;
  }
}

function resetMixer() {
  const library = document.querySelector('.sound-items');

  soundItems.forEach(function (item) {
    library.appendChild(item);
  });

  dropZones.forEach(function (zone) {
    zone.innerHTML = 'Drop here';
    zone.classList.remove('has-sound');
  });

  stopAllSounds();
}



createAudioElements(); 

soundItems.forEach(function (item) {
  item.addEventListener('dragstart', allowDrag);
});

dropZones.forEach(function (zone) {
  zone.addEventListener('dragover', allowDragOver);
  zone.addEventListener('dragleave', clearDragStyle);
  zone.addEventListener('drop', handleDrop);
});

playBtn.addEventListener('click', playAllSounds);
stopBtn.addEventListener('click', stopAllSounds);
resetBtn.addEventListener('click', resetMixer);
