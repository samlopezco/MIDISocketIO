
var context = new AudioContext();
var oscillators = {};
var midi, data;
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser");
}
//Listens to MIDI Messages
function onMIDISuccess(midiData) {
  console.log(midiData);
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = onMIDImessage;
  }
}
function onMIDIFailure() {
  console.warn("Not finding a MIDI controller");
}
//New <li> element
//adds CSS class of user-midi 
//Adds new item to the <ul> id = "midi-data"
function onMIDImessage(messageData) {
    var newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode(messageData.data));
    newItem.className = 'user-midi';
    document.getElementById('midi-data').prepend(newItem);
  }
  //Values ON / OFF -> 144 / 128 
  //NOTE -> 0-127, C2 = 48
  //Velocity -> 0-127
  