const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const rateControl = document.getElementById('rateControl');
const nudgeEl = document.getElementById('nudge');
const displayArea = document.getElementById('displayArea');
let voices = [];

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

function renderTextWithSpans(text) {
  displayArea.innerHTML = '';
  let currentIndex = 0;

  text.split(/\s+/).forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.dataset.start = currentIndex;
    span.dataset.end = currentIndex + word.length;
    currentIndex += word.length + 1;
    displayArea.appendChild(span);
  });
}

function highlightWordAt(index) {
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
  const spans = document.querySelectorAll('#displayArea span');
  for (let span of spans) {
    const start = parseInt(span.dataset.start);
    const end = parseInt(span.dataset.end);
    if (index >= start && index < end) {
      span.classList.add('highlight');
      break;
    }
  }
}

function readText() {
  const text = textInput.value.trim();
  if (!text) {
    alert('Please enter some text.');
    return;
  }

  renderTextWithSpans(text);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceSelect.value];
  utterance.rate = parseFloat(rateControl.value);

  // 🔥 Set up highlighter
  utterance.onboundary = function(event) {
    if (event.name === 'word') {
      highlightWordAt(event.charIndex);
    }
  };

  speechSynthesis.speak(utterance);
}

function stopReading() {
  speechSynthesis.cancel();
}

document.getElementById('readBtn').addEventListener('click', readText);
document.getElementById('stopBtn').addEventListener('click', stopReading);

speechSynthesis.onvoiceschanged = populateVoices;
populateVoices();
