
// Using https://blockchain.info/api/api_websocket API
// Open websocket
blockSocket = new WebSocket("wss://ws.blockchain.info/inv");

// Subscribe to unconfirmed transaction and block confirmation events
blockSocket.onopen = function(event) {
	blockSocket.send('{"op":"unconfirmed_sub"}')
	blockSocket.send('{"op":"blocks_sub"}')
};

// using AudioSynth - https://github.com/keithwhor/audiosynth
var acoustic = Synth.createInstrument('acoustic');

// Using/from ToneJS - https://github.com/Tonejs/Tone.js/
// create a synth and connect it to the master output (your speakers)
var synth = new Tone.FMSynth().toMaster();

// http://soundbible.com/1477-Zen-Temple-Bell.html
var gong = new Audio('https://cdn.rawgit.com/jacobajit/blockchainRadio/master/gong.mp3');



blockSocket.onmessage = function (event) {

	var data = JSON.parse(event.data);

	// Unconfirmed transaction
	if(data.op == "utx")
	{

		// Inputs of transaction
		inputs = data.x.inputs

		// Sum transaction inputs to get total value approximation
		var total = 0;
		for(i = 0; i < inputs.length; i++)
		{
			total += inputs[i].prev_out.value;
		}

		// Convert bits sub-unit to Bitcoin
		var totalBTC = total * 0.000001

		// Put total value in circle
		document.getElementById("circle").innerHTML = '฿' + totalBTC;

		// Change circle color to a random one
		// https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
		document.getElementById("circle").style.background = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

		// Scale total logarithmically for even distribution of notes
		noteVal = Math.log10(total)


		// Sequence of if statements to pick notes- values decided from trial and error
		// Ugly but efficient - https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than
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

		// Play that note in 4th octave for duration of fourth notes using ToneJS
		synth.triggerAttackRelease(note + "4", "4n");

	}

	// New block confirmed
	else if(data.op == "block")
	{
		gong.play();
	}
}