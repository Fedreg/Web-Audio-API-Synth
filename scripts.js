//start new audio session. Do this only once
var context = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)

var compressor = context.createDynamicsCompressor();
	compressor.threshold.value = -24;
	compressor.knee.value = 40;
	compressor.ratio.value = 12;
	compressor.reduction.value = -20;
	compressor.attack.value = 0;
	compressor.release.value = 0.25;
	compressor.connect(context.destination);


//main function for crearing sound
function playSound(note, time) {
	oscillator = context.createOscillator();
	
	//create volume controller
	var gainNode = context.createGain();
	
	//connect signal to audio to gain; gain to compressor (compressor to output)
 	oscillator.connect(gainNode);
 	gainNode.connect(compressor); 	
 	
 	//adjusts frequency played by 50%, 100% or 200% 
	var octave = document.getElementById('octave').value;

	//sets oscillator frequency
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	//oscillator wave type
 	oscillator.type = document.getElementById('waveSelect').value;

 	
 	//initialize gain at 0 and ramp up to full volume very quikcly (prevents audible 'pop')
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, 0.1);
 	
 	//starts oscillator. Delayed start can be achieved by adding time(in secs) after currentTime
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
 		//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		compressor.connect(gainNode);
		gainNode.connect(delay);
		delay.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
	//distortion curve taken from MDN which they in turn took from Stack Overflow
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
	
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
		//decrease gain
 		quickFadeOut;
	} 
	
	if (document.getElementById('toggleDelay').value == 'true'){delayNode();}	
	if (document.getElementById('toggleDistortion').value == 'true'){distortionNode();}
 	
 	//determines note duration
 	var sustain = parseFloat(document.getElementById('sustain').value);
 	
 	//stops oscillator by exponentially ramping down sound over .015 seconds to avoid audible click
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
	//change key color on keypress

	//append the word "note" to the object.name note to identify the correct key div
	var divId = "note" + String(note);
	var element = document.getElementById(divId);
    
	//change background color for durarion of note length
	var currentColor = element.style.backgroundColor;
	element.style.backgroundColor = '#3cf7ac';
	
	setTimeout(function () {
		if (currentColor != 'rgb(60, 247, 172)') {
    		element.style.backgroundColor = currentColor
  	  	}
 	}, 1000 * sustain);    

 	//for testing
 	console.log('playSound Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime.toFixed(2));
}

 //controls 2nd keyboard.  Same logic as playSound()
function playSoundb(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaveb').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectb').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayb').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionb').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainb').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "b";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#3ce4f7';
    setTimeout(function () {
    	if (currentColor != 'rgb(60, 228, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*B* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//third keyboard
function playSoundc(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octavec').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectc').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayc').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortionc').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustainc').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "c";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#fa0a8b';
    setTimeout(function () {
    	if (currentColor != 'rgb(250, 10, 139)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*C* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}

//fourth keyboard
function playSoundd(note, time) {
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	
	oscillator.connect(gainNode);
 	gainNode.connect(compressor);
 	
	var octave = document.getElementById('octaved').value;
 	oscillator.frequency.value = frequencies[note] * octave;
 	
 	oscillator.type = document.getElementById('waveSelectd').value;
 	
 	gainNode.gain.value = 0
 	var quickFadeIn = gainNode.gain.setTargetAtTime(.15, context.currentTime, .1);
 	oscillator.start(context.currentTime + .05);
 	
 	/**
 	 *	AUDIO EFFECTS
 	 */

 	function delayNode() {
	//create delay
		var delay = context.createDelay();
		delay.delayTime.value = .5;
		
		//create gain
		gainNode;
		gainNode.gain.value =  0; 
		quickFadeIn;
		
		//create feedback loop
		gainNode.connect(delay);
		delay.connect(gainNode);
		compressor.connect(gainNode);
		delay.connect(compressor);	
		
		//decrease gain
		quickFadeOut;
	}
	
	function distortionNode() {
		var distortion = context.createWaveShaper();
				
		function makeDistortionCurve(amount) {
		  var k = typeof amount === 'number' ? amount : 25,
		    n_samples = 44100,
		    curve = new Float32Array(n_samples),
		    deg = Math.PI / 90,
		    i = 0,
		    x;
		  for ( ; i < n_samples; ++i ) {
		    x = i * 2 / n_samples - 1;
		    curve[i] = ( 3 + k ) * x * 3 * deg / ( Math.PI + k * Math.abs(x) );
		  }
		  return curve;
		};
		
		distortion.curve = makeDistortionCurve(300);
		distortion.oversample = '3x';
		
		gainNode;
		quickFadeIn;
		
		compressor.connect(gainNode);
		gainNode.connect(distortion);
		distortion.connect(compressor);
		
 		quickFadeOut;
	}
	
	if (document.getElementById('toggleDelayd').value == 'true'){delayNode();}
	if (document.getElementById('toggleDistortiond').value == 'true'){distortionNode();}		
 	
  	var sustain = parseFloat(document.getElementById('sustaind').value);
 	
 	var quickFadeOut = gainNode.gain.setTargetAtTime(0, context.currentTime + sustain, 0.1);
 	
 	//change key color on keypress
	var divId = "note" + String(note) + "d";
    var element = document.getElementById(divId);
    var currentColor = element.style.backgroundColor;
    element.style.backgroundColor = '#ad3cf7';
    setTimeout(function () {
    	if (currentColor != 'rgb(173, 60, 247)') {
        	element.style.backgroundColor = currentColor
        }
     }, 1000 * sustain);
 	
	//for testing
 	console.log('playSound*D* Hz:' + frequencies[note] * octave + ' octave:' + octave + ' wave:' + oscillator.type + ' duration: ' + sustain + ' time:' + context.currentTime); 
}


//triggers playSound() to create note
document.getElementById('note1').addEventListener(ifTouch() ,function() { playSound('1');});
document.getElementById('note2').addEventListener(ifTouch() ,function() { playSound('2');});
document.getElementById('note3').addEventListener(ifTouch() ,function() { playSound('3');});
document.getElementById('note4').addEventListener(ifTouch() ,function() { playSound('4');});
document.getElementById('note5').addEventListener(ifTouch() ,function() { playSound('5');});
document.getElementById('note6').addEventListener(ifTouch() ,function() { playSound('6');});
document.getElementById('note7').addEventListener(ifTouch() ,function() { playSound('7');});
document.getElementById('note8').addEventListener(ifTouch() ,function() { playSound('8');});
document.getElementById('note9').addEventListener(ifTouch() ,function() { playSound('9');});
document.getElementById('note10').addEventListener(ifTouch() ,function() { playSound('10');});
document.getElementById('note11').addEventListener(ifTouch() ,function() { playSound('11');});
document.getElementById('note12').addEventListener(ifTouch() ,function() { playSound('12');});
document.getElementById('note13').addEventListener(ifTouch() ,function() { playSound('13');});
document.getElementById('note14').addEventListener(ifTouch() ,function() { playSound('14');});
document.getElementById('note15').addEventListener(ifTouch() ,function() { playSound('15');});

//second keyboard
document.getElementById('note1b').addEventListener(ifTouch() ,function() { playSound('1');});
document.getElementById('note2b').addEventListener(ifTouch() ,function() { playSound('2');});
document.getElementById('note3b').addEventListener(ifTouch() ,function() { playSound('3');});
document.getElementById('note4b').addEventListener(ifTouch() ,function() { playSound('4');});
document.getElementById('note5b').addEventListener(ifTouch() ,function() { playSound('5');});
document.getElementById('note6b').addEventListener(ifTouch() ,function() { playSound('6');});
document.getElementById('note7b').addEventListener(ifTouch() ,function() { playSound('7');});
document.getElementById('note8b').addEventListener(ifTouch() ,function() { playSound('8');});
document.getElementById('note9b').addEventListener(ifTouch() ,function() { playSound('9');});
document.getElementById('note10b').addEventListener(ifTouch() ,function() { playSound('10');});
document.getElementById('note11b').addEventListener(ifTouch() ,function() { playSound('11');});
document.getElementById('note12b').addEventListener(ifTouch() ,function() { playSound('12');});
document.getElementById('note13b').addEventListener(ifTouch() ,function() { playSound('13');});
document.getElementById('note14b').addEventListener(ifTouch() ,function() { playSound('14');});
document.getElementById('note15b').addEventListener(ifTouch() ,function() { playSound('15');});

//third keyboard
document.getElementById('note1c').addEventListener(ifTouch() ,function() { playSound('1');});
document.getElementById('note2c').addEventListener(ifTouch() ,function() { playSound('2');});
document.getElementById('note3c').addEventListener(ifTouch() ,function() { playSound('3');});
document.getElementById('note4c').addEventListener(ifTouch() ,function() { playSound('4');});
document.getElementById('note5c').addEventListener(ifTouch() ,function() { playSound('5');});
document.getElementById('note6c').addEventListener(ifTouch() ,function() { playSound('6');});
document.getElementById('note7c').addEventListener(ifTouch() ,function() { playSound('7');});
document.getElementById('note8c').addEventListener(ifTouch() ,function() { playSound('8');});
document.getElementById('note9c').addEventListener(ifTouch() ,function() { playSound('9');});
document.getElementById('note10c').addEventListener(ifTouch() ,function() { playSound('10');});
document.getElementById('note11c').addEventListener(ifTouch() ,function() { playSound('11');});
document.getElementById('note12c').addEventListener(ifTouch() ,function() { playSound('12');});
document.getElementById('note13c').addEventListener(ifTouch() ,function() { playSound('13');});
document.getElementById('note14c').addEventListener(ifTouch() ,function() { playSound('14');});
document.getElementById('note15c').addEventListener(ifTouch() ,function() { playSound('15');});

//fourth keyboard
document.getElementById('note1d').addEventListener(ifTouch() ,function() { playSound('1');});
document.getElementById('note2d').addEventListener(ifTouch() ,function() { playSound('2');});
document.getElementById('note3d').addEventListener(ifTouch() ,function() { playSound('3');});
document.getElementById('note4d').addEventListener(ifTouch() ,function() { playSound('4');});
document.getElementById('note5d').addEventListener(ifTouch() ,function() { playSound('5');});
document.getElementById('note6d').addEventListener(ifTouch() ,function() { playSound('6');});
document.getElementById('note7d').addEventListener(ifTouch() ,function() { playSound('7');});
document.getElementById('note8d').addEventListener(ifTouch() ,function() { playSound('8');});
document.getElementById('note9d').addEventListener(ifTouch() ,function() { playSound('9');});
document.getElementById('note10d').addEventListener(ifTouch() ,function() { playSound('10');});
document.getElementById('note11d').addEventListener(ifTouch() ,function() { playSound('11');});
document.getElementById('note12d').addEventListener(ifTouch() ,function() { playSound('12');});
document.getElementById('note13d').addEventListener(ifTouch() ,function() { playSound('13');});
document.getElementById('note14d').addEventListener(ifTouch() ,function() { playSound('14');});
document.getElementById('note15d').addEventListener(ifTouch() ,function() { playSound('15');});

//Frequencies in Hz of notes to be played. 
var frequencies = {
 	'1': 130.81,
 	'2': 146.83,
 	'3': 164.81,
 	'4': 174.61,
 	'5': 196.00,
 	'6': 220.00,
 	'7': 246.94,
 	'8': 261.63,
 	'9': 293.66,
 	'10': 329.63,
 	'11': 349.23,
 	'12': 392.00,
 	'13': 440.00,
 	'14': 493.88,
 	'15': 523.25,
 };

/**
 *	UI
 */
 

//hides the chromatic notes of the keyboard
function ezMode() {
	var chromaticNotes = document.getElementsByClassName('black-keys');
		
	for (var i = 0; i < chromaticNotes.length; i++) {
		if (chromaticNotes[i].style.display == 'block') {
			chromaticNotes[i].style.display = 'none';
			document.getElementById('note13').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13b').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13c').style.backgroundColor = 'rgba(0,0,0,.2)';
			document.getElementById('note13d').style.backgroundColor = 'rgba(0,0,0,.2)';
		}
		
		else {
			chromaticNotes[i].style.display = 'block';
			document.getElementById('note13').style.backgroundColor = 'rgba(0,0,0,0)';
			document.getElementById('note13b').style.backgroundColor = 'rgba(0,0,0,0)';	
			document.getElementById('note13c').style.backgroundColor = 'rgba(0,0,0,0)';
			document.getElementById('note13d').style.backgroundColor = 'rgba(0,0,0,0)';	
		}
	}
}

//change UI color theme
function themeChange() {
	var skin = document.getElementById('wrapper');
	var nav = document.getElementById('navigation');
	var toggleTheme = document.getElementById('theme');
	var burger = document.getElementById('burger');	
	var select = document.getElementsByTagName('select');
	
	for (var i = 0; i < select.length; i++) {

		if (toggleTheme.value == 'true') {
			skin.style.background = 'linear-gradient(to bottom right, #ddd 40%, #bbb)';
			nav.style.backgroundColor = '#fff';
			burger.style.color ='#555';
			select[i].style.color ='#000';
		}
		
		else {
			skin.style.background = 'linear-gradient(to bottom right, #333 40%, #000)';
			nav.style.backgroundColor = '#000';
			burger.style.color ='#777';
			select[i].style.color ='#fff';
			
		}console.log(i);
	}
}
	

//check for touchscreen and provide correct event for listener
function ifTouch() {
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
    	return 'touchstart';
    
    else {
    	return 'click';
	}
}

function playString() {
var said = document.getElementById("userString");
var msg = said.value;
var noteArr = [];
var interval = Math.random() * 1000;

for (var i = 0; i < msg.length; i++) {

	noteArr.push(msg.charCodeAt(i)%15+1);

} 

	playAllNotes(0);
	playAllNotesd(0);
	playAllNotesc(0);
	playAllNotesb(0);	
	
	function playAllNotes(index) {
		if (noteArr.length > index) {
			setTimeout(function() {
			    playSound(noteArr[index]);
			    playAllNotes(++index);
			}, Math.random() * 1000);
		}
	}
	
	function playAllNotesb(index) {
		if (noteArr.length > index * .5) {
			setTimeout(function() {
			    playSoundb(noteArr[index]);
			    playAllNotesb(++index);
			}, Math.random() * 500);
		}
	}
	
	function playAllNotesc(index) {
		if (noteArr.length > index * .5) {
			setTimeout(function() {
			    playSoundc(noteArr[index]);
			    playAllNotesc(++index);
			}, Math.random() * 500);
		}
	}

		function playAllNotesd(index) {
		if (noteArr.length > index) {
			setTimeout(function() {
			    playSoundd(noteArr[index]);
			    playAllNotesd(++index);
			}, Math.random() * 1000);
		}
	}

}	