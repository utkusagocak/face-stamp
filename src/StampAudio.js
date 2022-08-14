import stampMp3 from './assests/stamp-sound.mp3';

export let audioContext = null;
export let stampAudioBuffer = null;
export let bufferLoadingError = null;

function loadStampSound(context, url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    context.decodeAudioData(
      request.response,
      function (buffer) {
        stampAudioBuffer = buffer;
        bufferLoadingError = null;
        console.log('Stamp audio loaded.');
      },
      (e) => {
        bufferLoadingError = e;
        console.error(e);
      },
    );
  };
  request.send();
}

function playAudio(context, audioBuffer, time) {
  const sampleSource = new AudioBufferSourceNode(context, {
    buffer: audioBuffer,
  });
  sampleSource.connect(context.destination);
  sampleSource.start(time);
  return sampleSource;
}

export function initStampAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (!stampAudioBuffer || bufferLoadingError) {
    loadStampSound(audioContext, stampMp3);
  }
}

export function playStampAudio(time = 0) {
  if (!audioContext) {
    throw 'Not initilized audio context.';
  } else if (!stampAudioBuffer) {
    throw 'Stamp audio not loaded.';
  } else if (bufferLoadingError !== null) {
    throw 'Stamp audio loading error.';
  }
  return playAudio(audioContext, stampAudioBuffer, time);
}
