var acoustic = Synth.createInstrument('acoustic');


// https://stackoverflow.com/questions/39200994/play-specific-frequency-with-javascript, https://jsfiddle.net/njb91z84/

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
// create Oscillator node
var oscillator = audioCtx.createOscillator();

oscillator.type = 'square';
oscillator.frequency.value = frequency; // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();

setTimeout(
	function(){
		oscillator.stop();
	}, duration);
}

//https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

blockSocket = new WebSocket("wss://ws.blockchain.info/inv");

blockSocket.onopen = function(event) {
	blockSocket.send('{"op":"unconfirmed_sub"}')
	blockSocket.send('{"op":"blocks_sub"}')
};

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
		acoustic.play(note, 4, 2)
		//playNote(total/1000000, 1000*256/(4*100));
	}
	else if(data.op == "block")
	{
		gong.play();
	}
}