
var context = new AudioContext();
var oscillators = {};
var midi, data;
var socket = io();
socket.on('externalMidi', gotExternalMidiMessage);

function gotExternalMidiMessage(data){
    var newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode('Note: ' + data.pitch + ' Velocity:' + data.velocity));
    newItem.className = "external-midi";
    document.getElementById('midi-data').prepend(newItem);

    playNote(data);
}


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
    socket.emit('midi', note);
  }
  //Values ON / OFF -> 144 / 128 
  //NOTE -> 0-127, C2 = 48
  //Velocity -> 0-127
  /////////////////////////////////////
  ///       MIDI PLAYBACK / AUDIO   ///
  /////////////////////////////////////
var d = messageData.data; // Example: [144, 60, 100]
var note = {
  on: d[0], 
  pitch: d[1],
  velocity: d[2]
};
play(note);


//Checks whether note is on/off reference to global variables
function play(note) {
    switch(note.on){
        case 144:
            noteOn (frequency(note.pitch), note.velocity);
            break;
        case 128:
            noteOff (frequency(note.pitch), note.velocity);
            break;
    }
    //MIDI NOTE TO PITCH
    // f(n) = 2^((n-49)/12) * 440HZ
    function frequency(note){
        return Math.pow(2, ((note - 69) / 12))*440;
      }
        var osc = oscillators[frequency] = context.createOscillator();
        osc.type = 'sawtooth';
        osc.connect(context.destination);
        osc.start(context.currentTime);
    }  
    function noteOff(frequency, velocity){
        oscillators[frequency].stop(context.currentTime);
        oscillators[frequency].disconnect();
      }

///////////////////
// CONTROLLER   //
/////////////////
var allPads = document.getElementsByClassName('pad'),
    dataList = document.querySelector('#midi-data ul');

for (var i=0; i<allPads.length; i++) {
  allPads[i].addEventListener('mousedown', function() {
    var newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode('[144,'+this.dataset.midi+',64]'));
    dataList.appendChild(newItem);
  });
    allPads[i].addEventListener('mouseup', function() {
    var newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode('[128,'+this.dataset.midi+',127]'));
    dataList.appendChild(newItem);
  });
}