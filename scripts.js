
//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");


// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
var AudioContext = window.AudioContext || window.webkitAudioContext;
var myContext = new AudioContext();

// Unlock audio context - adapted from https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
var isUnlocked = false;
function unlock() {
			
	if(this.unlocked)
		return;

	// create empty buffer and play it
	var buffer = myContext.createBuffer(1, 1, 22050);
	var source = myContext.createBufferSource();
	source.buffer = buffer;
	source.connect(myContext.destination);
	source.start(0);

	// by checking the play state after some time, we know if we're really unlocked
	setTimeout(function() {
		if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
			isUnlocked = true;
		}
	}, 0);

}


blockSocket = new WebSocket("wss://ws.blockchain.info/inv");


blockSocket.onopen = function(event) {
	blockSocket.send('{"op":"unconfirmed_sub"}')
	blockSocket.send('{"op":"blocks_sub"}')
};

// using AudioSynth - https://github.com/keithwhor/audiosynth
var acoustic = Synth.createInstrument('acoustic');

//http://soundbible.com/1477-Zen-Temple-Bell.html
var gong = new Audio('https://cdn.rawgit.com/jacobajit/blockchainRadio/master/gong.mp3');

blockSocket.onmessage = function (event) {
	var data = JSON.parse(event.data);
	console.log(data);
	if(data.op == "utx")
	{
		size = parseInt(data.x.size);
		console.log(size);

		outputs = data.x.inputs

		var total = 0;
		for(i = 0; i < outputs.length; i++)
		{
			total += outputs[i].prev_out.value;
		}

		document.getElementById("circle").innerHTML = '฿ ' + total;

		//https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
		document.getElementById("circle").style.background = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

		console.log(total);


		noteVal = Math.log10(total)

		if(total > 0 && noteVal < 4)
		{
			note = 'A'
		}

		else if(noteVal > 4 && noteVal < 5)
		{
			note = 'B'
		}

		else if(noteVal > 5 && noteVal < 6)
		{
			note = 'C'
		}

		else if(noteVal > 6 && noteVal < 7)
		{
			note = 'D'
		}

		else if(noteVal > 7 && noteVal < 8)
		{
			note = 'E'
		}

		else if(noteVal > 8 && noteVal < 9)
		{
			note = 'F'
		}

		else
		{
			note = 'G'
		}

		console.log(note)
		unlock();
		// acoustic.play(note, 4, 2)
		//playNote(total/1000000, 1000*256/(4*100));
	}
	else if(data.op == "block")
	{
		gong.play();
	}
}